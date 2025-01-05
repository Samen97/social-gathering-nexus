import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { NoticeHeader } from "./notice/NoticeHeader";
import { NoticeComments } from "./notice/NoticeComments";
import { DeleteNoticeDialog } from "./notice/DeleteNoticeDialog";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
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

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg h-48" />;
  }

  if (!notice) {
    return <div>Notice not found</div>;
  }

  return (
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
          onDeleteClick={() => setDeleteDialogOpen(true)}
        />

        <NoticeComments
          comments={notice.notice_comments}
          onAddComment={(content) => addCommentMutation.mutate(content)}
          isAddingComment={addCommentMutation.isPending}
        />

        <DeleteNoticeDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => deleteNoticeMutation.mutate()}
        />
      </div>
    </div>
  );
};