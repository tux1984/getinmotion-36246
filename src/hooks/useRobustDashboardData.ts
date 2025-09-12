
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RobustDashboardData {
  profile: {
    name: string;
    email: string;
  };
  maturityScores: {
    ideaValidation: number;
    userExperience: number;
    marketFit: number;
    monetization: number;
  };
  userAgents: Array<{
    agent_id: string;
    is_enabled: boolean;
    usage_count: number;
  }>;
  loading: boolean;
  error: string | null;
}

const DEFAULT_SCORES = {
  ideaValidation: 25,
  userExperience: 20,
  marketFit: 15,
  monetization: 10
};

export const useRobustDashboardData = (): RobustDashboardData => {
  const { user, session } = useAuth();
  const [data, setData] = useState<RobustDashboardData>({
    profile: {
      name: 'Usuario',
      email: ''
    },
    maturityScores: DEFAULT_SCORES,
    userAgents: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    // Check both user AND session to ensure valid authentication
    if (!user || !session) {
      console.log('🔍 useRobustDashboardData: No valid user/session, setting defaults');
      setData(prev => ({
        ...prev,
        loading: false,
        profile: { name: 'Usuario', email: '' }
      }));
      return;
    }

    // Check if we have auth.uid() by testing a simple query
    const verifySession = async () => {
      try {
        const { data: authTest, error } = await supabase.rpc('is_authorized_user', { 
          user_email: user.email || '' 
        });
        
        if (error) {
          console.error('🚫 useRobustDashboardData: Session verification failed:', error);
          setData(prev => ({ ...prev, loading: false }));
          return false;
        }
        
        console.log('✅ useRobustDashboardData: Session verified successfully');
        return true;
      } catch (error) {
        console.error('🚫 useRobustDashboardData: Session test failed:', error);
        setData(prev => ({ ...prev, loading: false }));
        return false;
      }
    };

    const loadData = async () => {
      // First verify session is working
      const sessionValid = await verifySession();
      if (!sessionValid) return;

      try {
        // Datos básicos del usuario - SIEMPRE disponibles
        const basicProfile = {
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          email: user.email || ''
        };

        // Intentar cargar datos adicionales con timeout normal
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );

        try {
          const [scoresResult, agentsResult] = await Promise.race([
            Promise.all([
              supabase.rpc('get_latest_maturity_scores', { user_uuid: user.id }),
              supabase.from('user_agents').select('*').eq('user_id', user.id)
            ]),
            timeoutPromise
          ]) as any[];

          let maturityScores = DEFAULT_SCORES;
          if (scoresResult.data && scoresResult.data.length > 0) {
            const scores = scoresResult.data[0];
            maturityScores = {
              ideaValidation: scores.idea_validation || DEFAULT_SCORES.ideaValidation,
              userExperience: scores.user_experience || DEFAULT_SCORES.userExperience,
              marketFit: scores.market_fit || DEFAULT_SCORES.marketFit,
              monetization: scores.monetization || DEFAULT_SCORES.monetization
            };
          }

          setData({
            profile: basicProfile,
            maturityScores,
            userAgents: agentsResult.data || [],
            loading: false,
            error: null
          });

        } catch (fetchError) {
          // Usar datos básicos si la carga falla
          console.log('Using basic data due to fetch timeout');
          setData({
            profile: basicProfile,
            maturityScores: DEFAULT_SCORES,
            userAgents: [],
            loading: false,
            error: null
          });
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar datos'
        }));
      }
    };

    loadData();
  }, [user, session]);

  return data;
};
