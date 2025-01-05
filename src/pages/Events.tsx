import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { EventCalendar } from "@/components/EventCalendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { AdminEventActions } from "@/components/event/AdminEventActions";

const Events = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!session?.user) return false;
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: session.user.id
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
  });

  const officialEvents = events?.filter((event) => event.is_official);
  const communityEvents = events?.filter((event) => !event.is_official);
  const pendingEvents = events?.filter((event) => !event.is_official && event.approval_status === 'pending');

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
            events={events || []}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse bg-white rounded-lg shadow-md h-96"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Admin Section - Pending Events */}
              {isAdmin && pendingEvents && pendingEvents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-orange-600">Pending Approval</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="relative">
                        <EventCard
                          title={event.title}
                          date={new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                          location={event.location}
                          description={event.description || ""}
                          imageUrl={event.image_url || "/placeholder.svg"}
                          attendees={event.event_attendees?.length || 0}
                          isOfficial={event.is_official}
                          onClick={() => navigate(`/events/${event.id}`)}
                        />
                        <div className="absolute top-4 right-4">
                          <AdminEventActions 
                            eventId={event.id} 
                            currentStatus={event.approval_status}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Events Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-primary">Official Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {officialEvents?.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      date={new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                      location={event.location}
                      description={event.description || ""}
                      imageUrl={event.image_url || "/placeholder.svg"}
                      attendees={event.event_attendees?.length || 0}
                      isOfficial={event.is_official}
                      onClick={() => navigate(`/events/${event.id}`)}
                    />
                  ))}
                  {officialEvents?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      No official events scheduled.
                    </p>
                  )}
                </div>
              </div>

              {/* Community Events Section */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {communityEvents?.filter(event => event.approval_status === 'approved').map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      date={new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                      location={event.location}
                      description={event.description || ""}
                      imageUrl={event.image_url || "/placeholder.svg"}
                      attendees={event.event_attendees?.length || 0}
                      isOfficial={event.is_official}
                      onClick={() => navigate(`/events/${event.id}`)}
                    />
                  ))}
                  {communityEvents?.filter(event => event.approval_status === 'approved').length === 0 && (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      No approved community events posted yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;