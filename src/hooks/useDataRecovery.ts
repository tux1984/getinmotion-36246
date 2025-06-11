
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

const RECOVERY_TIMEOUT = 15000; // 15 segundos

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

      // ARREGLO: Añadir timeout a las consultas de verificación
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Check timeout')), 5000);
      });

      try {
        const [scoresResult, agentsResult] = await Promise.race([
          Promise.all([
            supabase.rpc('get_latest_maturity_scores', { user_uuid: user.id }),
            supabase.from('user_agents').select('*').eq('user_id', user.id).eq('is_enabled', true)
          ]),
          timeoutPromise
        ]) as any[];

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
      } catch (checkErr) {
        console.warn('Recovery check failed, assuming recovery needed:', checkErr);
        setStatus(prev => ({ ...prev, needsRecovery: true }));
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

      // ARREGLO: Usar timeout para las operaciones de recovery
      const recoveryTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Recovery timeout')), RECOVERY_TIMEOUT);
      });

      // Guardar maturity scores en BD (si no existen) con retry
      let scoresSaved = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const { data: existingScores } = await Promise.race([
            supabase.rpc('get_latest_maturity_scores', { user_uuid: user.id }),
            recoveryTimeout
          ]) as any;
          
          if (!existingScores || existingScores.length === 0) {
            scoresSaved = await saveMaturityScores(maturityScores);
            if (scoresSaved) {
              console.log('Maturity scores saved successfully during recovery');
              break;
            }
          } else {
            console.log('Maturity scores already exist in database, skipping save');
            scoresSaved = true;
            break;
          }
        } catch (err) {
          console.warn(`Recovery attempt ${attempt} failed:`, err);
          if (attempt === 3) {
            console.warn('All recovery attempts failed, but continuing');
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between attempts
        }
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

      // ARREGLO: Crear agentes en BD con retry y mejor manejo de errores
      let agentsCreated = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          agentsCreated = await createUserAgentsFromRecommendations(user.id, recommendedAgents);
          if (agentsCreated) {
            console.log('User agents created successfully during recovery');
            break;
          }
        } catch (err) {
          console.warn(`Agent creation attempt ${attempt} failed:`, err);
          if (attempt === 3) {
            // Crear al menos el agente cultural por defecto
            try {
              const defaultAgents = { cultural: true };
              agentsCreated = await createUserAgentsFromRecommendations(user.id, defaultAgents);
            } catch (fallbackErr) {
              console.error('Even fallback agent creation failed:', fallbackErr);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between attempts
        }
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
      // ARREGLO: Añadir delay antes de verificar recovery para evitar calls inmediatos
      const timer = setTimeout(() => {
        checkNeedsRecovery();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, checkNeedsRecovery, status.recovered]);

  return {
    ...status,
    performRecovery,
    checkNeedsRecovery
  };
};
