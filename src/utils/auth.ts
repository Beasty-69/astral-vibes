
import { supabase } from "@/integrations/supabase/client";
import { Toast } from "@/hooks/use-toast";

export const validateAuthInput = (email: string, password: string, toast: Toast) => {
  if (!email || !password) {
    toast({
      title: "Missing fields",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return false;
  }
  if (password.length < 6) {
    toast({
      title: "Invalid password",
      description: "Password must be at least 6 characters long.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const handleSignIn = async (
  email: string,
  password: string,
  setLoading: (loading: boolean) => void,
  toast: Toast
) => {
  if (!validateAuthInput(email, password, toast)) return;
  
  setLoading(true);
  console.log("Attempting login with:", { email });
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email not confirmed",
          description: "Please check your email and click the confirmation link before logging in.",
          variant: "destructive",
        });
      } else if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else if (data?.user) {
      console.log("Login successful:", data);
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

export const handleSignUp = async (
  email: string,
  password: string,
  username: string,
  setLoading: (loading: boolean) => void,
  toast: Toast
) => {
  if (!validateAuthInput(email, password, toast) || !username) {
    toast({
      title: "Missing username",
      description: "Please provide a username.",
      variant: "destructive",
    });
    return;
  }
  
  setLoading(true);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;

    if (data?.user?.identities?.length === 0) {
      toast({
        title: "Account already exists",
        description: "Please try logging in instead.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email for the confirmation link before logging in.",
      });
      console.log("Signup successful:", data);
    }
  } catch (error: any) {
    console.error("Signup error:", error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
