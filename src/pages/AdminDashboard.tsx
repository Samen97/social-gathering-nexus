import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingEventSection } from "@/components/event/PendingEventSection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!session?.user) return false;
      const { data, error } = await supabase.rpc('is_admin', {
        input_user_id: session.user.id
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const { data: pendingEvents } = useQuery({
    queryKey: ["pendingEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_attendees (
            user_id,
            status
          )
        `)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
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
          <p className="text-gray-500">Coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;