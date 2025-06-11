
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { createUserAgentsFromRecommendations } from '@/utils/onboardingUtils';
import { useMaturityScoresSaver } from './useMaturityScoresSaver';

interface RecoveryStatus {
  needsRecovery: boolean;
  recovering: boolean;
  recovered: boolean;
  error: string | null;
}

export const useDataRecovery = () => {
  const { user } = useAuth();
  const { saveMaturityScores } = useMaturityScoresSaver();
  const [status, setStatus] = useState<RecoveryStatus>({
    needsRecovery: false,
    recovering: false,
    recovered: false,
    error: null
  });

  const checkNeedsRecovery = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Checking if user needs data recovery...');

      // Verificar si tiene datos en localStorage
      const localMaturityScores = localStorage.getItem('maturityScores');
      const localRecommendedAgents = localStorage.getItem('recommendedAgents');
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');

      if (!localMaturityScores || !onboardingCompleted) {
        console.log('No localStorage data found, no recovery needed');
        return;
      }

      // Verificar si ya tiene datos en la BD
      const [scoresResult, agentsResult] = await Promise.all([
        supabase.rpc('get_latest_maturity_scores', { user_uuid: user.id }),
        supabase.from('user_agents').select('*').eq('user_id', user.id).eq('is_enabled', true)
      ]);

      const hasDbScores = scoresResult.data && scoresResult.data.length > 0;
      const hasDbAgents = agentsResult.data && agentsResult.data.length > 0;

      console.log('Recovery check results:', { 
        hasDbScores, 
        hasDbAgents, 
        scoresCount: scoresResult.data?.length || 0,
        agentsCount: agentsResult.data?.length || 0 
      });

      if (!hasDbScores || !hasDbAgents) {
        console.log('User needs data recovery:', { hasDbScores, hasDbAgents });
        setStatus(prev => ({ ...prev, needsRecovery: true }));
      } else {
        console.log('User has complete data in database, no recovery needed');
      }
    } catch (err) {
      console.error('Error checking recovery needs:', err);
      setStatus(prev => ({ ...prev, error: 'Error verificando necesidad de recuperación' }));
    }
  }, [user]);

  const performRecovery = useCallback(async () => {
    if (!user) return false;

    try {
      setStatus(prev => ({ ...prev, recovering: true, error: null }));
      console.log('Starting data recovery process...');

      // Recuperar datos de localStorage
      const localMaturityScoresStr = localStorage.getItem('maturityScores');
      const localRecommendedAgentsStr = localStorage.getItem('recommendedAgents');

      if (!localMaturityScoresStr) {
        throw new Error('No maturity scores found in localStorage');
      }

      const maturityScores: CategoryScore = JSON.parse(localMaturityScoresStr);
      console.log('Recovered maturity scores from localStorage:', maturityScores);

      // Guardar maturity scores en BD (si no existen)
      const { data: existingScores } = await supabase.rpc('get_latest_maturity_scores', { user_uuid: user.id });
      
      if (!existingScores || existingScores.length === 0) {
        const scoresSaved = await saveMaturityScores(maturityScores);
        if (!scoresSaved) {
          console.warn('Failed to save maturity scores, but continuing with recovery');
        } else {
          console.log('Maturity scores saved successfully during recovery');
        }
      } else {
        console.log('Maturity scores already exist in database, skipping save');
      }

      // Recuperar y guardar agentes recomendados
      let recommendedAgents: RecommendedAgents = {
        cultural: true, // Default mínimo
      };

      if (localRecommendedAgentsStr) {
        try {
          recommendedAgents = JSON.parse(localRecommendedAgentsStr);
        } catch (e) {
          console.warn('Error parsing recommended agents, using defaults:', e);
        }
      }

      console.log('Recovered recommended agents from localStorage:', recommendedAgents);

      // Crear agentes en BD
      const agentsCreated = await createUserAgentsFromRecommendations(user.id, recommendedAgents);
      if (!agentsCreated) {
        console.warn('Failed to create agents during recovery');
        // Crear al menos el agente cultural por defecto
        const defaultAgents = { cultural: true };
        await createUserAgentsFromRecommendations(user.id, defaultAgents);
      } else {
        console.log('User agents created successfully during recovery');
      }

      setStatus(prev => ({ 
        ...prev, 
        recovering: false, 
        recovered: true, 
        needsRecovery: false 
      }));

      console.log('Data recovery completed successfully');
      return true;
    } catch (err) {
      console.error('Error during data recovery:', err);
      setStatus(prev => ({ 
        ...prev, 
        recovering: false, 
        error: 'Error durante la recuperación de datos' 
      }));
      return false;
    }
  }, [user, saveMaturityScores]);

  useEffect(() => {
    if (user && !status.recovered) {
      checkNeedsRecovery();
    }
  }, [user, checkNeedsRecovery, status.recovered]);

  return {
    ...status,
    performRecovery,
    checkNeedsRecovery
  };
};
