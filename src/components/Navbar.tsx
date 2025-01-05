import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const location = useLocation();
  const session = useSession();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              SMSS
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/events">
                <Button
                  variant={isActive("/events") ? "default" : "ghost"}
                >
                  Events
                </Button>
              </Link>
              <Link to="/notices">
                <Button
                  variant={isActive("/notices") ? "default" : "ghost"}
                >
                  Notices
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant={isActive("/about") ? "default" : "ghost"}
                >
                  About
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <Button
                variant="ghost"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};