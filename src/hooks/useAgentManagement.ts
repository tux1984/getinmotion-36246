import { useState, useEffect } from 'react';
import { Agent, ProfileType, CategoryScore, RecommendedAgents, AgentStatus } from '@/types/dashboard';

export const useAgentManagement = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>('idea');
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents>({
    primary: [],
    secondary: []
  });
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Enhanced agents data that responds to recommendations
  const getAllAgents = (): Agent[] => [
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
    },
    {
      id: "admin",
      name: "A4 - Asistente administrativo",
      status: "inactive", 
      category: "Administración",
      activeTasks: 0,
      color: "bg-orange-100 text-orange-700",
      icon: "📋"
    },
    {
      id: "accounting",
      name: "A5 - Contabilidad cultural", 
      status: "inactive",
      category: "Financiera",
      activeTasks: 0,
      color: "bg-green-100 text-green-700",
      icon: "📊"
    },
    {
      id: "legal",
      name: "A6 - Asesor legal cultural",
      status: "inactive",
      category: "Legal", 
      activeTasks: 0,
      color: "bg-red-100 text-red-700",
      icon: "⚖️"
    },
    {
      id: "operations",
      name: "A7 - Gestor de operaciones",
      status: "inactive",
      category: "Operaciones",
      activeTasks: 0,
      color: "bg-purple-100 text-purple-700", 
      icon: "⚙️"
    },
    {
      id: "cultural",
      name: "A8 - Creador cultural",
      status: "inactive",
      category: "Creativo",
      activeTasks: 0,
      color: "bg-pink-100 text-pink-700",
      icon: "🎨"
    }
  ];

  const agents = getAllAgents();

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
      const parsedAgents = JSON.parse(storedAgents);
      // Convert legacy format to new format if needed
      if (parsedAgents.admin !== undefined) {
        // Legacy format conversion
        const primary = [];
        const secondary = [];
        
        if (parsedAgents.admin) primary.push('admin');
        if (parsedAgents.accounting) primary.push('accounting');
        if (parsedAgents.legal) primary.push('legal');
        if (parsedAgents.operations) secondary.push('operations');
        if (parsedAgents.cultural) secondary.push('cultural');
        
        setRecommendedAgents({ primary, secondary });
      } else {
        setRecommendedAgents(parsedAgents);
      }
    }
    
    // Load maturity scores if they exist
    const storedScores = localStorage.getItem('maturityScores');
    if (storedScores) {
      setMaturityScores(JSON.parse(storedScores));
    }
  }, []);

  // Handle onboarding completion with score history
  const handleOnboardingComplete = (scores: CategoryScore, agents: RecommendedAgents) => {
    setMaturityScores(scores);
    setRecommendedAgents(agents);
    setShowOnboarding(false);
    
    // Save to localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(agents));
    
    // Save to score history for comparison
    try {
      const existingHistory = localStorage.getItem('maturityScoreHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push({
        ...scores,
        timestamp: new Date().toISOString()
      });
      // Keep only last 10 assessments
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }
      localStorage.setItem('maturityScoreHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving score history:', error);
    }
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
