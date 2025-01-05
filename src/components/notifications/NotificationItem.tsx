import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, MessageSquare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
  id,
  type,
  title,
  content,
  created_at,
  is_read,
  reference_id,
  onClose,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting notification:", error);
        toast.error("Failed to delete notification");
        return;
      }

      // Update the cache directly to remove the notification
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((notification: any) => notification.id !== id);
      });

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleClick = () => {
    if (reference_id) {
      if (type.includes('event')) {
        navigate(`/events/${reference_id}`);
      } else if (type.includes('notice')) {
        navigate(`/notices/${reference_id}`);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  const Icon = type.includes('event') ? Calendar : 
               type.includes('comment') ? MessageSquare : Bell;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-accent cursor-pointer bg-background transition-opacity duration-300 relative",
        !is_read && "bg-accent",
        is_read && "opacity-50"
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
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleDelete}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};