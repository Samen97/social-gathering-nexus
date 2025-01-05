import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const NotificationsPopover = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log("No user session found");
        return [];
      }

      console.log("Fetching notifications for user:", session.user.id);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq('user_id', session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
        throw error;
      }
      
      console.log("Fetched notifications:", data);
      return data || [];
    },
    enabled: !!session?.user?.id,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data always stale to ensure we get fresh data
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Failed to mark notification as read");
        throw error;
      }
    },
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(["notifications"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return [];
        return old.map((notification: any) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        );
      });

      // Return a context object with the snapshotted value
      return { previousNotifications };
    },
    onError: (err, newNotification, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["notifications"], context?.previousNotifications);
      toast.error("Failed to mark notification as read");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-background border shadow-lg" 
        align="end"
      >
        <div className="p-4 border-b bg-background">
          <h4 className="text-sm font-medium">Notifications</h4>
        </div>
        <ScrollArea className="h-[400px] bg-background">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onClose={() => handleNotificationClick(notification.id)}
              />
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground bg-background">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};