
import { useState, useEffect, useCallback } from 'react';
import { Agent, ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useAgentData } from '@/components/cultural/useAgentData';

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

  // Get agents using the hook
  const culturalAgents = useAgentData('en'); // Default to English, could be made dynamic

  // Convert recommended agents to legacy format for dashboard display
  const convertRecommendationsToLegacy = useCallback((recommendations: RecommendedAgents): Agent[] => {
    console.log('Converting recommendations to legacy format:', recommendations);
    const allAgents: Agent[] = [];
    
    // Always add admin agent as it's always recommended
    allAgents.push({
      id: 'admin',
      name: 'Administrative Assistant',
      status: 'active',
      category: 'business',
      activeTasks: 0,
      color: 'bg-blue-500',
      icon: '📋'
    });

    // Check for cultural agents in primary/secondary recommendations
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

    // Check for other agents based on recommendations
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
  }, []);

  // Initialize data from localStorage
  useEffect(() => {
    console.log('useAgentManagement: Starting initialization');
    setIsLoading(true);
    setError(null);

    const initializeData = () => {
      try {
        console.log('useAgentManagement: Checking onboarding status');
        // Check onboarding status
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        console.log('Onboarding completed:', onboardingCompleted);
        
        if (!onboardingCompleted) {
          console.log('useAgentManagement: Onboarding not completed, showing onboarding');
          setShowOnboarding(true);
          setIsLoading(false);
          return;
        }

        console.log('useAgentManagement: Loading maturity scores');
        // Load maturity scores
        const storedScores = localStorage.getItem('maturityScores');
        if (storedScores) {
          const scores = JSON.parse(storedScores);
          console.log('Loaded maturity scores:', scores);
          setMaturityScores(scores);
          
          // Add to history if not already there
          const scoreHistory = localStorage.getItem('maturityScoreHistory');
          let history = scoreHistory ? JSON.parse(scoreHistory) : [];
          
          // Only add if it's different from the last entry
          const lastEntry = history[history.length - 1];
          if (!lastEntry || JSON.stringify(lastEntry) !== JSON.stringify(scores)) {
            history.push({
              ...scores,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('maturityScoreHistory', JSON.stringify(history));
          }
        }

        console.log('useAgentManagement: Loading recommended agents');
        // Load recommended agents
        const storedRecommended = localStorage.getItem('recommendedAgents');
        if (storedRecommended) {
          const recommendations = JSON.parse(storedRecommended);
          console.log('Loaded recommended agents:', recommendations);
          setRecommendedAgents(recommendations);
          
          // Convert recommendations to agents for dashboard display
          const agentsFromRecommendations = convertRecommendationsToLegacy(recommendations);
          setAgents(agentsFromRecommendations);
        } else {
          console.log('useAgentManagement: No recommendations found, using defaults');
          // If no recommendations, show default agents based on profile type
          const storedProfile = localStorage.getItem('profileType');
          const currentProfileType = storedProfile as ProfileType || 'solo';
          setProfileType(currentProfileType);
          
          // Create default recommendations based on profile type
          const defaultRecommendations: RecommendedAgents = {
            primary: ['admin'],
            secondary: currentProfileType === 'team' ? ['operations'] : ['cultural']
          };
          
          const defaultAgents = convertRecommendationsToLegacy(defaultRecommendations);
          setAgents(defaultAgents);
        }

        console.log('useAgentManagement: Loading profile type');
        // Load profile type
        const storedProfile = localStorage.getItem('profileType');
        if (storedProfile) {
          setProfileType(storedProfile as ProfileType);
          console.log('Loaded profile type:', storedProfile);
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
  }, [convertRecommendationsToLegacy]);

  const handleOnboardingComplete = useCallback((scores: CategoryScore, recommended: RecommendedAgents) => {
    console.log('useAgentManagement: Onboarding completed with recommendations:', recommended);
    
    setMaturityScores(scores);
    setRecommendedAgents(recommended);
    setShowOnboarding(false);
    
    // Convert recommendations to agents for dashboard
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
  }, [convertRecommendationsToLegacy]);

  const handleSelectAgent = useCallback((agentId: string) => {
    console.log('useAgentManagement: Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  }, []);

  const handleBackFromAgentDetails = useCallback(() => {
    console.log('useAgentManagement: Going back from agent details');
    setSelectedAgent(null);
    setActiveSection('dashboard');
  }, []);

  const checkLocationStateForOnboarding = useCallback((locationState: any) => {
    if (locationState?.showOnboarding) {
      console.log('useAgentManagement: Location state requests onboarding');
      setShowOnboarding(true);
      return true;
    }
    return false;
  }, []);

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
