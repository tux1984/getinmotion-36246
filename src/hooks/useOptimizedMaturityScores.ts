
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore } from '@/types/dashboard';

interface OptimizedMaturityData {
  currentScores: CategoryScore | null;
  loading: boolean;
  error: string | null;
}

export const useOptimizedMaturityScores = (): OptimizedMaturityData => {
  const { user } = useAuth();
  const [data, setData] = useState<OptimizedMaturityData>({
    currentScores: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchMaturityScores = async () => {
      try {
        const { data: scores, error } = await supabase.rpc('get_latest_maturity_scores', {
          user_uuid: user.id
        });

        if (error) throw error;

        const currentScores = scores && scores.length > 0 ? {
          ideaValidation: scores[0].idea_validation,
          userExperience: scores[0].user_experience,
          marketFit: scores[0].market_fit,
          monetization: scores[0].monetization
        } : null;

        setData({
          currentScores,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching maturity scores:', err);
        setData({
          currentScores: null,
          loading: false,
          error: 'Error al cargar las puntuaciones de madurez'
        });
      }
    };

    fetchMaturityScores();
  }, [user]);

  return data;
};
