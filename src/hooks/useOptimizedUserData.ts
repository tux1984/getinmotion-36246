
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

const FETCH_TIMEOUT = 10000; // 10 segundos

const createTimeoutPromise = (timeout: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
};

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

        // ARREGLO: Añadir timeout a todas las consultas
        const profilePromise = supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        const projectsPromise = supabase
          .from('user_projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        const agentsPromise = supabase
          .from('user_agents')
          .select('*')
          .eq('user_id', user.id);

        // Ejecutar todas las consultas con timeout
        const [profileResult, projectsResult, agentsResult] = await Promise.race([
          Promise.all([profilePromise, projectsPromise, agentsPromise]),
          createTimeoutPromise(FETCH_TIMEOUT)
        ]) as any[];

        // Handle profile creation if it doesn't exist
        let profile = profileResult.data;
        if (!profile && !profileResult.error) {
          try {
            const { data: newProfile, error: createError } = await Promise.race([
              supabase
                .from('user_profiles')
                .insert({
                  user_id: user.id,
                  full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
                })
                .select()
                .single(),
              createTimeoutPromise(5000)
            ]) as any;

            if (createError) throw createError;
            profile = newProfile;
          } catch (createErr) {
            console.warn('Could not create profile, using fallback');
            profile = {
              id: user.id,
              user_id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
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
        
        // ARREGLO: Fallback con datos de localStorage si falla
        try {
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
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
          setData(prev => ({
            ...prev,
            loading: false,
            error: 'Error al cargar los datos del usuario'
          }));
        }
      }
    };

    fetchAllUserData();
  }, [user]);

  return {
    ...data,
    hasOnboarding
  };
};
