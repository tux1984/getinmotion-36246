
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

  // Memoize the agents transformation to avoid recalculation
  const agents: Agent[] = useMemo(() => {
    return culturalAgentsDatabase.map(agentInfo => {
      const userAgent = userAgents.find(ua => ua.agent_id === agentInfo.id);
      
      return {
        id: agentInfo.id,
        name: agentInfo.name,
        status: userAgent?.is_enabled ? 'active' : 'inactive',
        category: agentInfo.category,
        activeTasks: userAgent?.usage_count || 0,
        lastUsed: userAgent?.last_used_at ? new Date(userAgent.last_used_at).toLocaleDateString() : undefined,
        color: agentInfo.color,
        icon: agentInfo.icon
      };
    });
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
