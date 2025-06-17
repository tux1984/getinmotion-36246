
import React, { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserActivity } from '@/hooks/useUserActivity';

// Components
import { PremiumDashboardHero } from './premium/PremiumDashboardHero';
import { ActiveAgentsWidget } from './premium/ActiveAgentsWidget';
import { CreativeInsightsWidget } from './premium/CreativeInsightsWidget';
import { RecentActivityWidget } from './premium/RecentActivityWidget';
import { TaskManagementInterface } from './TaskManagementInterface';

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
  agents = [], // Default to empty array to prevent undefined errors
  maturityScores,
  profileData,
  recommendedAgents
}) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const enabledAgents = useMemo(() => 
    (agents || []).filter(a => a.status === 'active').map(a => a.id), 
    [agents]
  );
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

  const activeAgents = (agents || []).filter(agent => agent.status === 'active');
  const overallProgress = maturityScores 
    ? Math.round((maturityScores.ideaValidation + maturityScores.userExperience + maturityScores.marketFit + maturityScores.monetization) / 4)
    : 0;

  return (
    <div>
      <PremiumDashboardHero
        language={language}
        welcomeText={t[language].welcome}
        subtitleText={t[language].subtitle}
        activeAgentsCount={activeAgents.length}
        completedTasksCount={0} // Se calculará desde TaskManagementInterface
        overallProgress={overallProgress}
      />

      <div className={`${isMobile ? 'px-4 py-6' : 'px-6 py-8'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            
            {/* Main Content Area */}
            <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
              {/* Task Management Interface - Principal Feature */}
              <TaskManagementInterface
                maturityScores={maturityScores}
                profileData={profileData}
                enabledAgents={enabledAgents}
                language={language}
                onSelectAgent={onSelectAgent}
              />
            </div>

            {/* Sidebar */}
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
