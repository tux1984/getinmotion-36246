
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useUserData } from '@/hooks/useUserData';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { ModernAgentManager } from '@/components/dashboard/ModernAgentManager';

const AgentManager = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { enableAgent, disableAgent, refetch } = useUserData();
  
  const {
    agents,
    isLoading,
    error
  } = useOptimizedAgentManagement();

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50/50 backdrop-blur-sm border border-purple-200/50"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'en' ? 'Back to Dashboard' : 'Volver al Dashboard'}
          </Button>
        </div>
        
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
