import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CommentFormProps {
  onAddComment: (content: string) => void;
  isAddingComment: boolean;
  placeholder?: string;
}

export const CommentForm = ({
  onAddComment,
  isAddingComment,
  placeholder = "Write a comment...",
}: CommentFormProps) => {
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
    <div className="flex gap-2">
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button size="icon" onClick={handleAddComment} disabled={isAddingComment}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};