import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session first
    if (session) {
      console.log("Existing session found, redirecting to home");
      navigate('/');
      return;
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Successfully signed in",
          duration: 2000,
        });
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          duration: 2000,
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery requested");
        toast({
          title: "Password Recovery",
          description: "Please check your email for reset instructions",
          duration: 5000,
        });
      }
    });

    // Test auth configuration
    const testAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("Auth configuration test:", { data, error });
        if (error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (err) {
        console.error("Auth test error:", err);
      }
    };

    testAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Welcome to South Manchester Social Stuff
          </h1>
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/auth/callback`}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;