import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  };
}

interface NoticeCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isAddingComment: boolean;
}

export const NoticeComments = ({
  comments,
  onAddComment,
  isAddingComment,
}: NoticeCommentsProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!session) {
      toast.error("You must be logged in to comment");
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="border-l-2 border-gray-100 pl-4 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {comment.profiles.full_name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600">{comment.content}</p>
          </div>
        ))}

        {session && (
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleAddComment}
              disabled={isAddingComment}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};