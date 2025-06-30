import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Session error:', error.message);
        // Clear any stale session data
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
        
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      return { data: null, error: err as any };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { data: null, error: err as any };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      return { error: err as any };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        console.error('Resend confirmation error:', error.message);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected resend confirmation error:', err);
      return { data: null, error: err as any };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmationEmail,
  };
}