
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useUserData } from '@/hooks/useUserData';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('Dashboard: Component rendering');
  
  const {
    agents,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  const {
    activeSection,
    selectedAgent,
    handleSelectAgent,
    handleBackFromAgentDetails,
    handleOpenAgentManager,
    handleBackFromAgentManager
  } = useDashboardState();

  const { enableAgent, disableAgent, refetch } = useUserData();

  console.log('Dashboard: Optimized state values:', {
    isLoading,
    error,
    agentsCount: agents.length,
    activeSection,
    hasMaturityScores: !!maturityScores,
    hasOnboarding
  });

  // Optimized onboarding check - only redirect if no onboarding and not loading
  useEffect(() => {
    if (!isLoading && !hasOnboarding && !maturityScores) {
      console.log('Dashboard: User needs onboarding, redirecting to maturity calculator');
      navigate('/maturity-calculator', { replace: true });
    }
  }, [isLoading, hasOnboarding, maturityScores, navigate]);
  
  const handleNavigateToMaturityCalculator = () => {
    console.log('Dashboard: Navigating to maturity calculator');
    navigate('/maturity-calculator');
  };

  const handleAgentToggle = async (agentId: string, enabled: boolean) => {
    console.log('Dashboard: Toggling agent:', agentId, enabled);
    try {
      if (enabled) {
        await enableAgent(agentId);
        console.log('Agent enabled successfully:', agentId);
      } else {
        await disableAgent(agentId);
        console.log('Agent disabled successfully:', agentId);
      }
      // Refresh data to ensure UI is updated
      await refetch();
      console.log('Data refreshed after agent toggle');
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  };

  // Show loading state only when actually loading
  if (isLoading) {
    console.log('Dashboard: Showing loading state');
    return (
      <div className="pt-24">
        <DashboardLoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    console.log('Dashboard: Showing error state:', error);
    return (
      <div className="pt-24">
        <DashboardErrorState error={error} />
      </div>
    );
  }

  console.log('Dashboard: Showing main dashboard, active section:', activeSection);
  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <div className="pt-24">
        <DashboardContent
          activeSection={activeSection}
          selectedAgent={selectedAgent}
          agents={agents}
          maturityScores={maturityScores}
          recommendedAgents={recommendedAgents}
          language={language}
          onSelectAgent={handleSelectAgent}
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onOpenAgentManager={handleOpenAgentManager}
          onBackFromAgentDetails={handleBackFromAgentDetails}
          onBackFromAgentManager={handleBackFromAgentManager}
          onAgentToggle={handleAgentToggle}
        />
      </div>
    </DashboardBackground>
  );
};

export default Dashboard;
