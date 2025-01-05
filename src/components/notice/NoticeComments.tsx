import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  parent_id: string | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface NoticeCommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onDeleteComment: (id: string) => void;
  isAddingComment: boolean;
}

export const NoticeComments = ({
  comments,
  onAddComment,
  onDeleteComment,
  isAddingComment,
}: NoticeCommentsProps) => {
  // Organize comments into a tree structure
  const commentTree = comments.reduce((acc, comment) => {
    if (!comment.parent_id) {
      // This is a root comment
      acc[comment.id] = {
        ...comment,
        replies: [],
      };
    } else {
      // This is a reply
      if (acc[comment.parent_id]) {
        acc[comment.parent_id].replies.push(comment);
      }
    }
    return acc;
  }, {} as Record<string, Comment & { replies: Comment[] }>);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Comments</h2>
      <CommentForm onAddComment={onAddComment} isAddingComment={isAddingComment} />
      <div className="space-y-6">
        {Object.values(commentTree).map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            createdAt={comment.created_at}
            createdBy={comment.created_by}
            authorName={comment.profiles?.full_name || "Anonymous"}
            onDelete={() => onDeleteComment(comment.id)}
            onReply={(content) => onAddComment(content, comment.id)}
            replies={comment.replies.map((reply) => ({
              id: reply.id,
              content: reply.content,
              createdAt: reply.created_at,
              createdBy: reply.created_by,
              authorName: reply.profiles?.full_name || "Anonymous",
              onDelete: () => onDeleteComment(reply.id),
            }))}
            isAddingReply={isAddingComment}
          />
        ))}
      </div>
    </div>
  );
};