
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OnboardingWizard, RecommendedAgents } from '@/components/onboarding/OnboardingWizard';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowLeft, Plus } from 'lucide-react';
import { AgentCard } from '@/components/dashboard/AgentCard';
import { AgentDetails } from '@/components/dashboard/AgentDetails';
import { useLanguage } from '@/context/LanguageContext';

type ProfileType = 'idea' | 'solo' | 'team';

type CategoryScore = {
  ideaValidation: number;
  userExperience: number;
  marketFit: number;
  monetization: number;
};

type AgentStatus = 'active' | 'paused' | 'inactive';

interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  category: string;
  activeTasks: number;
  lastUsed?: string;
  color: string;
  icon: React.ReactNode;
}

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
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const t = {
    en: {
      greeting: "Hello, Manu! Your agents are ready 👇",
      configureAccount: "Configure account",
      myAgents: "My Agents",
      addNewAgent: "Add new agent",
      back: "Back",
      maturityCalculator: "Maturity Calculator",
      dashboard: "Dashboard",
      activateAgent: "Activate",
      pauseAgent: "Pause",
      viewTasks: "View tasks",
      enter: "Enter",
      info: "Info",
      activeStatus: "Active",
      pausedStatus: "Paused",
      inactiveStatus: "Inactive",
      activeTasks: "active tasks",
      lastUsed: "Last used",
      daysAgo: "days ago",
      generalActivity: "General Activity",
      activeAgents: "Active agents",
      tasksInProgress: "Tasks in progress",
      lastDeliverable: "Last deliverable generated",
      mostUsedAgent: "Most used agent",
      estimatedCostPerMonth: "Estimated cost per month"
    },
    es: {
      greeting: "¡Hola, Manu! Tus agentes están listos 👇",
      configureAccount: "Configurar cuenta",
      myAgents: "Mis Agentes",
      addNewAgent: "Agregar agente nuevo",
      back: "Volver",
      maturityCalculator: "Calculadora de Madurez",
      dashboard: "Dashboard",
      activateAgent: "Activar",
      pauseAgent: "Pausar",
      viewTasks: "Ver tareas",
      enter: "Entrar",
      info: "Info",
      activeStatus: "Activo",
      pausedStatus: "En pausa",
      inactiveStatus: "Inactivo",
      activeTasks: "tareas activas",
      lastUsed: "Último uso",
      daysAgo: "días atrás",
      generalActivity: "Actividad general",
      activeAgents: "Agentes activos",
      tasksInProgress: "Tareas en curso",
      lastDeliverable: "Último entregable generado",
      mostUsedAgent: "Agente más usado",
      estimatedCostPerMonth: "Costo estimado por mes"
    }
  };
  
  // Mock agents data - this would come from an API in a real application
  const agents: Agent[] = [
    {
      id: "contract-generator",
      name: "A2 - Contrato cultural",
      status: "active",
      category: "Legal",
      activeTasks: 1,
      lastUsed: "2 days ago",
      color: "bg-blue-100 text-blue-700",
      icon: "🧾"
    },
    {
      id: "cost-calculator",
      name: "A1 - Cálculo de costos",
      status: "paused",
      category: "Financiera",
      activeTasks: 0,
      lastUsed: "5 days ago",
      color: "bg-emerald-100 text-emerald-700",
      icon: "💰"
    },
    {
      id: "maturity-evaluator",
      name: "A3 - Evaluador de madurez",
      status: "inactive",
      category: "Diagnóstico",
      activeTasks: 0,
      color: "bg-violet-100 text-violet-700",
      icon: "📊"
    }
  ];
  
  // Verify if onboarding should be started
  useEffect(() => {
    const startOnboarding = location.state?.startOnboarding;
    const storedProfileType = localStorage.getItem('userProfile');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (startOnboarding && location.state?.profileType) {
      setProfileType(location.state.profileType);
      setShowOnboarding(true);
      
      // Clear state after using it
      window.history.replaceState({}, document.title);
    } else if (storedProfileType && !onboardingCompleted) {
      setProfileType(storedProfileType as ProfileType);
      setShowOnboarding(true);
    }
    
    // Load recommended agents if they exist
    const storedAgents = localStorage.getItem('recommendedAgents');
    if (storedAgents) {
      setRecommendedAgents(JSON.parse(storedAgents));
    }
    
    // Load maturity scores if they exist
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
  };
  
  const handleSelectAgent = (id: string) => {
    setSelectedAgent(id);
    setActiveSection('agent-details');
  };

  const handleBackFromAgentDetails = () => {
    setSelectedAgent(null);
    setActiveSection('dashboard');
  };

  const handleAgentAction = (id: string, action: string) => {
    console.log(`Agent ${id} action: ${action}`);
    if (action === 'enter') {
      handleSelectAgent(id);
    }
    // Here you would implement the actual agent status changes
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Button 
              variant={activeSection === 'dashboard' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center gap-2"
            >
              {t[language].dashboard}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleNavigateToMaturityCalculator}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {t[language].maturityCalculator}
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="text-sm">
            ⚙️ {t[language].configureAccount}
          </Button>
        </div>

        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h1 className="text-2xl font-medium mb-6">
                {t[language].greeting}
              </h1>
              
              {/* Summary dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">{t[language].generalActivity}</h2>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm">• {t[language].activeAgents}: 2</li>
                    <li className="text-sm">• {t[language].tasksInProgress}: 4</li>
                    <li className="text-sm">• {t[language].lastDeliverable}: 1 {t[language].daysAgo}</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">{t[language].mostUsedAgent}</h2>
                  <p className="mt-2 text-sm">A2 - Contrato cultural</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">{t[language].estimatedCostPerMonth}</h2>
                  <p className="mt-2 text-sm font-medium">$42</p>
                </div>
              </div>
              
              <h2 className="text-xl font-medium mb-4">
                🧠 {t[language].myAgents}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    onActionClick={handleAgentAction}
                    language={language}
                  />
                ))}
                
                {/* Add new agent card */}
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-violet-300 hover:text-violet-500 cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-4">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-center">{t[language].addNewAgent}</p>
                </div>
              </div>
            </div>
          </div>
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
                {t[language].back}
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
