import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { EventCard } from "./EventCard";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
  image_url: string | null;
  is_official: boolean | null;
  event_attendees: any[];
}

interface EventCalendarProps {
  events: Event[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

export const EventCalendar = ({ events, onDateSelect, selectedDate }: EventCalendarProps) => {
  const filteredEvents = selectedDate
    ? events?.filter(
        (event) =>
          format(new Date(event.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : events;

  const officialEvents = filteredEvents?.filter((event) => event.is_official);
  const communityEvents = filteredEvents?.filter((event) => !event.is_official);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
      <div className="bg-white rounded-lg shadow-md p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md"
        />
      </div>
      
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">
          {selectedDate
            ? `Events on ${format(selectedDate, "MMMM d, yyyy")}`
            : "All Events"}
        </h2>
        
        {/* Official Events Section */}
        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">Official Events</h3>
          {officialEvents && officialEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {officialEvents.map((event) => (
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
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No official events found.</p>
          )}
        </div>

        {/* Community Events Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Community Events</h3>
          {communityEvents && communityEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityEvents.map((event) => (
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
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No community events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};