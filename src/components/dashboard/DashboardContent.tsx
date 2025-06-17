
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { ModernDashboardMain } from './ModernDashboardMain';
import { DashboardAgentDetails } from './DashboardAgentDetails';
import { DashboardAgentManager } from './DashboardAgentManager';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

type ActiveSection = 'dashboard' | 'agent-details' | 'agent-manager';

interface DashboardContentProps {
  activeSection: ActiveSection;
  selectedAgent: string | null;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
  profileData: any | null;
  language: 'en' | 'es';
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onOpenAgentManager: () => void;
  onBackFromAgentDetails: () => void;
  onBackFromAgentManager: () => void;
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  activeSection,
  selectedAgent,
  agents,
  maturityScores,
  recommendedAgents,
  profileData,
  language,
  onSelectAgent,
  onMaturityCalculatorClick,
  onOpenAgentManager,
  onBackFromAgentDetails,
  onBackFromAgentManager,
  onAgentToggle
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <div className={`flex-1 container mx-auto px-4 sm:px-6 lg:px-8 ${
        activeSection === 'dashboard' ? 'pt-24 pb-6' : 'pt-4 pb-6'
      } ${isMobile ? 'pb-20' : ''}`}>
        {activeSection === 'dashboard' && (
          <ModernDashboardMain 
            onSelectAgent={onSelectAgent} 
            onMaturityCalculatorClick={onMaturityCalculatorClick} 
            onAgentManagerClick={onOpenAgentManager} 
            agents={agents} 
            maturityScores={maturityScores} 
            recommendedAgents={recommendedAgents}
            profileData={profileData}
          />
        )}

        {activeSection === 'agent-details' && selectedAgent && (
          <DashboardAgentDetails 
            selectedAgent={selectedAgent} 
            language={language} 
            onBack={onBackFromAgentDetails} 
          />
        )}

        {activeSection === 'agent-manager' && (
          <DashboardAgentManager 
            agents={agents} 
            language={language} 
            onBack={onBackFromAgentManager} 
            onAgentToggle={onAgentToggle} 
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && activeSection === 'dashboard' && (
        <MobileBottomNav language={language} />
      )}
    </div>
  );
};
