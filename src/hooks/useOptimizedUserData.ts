
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

const FETCH_TIMEOUT = 8000; // 8 segundos

export const useOptimizedUserData = (): OptimizedUserData => {
  const { user } = useAuth();
  const [data, setData] = useState<Omit<OptimizedUserData, 'hasOnboarding'>>({
    profile: null,
    projects: [],
    agents: [],
    loading: true,
    error: null,
  });

  // ARREGLO CRÍTICO: Simplificar detección de onboarding
  const hasOnboarding = useMemo(() => {
    try {
      // Verificar localStorage primero
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (onboardingCompleted === 'true') {
        console.log('useOptimizedUserData: hasOnboarding = true (localStorage)');
        return true;
      }

      // Verificar maturity scores como indicador secundario
      const savedMaturityScores = localStorage.getItem('maturityScores');
      if (savedMaturityScores) {
        try {
          const scores = JSON.parse(savedMaturityScores);
          if (scores && typeof scores === 'object' && Object.keys(scores).length > 0) {
            console.log('useOptimizedUserData: hasOnboarding = true (maturityScores)');
            localStorage.setItem('onboardingCompleted', 'true');
            return true;
          }
        } catch (e) {
          console.warn('useOptimizedUserData: Error parsing maturityScores:', e);
        }
      }

      console.log('useOptimizedUserData: hasOnboarding = false');
      return false;
    } catch (error) {
      console.error('useOptimizedUserData: Error checking onboarding:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      console.log('useOptimizedUserData: No user, setting loading to false');
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchUserData = async () => {
      console.log('useOptimizedUserData: Starting fetch for user:', user.id);
      
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // ARREGLO: Timeout para todas las consultas
        const fetchPromise = Promise.all([
          supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('user_projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('user_agents').select('*').eq('user_id', user.id)
        ]);

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), FETCH_TIMEOUT)
        );

        const [profileResult, projectsResult, agentsResult] = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as any[];

        // Manejo de errores de perfil
        let profile = profileResult.data;
        if (!profile && !profileResult.error) {
          // Crear perfil si no existe
          const fallbackProfile = {
            id: user.id,
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          try {
            const { data: newProfile } = await supabase
              .from('user_profiles')
              .insert(fallbackProfile)
              .select()
              .single();
            profile = newProfile || fallbackProfile;
          } catch (createError) {
            console.warn('useOptimizedUserData: Could not create profile, using fallback');
            profile = fallbackProfile;
          }
        }

        console.log('useOptimizedUserData: Fetch completed successfully');
        setData({
          profile,
          projects: projectsResult.data || [],
          agents: agentsResult.data || [],
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('useOptimizedUserData: Fetch error:', error);
        
        // ARREGLO: Fallback robusto
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
          error: null, // No mostrar error, usar fallback
        });
      }
    };

    fetchUserData();
  }, [user]);

  console.log('useOptimizedUserData: Current state:', {
    hasProfile: !!data.profile,
    agentCount: data.agents.length,
    projectCount: data.projects.length,
    loading: data.loading,
    hasOnboarding,
    error: data.error
  });

  return {
    ...data,
    hasOnboarding
  };
};
