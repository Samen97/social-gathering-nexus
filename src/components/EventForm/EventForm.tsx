import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees: number;
}

export const EventForm = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const form = useForm<EventFormData>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      maxAttendees: 0,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    if (!session?.user) {
      toast.error("You must be logged in to create an event");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the event
      const { data: newEvent, error } = await supabase.from("events").insert({
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        location: data.location,
        image_url: imageUrl,
        max_attendees: data.maxAttendees || null,
        created_by: session.user.id,
        is_official: isAdmin,
        approval_status: isAdmin ? 'approved' : 'pending',
      }).select().single();

      if (error) throw error;

      // Call the notify-event function
      const { error: notifyError } = await supabase.functions.invoke('notify-event', {
        body: { event: newEvent }
      });

      if (notifyError) {
        console.error('Error calling notify-event function:', notifyError);
        // Don't throw here, we still want to show success for event creation
        toast.error('Event created but notifications may be delayed');
      } else {
        console.log('Successfully called notify-event function');
      }

      toast.success("Event created successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date and Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxAttendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Attendees (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter maximum number of attendees"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Event Image</FormLabel>
          <ImageUpload onImageSelected={setImageUrl} />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Event preview"
              className="mt-4 rounded-lg max-h-48 object-cover"
            />
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
};