import { Calendar, MapPin, Users } from "lucide-react";

interface EventInfoProps {
  date: string;
  location: string;
  attendeeCount: number;
  maxAttendees?: number | null;
}

export const EventInfo = ({ date, location, attendeeCount, maxAttendees }: EventInfoProps) => {
  return (
    <div className="flex flex-col gap-4 text-gray-600">
      <div className="flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        <span>{date}</span>
      </div>

      <div className="flex items-center">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{location}</span>
      </div>

      <div className="flex items-center">
        <Users className="h-5 w-5 mr-2" />
        <span>
          {attendeeCount} attending
          {maxAttendees && ` (max ${maxAttendees})`}
        </span>
      </div>
    </div>
  );
};