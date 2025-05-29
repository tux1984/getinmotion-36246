
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore } from '@/types/dashboard';
import { ModernDashboardMain } from './ModernDashboardMain';

interface NewDashboardMainProps {
  onSelectAgent: (agent: Agent) => void;
  onMaturityCalculatorClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: Agent[];
}

export const NewDashboardMain: React.FC<NewDashboardMainProps> = ({ 
  onSelectAgent,
  onMaturityCalculatorClick,
  agents,
  maturityScores,
  recommendedAgents
}) => {
  const { language } = useLanguage();

  return (
    <ModernDashboardMain
      onSelectAgent={onSelectAgent}
      onMaturityCalculatorClick={onMaturityCalculatorClick}
      agents={agents}
      maturityScores={maturityScores}
      recommendedAgents={recommendedAgents}
      language={language}
      onAgentToggle={async () => {}}
    />
  );
};
