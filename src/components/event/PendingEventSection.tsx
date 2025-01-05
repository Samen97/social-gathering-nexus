import { EventCard } from "@/components/EventCard";
import { AdminEventActions } from "@/components/event/AdminEventActions";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url: string;
  event_attendees: any[];
  is_official: boolean;
  approval_status: string;
}

interface PendingEventSectionProps {
  events: Event[];
  onEventUpdate?: (eventId: string) => void;
}

export const PendingEventSection = ({ events, onEventUpdate }: PendingEventSectionProps) => {
  const navigate = useNavigate();

  if (!events || events.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6 text-orange-600">Pending Approval</h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="relative w-full">
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
                  onStatusChange={() => onEventUpdate?.(event.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};