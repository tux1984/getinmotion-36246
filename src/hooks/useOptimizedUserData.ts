
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

export const useOptimizedUserData = (): OptimizedUserData => {
  const { user } = useAuth();
  const [data, setData] = useState<Omit<OptimizedUserData, 'hasOnboarding'>>({
    profile: null,
    projects: [],
    agents: [],
    loading: true,
    error: null,
  });

  // ARREGLO CRÍTICO: Mejorar la detección de onboarding completado
  const hasOnboarding = useMemo(() => {
    // 1. Verificar localStorage primero (más confiable)
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      console.log('useOptimizedUserData: hasOnboarding = true (localStorage)');
      return true;
    }

    // 2. Verificar si tiene maturityScores guardados (indicador secundario)
    const savedMaturityScores = localStorage.getItem('maturityScores');
    if (savedMaturityScores) {
      try {
        const scores = JSON.parse(savedMaturityScores);
        if (scores && typeof scores === 'object') {
          console.log('useOptimizedUserData: hasOnboarding = true (maturityScores)');
          // Auto-marcar como completado si tiene scores pero no el flag
          localStorage.setItem('onboardingCompleted', 'true');
          return true;
        }
      } catch (e) {
        console.warn('useOptimizedUserData: Error parsing maturityScores:', e);
      }
    }

    // 3. Como último recurso, verificar agentes habilitados
    if (data.agents.length > 0 && data.agents.some(agent => agent.is_enabled)) {
      console.log('useOptimizedUserData: hasOnboarding = true (enabled agents)');
      // Auto-marcar como completado si tiene agentes pero no el flag
      localStorage.setItem('onboardingCompleted', 'true');
      return true;
    }

    console.log('useOptimizedUserData: hasOnboarding = false (no indicators)');
    return false;
  }, [data.agents]);

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchAllUserData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all user data in parallel for better performance
        const [profileResult, projectsResult, agentsResult] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          
          supabase
            .from('user_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10), // Limit initial load
          
          supabase
            .from('user_agents')
            .select('*')
            .eq('user_id', user.id)
        ]);

        // Handle profile creation if it doesn't exist
        let profile = profileResult.data;
        if (!profile && !profileResult.error) {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
            })
            .select()
            .single();

          if (createError) throw createError;
          profile = newProfile;
        }

        if (profileResult.error && profileResult.error.code !== 'PGRST116') {
          throw profileResult.error;
        }
        if (projectsResult.error) throw projectsResult.error;
        if (agentsResult.error) throw agentsResult.error;

        setData({
          profile,
          projects: projectsResult.data || [],
          agents: agentsResult.data || [],
          loading: false,
          error: null,
        });

      } catch (err) {
        console.error('Error fetching user data:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar los datos del usuario'
        }));
      }
    };

    fetchAllUserData();
  }, [user]);

  return {
    ...data,
    hasOnboarding
  };
};
