import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { NoticeHeader } from "./notice/NoticeHeader";
import { NoticeComments } from "./notice/NoticeComments";
import { DeleteNoticeDialog } from "./notice/DeleteNoticeDialog";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  parent_id: string | null;
  profiles: {
    full_name: string | null;
  };
}

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  created_by: string;
  created_at: string;
  is_pinned: boolean;
  profiles: {
    full_name: string | null;
  };
  notice_comments: Comment[];
}

export const NoticeDetail = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: notice, isLoading } = useQuery({
    queryKey: ["notice", id],
    queryFn: async () => {
      const { data: notice, error } = await supabase
        .from("notices")
        .select(`
          *,
          profiles (
            full_name
          ),
          notice_comments (
            *,
            profiles (
              full_name
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return notice as Notice;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();
      
      if (error) return false;
      return !!data;
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      navigate("/notices");
      toast.success("Notice deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notices")
        .update({ is_pinned: !notice?.is_pinned })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      toast.success(notice?.is_pinned ? "Notice unpinned" : "Notice pinned");
    },
    onError: (error) => {
      console.error("Error toggling pin status:", error);
      toast.error("Failed to update notice pin status");
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!session?.user?.id) throw new Error("Must be logged in to comment");
      
      const { error } = await supabase.from("notice_comments").insert({
        notice_id: id,
        content,
        created_by: session.user.id,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("notice_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    },
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg h-48" />;
  }

  if (!notice) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Notice not found</p>
        <Button onClick={() => navigate("/notices")} variant="default">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notices
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => navigate("/notices")}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Notices
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <NoticeHeader
            title={notice.title}
            description={notice.description}
            authorName={notice.profiles.full_name || "Anonymous"}
            createdAt={new Date(notice.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            canDelete={session?.user?.id === notice.created_by}
            isPinned={notice.is_pinned}
            canPin={isAdmin}
            onDeleteClick={() => setDeleteDialogOpen(true)}
            onPinClick={() => togglePinMutation.mutate()}
          />

          <NoticeComments
            comments={notice.notice_comments}
            onAddComment={(content) => addCommentMutation.mutate(content)}
            onDeleteComment={(commentId) => deleteCommentMutation.mutate(commentId)}
            isAddingComment={addCommentMutation.isPending}
          />

          <DeleteNoticeDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={() => deleteNoticeMutation.mutate()}
          />
        </div>
      </div>
    </div>
  );
};