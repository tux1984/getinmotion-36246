import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { ModernDashboardMain } from './ModernDashboardMain';
import { DashboardAgentDetails } from './DashboardAgentDetails';
import { DashboardAgentManager } from './DashboardAgentManager';
type ActiveSection = 'dashboard' | 'agent-details' | 'agent-manager';
interface DashboardContentProps {
  activeSection: ActiveSection;
  selectedAgent: string | null;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
  language: 'en' | 'es';
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onOpenAgentManager: () => void;
  onBackFromAgentDetails: () => void;
  onBackFromAgentManager: () => void;
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}
export const DashboardContent: React.FC<DashboardContentProps> = ({
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
}) => {
  return <div className="container py-[24px] px-[24px] mx-[24px] my-[24px] bg-white/0 rounded">
      {activeSection === 'dashboard' && <ModernDashboardMain onSelectAgent={onSelectAgent} onMaturityCalculatorClick={onMaturityCalculatorClick} onAgentManagerClick={onOpenAgentManager} agents={agents} maturityScores={maturityScores} recommendedAgents={recommendedAgents} />}

      {activeSection === 'agent-details' && selectedAgent && <DashboardAgentDetails selectedAgent={selectedAgent} language={language} onBack={onBackFromAgentDetails} />}

      {activeSection === 'agent-manager' && <DashboardAgentManager agents={agents} language={language} onBack={onBackFromAgentManager} onAgentToggle={onAgentToggle} />}
    </div>;
};