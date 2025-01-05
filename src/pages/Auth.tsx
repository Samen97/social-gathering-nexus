import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we're in a password reset flow
    const token = searchParams.get('token');
    if (token) {
      navigate(`/password-reset?token=${token}`);
      return;
    }

    // Check for existing session
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
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, toast, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Welcome to South Manchester Social Stuff
          </h1>
          <SupabaseAuth
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
            supabaseClient={supabase}
            view="sign_up"
            showLinks={true}
            redirectTo={`${window.location.origin}/auth/callback`}
            localization={{
              variables: {
                sign_up: {
                  full_name_label: 'Full Name',
                  full_name_placeholder: 'Enter your full name',
                }
              }
            }}
            additionalData={{
              full_name: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;