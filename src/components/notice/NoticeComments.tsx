import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  authorName: string;
}

interface NoticeCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onDeleteComment: (id: string) => void;
  isAddingComment: boolean;
}

export const NoticeComments = ({
  comments,
  onAddComment,
  onDeleteComment,
  isAddingComment,
}: NoticeCommentsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Comments</h2>
      <CommentForm onAddComment={onAddComment} isAddingComment={isAddingComment} />
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            createdAt={comment.created_at}
            createdBy={comment.created_by}
            authorName={comment.authorName}
            onDelete={() => onDeleteComment(comment.id)}
          />
        ))}
      </div>
    </div>
  );
};