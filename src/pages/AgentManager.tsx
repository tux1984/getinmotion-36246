
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useUserData } from '@/hooks/useUserData';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { ModernAgentManager } from '@/components/dashboard/ModernAgentManager';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';

const AgentManager = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { enableAgent, disableAgent, refetch } = useUserData();
  
  const {
    agents,
    isLoading,
    error
  } = useOptimizedAgentManagement();

  const handleMaturityCalculatorClick = () => {
    navigate('/dashboard/maturity-calculator');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard/home');
  };

  const handleAgentToggle = async (agentId: string, enabled: boolean) => {
    console.log('AgentManager: Toggling agent:', agentId, enabled);
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

  if (isLoading) {
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleMaturityCalculatorClick}
          onAgentManagerClick={handleBackToDashboard}
        />
        <div className="pt-32">
          <DashboardLoadingState />
        </div>
      </DashboardBackground>
    );
  }

  if (error) {
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleMaturityCalculatorClick}
          onAgentManagerClick={handleBackToDashboard}
        />
        <div className="pt-32">
          <DashboardErrorState error={error} />
        </div>
      </DashboardBackground>
    );
  }

  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleBackToDashboard}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 pt-32">
        <ModernAgentManager 
          currentAgents={agents}
          onAgentToggle={handleAgentToggle}
          language={language}
        />
      </div>
    </DashboardBackground>
  );
};

export default AgentManager;
