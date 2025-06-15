
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore } from '@/types/dashboard';

interface OptimizedMaturityData {
  currentScores: CategoryScore | null;
  profileData: any | null;
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
    profileData: null,
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

        const profileData = scores && scores.length > 0 ? scores[0].profile_data : null;

        setData({
          currentScores,
          profileData,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching maturity scores:', err);
        
        try {
          const localScores = localStorage.getItem('maturityScores');
          const localProfileData = localStorage.getItem('profileData');
          if (localScores) {
            const parsedScores = JSON.parse(localScores);
            const parsedProfileData = localProfileData ? JSON.parse(localProfileData) : null;
            console.log('Using localStorage fallback for maturity scores');
            
            setData({
              currentScores: parsedScores,
              profileData: parsedProfileData,
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
          profileData: null,
          loading: false,
          error: 'Error al cargar las puntuaciones de madurez'
        });
      }
    };

    fetchMaturityScores();
  }, [user]);

  return data;
};
