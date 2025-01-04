import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">About South Manchester Social</h1>
        
        <div className="space-y-8">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                South Manchester Social is a vibrant community bringing together people from across South Manchester. 
                We organize regular social events, activities, and meetups to help locals connect, make friends, 
                and enjoy everything our area has to offer.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in delay-100">
            <CardHeader>
              <CardTitle>What We Do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                From casual coffee meetups to organized sports events, book clubs to pub quizzes, 
                we create opportunities for people to meet and connect. Our events are designed to be 
                inclusive, welcoming, and fun for everyone, whether you're new to the area or a long-time resident.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in delay-200">
            <CardHeader>
              <CardTitle>Join Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Getting involved is easy! Simply sign up, browse our upcoming events, and RSVP to anything 
                that interests you. Whether you're looking to make new friends, explore the area, or just 
                try something new, there's a place for you in our community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;