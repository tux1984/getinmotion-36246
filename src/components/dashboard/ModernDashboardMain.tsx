
import React, { useState, useEffect } from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { OptimizedTaskBasedDashboard } from './OptimizedTaskBasedDashboard';
import { useLanguage } from '@/context/LanguageContext';

interface ModernDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
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
  const [enabledAgents, setEnabledAgents] = useState<string[]>([]);

  useEffect(() => {
    // Extract enabled agents from the agents array based on status
    const enabled = agents.filter(agent => agent.status === 'active').map(agent => agent.id);
    console.log('Enabled agents for dashboard:', enabled);
    setEnabledAgents(enabled);
  }, [agents]);

  return (
    <OptimizedTaskBasedDashboard
      maturityScores={maturityScores}
      recommendedAgents={recommendedAgents}
      enabledAgents={enabledAgents}
      language={language}
      onSelectAgent={onSelectAgent}
      onMaturityCalculatorClick={onMaturityCalculatorClick}
    />
  );
};
