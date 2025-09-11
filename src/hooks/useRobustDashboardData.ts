
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
  const { user } = useAuth();
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
    if (!user) {
      setData(prev => ({
        ...prev,
        loading: false,
        profile: { name: 'Usuario', email: '' }
      }));
      return;
    }

    const loadData = async () => {
      try {
        // Datos básicos del usuario - SIEMPRE disponibles
        const basicProfile = {
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          email: user.email || ''
        };

        // Cargar datos adicionales de forma segura
        let maturityScores = DEFAULT_SCORES;
        let userAgents: any[] = [];

        try {
          const scoresResult = await supabase.rpc('get_latest_maturity_scores', { user_uuid: user.id });
          if (scoresResult.data && scoresResult.data.length > 0) {
            const scores = scoresResult.data[0];
            maturityScores = {
              ideaValidation: scores.idea_validation || DEFAULT_SCORES.ideaValidation,
              userExperience: scores.user_experience || DEFAULT_SCORES.userExperience,
              marketFit: scores.market_fit || DEFAULT_SCORES.marketFit,
              monetization: scores.monetization || DEFAULT_SCORES.monetization
            };
          }
        } catch (scoresError) {
          console.log('Failed to load maturity scores, using defaults');
        }

        try {
          const agentsResult = await supabase.from('user_agents').select('*').eq('user_id', user.id);
          userAgents = agentsResult.data || [];
        } catch (agentsError) {
          console.log('Failed to load user agents');
        }

        setData({
          profile: basicProfile,
          maturityScores,
          userAgents,
          loading: false,
          error: null
        });

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
  }, [user]);

  return data;
};
