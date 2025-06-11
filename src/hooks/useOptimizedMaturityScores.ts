
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore } from '@/types/dashboard';

interface OptimizedMaturityData {
  currentScores: CategoryScore | null;
  loading: boolean;
  error: string | null;
}

const FETCH_TIMEOUT = 8000; // 8 segundos

const createTimeoutPromise = (timeout: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
};

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
        setData(prev => ({ ...prev, loading: true, error: null }));

        // ARREGLO: Añadir timeout y fallback
        const scoresPromise = supabase.rpc('get_latest_maturity_scores', {
          user_uuid: user.id
        });

        const { data: scores, error } = await Promise.race([
          scoresPromise,
          createTimeoutPromise(FETCH_TIMEOUT)
        ]) as any;

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
        
        // ARREGLO: Fallback con localStorage si falla la BD
        try {
          const localScores = localStorage.getItem('maturityScores');
          if (localScores) {
            const parsedScores = JSON.parse(localScores);
            console.log('Using localStorage fallback for maturity scores');
            
            setData({
              currentScores: parsedScores,
              loading: false,
              error: null
            });
            return;
          }
        } catch (fallbackErr) {
          console.warn('localStorage fallback failed:', fallbackErr);
        }

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
