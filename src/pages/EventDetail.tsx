import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EventActions } from "@/components/EventActions";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { EventImageUpload } from "@/components/EventImageUpload";
import { EventGallery } from "@/components/EventGallery";
import { EventHeader } from "@/components/event/EventHeader";
import { EventInfo } from "@/components/event/EventInfo";
import { NoticeComments } from "@/components/notice/NoticeComments";
import { ArrowLeft } from "lucide-react";

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
        .select(`
          *,
          profiles:created_by(full_name),
          event_attendees(user_id, status)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["eventComments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_comments")
        .select(`
          *,
          profiles:created_by(full_name)
        `)
        .eq("event_id", id)
        .order("created_at", { ascending: true });

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

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { error } = await supabase.from("event_comments").insert({
        event_id: id,
        created_by: session?.user?.id,
        content,
        parent_id: parentId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", id] });
      toast.success("Comment added successfully");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("event_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", id] });
      toast.success("Comment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  const handleImageUploaded = (newImageUrl: string) => {
    queryClient.invalidateQueries({ queryKey: ["event", id] });
  };

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

  const handleAttendance = () => {
    if (userAttendance) {
      cancelAttendanceMutation.mutate();
    } else {
      attendMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </>
    );
  }

  const attendeeCount = event.event_attendees?.length || 0;
  const isAtCapacity =
    event.max_attendees !== null && attendeeCount >= event.max_attendees;
  const isHost = session?.user?.id === event.created_by;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/events")}
          className="mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          {isHost ? (
            <EventImageUpload
              eventId={event.id}
              currentImageUrl={event.image_url}
              onImageUploaded={handleImageUploaded}
            />
          ) : (
            event.image_url && (
              <div
                className="h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${event.image_url})` }}
              />
            )
          )}

          <div className="space-y-6">
            <EventHeader title={event.title} isOfficial={event.is_official} />

            <EventInfo
              date={new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
              location={event.location}
              attendeeCount={attendeeCount}
              maxAttendees={event.max_attendees}
            />

            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description}
            </p>

            <EventActions
              eventId={event.id}
              isHost={isHost}
              isAttending={!!userAttendance}
              isAtCapacity={isAtCapacity}
              onAttendanceChange={handleAttendance}
            />

            <EventGallery
              eventId={event.id}
              images={event.image_urls || []}
              isHost={isHost}
              onImagesChange={() => queryClient.invalidateQueries({ queryKey: ["event", id] })}
            />

            <NoticeComments
              comments={comments || []}
              onAddComment={(content, parentId) =>
                addCommentMutation.mutate({ content, parentId })
              }
              onDeleteComment={(commentId) => deleteCommentMutation.mutate(commentId)}
              isAddingComment={addCommentMutation.isPending}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
