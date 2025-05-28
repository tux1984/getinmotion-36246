
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { ModernMaturityOverview } from './ModernMaturityOverview';
import { ModernAgentsGrid } from './ModernAgentsGrid';
import { ModernWelcomeSection } from './ModernWelcomeSection';

interface ModernDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
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
  const { language } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto py-8 space-y-8">
      {/* Welcome Section */}
      <ModernWelcomeSection language={language} />
      
      {/* Maturity Overview */}
      {maturityScores && (
        <ModernMaturityOverview
          currentScores={maturityScores}
          language={language}
          onRetakeAssessment={onMaturityCalculatorClick}
        />
      )}
      
      {/* Agents Grid */}
      <ModernAgentsGrid
        agents={agents}
        recommendedAgents={recommendedAgents}
        onSelectAgent={onSelectAgent}
        language={language}
      />
    </div>
  );
};
