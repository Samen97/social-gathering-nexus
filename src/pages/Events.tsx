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
import { NoticeBoard } from "@/components/NoticeBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Events = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();

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

          <Tabs defaultValue="official" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="official">Official Events</TabsTrigger>
              <TabsTrigger value="community">Community Events</TabsTrigger>
              <TabsTrigger value="noticeboard">Notice Board</TabsTrigger>
            </TabsList>

            <TabsContent value="official">
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
              )}
            </TabsContent>

            <TabsContent value="community">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communityEvents?.map((event) => (
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
                {communityEvents?.length === 0 && (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    No community events posted yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="noticeboard">
              <NoticeBoard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Events;