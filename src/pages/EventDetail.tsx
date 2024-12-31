import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Crown } from "lucide-react";

const EventDetail = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          profiles:created_by(full_name),
          event_attendees(user_id, status)
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: userAttendance } = useQuery({
    queryKey: ["attendance", id],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("event_attendees")
        .select("*")
        .eq("event_id", id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const attendMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Must be logged in");
      const { error } = await supabase.from("event_attendees").upsert({
        event_id: id,
        user_id: session.user.id,
        status: "going",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["attendance", id] });
      toast.success("You're now attending this event!");
    },
    onError: () => {
      toast.error("Failed to RSVP. Please try again.");
    },
  });

  const cancelAttendanceMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Must be logged in");
      const { error } = await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", id)
        .eq("user_id", session.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["attendance", id] });
      toast.success("You've cancelled your attendance.");
    },
    onError: () => {
      toast.error("Failed to cancel. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => navigate("/events")}>Back to Events</Button>
      </div>
    );
  }

  const handleAttendance = () => {
    if (!session) {
      navigate("/auth");
      return;
    }
    if (userAttendance) {
      cancelAttendanceMutation.mutate();
    } else {
      attendMutation.mutate();
    }
  };

  const attendeeCount = event.event_attendees?.length || 0;
  const isAtCapacity =
    event.max_attendees !== null && attendeeCount >= event.max_attendees;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div
          className="h-96 bg-cover bg-center rounded-lg mb-8"
          style={{ backgroundImage: `url(${event.image_url})` }}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{event.title}</h1>
            {event.is_official && (
              <Crown className="h-6 w-6 text-primary" />
            )}
          </div>

          <div className="flex flex-col gap-4 text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>
                {attendeeCount} attending
                {event.max_attendees && ` (max ${event.max_attendees})`}
              </span>
            </div>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">
            {event.description}
          </p>

          <div className="flex justify-between items-center">
            <Button
              onClick={handleAttendance}
              disabled={
                isAtCapacity && !userAttendance
              }
              variant={userAttendance ? "outline" : "default"}
            >
              {userAttendance
                ? "Cancel Attendance"
                : isAtCapacity
                ? "Event Full"
                : "Attend Event"}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/events")}
            >
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;