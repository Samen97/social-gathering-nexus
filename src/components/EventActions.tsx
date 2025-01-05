import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";

interface EventActionsProps {
  eventId: string;
  isHost: boolean;
  isAttending: boolean;
  isAtCapacity: boolean;
  onAttendanceChange: () => void;
}

export const EventActions = ({ 
  eventId, 
  isHost, 
  isAttending, 
  isAtCapacity, 
  onAttendanceChange 
}: EventActionsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!session?.user) return false;
      const { data, error } = await supabase.rpc('is_admin', {
        input_user_id: session.user.id
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      navigate("/events");
    },
    onError: (error) => {
      toast.error("Failed to delete event: " + error.message);
    },
  });

  return (
    <div className="flex justify-between items-center gap-4">
      <Button
        onClick={onAttendanceChange}
        disabled={isAtCapacity && !isAttending}
        variant={isAttending ? "outline" : "default"}
      >
        {isAttending
          ? "Cancel Attendance"
          : isAtCapacity
          ? "Event Full"
          : "Attend Event"}
      </Button>

      {(isHost || isAdmin) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Event</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event
                and remove all attendee records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};