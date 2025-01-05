import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { EventCalendar } from "@/components/EventCalendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { EventSection } from "@/components/event/EventSection";
import { PendingEventSection } from "@/components/event/PendingEventSection";

const Events = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [localEvents, setLocalEvents] = useState<any[]>([]);

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

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_attendees(
            status,
            user_id
          ),
          profiles(full_name)
        `)
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data) => {
        setLocalEvents(data || []);
      },
    },
  });

  const handleEventDelete = (eventId: string) => {
    setLocalEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const officialEvents = localEvents?.filter((event) => event.is_official);
  const communityEvents = localEvents?.filter((event) => !event.is_official);
  const pendingEvents = localEvents?.filter((event) => !event.is_official && event.approval_status === 'pending');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="animate-pulse bg-white rounded-lg shadow-md h-96"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {session && (
            <Button onClick={() => navigate("/events/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>

        <div className="space-y-8">
          <EventCalendar
            events={localEvents || []}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />

          <div className="space-y-12">
            {isAdmin && <PendingEventSection events={pendingEvents || []} />}

            <EventSection
              title="Official Events"
              events={officialEvents || []}
              emptyMessage="No official events scheduled."
              onEventDelete={handleEventDelete}
            />

            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Community Events</h2>
                <Alert variant="info" className="mb-6">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Community events are created by members and subject to approval. 
                    These events are not officially organized by South Manchester Social Stuff.
                  </AlertDescription>
                </Alert>
              </div>
              <EventSection
                title="Community Events"
                events={communityEvents?.filter(event => event.approval_status === 'approved') || []}
                emptyMessage="No approved community events posted yet."
                onEventDelete={handleEventDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;