
import { supabase } from '@/integrations/supabase/client';
import { RecommendedAgents } from '@/types/dashboard';
import { getAllAgentIds } from '@/data/agentsDatabase';

export const createUserAgentsFromRecommendations = async (
  userId: string, 
  recommendations: RecommendedAgents
): Promise<boolean> => {
  try {
    console.log('Creating user agents from recommendations:', recommendations);
    
    const agentsToCreate = [];
    const validAgentIds = getAllAgentIds();
    console.log('Valid agent IDs from database:', validAgentIds);
    
    // Mapear recomendaciones usando el formato correcto del tipo RecommendedAgents
    if (recommendations.primary && Array.isArray(recommendations.primary)) {
      recommendations.primary.forEach(agentId => {
        if (validAgentIds.includes(agentId)) {
          agentsToCreate.push({ user_id: userId, agent_id: agentId, is_enabled: true });
        } else {
          console.warn(`Agent ID ${agentId} not found in valid agents list`);
        }
      });
    }
    
    if (recommendations.secondary && Array.isArray(recommendations.secondary)) {
      recommendations.secondary.forEach(agentId => {
        if (validAgentIds.includes(agentId)) {
          agentsToCreate.push({ user_id: userId, agent_id: agentId, is_enabled: true });
        } else {
          console.warn(`Agent ID ${agentId} not found in valid agents list`);
        }
      });
    }
    
    // También verificar el formato legacy para compatibilidad
    if (recommendations.cultural) {
      agentsToCreate.push({ user_id: userId, agent_id: 'cultural-consultant', is_enabled: true });
    }
    if (recommendations.admin) {
      agentsToCreate.push({ user_id: userId, agent_id: 'project-manager', is_enabled: true });
    }
    if (recommendations.accounting) {
      agentsToCreate.push({ user_id: userId, agent_id: 'cost-calculator', is_enabled: true });
    }
    if (recommendations.legal) {
      agentsToCreate.push({ user_id: userId, agent_id: 'collaboration-agreement', is_enabled: true });
    }
    if (recommendations.operations) {
      agentsToCreate.push({ user_id: userId, agent_id: 'maturity-evaluator', is_enabled: true });
    }

    // Si no hay agentes recomendados, crear al menos el consultor cultural
    if (agentsToCreate.length === 0) {
      agentsToCreate.push({ user_id: userId, agent_id: 'cultural-consultant', is_enabled: true });
    }

    console.log('Inserting agents:', agentsToCreate);

    // ARREGLO CRÍTICO: Usar UPSERT con ON CONFLICT para evitar errores de duplicados
    const { error } = await supabase
      .from('user_agents')
      .upsert(agentsToCreate, {
        onConflict: 'user_id,agent_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error creating user agents:', error);
      return false;
    }

    console.log('Successfully created/updated user agents:', agentsToCreate.length);
    return true;
  } catch (err) {
    console.error('Error in createUserAgentsFromRecommendations:', err);
    return false;
  }
};

export const markOnboardingComplete = (
  maturityScores: any, 
  recommendedAgents: RecommendedAgents
): void => {
  try {
    localStorage.setItem('maturityScores', JSON.stringify(maturityScores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    console.log('Onboarding marked as complete in localStorage');
  } catch (err) {
    console.error('Error marking onboarding complete:', err);
  }
};

// NUEVA FUNCIÓN: Resetear completamente el onboarding
export const resetOnboarding = (): void => {
  try {
    localStorage.removeItem('maturityScores');
    localStorage.removeItem('recommendedAgents');
    localStorage.removeItem('onboardingCompleted');
    console.log('Onboarding data reset from localStorage');
  } catch (err) {
    console.error('Error resetting onboarding:', err);
  }
};

// NUEVA FUNCIÓN: Crear datos de fallback
export const createFallbackData = async (userId: string): Promise<boolean> => {
  try {
    console.log('Creating fallback data for user:', userId);
    
    const fallbackScores = {
      ideaValidation: 30,
      userExperience: 25,
      marketFit: 20,
      monetization: 15
    };
    
    const fallbackAgents = {
      cultural: true,
      admin: false,
      accounting: false,
      legal: false,
      operations: false
    };
    
    // Guardar en localStorage
    markOnboardingComplete(fallbackScores, fallbackAgents);
    
    // Crear agentes en BD si hay usuario
    if (userId) {
      await createUserAgentsFromRecommendations(userId, fallbackAgents);
    }
    
    return true;
  } catch (err) {
    console.error('Error creating fallback data:', err);
    return false;
  }
};
