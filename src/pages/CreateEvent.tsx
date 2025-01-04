import { EventForm } from "@/components/EventForm/EventForm";

const CreateEvent = () => {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <EventForm />
    </div>
  );
};

export default CreateEvent;