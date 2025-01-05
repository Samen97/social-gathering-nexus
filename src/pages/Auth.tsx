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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Successfully signed in",
          duration: 2000,
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, searchParams]);

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
                    brand: '#6D28D9',
                    brandAccent: '#5B21B6',
                  },
                },
              },
              className: {
                container: 'auth-container',
                label: 'text-sm font-medium text-gray-700',
                button: 'w-full bg-primary text-white rounded-md py-2 hover:bg-primary/90',
                input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
              },
            }}
            supabaseClient={supabase}
            providers={[]}
            redirectTo={`${window.location.origin}/auth/callback`}
            magicLink={false}
            showLinks={true}
            additionalData={{
              full_name: {
                required: true,
                label: 'Full Name',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;