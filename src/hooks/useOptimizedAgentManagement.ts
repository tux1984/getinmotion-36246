
import { useMemo } from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useOptimizedUserData } from './useOptimizedUserData';
import { useOptimizedMaturityScores } from './useOptimizedMaturityScores';
import { useAgentRecommendations } from './useAgentRecommendations';

export const useOptimizedAgentManagement = () => {
  const {
    profile,
    projects,
    agents: userAgents,
    loading: userDataLoading,
    error: userDataError,
    hasOnboarding
  } = useOptimizedUserData();

  const {
    currentScores: maturityScores,
    loading: scoresLoading,
    error: scoresError
  } = useOptimizedMaturityScores();

  const recommendedAgents = useAgentRecommendations({
    maturityScores,
    userProfile: profile
  });

  // DEBUG: Log del estado actual
  console.log('useOptimizedAgentManagement: Current state:', {
    hasOnboarding,
    maturityScores,
    userAgentsCount: userAgents.length,
    enabledUserAgents: userAgents.filter(ua => ua.is_enabled).length,
    userDataLoading,
    scoresLoading,
    profile: !!profile
  });

  // Memoize the agents transformation to avoid recalculation
  const agents: Agent[] = useMemo(() => {
    const transformedAgents = culturalAgentsDatabase.map(agentInfo => {
      const userAgent = userAgents.find(ua => ua.agent_id === agentInfo.id);
      
      // ARREGLO CRÍTICO: Asegurar que status sea compatible con AgentStatus type
      const status: 'active' | 'inactive' = userAgent?.is_enabled ? 'active' : 'inactive';
      
      return {
        id: agentInfo.id,
        name: agentInfo.name,
        status,
        category: agentInfo.category,
        activeTasks: userAgent?.usage_count || 0,
        lastUsed: userAgent?.last_used_at ? new Date(userAgent.last_used_at).toLocaleDateString() : undefined,
        color: agentInfo.color,
        icon: agentInfo.icon
      };
    });

    console.log('useOptimizedAgentManagement: Transformed agents:', {
      totalAgents: transformedAgents.length,
      activeAgents: transformedAgents.filter(a => a.status === 'active').length,
      agentStatuses: transformedAgents.map(a => ({ id: a.id, status: a.status }))
    });

    return transformedAgents;
  }, [userAgents]);

  const isLoading = userDataLoading || scoresLoading;
  const error = userDataError || scoresError;

  return {
    agents,
    profile,
    projects,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  };
};
