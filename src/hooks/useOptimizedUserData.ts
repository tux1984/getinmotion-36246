import { useState, useEffect, useMemo } from 'react';
import { safeSupabase } from '@/utils/supabase-safe';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  business_description?: string;
  brand_name?: string;
  business_type?: string;
  target_market?: string;
  current_stage?: string;
  business_goals?: string[];
  time_availability?: string;
  team_size?: string;
  current_challenges?: string[];
  sales_channels?: string[];
  business_location?: string;
  initial_investment_range?: string;
  primary_skills?: string[];
}

interface UserProject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

interface UserAgent {
  id: string;
  user_id: string;
  agent_id: string;
  is_enabled: boolean;
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

  const hasOnboarding = useMemo(() => {
    return !!(data.profile?.brand_name || data.profile?.business_description);
  }, [data.profile]);

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
          safeSupabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
          safeSupabase.from('user_projects').select('*').eq('user_id', user.id),
          safeSupabase.from('user_agents').select('*').eq('user_id', user.id)
        ]);

        const [profileResult, projectsResult, agentsResult] = await Promise.race([
          dataPromise,
          timeoutPromise
        ]) as any;

        // Ensure profile exists, create fallback if needed
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
          error: null, // Use fallback instead of error
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