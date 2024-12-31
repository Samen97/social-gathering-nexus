import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";

const FEATURED_EVENTS = [
  {
    title: "Manchester Art Walk",
    date: "Saturday, April 20th at 2:00 PM",
    location: "Northern Quarter",
    description:
      "Join us for a guided walk through Manchester's vibrant street art scene. Perfect for photography enthusiasts and art lovers!",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
  },
  {
    title: "Coffee & Code Social",
    date: "Sunday, April 21st at 10:00 AM",
    location: "Ancoats Coffee Co.",
    description:
      "Whether you're a seasoned developer or just starting out, come along for coffee and casual coding conversations!",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    title: "Weekend Hiking Adventure",
    date: "Saturday, April 27th at 9:00 AM",
    location: "Peak District",
    description:
      "A beginner-friendly hike through some of the most beautiful trails in the Peak District. Transportation provided.",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with South Manchester
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our vibrant community and discover exciting events, meet new
            friends, and create lasting memories together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg">
              Join Now
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Browse Events
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_EVENTS.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
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
            room for new friends and adventures.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-secondary hover:bg-secondary/90"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;