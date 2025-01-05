import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingEventSection } from "@/components/event/PendingEventSection";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Check if user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_admin', {
        input_user_id: (await supabase.auth.getSession()).data.session?.user.id
      });
      if (error) throw error;
      return data;
    },
  });

  // Fetch pending events
  const { data: pendingEvents } = useQuery({
    queryKey: ["pendingEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_attendees (
            status,
            user_id
          ),
          profiles (
            full_name
          )
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  if (isCheckingAdmin) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="pending-events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending-events">Pending Events</TabsTrigger>
            <TabsTrigger value="all-events">All Events</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-events">
            <PendingEventSection events={pendingEvents || []} />
          </TabsContent>

          <TabsContent value="all-events">
            <div className="text-gray-500">
              All events management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;