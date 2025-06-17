
import { useState, useCallback } from 'react';
import { useUserData } from './useUserData';
import { useMaturityScores } from './useMaturityScores';
import { useAgentRecommendations } from './useAgentRecommendations';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';

type ActiveSection = 'dashboard' | 'agent-details' | 'agent-manager';

export const useDashboardState = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Use real data hooks
  const { 
    profile, 
    agents: userAgents, 
    enableAgent,
    disableAgent
  } = useUserData();
  
  const { currentScores } = useMaturityScores();
  
  const recommendedAgents = useAgentRecommendations({ 
    maturityScores: currentScores,
    userProfile: profile 
  });

  // Convert user agents to Agent format
  const agents: Agent[] = culturalAgentsDatabase.map(agentInfo => {
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

  const handleSelectAgent = useCallback((agentId: string) => {
    console.log('Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  }, []);

  const handleBackFromAgentDetails = useCallback(() => {
    console.log('Returning from agent details');
    setSelectedAgent(null);
    setActiveSection('dashboard');
  }, []);

  const handleOpenAgentManager = useCallback(() => {
    console.log('Opening agent manager');
    setActiveSection('agent-manager');
  }, []);

  const handleBackFromAgentManager = useCallback(() => {
    console.log('Returning from agent manager');
    setActiveSection('dashboard');
  }, []);

  const handleMaturityCalculatorClick = useCallback(() => {
    // This will be handled by the component using this hook
  }, []);

  const handleAgentToggle = useCallback(async (agentId: string, enabled: boolean) => {
    console.log('Toggling agent:', agentId, enabled);
    try {
      if (enabled) {
        await enableAgent(agentId);
      } else {
        await disableAgent(agentId);
      }
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  }, [enableAgent, disableAgent]);

  return {
    activeSection,
    selectedAgent,
    agents,
    maturityScores: currentScores,
    recommendedAgents,
    profileData: profile,
    handleSelectAgent,
    handleBackFromAgentDetails,
    handleOpenAgentManager,
    handleBackFromAgentManager,
    handleMaturityCalculatorClick,
    handleAgentToggle
  };
};
