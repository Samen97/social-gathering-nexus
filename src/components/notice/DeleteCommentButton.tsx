import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface DeleteCommentButtonProps {
  onDelete: () => void;
}

export const DeleteCommentButton = ({ onDelete }: DeleteCommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};