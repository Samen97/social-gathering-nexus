import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Calendar, Users, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COMMUNITY_STATS = [
  { icon: Calendar, label: "Events Hosted", value: "150+" },
  { icon: Users, label: "Active Members", value: "500+" },
  { icon: MapPin, label: "Locations", value: "25+" },
  { icon: Heart, label: "Connections Made", value: "1000+" },
];

const FEATURED_EVENTS = [
  {
    title: "South Manchester Book Club",
    date: "Next Saturday at 3:00 PM",
    location: "Didsbury Library",
    description: "Join us for an engaging discussion of this month's book selection. All reading enthusiasts welcome!",
    imageUrl: "/placeholder.svg",
    attendees: 12,
    isOfficial: true,
  },
  {
    title: "Chorlton Coffee Morning",
    date: "Every Tuesday at 10:00 AM",
    location: "The Edge, Chorlton",
    description: "Weekly casual coffee meetup. Come along for great conversations and even better coffee!",
    imageUrl: "/placeholder.svg",
    attendees: 8,
  },
  {
    title: "Levenshulme Market Social",
    date: "This Saturday at 11:00 AM",
    location: "Levenshulme Market",
    description: "Explore the market together and grab lunch from local vendors. Perfect for foodies and social butterflies!",
    imageUrl: "/placeholder.svg",
    attendees: 15,
  },
];

const Index = () => {
  const navigate = useNavigate();

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
            Upcoming Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest events happening in South Manchester. From casual meetups
            to organized activities, there's something for everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_EVENTS.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
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