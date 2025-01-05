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

export const NoticeDetail = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { id } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: notice, isLoading } = useNoticeQuery(id);
  const { data: isAdmin } = useAdminStatus();
  const deleteNoticeMutation = useNoticeDelete(id);
  const togglePinMutation = useTogglePin(id);

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
            comments={notice.notice_comments.map(comment => ({
              id: comment.id,
              content: comment.content,
              created_at: comment.created_at,
              created_by: comment.created_by,
              authorName: comment.profiles?.full_name || "Anonymous",
            }))}
            onAddComment={(content) => {
              if (!session?.user?.id) throw new Error("Must be logged in to comment");
              
              const { error } = await supabase.from("notice_comments").insert({
                notice_id: id,
                content,
                created_by: session.user.id,
              });
              
              if (error) throw error;
            }}
            onDeleteComment={(commentId) => {
              const { error } = await supabase
                .from("notice_comments")
                .delete()
                .eq("id", commentId);
              if (error) throw error;
            }}
            isAddingComment={false}
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
