import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { NoticeHeader } from "./notice/NoticeHeader";
import { NoticeComments } from "./notice/NoticeComments";
import { DeleteNoticeDialog } from "./notice/DeleteNoticeDialog";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNoticeQuery } from "./notice/useNoticeQuery";
import { useAdminStatus } from "./notice/useAdminStatus";
import { useNoticeDelete } from "./notice/useNoticeDelete";
import { useTogglePin } from "./notice/useTogglePin";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const NoticeDetail = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notice, isLoading, error } = useNoticeQuery(id);
  const { data: isAdmin } = useAdminStatus();
  const deleteNoticeMutation = useNoticeDelete(id);
  const togglePinMutation = useTogglePin(id);

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
      queryClient.invalidateQueries({ queryKey: ['notice', id] });
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
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
      queryClient.invalidateQueries({ queryKey: ['notice', id] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg h-48" />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading notice: {error.message}</p>
        <Button onClick={() => navigate("/notices")} variant="default">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notices
        </Button>
      </div>
    );
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
            comments={notice.notice_comments.map(comment => ({
              id: comment.id,
              content: comment.content,
              created_at: comment.created_at,
              created_by: comment.created_by,
              authorName: comment.profiles?.full_name || "Anonymous",
            }))}
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