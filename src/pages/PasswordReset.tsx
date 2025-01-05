import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're in a password reset flow
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token") || 
                       (location.state && location.state.accessToken);
    const type = hashParams.get("type") || 
                 (location.state && location.state.type);

    if (type === "recovery" && accessToken) {
      console.log("Password reset flow detected with token");
      // Set the session with the access token
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // If no session, try to set it using the access token
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: '',
          }).catch((error) => {
            console.error("Error setting session:", error);
            navigate("/auth");
          });
        }
      });
    } else {
      console.log("No valid password reset flow detected, redirecting to auth");
      navigate("/auth");
    }
  }, [navigate, location]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
        description: "You can now sign in with your new password",
        duration: 5000,
      });

      // After successful password reset, redirect to auth page
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Reset Your Password
          </h1>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;