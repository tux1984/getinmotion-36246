
import React from 'react';
import { Agent, CategoryScore } from '@/types/dashboard';
import { ModernWelcomeSection } from './ModernWelcomeSection';
import { ModernMaturityOverview } from './ModernMaturityOverview';
import { ModernAgentsGrid } from './ModernAgentsGrid';
import { useLanguage } from '@/context/LanguageContext';

interface ModernDashboardMainProps {
  onSelectAgent: (agent: Agent) => void;
  onMaturityCalculatorClick: () => void;
  onOpenAgentManager?: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: Agent[];
  language: 'en' | 'es';
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}

export const ModernDashboardMain: React.FC<ModernDashboardMainProps> = ({
  onSelectAgent,
  onMaturityCalculatorClick,
  onOpenAgentManager,
  agents,
  maturityScores,
  recommendedAgents,
  language,
  onAgentToggle
}) => {
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
        recommendedAgents={{
          primary: recommendedAgents.map(agent => agent.id),
          secondary: []
        }}
        maturityScores={maturityScores}
        onSelectAgent={(agentId: string) => {
          const agent = agents.find(a => a.id === agentId);
          if (agent) onSelectAgent(agent);
        }}
        language={language}
      />
    </div>
  );
};
