
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { BasicDashboardFallback } from './BasicDashboardFallback';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';

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
  // Get additional data for fallback
  const { tasks } = useAgentTasks();
  const { coordinatorError } = useMasterCoordinator();
  const { currentScores } = useOptimizedMaturityScores();

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const activeTasksCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  
  // Show basic fallback if coordinator has errors but we have some data
  if (coordinatorError && (maturityScores || tasks.length > 0)) {
    return (
      <BasicDashboardFallback
        onMaturityCalculatorClick={onMaturityCalculatorClick}
        onAgentManagerClick={onAgentManagerClick}
        tasks={tasks}
        currentScores={currentScores}
        completedTasksCount={completedTasksCount}
        activeTasksCount={activeTasksCount}
      />
    );
  }
  
  return (
    <MasterCoordinatorDashboard language="es" />
  );
};
