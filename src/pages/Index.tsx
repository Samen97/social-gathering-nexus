import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Calendar, Users, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const COMMUNITY_STATS = [
  { icon: Calendar, label: "Events Hosted", value: "150+" },
  { icon: Users, label: "Active Members", value: "900+" },
  { icon: MapPin, label: "Locations", value: "25+" },
  { icon: Heart, label: "Connections Made", value: "1000+" },
];

const Index = () => {
  const navigate = useNavigate();

  const { data: events } = useQuery({
    queryKey: ["officialEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_attendees(*)
        `)
        .eq('is_official', true)
        .eq('approval_status', 'approved')
        .order('date', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with South Manchester
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our vibrant community and discover exciting events, meet new
              friends, and create lasting memories together in South Manchester.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Join Our Community
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
                onClick={() => navigate("/events")}
              >
                Explore Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {COMMUNITY_STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Official Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest official events happening in South Manchester. Join us
            for these specially curated community gatherings.
          </p>
        </div>
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
              No official events scheduled at the moment.
            </p>
          )}
        </div>
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/events")}
          >
            View All Events
          </Button>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're new to Manchester or a longtime local, there's always
            room for new friends and adventures. Host your own events or join
            existing ones - the choice is yours!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;