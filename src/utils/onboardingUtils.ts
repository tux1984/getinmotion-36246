
import { supabase } from '@/integrations/supabase/client';
import { RecommendedAgents } from '@/types/dashboard';

export const createUserAgentsFromRecommendations = async (
  userId: string, 
  recommendations: RecommendedAgents
): Promise<boolean> => {
  try {
    console.log('Creating user agents from recommendations:', recommendations);
    
    const agentsToCreate = [];
    
    // Mapear recomendaciones usando el formato correcto del tipo RecommendedAgents
    // Verificar el formato primary/secondary primero
    if (recommendations.primary && Array.isArray(recommendations.primary)) {
      recommendations.primary.forEach(agentId => {
        agentsToCreate.push({ user_id: userId, agent_id: agentId, is_enabled: true });
      });
    }
    
    if (recommendations.secondary && Array.isArray(recommendations.secondary)) {
      recommendations.secondary.forEach(agentId => {
        agentsToCreate.push({ user_id: userId, agent_id: agentId, is_enabled: true });
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

    console.log('Successfully created user agents');
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
