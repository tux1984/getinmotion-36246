
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';

interface NewDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
  profileData: any | null;
}

export const NewDashboardMain: React.FC<NewDashboardMainProps> = ({ 
  onSelectAgent,
  onMaturityCalculatorClick,
  onAgentManagerClick,
  agents,
  maturityScores,
  recommendedAgents,
  profileData
}) => {
  
  // ALWAYS return Master Coordinator Dashboard - NO MORE FALLBACKS
  return (
    <MasterCoordinatorDashboard language="es" />
  );
};
