
import { useState } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { safeSupabase } from '@/utils/supabase-safe';
import { CategoryScore } from '@/types/dashboard';

export const useMaturityScoresSaver = () => {
  const { user } = useRobustAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMaturityScores = async (scores: CategoryScore, profileData?: any) => {
    if (!user) {
      console.warn('No authenticated user found for saving maturity scores');
      return false;
    }

    try {
      setSaving(true);
      setError(null);
      
      console.log('Saving maturity scores to database:', { userId: user.id, scores });

      const { data, error: supabaseError } = await safeSupabase
        .from('user_maturity_scores')
        .insert({
          user_id: user.id,
          idea_validation: scores.ideaValidation,
          user_experience: scores.userExperience,
          market_fit: scores.marketFit,
          monetization: scores.monetization,
          profile_data: profileData || {}
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('Error saving maturity scores:', supabaseError);
        setError('Error al guardar las puntuaciones de madurez');
        return false;
      }

      console.log('Maturity scores saved successfully:', data);
      return true;
    } catch (err) {
      console.error('Unexpected error saving maturity scores:', err);
      setError('Error inesperado al guardar las puntuaciones');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saveMaturityScores,
    saving,
    error
  };
};
