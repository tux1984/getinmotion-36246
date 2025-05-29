
import React from 'react';
import { ModernDashboardMain } from './ModernDashboardMain';
import { DashboardAgentDetails } from './DashboardAgentDetails';
import { DashboardAgentManager } from './DashboardAgentManager';
import { ModernCopilotChat } from './ModernCopilotChat';
import { Agent } from '@/types/agentTypes';
import { CategoryScore } from '@/components/maturity/types';

interface DashboardContentProps {
  activeSection: 'main' | 'agent-details' | 'agent-manager' | 'agent-chat';
  selectedAgent: Agent | null;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: Agent[];
  language: 'en' | 'es';
  onSelectAgent: (agent: Agent) => void;
  onMaturityCalculatorClick: () => void;
  onOpenAgentManager: () => void;
  onBackFromAgentDetails: () => void;
  onBackFromAgentManager: () => void;
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}

export const DashboardContent = ({
  activeSection,
  selectedAgent,
  agents,
  maturityScores,
  recommendedAgents,
  language,
  onSelectAgent,
  onMaturityCalculatorClick,
  onOpenAgentManager,
  onBackFromAgentDetails,
  onBackFromAgentManager,
  onAgentToggle
}: DashboardContentProps) => {
  console.log('DashboardContent: Rendering section:', activeSection);

  switch (activeSection) {
    case 'main':
      return (
        <ModernDashboardMain
          agents={agents}
          maturityScores={maturityScores}
          recommendedAgents={recommendedAgents}
          language={language}
          onSelectAgent={onSelectAgent}
          onMaturityCalculatorClick={onMaturityCalculatorClick}
          onOpenAgentManager={onOpenAgentManager}
          onAgentToggle={onAgentToggle}
        />
      );

    case 'agent-details':
      if (!selectedAgent) {
        console.warn('DashboardContent: No selected agent for agent-details view');
        return (
          <ModernDashboardMain
            agents={agents}
            maturityScores={maturityScores}
            recommendedAgents={recommendedAgents}
            language={language}
            onSelectAgent={onSelectAgent}
            onMaturityCalculatorClick={onMaturityCalculatorClick}
            onOpenAgentManager={onOpenAgentManager}
            onAgentToggle={onAgentToggle}
          />
        );
      }
      return (
        <DashboardAgentDetails
          selectedAgent={selectedAgent.id}
          language={language}
          onBack={onBackFromAgentDetails}
        />
      );

    case 'agent-manager':
      return (
        <DashboardAgentManager
          agents={agents}
          language={language}
          onBack={onBackFromAgentManager}
          onAgentToggle={onAgentToggle}
        />
      );

    case 'agent-chat':
      if (!selectedAgent) {
        console.warn('DashboardContent: No selected agent for agent-chat view');
        return (
          <ModernDashboardMain
            agents={agents}
            maturityScores={maturityScores}
            recommendedAgents={recommendedAgents}
            language={language}
            onSelectAgent={onSelectAgent}
            onMaturityCalculatorClick={onMaturityCalculatorClick}
            onOpenAgentManager={onOpenAgentManager}
            onAgentToggle={onAgentToggle}
          />
        );
      }
      return (
        <ModernCopilotChat
          agentId={selectedAgent.id}
          onBack={onBackFromAgentDetails}
        />
      );

    default:
      console.warn('DashboardContent: Unknown section:', activeSection);
      return (
        <ModernDashboardMain
          agents={agents}
          maturityScores={maturityScores}
          recommendedAgents={recommendedAgents}
          language={language}
          onSelectAgent={onSelectAgent}
          onMaturityCalculatorClick={onMaturityCalculatorClick}
          onOpenAgentManager={onOpenAgentManager}
          onAgentToggle={onAgentToggle}
        />
      );
  }
};
