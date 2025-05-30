
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  checkAuthorization: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuthorization = async (userEmail?: string): Promise<boolean> => {
    try {
      const email = userEmail || user?.email;
      if (!email) {
        console.log('No email provided for authorization check');
        return false;
      }
      
      console.log('Checking authorization for:', email);
      
      // Check if user is in admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking authorization:', error);
        return false;
      }
      
      const authorized = !!data;
      console.log('Authorization result:', authorized, data);
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('Exception checking authorization:', error);
      setIsAuthorized(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('AuthContext: Setting up auth listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check authorization for authenticated users
        if (session?.user?.email) {
          await checkAuthorization(session.user.email);
        } else {
          setIsAuthorized(false);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('AuthContext: Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.email) {
        await checkAuthorization(session.user.email);
      } else {
        setIsAuthorized(false);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        return { error };
      }
      
      console.log('AuthContext: Sign in successful for:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out');
    await supabase.auth.signOut();
    setIsAuthorized(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAuthorized,
      signIn,
      signOut,
      checkAuthorization
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
