
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UserAgent {
  id: string;
  user_id: string;
  agent_id: string;
  is_enabled: boolean;
  last_used_at: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface OptimizedUserData {
  profile: UserProfile | null;
  projects: UserProject[];
  agents: UserAgent[];
  loading: boolean;
  error: string | null;
  hasOnboarding: boolean;
}

const FETCH_TIMEOUT = 5000;

export const useOptimizedUserData = (): OptimizedUserData => {
  const { user } = useAuth();
  const [data, setData] = useState<Omit<OptimizedUserData, 'hasOnboarding'>>({
    profile: null,
    projects: [],
    agents: [],
    loading: false,
    error: null,
  });

  // Simplified onboarding detection
  const hasOnboarding = useMemo(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    const scores = localStorage.getItem('maturityScores');
    return completed === 'true' || (scores && scores !== 'null');
  }, []);

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchUserData = async () => {
      console.log('useOptimizedUserData: Starting fetch');
      setData(prev => ({ ...prev, loading: true, error: null }));

      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), FETCH_TIMEOUT)
        );

        const dataPromise = Promise.all([
          supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('user_projects').select('*').eq('user_id', user.id).limit(5),
          supabase.from('user_agents').select('*').eq('user_id', user.id)
        ]);

        const [profileResult, projectsResult, agentsResult] = await Promise.race([
          dataPromise,
          timeoutPromise
        ]) as any[];

        // Create fallback profile if needed
        let profile = profileResult.data;
        if (!profile) {
          profile = {
            id: user.id,
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }

        console.log('useOptimizedUserData: Fetch successful');
        setData({
          profile,
          projects: projectsResult.data || [],
          agents: agentsResult.data || [],
          loading: false,
          error: null,
        });

      } catch (error) {
        console.warn('useOptimizedUserData: Using fallback data due to error:', error);
        
        // Provide fallback data instead of error
        const fallbackProfile = {
          id: user.id,
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setData({
          profile: fallbackProfile,
          projects: [],
          agents: [],
          loading: false,
          error: null,
        });
      }
    };

    fetchUserData();
  }, [user]);

  return {
    ...data,
    hasOnboarding
  };
};
