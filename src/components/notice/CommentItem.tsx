import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { DeleteCommentButton } from "./DeleteCommentButton";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  authorName: string;
  onDelete?: () => void;
  onReply?: (content: string) => void;
  replies?: CommentItemProps[];
  isAddingReply?: boolean;
}

export const CommentItem = ({
  id,
  content,
  createdAt,
  createdBy,
  authorName,
  onDelete,
  onReply,
  replies = [],
  isAddingReply = false,
}: CommentItemProps) => {
  const session = useSession();
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (content: string) => {
    if (onReply) {
      onReply(content);
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-l-2 border-gray-100 pl-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {authorName || "Anonymous"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
            {session?.user?.id === createdBy && onDelete && (
              <DeleteCommentButton onDelete={onDelete} />
            )}
          </div>
        </div>
        <p className="text-gray-600">{content}</p>
        {session && !isReplying && (
          <button
            onClick={() => setIsReplying(true)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Reply
          </button>
        )}
        {isReplying && (
          <div className="mt-2">
            <CommentForm
              onAddComment={handleReply}
              isAddingComment={isAddingReply}
              placeholder="Write a reply..."
            />
            <button
              onClick={() => setIsReplying(false)}
              className="text-sm text-gray-500 hover:text-gray-600 mt-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {replies.map((reply) => (
            <CommentItem key={reply.id} {...reply} />
          ))}
        </div>
      )}
    </div>
  );
};