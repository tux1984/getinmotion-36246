
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
    <div className="space-y-8">
      {/* Two-column layout for Welcome and Maturity sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModernWelcomeSection 
          language={language}
        />
        
        {maturityScores && (
          <ModernMaturityOverview 
            currentScores={maturityScores}
            language={language}
            onRetakeAssessment={onMaturityCalculatorClick}
          />
        )}
      </div>
      
      <ModernAgentsGrid 
        agents={agents}
        recommendedAgents={recommendedAgents}
        maturityScores={maturityScores}
        onSelectAgent={onSelectAgent}
        language={language}
      />
    </div>
  );
};
