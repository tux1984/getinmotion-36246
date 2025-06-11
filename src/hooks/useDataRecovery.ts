
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { createUserAgentsFromRecommendations, markOnboardingComplete } from '@/utils/onboardingUtils';

interface RecoveryStatus {
  needsRecovery: boolean;
  recovering: boolean;
  recovered: boolean;
  error: string | null;
}

export const useDataRecovery = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<RecoveryStatus>({
    needsRecovery: false,
    recovering: false,
    recovered: false,
    error: null
  });

  // NUEVA FUNCIÓN: Auto-reparar basado en maturity scores existentes
  const autoRepairFromMaturityScores = useCallback(async (scores: CategoryScore): Promise<boolean> => {
    try {
      console.log('Auto-repairing user data based on maturity scores:', scores);
      
      // Generar agentes recomendados inteligentemente basado en los scores
      const recommendedAgents: RecommendedAgents = {
        primary: [],
        secondary: []
      };

      // Si monetización es baja (35), agregar agentes financieros
      if (scores.monetization < 50) {
        recommendedAgents.primary?.push('cost-calculator');
        recommendedAgents.secondary?.push('marketing-advisor');
      }

      // Si idea validation es media-baja (55), agregar consultores
      if (scores.ideaValidation < 70) {
        recommendedAgents.primary?.push('cultural-consultant');
        recommendedAgents.secondary?.push('maturity-evaluator');
      }

      // Si user experience necesita mejora (60)
      if (scores.userExperience < 70) {
        recommendedAgents.secondary?.push('project-manager');
      }

      // Siempre incluir al menos un agente básico
      if (!recommendedAgents.primary?.length) {
        recommendedAgents.primary = ['cultural-consultant'];
      }

      // Crear agentes en la base de datos
      const success = await createUserAgentsFromRecommendations(user!.id, recommendedAgents);
      
      if (success) {
        // Marcar onboarding como completo
        markOnboardingComplete(scores, recommendedAgents);
        console.log('Auto-repair completed successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error in auto-repair:', err);
      return false;
    }
  }, [user]);

  const checkAndRepair = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Starting comprehensive data check and repair...');
      
      // Verificar maturity scores
      const { data: scores } = await supabase.rpc('get_latest_maturity_scores', {
        user_uuid: user.id
      });

      // Verificar agentes habilitados
      const { data: userAgents } = await supabase
        .from('user_agents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_enabled', true);

      const hasScores = scores && scores.length > 0;
      const hasUsefulAgents = userAgents && userAgents.length > 1; // Más de 1 agente

      console.log('Data check results:', {
        hasScores,
        hasUsefulAgents,
        scoresCount: scores?.length || 0,
        agentsCount: userAgents?.length || 0
      });

      // Si tiene scores pero no agentes útiles, auto-reparar
      if (hasScores && !hasUsefulAgents) {
        console.log('User has scores but insufficient agents, auto-repairing...');
        setStatus(prev => ({ ...prev, recovering: true }));
        
        const scoresData = {
          ideaValidation: scores[0].idea_validation,
          userExperience: scores[0].user_experience,
          marketFit: scores[0].market_fit,
          monetization: scores[0].monetization
        };
        
        const repaired = await autoRepairFromMaturityScores(scoresData);
        
        if (repaired) {
          setStatus({
            needsRecovery: false,
            recovering: false,
            recovered: true,
            error: null
          });
          return;
        }
      }

      // Si no tiene nada, necesita recovery completo
      if (!hasScores) {
        setStatus(prev => ({ ...prev, needsRecovery: true }));
      }

    } catch (err) {
      console.error('Error in checkAndRepair:', err);
      setStatus(prev => ({ ...prev, error: 'Error verificando datos del usuario' }));
    }
  }, [user, autoRepairFromMaturityScores]);

  const performEmergencyRecovery = useCallback(async () => {
    if (!user) return false;

    try {
      setStatus(prev => ({ ...prev, recovering: true }));
      
      // Crear datos mínimos funcionales
      const emergencyScores = {
        ideaValidation: 50,
        userExperience: 50,
        marketFit: 50,
        monetization: 30
      };

      const emergencyAgents: RecommendedAgents = {
        primary: ['cultural-consultant', 'cost-calculator'],
        secondary: ['marketing-advisor']
      };

      // Guardar en localStorage
      markOnboardingComplete(emergencyScores, emergencyAgents);
      
      // Crear agentes en BD
      await createUserAgentsFromRecommendations(user.id, emergencyAgents);
      
      setStatus({
        needsRecovery: false,
        recovering: false,
        recovered: true,
        error: null
      });
      
      return true;
    } catch (err) {
      console.error('Emergency recovery failed:', err);
      setStatus(prev => ({ 
        ...prev, 
        recovering: false, 
        error: 'Error en recuperación de emergencia' 
      }));
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (user && !status.recovered) {
      const timer = setTimeout(() => {
        checkAndRepair();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, checkAndRepair, status.recovered]);

  return {
    ...status,
    performEmergencyRecovery,
    checkAndRepair
  };
};
