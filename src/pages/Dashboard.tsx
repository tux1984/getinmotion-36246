
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { ProjectStatusCards } from '@/components/dashboard/ProjectStatusCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { CopilotSelector } from '@/components/dashboard/CopilotSelector';
import { CopilotChat } from '@/components/dashboard/CopilotChat';
import { OnboardingWizard, RecommendedAgents } from '@/components/onboarding/OnboardingWizard';
import { CulturalCreatorAgents } from '@/components/cultural/CulturalCreatorAgents';
import { CostCalculatorAgent } from '@/components/cultural/CostCalculatorAgent';
import { Button } from '@/components/ui/button';
import { BarChart3, Calculator, FileText } from 'lucide-react';

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
    operations: false,
    cultural: false
  });
  const [selectedCopilot, setSelectedCopilot] = useState<string | null>(null);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [showCulturalAgents, setShowCulturalAgents] = useState(false);
  const [selectedCulturalAgent, setSelectedCulturalAgent] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  
  const location = useLocation();
  const navigate = useNavigate();
  
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
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(agents));
    
    // Seleccionar el primer agente recomendado por defecto
    if (agents.admin) setSelectedCopilot('admin');
    else if (agents.accounting) setSelectedCopilot('accounting');
    else if (agents.legal) setSelectedCopilot('legal');
    else if (agents.cultural) setSelectedCopilot('cultural');
  };
  
  const handleSelectCopilot = (id: string) => {
    if (id === 'cultural') {
      setShowCulturalAgents(true);
      setSelectedCopilot(null);
      setActiveSection('cultural');
    } else {
      setSelectedCopilot(id);
      setActiveSection('chat');
    }
  };

  const handleSelectCulturalAgent = (id: string) => {
    setSelectedCulturalAgent(id);
    if (id === 'cost-calculator') {
      setActiveSection('cost-calculator');
    }
  };

  const handleBackFromCulturalAgents = () => {
    setShowCulturalAgents(false);
    setSelectedCulturalAgent(null);
    setActiveSection('dashboard');
  };

  const handleNavigateToMaturityCalculator = () => {
    navigate('/maturity-calculator', { state: { profileType } });
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
        {/* Barra de navegación del Dashboard */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Button 
              variant={activeSection === 'dashboard' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeSection === 'maturity' ? "default" : "ghost"} 
              size="sm"
              onClick={handleNavigateToMaturityCalculator}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Calculadora de Madurez
            </Button>
          </div>
        </div>

        {activeSection === 'dashboard' && !selectedCopilot && !showCulturalAgents && (
          <>
            <WelcomeSection />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ProjectStatusCards />
              </div>
              
              <div>
                <QuickActions />
              </div>
            </div>
            
            <div className="mb-8">
              <CopilotSelector 
                onSelectCopilot={handleSelectCopilot} 
                recommendedAgents={recommendedAgents}
                showCategories={true}
              />
            </div>

            <div className="mb-8">
              <TaskManager />
            </div>
          </>
        )}

        {activeSection === 'cultural' && !selectedCulturalAgent && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <button 
                onClick={() => {
                  setShowCulturalAgents(false);
                  setActiveSection('dashboard');
                }} 
                className="text-sm flex items-center text-gray-500 hover:text-gray-700"
              >
                ← Volver a agentes principales
              </button>
            </div>
            <CulturalCreatorAgents onSelectAgent={handleSelectCulturalAgent} />
          </div>
        )}

        {activeSection === 'cost-calculator' && selectedCulturalAgent === 'cost-calculator' && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <button 
                onClick={() => {
                  setSelectedCulturalAgent(null);
                  setActiveSection('cultural');
                }} 
                className="text-sm flex items-center text-gray-500 hover:text-gray-700"
              >
                ← Volver a agentes culturales
              </button>
            </div>
            <CostCalculatorAgent />
          </div>
        )}
        
        {activeSection === 'chat' && selectedCopilot && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CopilotChat 
              agentId={selectedCopilot} 
              onBack={() => {
                setSelectedCopilot(null);
                setActiveSection('dashboard');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
