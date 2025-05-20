
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentDetails } from '@/components/dashboard/AgentDetails';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation';
import { DashboardMain } from '@/components/dashboard/DashboardMain';
import { useAgentManagement } from '@/hooks/useAgentManagement';

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
  }, [location]);
  
  const handleNavigateToMaturityCalculator = () => {
    navigate('/maturity-calculator', { state: { profileType } });
  };

  // Show onboarding if necessary
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <OnboardingWizard 
          profileType={profileType} 
          onComplete={handleOnboardingComplete} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Dashboard Navigation */}
        <DashboardNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          language={language}
        />

        {activeSection === 'dashboard' && (
          <DashboardMain 
            onSelectAgent={handleSelectAgent}
            agents={agents}
          />
        )}

        {activeSection === 'agent-details' && selectedAgent && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackFromAgentDetails}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back' : 'Volver'}
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
