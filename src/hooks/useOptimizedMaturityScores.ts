
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

const FETCH_TIMEOUT = 6000; // 6 segundos

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
      console.log('useOptimizedMaturityScores: No user, setting loading to false');
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchMaturityScores = async () => {
      console.log('useOptimizedMaturityScores: Starting fetch for user:', user.id);
      
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // ARREGLO: Timeout más corto y fallback inmediato
        const scoresPromise = supabase.rpc('get_latest_maturity_scores', {
          user_uuid: user.id
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), FETCH_TIMEOUT)
        );

        const { data: scores, error } = await Promise.race([
          scoresPromise,
          timeoutPromise
        ]) as any;

        if (error) throw error;

        let currentScores = null;
        let profileData = null;

        if (scores && scores.length > 0) {
          currentScores = {
            ideaValidation: scores[0].idea_validation,
            userExperience: scores[0].user_experience,
            marketFit: scores[0].market_fit,
            monetization: scores[0].monetization
          };
          profileData = scores[0].profile_data;
        }

        console.log('useOptimizedMaturityScores: Fetch completed successfully');
        setData({
          currentScores,
          profileData,
          loading: false,
          error: null,
        });

      } catch (err) {
        console.error('useOptimizedMaturityScores: Fetch error:', err);
        
        // ARREGLO: Fallback con localStorage
        try {
          const localScores = localStorage.getItem('maturityScores');
          const localProfileData = localStorage.getItem('profileData');
          
          if (localScores) {
            const parsedScores = JSON.parse(localScores);
            const parsedProfileData = localProfileData ? JSON.parse(localProfileData) : null;
            
            console.log('useOptimizedMaturityScores: Using localStorage fallback');
            setData({
              currentScores: parsedScores,
              profileData: parsedProfileData,
              loading: false,
              error: null
            });
            return;
          }
        } catch (fallbackErr) {
          console.warn('useOptimizedMaturityScores: localStorage fallback failed:', fallbackErr);
        }

        // Fallback final: no hay error, solo datos vacíos
        setData({
          currentScores: null,
          profileData: null,
          loading: false,
          error: null // No mostrar error para evitar romper el dashboard
        });
      }
    };

    fetchMaturityScores();
  }, [user]);

  console.log('useOptimizedMaturityScores: Current state:', {
    hasScores: !!data.currentScores,
    hasProfileData: !!data.profileData,
    loading: data.loading,
    error: data.error
  });

  return data;
};
