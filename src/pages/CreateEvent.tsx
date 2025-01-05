import { EventForm } from "@/components/EventForm/EventForm";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navbar />
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8 space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/events")}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Event</h1>
        </div>
        <EventForm />
      </div>
    </div>
  );
};

export default CreateEvent;