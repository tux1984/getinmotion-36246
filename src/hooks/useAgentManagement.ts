
import { useState, useEffect } from 'react';
import { Agent, ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';

export const useAgentManagement = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>('solo');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'agent-details'>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents>({
    primary: [],
    secondary: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('useAgentManagement: Hook initialized');

  // Convert recommended agents to legacy format for dashboard display
  const convertRecommendationsToLegacy = (recommendations: RecommendedAgents): Agent[] => {
    console.log('Converting recommendations to legacy format:', recommendations);
    const allAgents: Agent[] = [];
    
    // Always add admin agent
    allAgents.push({
      id: 'admin',
      name: 'Administrative Assistant',
      status: 'active',
      category: 'business',
      activeTasks: 0,
      color: 'bg-blue-500',
      icon: '📋'
    });

    // Check for cultural agents
    const hasCultural = recommendations.primary?.includes('cultural') || 
                       recommendations.secondary?.includes('cultural') ||
                       recommendations.cultural;
    
    if (hasCultural) {
      allAgents.push({
        id: 'cultural',
        name: 'Cultural Creator Agent',
        status: 'active',
        category: 'cultural',
        activeTasks: 0,
        color: 'bg-pink-500',
        icon: '🎨'
      });
    }

    // Add other agents based on recommendations
    const hasAccounting = recommendations.primary?.includes('finance-advisor') || 
                         recommendations.secondary?.includes('finance-advisor') ||
                         recommendations.accounting;
    
    if (hasAccounting) {
      allAgents.push({
        id: 'accounting',
        name: 'Accounting Copilot',
        status: 'active',
        category: 'finance',
        activeTasks: 0,
        color: 'bg-green-500',
        icon: '💰'
      });
    }

    const hasLegal = recommendations.primary?.includes('legal') || 
                     recommendations.secondary?.includes('legal') ||
                     recommendations.legal;
    
    if (hasLegal) {
      allAgents.push({
        id: 'legal',
        name: 'Legal Advisor',
        status: 'active',
        category: 'legal',
        activeTasks: 0,
        color: 'bg-red-500',
        icon: '⚖️'
      });
    }

    const hasOperations = recommendations.primary?.includes('operations') || 
                         recommendations.secondary?.includes('operations') ||
                         recommendations.operations;
    
    if (hasOperations) {
      allAgents.push({
        id: 'operations',
        name: 'Operations Manager',
        status: 'active',
        category: 'operations',
        activeTasks: 0,
        color: 'bg-amber-500',
        icon: '⚙️'
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
          
          const agentsFromRecommendations = convertRecommendationsToLegacy(recommendations);
          setAgents(agentsFromRecommendations);
        } else {
          console.log('useAgentManagement: No recommendations found, using defaults');
          const defaultRecommendations: RecommendedAgents = {
            primary: ['admin'],
            secondary: profileType === 'team' ? ['operations'] : ['cultural']
          };
          
          const defaultAgents = convertRecommendationsToLegacy(defaultRecommendations);
          setAgents(defaultAgents);
          setRecommendedAgents(defaultRecommendations);
        }

        console.log('useAgentManagement: Initialization completed successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('useAgentManagement: Error initializing data:', error);
        setError('Error loading dashboard data');
        
        // Set default agents if there's an error
        setAgents([{
          id: 'admin',
          name: 'Administrative Assistant',
          status: 'active',
          category: 'business',
          activeTasks: 0,
          color: 'bg-blue-500',
          icon: '📋'
        }]);
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent blocking the UI
    const timeoutId = setTimeout(initializeData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []); // Remove all dependencies to prevent loops

  const handleOnboardingComplete = (scores: CategoryScore, recommended: RecommendedAgents) => {
    console.log('useAgentManagement: Onboarding completed with recommendations:', recommended);
    
    setMaturityScores(scores);
    setRecommendedAgents(recommended);
    setShowOnboarding(false);
    
    const agentsFromRecommendations = convertRecommendationsToLegacy(recommended);
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
    checkLocationStateForOnboarding
  };
};
