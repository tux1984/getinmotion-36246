
import { useMemo } from 'react';
import { CulturalAgent } from '@/data/agentsDatabase';
import { AgentStats } from '@/types/agentTypes';
import { isAgentRecommended } from '@/utils/agentUtils';

export const useAgentStats = (
  allAgents: CulturalAgent[],
  userAgents: any[]
): AgentStats => {
  return useMemo(() => {
    const totalAgents = allAgents.length;
    const activeAgents = userAgents.filter(ua => ua.is_enabled).length;
    const recommendedAgents = allAgents.filter(agent => 
      isAgentRecommended(agent.id)
    ).length;
    const efficiencyRate = totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0;

    return {
      totalAgents,
      activeAgents,
      recommendedAgents,
      efficiencyRate
    };
  }, [allAgents, userAgents]);
};
