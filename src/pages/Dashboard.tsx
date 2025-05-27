
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentDetails } from '@/components/dashboard/AgentDetails';
import { useLanguage } from '@/context/LanguageContext';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { NewDashboardMain } from '@/components/dashboard/NewDashboardMain';

const Dashboard = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    agents,
    showOnboarding,
    profileType,
    activeSection,
    setActiveSection,
    selectedAgent,
    maturityScores,
    recommendedAgents,
    handleOnboardingComplete,
    handleSelectAgent,
    handleBackFromAgentDetails,
    checkLocationStateForOnboarding
  } = useAgentManagement();

  // Check for onboarding flag in location state
  useEffect(() => {
    const stateChanged = checkLocationStateForOnboarding(location.state);
    
    if (stateChanged) {
      // Clear state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location, checkLocationStateForOnboarding]);
  
  const handleNavigateToMaturityCalculator = () => {
    navigate('/maturity-calculator', { state: { profileType } });
  };

  // Show onboarding if necessary
  if (showOnboarding) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <NewDashboardHeader onMaturityCalculatorClick={handleNavigateToMaturityCalculator} />
      
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
      </div>
    </div>
  );
};

export default Dashboard;
