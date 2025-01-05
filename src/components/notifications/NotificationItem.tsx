import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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

  const handleClick = async () => {
    console.log("Notification clicked:", { type, title, reference_id });
    
    if (is_read) {
      // If already read, just navigate
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
      return;
    }

    try {
      // Mark notification as read in the database
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      // Update the cache directly instead of invalidating
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return [];
        return oldData.map((notification: any) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        );
      });

      // Navigate to the referenced item if available
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
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const Icon = type.includes('event') ? Calendar : 
               type.includes('comment') ? MessageSquare : Bell;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-4 p-4 hover:bg-accent cursor-pointer bg-background transition-opacity duration-300",
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
    </div>
  );
};