
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const handleSignIn = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
  toast: any
) => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    } else {
      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });
    }
  } finally {
    setLoading(false);
  }
};

export const handleSignUp = async (
  email: string,
  password: string,
  username: string,
  setLoading: (loading: boolean) => void,
  toast: any
) => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } else {
      toast({
        title: "Successfully signed up",
        description: "Please check your email to confirm your account.",
      });
    }
  } finally {
    setLoading(false);
  }
};
