
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { ModernWelcomeSection } from './ModernWelcomeSection';
import { ModernMaturityOverview } from './ModernMaturityOverview';
import { ModernAgentsGrid } from './ModernAgentsGrid';
import { useLanguage } from '@/context/LanguageContext';

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
  onAgentManagerClick,
  agents,
  maturityScores,
  recommendedAgents
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-12">
      <ModernWelcomeSection 
        language={language}
        onMaturityCalculatorClick={onMaturityCalculatorClick}
        onAgentManagerClick={onAgentManagerClick}
      />
      
      {maturityScores && (
        <ModernMaturityOverview 
          scores={maturityScores}
          language={language}
          onMaturityCalculatorClick={onMaturityCalculatorClick}
        />
      )}
      
      <ModernAgentsGrid 
        agents={agents}
        recommendedAgents={recommendedAgents}
        onSelectAgent={onSelectAgent}
        language={language}
      />
    </div>
  );
};
