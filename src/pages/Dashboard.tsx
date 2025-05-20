
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgentDetails } from '@/components/dashboard/AgentDetails';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardMain } from '@/components/dashboard/DashboardMain';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <DashboardSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        />
        
        <SidebarInset>
          <div className="px-3 py-3 sm:px-6 sm:py-4">
            {activeSection === 'dashboard' && (
              <DashboardMain 
                onSelectAgent={handleSelectAgent}
                agents={agents}
              />
            )}

            {activeSection === 'agent-details' && selectedAgent && (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBackFromAgentDetails}
                    className="flex items-center gap-2 h-8 text-sm"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
