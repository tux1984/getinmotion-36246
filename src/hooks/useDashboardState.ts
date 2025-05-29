
import { useState, useCallback } from 'react';

type ActiveSection = 'dashboard' | 'agent-details' | 'agent-manager';

export const useDashboardState = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

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

  return {
    activeSection,
    selectedAgent,
    handleSelectAgent,
    handleBackFromAgentDetails,
    handleOpenAgentManager,
    handleBackFromAgentManager
  };
};
