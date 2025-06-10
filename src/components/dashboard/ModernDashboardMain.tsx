
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { TaskBasedDashboard } from './TaskBasedDashboard';

interface ModernDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick?: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
}

export const ModernDashboardMain: React.FC<ModernDashboardMainProps> = ({
  onSelectAgent,
  onMaturityCalculatorClick,
  agents,
  maturityScores,
  recommendedAgents
}) => {
  return (
    <TaskBasedDashboard
      agents={agents}
      maturityScores={maturityScores}
      onSelectAgent={onSelectAgent}
      onMaturityCalculatorClick={onMaturityCalculatorClick}
    />
  );
};
