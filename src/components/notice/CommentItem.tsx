import { useSession } from "@supabase/auth-helpers-react";
import { DeleteCommentButton } from "./DeleteCommentButton";

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  authorName: string;
  onDelete?: () => void;
}

export const CommentItem = ({
  content,
  createdAt,
  createdBy,
  authorName,
  onDelete,
}: CommentItemProps) => {
  const session = useSession();

  return (
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
    </div>
  );
};