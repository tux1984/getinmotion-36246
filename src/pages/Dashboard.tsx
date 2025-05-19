
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { ProjectStatusCards } from '@/components/dashboard/ProjectStatusCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { CopilotSelector } from '@/components/dashboard/CopilotSelector';
import { CopilotChat } from '@/components/dashboard/CopilotChat';
import { OnboardingWizard, RecommendedAgents } from '@/components/onboarding/OnboardingWizard';

type ProfileType = 'idea' | 'solo' | 'team';

type CategoryScore = {
  ideaValidation: number;
  userExperience: number;
  marketFit: number;
  monetization: number;
};

const Dashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>('idea');
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents>({
    admin: true,
    accounting: false,
    legal: false,
    operations: false
  });
  const [selectedCopilot, setSelectedCopilot] = useState<string | null>(null);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const location = useLocation();
  
  // Verificar si se debe iniciar el onboarding
  useEffect(() => {
    const startOnboarding = location.state?.startOnboarding;
    const storedProfileType = localStorage.getItem('userProfile');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (startOnboarding && location.state?.profileType) {
      setProfileType(location.state.profileType);
      setShowOnboarding(true);
      
      // Limpiar el estado después de usarlo
      window.history.replaceState({}, document.title);
    } else if (storedProfileType && !onboardingCompleted) {
      setProfileType(storedProfileType as ProfileType);
      setShowOnboarding(true);
    }
    
    // Cargar agentes recomendados si existen
    const storedAgents = localStorage.getItem('recommendedAgents');
    if (storedAgents) {
      setRecommendedAgents(JSON.parse(storedAgents));
    }
    
    // Cargar puntuaciones de madurez si existen
    const storedScores = localStorage.getItem('maturityScores');
    if (storedScores) {
      setMaturityScores(JSON.parse(storedScores));
    }
  }, [location]);
  
  const handleOnboardingComplete = (scores: CategoryScore, agents: RecommendedAgents) => {
    setMaturityScores(scores);
    setRecommendedAgents(agents);
    setShowOnboarding(false);
    
    // Seleccionar el primer agente recomendado por defecto
    if (agents.admin) setSelectedCopilot('admin');
    else if (agents.accounting) setSelectedCopilot('accounting');
    else if (agents.legal) setSelectedCopilot('legal');
  };
  
  const handleSelectCopilot = (id: string) => {
    setSelectedCopilot(id);
  };

  // Mostrar onboarding si es necesario
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
      
      <div className="container mx-auto px-4 py-8">
        <WelcomeSection profileType={profileType} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProjectStatusCards maturityScores={maturityScores} />
          </div>
          
          <div>
            <QuickActions />
          </div>
        </div>
        
        {!selectedCopilot ? (
          <>
            <CopilotSelector 
              onSelectCopilot={handleSelectCopilot} 
              recommendedAgents={recommendedAgents}
            />
            <TaskManager />
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CopilotChat 
              agentId={selectedCopilot} 
              onBack={() => setSelectedCopilot(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
