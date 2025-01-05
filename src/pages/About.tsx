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
                South Manchester Social Stuff is more than just a group—it's a thriving community for anyone looking to connect, make friends, and discover the best of South Manchester. Whether you're new to the area or a lifelong local, our regular social events, activities, and meetups offer something for everyone. From casual coffee catch-ups to adventurous outings, we're here to bring people together and create meaningful connections.
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
                Getting involved is easy! Simply sign up, browse our upcoming events, and RSVP to anything that catches your eye. For the full picture of who's attending, don't forget to check out our Meetup and Facebook pages—our community thrives across platforms, so the site might not always reflect the buzz happening elsewhere.
                <br /><br />
                But that's not all! You can also use our platform to post notices and connect with others for things like finding gym buddies, starting a hobby group, or sharing local tips. Whether you're here to make new friends, explore the area, or try something completely different, there's always a place for you in our vibrant community. Jump in and join the fun!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;