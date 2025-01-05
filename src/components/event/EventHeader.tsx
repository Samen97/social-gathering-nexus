import { Crown } from "lucide-react";

interface EventHeaderProps {
  title: string;
  isOfficial: boolean;
}

export const EventHeader = ({ title, isOfficial }: EventHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">{title}</h1>
      {isOfficial && <Crown className="h-6 w-6 text-primary" />}
    </div>
  );
};