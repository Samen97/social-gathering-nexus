import { useSession } from "@supabase/auth-helpers-react";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  profiles: {
    full_name: string | null;
  };
}

interface NoticeCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onDeleteComment?: (id: string) => void;
  isAddingComment: boolean;
}

export const NoticeComments = ({
  comments,
  onAddComment,
  onDeleteComment,
  isAddingComment,
}: NoticeCommentsProps) => {
  const session = useSession();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            createdAt={comment.created_at}
            createdBy={comment.created_by}
            authorName={comment.profiles.full_name || "Anonymous"}
            onDelete={onDeleteComment ? () => onDeleteComment(comment.id) : undefined}
          />
        ))}

        {session && (
          <CommentForm
            onAddComment={onAddComment}
            isAddingComment={isAddingComment}
          />
        )}
      </div>
    </div>
  );
};