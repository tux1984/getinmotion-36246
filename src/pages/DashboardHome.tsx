
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { ModernDashboardMain } from '@/components/dashboard/ModernDashboardMain';

const DashboardHome = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  console.log('DashboardHome: Component rendering');
  
  const {
    agents,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  console.log('DashboardHome: State values:', {
    isLoading,
    error,
    agentsCount: agents.length,
    hasMaturityScores: !!maturityScores,
    hasOnboarding
  });

  // Redirect to onboarding if needed
  useEffect(() => {
    if (!isLoading && !hasOnboarding && !maturityScores) {
      console.log('DashboardHome: User needs onboarding, redirecting to maturity calculator');
      navigate('/maturity-calculator', { replace: true });
    }
  }, [isLoading, hasOnboarding, maturityScores, navigate]);
  
  const handleNavigateToMaturityCalculator = () => {
    console.log('DashboardHome: Navigating to maturity calculator');
    navigate('/maturity-calculator');
  };

  const handleSelectAgent = (agentId: string) => {
    console.log('DashboardHome: Navigating to agent details:', agentId);
    navigate(`/dashboard/agent/${agentId}`);
  };

  const handleOpenAgentManager = () => {
    console.log('DashboardHome: Navigating to agent manager');
    navigate('/dashboard/agents');
  };

  // Show loading state
  if (isLoading) {
    console.log('DashboardHome: Showing loading state');
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <DashboardLoadingState />
        </div>
      </DashboardBackground>
    );
  }

  // Show error state
  if (error) {
    console.log('DashboardHome: Showing error state:', error);
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <DashboardErrorState error={error} />
        </div>
      </DashboardBackground>
    );
  }

  console.log('DashboardHome: Showing main dashboard');
  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <div className="pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ModernDashboardMain 
            onSelectAgent={handleSelectAgent}
            onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
            onAgentManagerClick={handleOpenAgentManager}
            agents={agents}
            maturityScores={maturityScores}
            recommendedAgents={recommendedAgents}
          />
        </div>
      </div>
    </DashboardBackground>
  );
};

export default DashboardHome;
