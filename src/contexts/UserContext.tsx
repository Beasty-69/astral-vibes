
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserContextType {
  user: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast.success('Welcome back!');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
