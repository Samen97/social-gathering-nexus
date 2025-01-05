import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  attendees: number;
  isOfficial?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export const EventCard = ({
  title,
  date,
  location,
  description,
  imageUrl,
  attendees,
  isOfficial,
  onClick,
  onDelete,
}: EventCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] animate-fade-in cursor-pointer",
        isOfficial && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onClick}
    >
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {isOfficial && (
            <Crown className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{date}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-2" />
          <span className="text-sm">{attendees} attending</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onClick}>
            View Details
          </Button>
          {onDelete && (
            <Button 
              variant="destructive" 
              className="px-3"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};