import { useState, useCallback } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore } from '@/components/maturity/types';
import { UserProfileData } from '@/components/cultural/types/wizardTypes';
import { useToast } from '@/hooks/use-toast';

// Hook reparado para manejar el test de madurez correctamente
export const useFusedMaturityAgent = () => {
  const { user, robustQuery } = useRobustAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const saveMaturityScores = useCallback(async (
    scores: CategoryScore,
    profileData: UserProfileData
  ): Promise<boolean> => {
    if (!user) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Guardar scores de madurez
      const { error: scoresError } = await supabase
        .from('user_maturity_scores')
        .insert({
          user_id: user.id,
          idea_validation: scores.ideaValidation,
          user_experience: scores.userExperience,
          market_fit: scores.marketFit,
          monetization: scores.monetization,
          profile_data: profileData as any
        });

      if (scoresError) {
        console.error('Error saving maturity scores:', scoresError);
        throw scoresError;
      }

      // 2. Actualizar perfil de usuario
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          brand_name: profileData.brandName || 'TriMedias',
          business_description: profileData.businessDescription || 'Empresa especializada en medias',
          business_type: profileData.industry || 'retail',
          target_market: profileData.targetAudience || 'general',
          current_stage: profileData.experience || 'inicial',
          business_goals: profileData.businessGoals,
          time_availability: profileData.timeAvailability,
          team_size: profileData.teamSize,
          current_challenges: profileData.currentChallenges,
          sales_channels: profileData.salesChannels,
          business_location: profileData.businessLocation,
          primary_skills: profileData.primarySkills,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }

      // 3. Actualizar contexto maestro
      const { error: contextError } = await supabase
        .from('user_master_context')
        .upsert({
          user_id: user.id,
          business_profile: {
            brand_name: profileData.brandName || 'TriMedias',
            business_description: profileData.businessDescription || 'Empresa especializada en medias',
            business_type: profileData.industry || 'retail',
            target_market: profileData.targetAudience || 'general',
            current_stage: profileData.experience || 'inicial'
          },
          task_generation_context: {
            maturity_scores: scores as any,
            profile_data: profileData as any,
            last_assessment: new Date().toISOString()
          },
          last_assessment_date: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          context_version: 1
        }, {
          onConflict: 'user_id'
        });

      if (contextError) {
        console.error('Error updating master context:', contextError);
        throw contextError;
      }

      // Limpiar cache
      localStorage.removeItem('maturity-scores-cache');
      localStorage.removeItem('user-data-cache');

      toast({
        title: 'Test completado',
        description: 'Los resultados del test de madurez se han guardado correctamente',
      });

      console.log('✅ Maturity test saved successfully');
      return true;

    } catch (error: any) {
      console.error('❌ Error saving maturity data:', error);
      setError(error.message || 'Error al guardar los datos del test');
      
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar los resultados del test',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Función auxiliar para comprobar si el usuario ha completado el test
  const checkHasCompletedTest = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_maturity_scores')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking test completion:', error);
      return false;
    }
  }, [user]);

  return {
    saveMaturityScores,
    checkHasCompletedTest,
    loading,
    error
  };
};