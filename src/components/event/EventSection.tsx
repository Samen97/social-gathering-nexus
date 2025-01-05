import { EventCard } from "@/components/EventCard";
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
  approval_status?: string;
}

interface EventSectionProps {
  title: string;
  events: Event[];
  emptyMessage: string;
  showAdminActions?: boolean;
}

export const EventSection = ({ title, events, emptyMessage, showAdminActions }: EventSectionProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.map((event) => (
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
        {events?.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-8">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
};