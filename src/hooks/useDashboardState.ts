
import { useState } from 'react';
import { Agent } from '@/types/agentTypes';

type DashboardSection = 'main' | 'agent-details' | 'agent-manager' | 'agent-chat';

export const useDashboardState = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('main');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSelectAgent = (agent: Agent) => {
    console.log('useDashboardState: Selecting agent:', agent.id);
    setSelectedAgent(agent);
    setActiveSection('agent-chat'); // Changed to go directly to chat
  };

  const handleBackFromAgentDetails = () => {
    console.log('useDashboardState: Back from agent details');
    setActiveSection('main');
    setSelectedAgent(null);
  };

  const handleOpenAgentManager = () => {
    console.log('useDashboardState: Opening agent manager');
    setActiveSection('agent-manager');
  };

  const handleBackFromAgentManager = () => {
    console.log('useDashboardState: Back from agent manager');
    setActiveSection('main');
  };

  return {
    activeSection,
    selectedAgent,
    handleSelectAgent,
    handleBackFromAgentDetails,
    handleOpenAgentManager,
    handleBackFromAgentManager
  };
};
