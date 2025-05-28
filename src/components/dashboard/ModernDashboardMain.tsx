
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

  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${backgroundPattern}")` }}
      />
      
      <div className="relative z-10 w-full py-8 space-y-8">
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
    </div>
  );
};
