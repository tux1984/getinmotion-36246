
import { useState, useEffect } from 'react';
import { Agent, ProfileType, CategoryScore, RecommendedAgents, AgentStatus } from '@/types/dashboard';

export const useAgentManagement = () => {
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

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProfileType = localStorage.getItem('userProfile');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (storedProfileType && !onboardingCompleted) {
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
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = (scores: CategoryScore, agents: RecommendedAgents) => {
    setMaturityScores(scores);
    setRecommendedAgents(agents);
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(agents));
  };

  // Handle agent selection
  const handleSelectAgent = (id: string) => {
    setSelectedAgent(id);
    setActiveSection('agent-details');
  };

  // Handle back from agent details
  const handleBackFromAgentDetails = () => {
    setSelectedAgent(null);
    setActiveSection('dashboard');
  };

  // Check location state for onboarding flag
  const checkLocationStateForOnboarding = (locationState: any) => {
    if (locationState?.startOnboarding && locationState?.profileType) {
      setProfileType(locationState.profileType);
      setShowOnboarding(true);
      return true;
    }
    return false;
  };

  return {
    agents,
    showOnboarding,
    setShowOnboarding,
    profileType,
    setProfileType,
    recommendedAgents,
    maturityScores,
    activeSection,
    setActiveSection,
    selectedAgent,
    setSelectedAgent,
    handleOnboardingComplete,
    handleSelectAgent,
    handleBackFromAgentDetails,
    checkLocationStateForOnboarding
  };
};
