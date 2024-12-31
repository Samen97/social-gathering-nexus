import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export const EventCard = ({
  title,
  date,
  location,
  description,
  imageUrl,
}: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] animate-fade-in">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{date}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{location}</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <Button className="w-full">Learn More</Button>
      </div>
    </div>
  );
};