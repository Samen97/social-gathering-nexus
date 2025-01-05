import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  reference_id?: string;
  onClose?: () => void;
}

export const NotificationItem = ({
  type,
  title,
  content,
  created_at,
  is_read,
  reference_id,
  onClose,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Notification clicked:", { type, title, reference_id });
    if (reference_id) {
      if (type.includes('event')) {
        navigate(`/events/${reference_id}`);
      } else if (type.includes('notice')) {
        navigate(`/notices/${reference_id}`);
      }
      if (onClose) {
        onClose();
        toast.success("Notification marked as read");
      }
    }
  };

  const Icon = type.includes('event') ? Calendar : 
               type.includes('comment') ? MessageSquare : Bell;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-accent cursor-pointer bg-background",
        !is_read && "bg-accent"
      )}
    >
      <Icon className="h-5 w-5 mt-1 text-primary" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{content}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};