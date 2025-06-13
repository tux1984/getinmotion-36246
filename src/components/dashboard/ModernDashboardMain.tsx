
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { PremiumDashboardMain } from './PremiumDashboardMain';
import { MobileTaskBasedDashboard } from './mobile/MobileTaskBasedDashboard';

interface ModernDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
}

export const ModernDashboardMain: React.FC<ModernDashboardMainProps> = (props) => {
  const isMobile = useIsMobile();

  // Use the appropriate dashboard based on device
  if (isMobile) {
    return (
      <MobileTaskBasedDashboard
        agents={props.agents}
        maturityScores={props.maturityScores}
        onSelectAgent={props.onSelectAgent}
        onMaturityCalculatorClick={props.onMaturityCalculatorClick}
      />
    );
  }

  return <PremiumDashboardMain {...props} />;
};
