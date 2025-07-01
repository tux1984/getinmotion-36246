
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

  console.log('useOptimizedAgentManagement: State check:', {
    hasOnboarding,
    maturityScores: !!maturityScores,
    userAgentsCount: userAgents.length,
    userDataLoading,
    scoresLoading,
    hasProfile: !!profile
  });

  // ARREGLO CRÍTICO: Memoize agents transformation
  const agents: Agent[] = useMemo(() => {
    if (!culturalAgentsDatabase || !Array.isArray(culturalAgentsDatabase)) {
      console.warn('useOptimizedAgentManagement: culturalAgentsDatabase is not available');
      return [];
    }

    try {
      const transformedAgents = culturalAgentsDatabase.map(agentInfo => {
        const userAgent = userAgents.find(ua => ua.agent_id === agentInfo.id);
        
        return {
          id: agentInfo.id,
          name: agentInfo.name,
          status: (userAgent?.is_enabled ? 'active' : 'inactive') as 'active' | 'inactive',
          category: agentInfo.category,
          activeTasks: userAgent?.usage_count || 0,
          lastUsed: userAgent?.last_used_at ? new Date(userAgent.last_used_at).toLocaleDateString() : undefined,
          color: agentInfo.color,
          icon: agentInfo.icon
        };
      });

      console.log('useOptimizedAgentManagement: Agents transformed successfully:', {
        totalAgents: transformedAgents.length,
        activeAgents: transformedAgents.filter(a => a.status === 'active').length
      });

      return transformedAgents;
    } catch (error) {
      console.error('useOptimizedAgentManagement: Error transforming agents:', error);
      return [];
    }
  }, [userAgents]);

  const isLoading = userDataLoading || scoresLoading;
  const error = userDataError || scoresError;

  console.log('useOptimizedAgentManagement: Final state:', {
    agentsCount: agents.length,
    isLoading,
    error,
    hasOnboarding,
    hasMaturityScores: !!maturityScores
  });

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
