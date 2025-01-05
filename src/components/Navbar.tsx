import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: isAdmin } = useQuery({
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              South Manchester Social
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/events" className="text-gray-600 hover:text-gray-900">
                Events
              </Link>
              <Link to="/notices" className="text-gray-600 hover:text-gray-900">
                Notices
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-orange-600 hover:text-orange-700 font-medium">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div>
            {session ? (
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};