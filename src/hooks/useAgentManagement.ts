import { useState, useEffect } from 'react';
import { Agent, ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { culturalAgentsDatabase, getAgentById } from '@/data/agentsDatabase';

export const useAgentManagement = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>('solo');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'agent-details' | 'agent-manager'>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents>({
    primary: [],
    secondary: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('useAgentManagement: Hook initialized');

  // Convert recommended agents to agent list for dashboard display
  const convertRecommendationsToAgents = (recommendations: RecommendedAgents): Agent[] => {
    console.log('Converting recommendations to agents:', recommendations);
    const allAgents: Agent[] = [];
    
    // Procesar agentes primarios
    if (recommendations.primary) {
      recommendations.primary.forEach(agentId => {
        const agentData = getAgentById(agentId);
        if (agentData) {
          allAgents.push({
            id: agentData.id,
            name: agentData.name,
            status: 'active',
            category: agentData.category,
            activeTasks: Math.floor(Math.random() * 5),
            color: agentData.color,
            icon: agentData.icon,
            lastUsed: Math.random() > 0.5 ? 'Hace 2 días' : undefined
          });
        }
      });
    }

    // Procesar agentes secundarios
    if (recommendations.secondary) {
      recommendations.secondary.forEach(agentId => {
        const agentData = getAgentById(agentId);
        if (agentData && !allAgents.find(a => a.id === agentData.id)) {
          allAgents.push({
            id: agentData.id,
            name: agentData.name,
            status: 'paused',
            category: agentData.category,
            activeTasks: 0,
            color: agentData.color,
            icon: agentData.icon
          });
        }
      });
    }

    // Si no hay agentes, agregar algunos por defecto
    if (allAgents.length === 0) {
      const defaultAgents = ['collaboration-agreement', 'cost-calculator', 'maturity-evaluator'];
      defaultAgents.forEach(agentId => {
        const agentData = getAgentById(agentId);
        if (agentData) {
          allAgents.push({
            id: agentData.id,
            name: agentData.name,
            status: 'active',
            category: agentData.category,
            activeTasks: Math.floor(Math.random() * 3),
            color: agentData.color,
            icon: agentData.icon
          });
        }
      });
    }

    console.log('Converted agents:', allAgents);
    return allAgents;
  };

  // Initialize data from localStorage
  useEffect(() => {
    console.log('useAgentManagement: Starting initialization');
    
    const initializeData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check onboarding status
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        console.log('Onboarding completed:', onboardingCompleted);
        
        if (!onboardingCompleted) {
          console.log('useAgentManagement: Onboarding not completed, showing onboarding');
          setShowOnboarding(true);
          setIsLoading(false);
          return;
        }

        // Load profile type
        const storedProfile = localStorage.getItem('profileType');
        if (storedProfile) {
          setProfileType(storedProfile as ProfileType);
          console.log('Loaded profile type:', storedProfile);
        }

        // Load maturity scores
        const storedScores = localStorage.getItem('maturityScores');
        if (storedScores) {
          const scores = JSON.parse(storedScores);
          console.log('Loaded maturity scores:', scores);
          setMaturityScores(scores);
          
          // Add to history if not already there
          const scoreHistory = localStorage.getItem('maturityScoreHistory');
          let history = scoreHistory ? JSON.parse(scoreHistory) : [];
          
          const lastEntry = history[history.length - 1];
          if (!lastEntry || JSON.stringify(lastEntry) !== JSON.stringify(scores)) {
            history.push({
              ...scores,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('maturityScoreHistory', JSON.stringify(history));
          }
        }

        // Load recommended agents
        const storedRecommended = localStorage.getItem('recommendedAgents');
        if (storedRecommended) {
          const recommendations = JSON.parse(storedRecommended);
          console.log('Loaded recommended agents:', recommendations);
          setRecommendedAgents(recommendations);
          
          const agentsFromRecommendations = convertRecommendationsToAgents(recommendations);
          setAgents(agentsFromRecommendations);
        } else {
          console.log('useAgentManagement: No recommendations found, using defaults');
          const defaultRecommendations: RecommendedAgents = {
            primary: ['collaboration-agreement', 'cost-calculator'],
            secondary: ['maturity-evaluator', 'export-advisor', 'contract-generator'],
            admin: true,
            accounting: false,
            legal: true,
            operations: false,
            cultural: true
          };
          
          const defaultAgents = convertRecommendationsToAgents(defaultRecommendations);
          setAgents(defaultAgents);
          setRecommendedAgents(defaultRecommendations);
        }

        console.log('useAgentManagement: Initialization completed successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('useAgentManagement: Error initializing data:', error);
        setError('Error loading dashboard data');
        
        // Set default agents if there's an error
        const defaultAgents = convertRecommendationsToAgents({
          primary: ['collaboration-agreement', 'cost-calculator'],
          secondary: []
        });
        setAgents(defaultAgents);
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent blocking the UI
    const timeoutId = setTimeout(initializeData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleOnboardingComplete = (scores: CategoryScore, recommended: RecommendedAgents) => {
    console.log('useAgentManagement: Onboarding completed with recommendations:', recommended);
    
    setMaturityScores(scores);
    setRecommendedAgents(recommended);
    setShowOnboarding(false);
    
    const agentsFromRecommendations = convertRecommendationsToAgents(recommended);
    setAgents(agentsFromRecommendations);
    
    // Save to localStorage
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommended));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Add to score history
    const scoreHistory = localStorage.getItem('maturityScoreHistory');
    const history = scoreHistory ? JSON.parse(scoreHistory) : [];
    history.push({
      ...scores,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('maturityScoreHistory', JSON.stringify(history));
  };

  const handleSelectAgent = (agentId: string) => {
    console.log('useAgentManagement: Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  };

  const handleBackFromAgentDetails = () => {
    console.log('useAgentManagement: Going back from agent details');
    setSelectedAgent(null);
    setActiveSection('dashboard');
  };

  const handleOpenAgentManager = () => {
    console.log('useAgentManagement: Opening agent manager');
    setActiveSection('agent-manager');
  };

  const handleBackFromAgentManager = () => {
    console.log('useAgentManagement: Going back from agent manager');
    setActiveSection('dashboard');
  };

  const checkLocationStateForOnboarding = (locationState: any) => {
    if (locationState?.showOnboarding) {
      console.log('useAgentManagement: Location state requests onboarding');
      setShowOnboarding(true);
      return true;
    }
    return false;
  };

  return {
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
  };
};
