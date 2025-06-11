
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { ModernDashboardMain } from './ModernDashboardMain';

interface NewDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
}

export const NewDashboardMain: React.FC<NewDashboardMainProps> = ({ 
  onSelectAgent,
  onMaturityCalculatorClick,
  onAgentManagerClick,
  agents,
  maturityScores,
  recommendedAgents
}) => {
  return (
    <ModernDashboardMain
      onSelectAgent={onSelectAgent}
      onMaturityCalculatorClick={onMaturityCalculatorClick}
      onAgentManagerClick={onAgentManagerClick}
      agents={agents}
      maturityScores={maturityScores}
      recommendedAgents={recommendedAgents}
    />
  );
};
