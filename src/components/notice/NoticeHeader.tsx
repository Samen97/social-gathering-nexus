import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface NoticeHeaderProps {
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
  canDelete: boolean;
  onDeleteClick: () => void;
}

export const NoticeHeader = ({
  title,
  description,
  authorName,
  createdAt,
  canDelete,
  onDeleteClick,
}: NoticeHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-gray-600">{description}</p>
        <div className="flex text-sm text-gray-500 space-x-4">
          <span>Posted by {authorName}</span>
          <span>{createdAt}</span>
        </div>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteClick}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};