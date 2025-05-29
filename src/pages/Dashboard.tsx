
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useLanguage } from '@/context/LanguageContext';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import { useUserData } from '@/hooks/useUserData';
import { useDashboardState } from '@/hooks/useDashboardState';
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
    showOnboarding,
    profileType,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    handleOnboardingComplete,
    checkLocationStateForOnboarding
  } = useAgentManagement();

  const {
    activeSection,
    selectedAgent,
    handleSelectAgent,
    handleBackFromAgentDetails,
    handleOpenAgentManager,
    handleBackFromAgentManager
  } = useDashboardState();

  const { enableAgent, disableAgent, refetch } = useUserData();

  console.log('Dashboard: State values:', {
    isLoading,
    error,
    showOnboarding,
    agentsCount: agents.length,
    activeSection,
    hasMaturityScores: !!maturityScores
  });

  // Check for onboarding flag in location state
  useEffect(() => {
    console.log('Dashboard: Checking location state for onboarding');
    const stateChanged = checkLocationStateForOnboarding(location.state);
    
    if (stateChanged) {
      // Clear state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location, checkLocationStateForOnboarding]);
  
  const handleNavigateToMaturityCalculator = () => {
    console.log('Dashboard: Navigating to maturity calculator');
    navigate('/maturity-calculator', { state: { profileType } });
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

  // Show loading state
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

  // Show onboarding if necessary
  if (showOnboarding) {
    console.log('Dashboard: Showing onboarding');
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <OnboardingWizard 
            profileType={profileType} 
            onComplete={handleOnboardingComplete} 
          />
        </div>
      </DashboardBackground>
    );
  }

  // Convert recommendedAgents to Agent[] format
  const recommendedAgentsArray = Array.isArray(recommendedAgents) ? recommendedAgents : [];

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
          recommendedAgents={recommendedAgentsArray}
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
