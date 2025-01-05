import { Button } from "@/components/ui/button";
import { Menu, Share2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            South Manchester Social
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/events" className="text-gray-600 hover:text-primary">
              Events
            </Link>
            <Link to="/notices" className="text-gray-600 hover:text-primary">
              Notices
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href="https://linktr.ee/SouthManchesterSocialStuff"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    Linktree
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {session ? (
              <Button variant="default" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button variant="default" onClick={handleSignIn}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/events"
                className="text-gray-600 hover:text-primary px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/notices"
                className="text-gray-600 hover:text-primary px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Notices
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-primary px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <a
                href="https://linktr.ee/SouthManchesterSocialStuff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Linktree
              </a>
              {session ? (
                <Button variant="default" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
              ) : (
                <Button variant="default" onClick={handleSignIn} className="w-full">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};