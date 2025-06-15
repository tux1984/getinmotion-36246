import React, { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useOptimizedRecommendedTasks } from '@/hooks/useOptimizedRecommendedTasks';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserActivity } from '@/hooks/useUserActivity';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';

// New components
import { PremiumDashboardHero } from './premium/PremiumDashboardHero';
import { PriorityTasks } from './premium/PriorityTasks';
import { ActiveAgentsWidget } from './premium/ActiveAgentsWidget';
import { CreativeInsightsWidget } from './premium/CreativeInsightsWidget';
import { RecentActivityWidget } from './premium/RecentActivityWidget';

interface PremiumDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  profileData: any | null;
  recommendedAgents: RecommendedAgents;
}

export const PremiumDashboardMain: React.FC<PremiumDashboardMainProps> = ({
  onSelectAgent,
  onMaturityCalculatorClick,
  onAgentManagerClick,
  agents,
  maturityScores,
  profileData,
  recommendedAgents
}) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const allAgentIds = useMemo(() => culturalAgentsDatabase.map(agent => agent.id), []);
  const { tasks, loading: tasksLoading } = useOptimizedRecommendedTasks(maturityScores, profileData, allAgentIds);
  const { recentConversations, loading: activityLoading } = useUserActivity();

  const t = {
    en: {
      welcome: 'Welcome to your Creative Universe',
      subtitle: 'Where art meets innovation and dreams become reality',
    },
    es: {
      welcome: 'Bienvenido a tu Universo Creativo',
      subtitle: 'Donde el arte se encuentra con la innovación y los sueños se hacen realidad',
    }
  };

  const activeAgents = agents.filter(agent => agent.status === 'active');
  const overallProgress = maturityScores 
    ? Math.round((maturityScores.ideaValidation + maturityScores.userExperience + maturityScores.marketFit + maturityScores.monetization) / 4)
    : 0;

  const handleTaskAction = (taskId: string, agentId: string) => {
    console.log('Starting task:', taskId, 'with agent:', agentId);
    onSelectAgent(agentId);
  };

  return (
    <div>
      <PremiumDashboardHero
        language={language}
        welcomeText={t[language].welcome}
        subtitleText={t[language].subtitle}
        activeAgentsCount={activeAgents.length}
        completedTasksCount={tasks.filter(t => t.completed).length}
        overallProgress={overallProgress}
      />

      <div className={`${isMobile ? 'px-4 py-6' : 'px-6 py-8'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            
            <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
              <PriorityTasks
                language={language}
                tasks={tasks}
                tasksLoading={tasksLoading}
                onTaskAction={handleTaskAction}
                onMaturityCalculatorClick={onMaturityCalculatorClick}
              />
            </div>

            <div className="space-y-6">
              <ActiveAgentsWidget
                language={language}
                agents={activeAgents}
                onSelectAgent={onSelectAgent}
                onAgentManagerClick={onAgentManagerClick}
              />

              {maturityScores && (
                <CreativeInsightsWidget
                  language={language}
                  maturityScores={maturityScores}
                />
              )}

              {(activityLoading || recentConversations.length > 0) && (
                <RecentActivityWidget
                  language={language}
                  activityLoading={activityLoading}
                  recentConversations={recentConversations}
                  onSelectAgent={onSelectAgent}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
