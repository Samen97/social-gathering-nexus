import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: "Please try again",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/events">
        <Button
          variant={isActive("/events") ? "default" : "ghost"}
          className="w-full justify-start"
        >
          Events
        </Button>
      </Link>
      <Link to="/notices">
        <Button
          variant={isActive("/notices") ? "default" : "ghost"}
          className="w-full justify-start"
        >
          Notices
        </Button>
      </Link>
      <Link to="/about">
        <Button
          variant={isActive("/about") ? "default" : "ghost"}
          className="w-full justify-start"
        >
          About
        </Button>
      </Link>
      {isAdmin && (
        <Link to="/admin">
          <Button
            variant={isActive("/admin") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            Admin
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              SMSS
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Sheet>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] sm:w-[240px]">
                    <div className="flex flex-col gap-4 py-4">
                      <NavLinks />
                    </div>
                  </SheetContent>
                </Sheet>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};