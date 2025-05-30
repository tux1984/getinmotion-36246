
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useUserData } from '@/hooks/useUserData';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { ModernAgentManager } from '@/components/dashboard/ModernAgentManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

  const translations = {
    en: { backToDashboard: "Back to Dashboard" },
    es: { backToDashboard: "Volver al Dashboard" }
  };

  if (isLoading) {
    return (
      <DashboardBackground>
        <div className="pt-6">
          <DashboardLoadingState />
        </div>
      </DashboardBackground>
    );
  }

  if (error) {
    return (
      <DashboardBackground>
        <div className="pt-6">
          <DashboardErrorState error={error} />
        </div>
      </DashboardBackground>
    );
  }

  return (
    <DashboardBackground>
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToDashboard}
          className="group flex items-center gap-2 bg-white/95 backdrop-blur-xl border-white/20 text-gray-700 hover:bg-white hover:border-gray-300 hover:text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-md rounded-xl font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          {translations[language].backToDashboard}
        </Button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
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
