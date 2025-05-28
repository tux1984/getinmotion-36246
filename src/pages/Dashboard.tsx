
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentDetails } from '@/components/dashboard/AgentDetails';
import { AgentManager } from '@/components/dashboard/AgentManager';
import { useLanguage } from '@/context/LanguageContext';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { NewDashboardMain } from '@/components/dashboard/NewDashboardMain';

const Dashboard = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('Dashboard: Component rendering');
  
  const {
    agents,
    showOnboarding,
    profileType,
    activeSection,
    setActiveSection,
    selectedAgent,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    handleOnboardingComplete,
    handleSelectAgent,
    handleBackFromAgentDetails,
    handleOpenAgentManager,
    handleBackFromAgentManager,
    checkLocationStateForOnboarding
  } = useAgentManagement();

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

  const handleAgentToggle = (agentId: string, enabled: boolean) => {
    console.log('Dashboard: Toggling agent:', agentId, enabled);
    // This will be implemented to update agent preferences
    // For now, just log the action
  };

  // Show loading state
  if (isLoading) {
    console.log('Dashboard: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.log('Dashboard: Showing error state:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-lg font-medium">Error cargando el dashboard</div>
          <p className="text-gray-600">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/maturity-calculator')}
            >
              Ir a Evaluación
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding if necessary
  if (showOnboarding) {
    console.log('Dashboard: Showing onboarding');
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <NewDashboardHeader onMaturityCalculatorClick={handleNavigateToMaturityCalculator} />
        <OnboardingWizard 
          profileType={profileType} 
          onComplete={handleOnboardingComplete} 
        />
      </div>
    );
  }

  console.log('Dashboard: Showing main dashboard');
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <div className="container mx-auto px-4 py-6">
        {activeSection === 'dashboard' && (
          <NewDashboardMain 
            onSelectAgent={handleSelectAgent}
            onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
            agents={agents}
            maturityScores={maturityScores}
            recommendedAgents={recommendedAgents}
          />
        )}

        {activeSection === 'agent-details' && selectedAgent && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackFromAgentDetails}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to Dashboard' : 'Volver al Dashboard'}
              </Button>
            </div>
            <AgentDetails 
              agentId={selectedAgent}
              language={language}
            />
          </div>
        )}

        {activeSection === 'agent-manager' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackFromAgentManager}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to Dashboard' : 'Volver al Dashboard'}
              </Button>
            </div>
            <AgentManager 
              currentAgents={agents}
              onAgentToggle={handleAgentToggle}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
