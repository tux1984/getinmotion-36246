
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

const FETCH_TIMEOUT = 4000;

export const useOptimizedMaturityScores = (): OptimizedMaturityData => {
  const { user } = useAuth();
  const [data, setData] = useState<OptimizedMaturityData>({
    currentScores: null,
    profileData: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchMaturityScores = async () => {
      console.log('useOptimizedMaturityScores: Starting fetch');
      setData(prev => ({ ...prev, loading: true, error: null }));

      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), FETCH_TIMEOUT)
        );

        const scoresPromise = supabase.rpc('get_latest_maturity_scores', {
          user_uuid: user.id
        });

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
          
          // Save to localStorage for future use
          localStorage.setItem('maturityScores', JSON.stringify(currentScores));
          localStorage.setItem('profileData', JSON.stringify(profileData));
        } else {
          // Try localStorage fallback
          const localScores = localStorage.getItem('maturityScores');
          const localProfileData = localStorage.getItem('profileData');
          
          if (localScores && localScores !== 'null') {
            currentScores = JSON.parse(localScores);
            profileData = localProfileData ? JSON.parse(localProfileData) : null;
          }
        }

        console.log('useOptimizedMaturityScores: Fetch completed');
        setData({
          currentScores,
          profileData,
          loading: false,
          error: null,
        });

      } catch (err) {
        console.warn('useOptimizedMaturityScores: RPC call failed, using fallback', err);
        
        // Try localStorage fallback first
        try {
          const localScores = localStorage.getItem('maturityScores');
          const localProfileData = localStorage.getItem('profileData');
          
          if (localScores && localScores !== 'null') {
            const parsedScores = JSON.parse(localScores);
            const parsedProfileData = localProfileData ? JSON.parse(localProfileData) : null;
            
            console.log('useOptimizedMaturityScores: Using cached data');
            setData({
              currentScores: parsedScores,
              profileData: parsedProfileData,
              loading: false,
              error: null
            });
            return;
          }
        } catch (fallbackErr) {
          console.warn('useOptimizedMaturityScores: localStorage fallback failed');
        }

        // Provide default mock data for new users
        const mockScores = {
          ideaValidation: 1,
          userExperience: 1,
          marketFit: 1,
          monetization: 1
        };

        console.log('useOptimizedMaturityScores: Using default mock data');
        setData({
          currentScores: mockScores,
          profileData: { isNewUser: true },
          loading: false,
          error: null
        });
      }
    };

    fetchMaturityScores();
  }, [user]);

  return data;
};
