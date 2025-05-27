
import { useState, useEffect, useCallback } from 'react';
import { Agent, ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { getAgentData } from '@/components/cultural/useAgentData';

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

  // Initialize data from localStorage
  useEffect(() => {
    const initializeData = () => {
      try {
        // Check onboarding status
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        if (!onboardingCompleted) {
          setShowOnboarding(true);
          return;
        }

        // Load maturity scores
        const storedScores = localStorage.getItem('maturityScores');
        if (storedScores) {
          const scores = JSON.parse(storedScores);
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

        // Load recommended agents
        const storedRecommended = localStorage.getItem('recommendedAgents');
        if (storedRecommended) {
          setRecommendedAgents(JSON.parse(storedRecommended));
        }

        // Load profile type
        const storedProfile = localStorage.getItem('profileType');
        if (storedProfile) {
          setProfileType(storedProfile as ProfileType);
        }

        // Initialize agents
        const allAgents = getAgentData();
        setAgents(allAgents);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  const handleOnboardingComplete = useCallback((scores: CategoryScore, recommended: RecommendedAgents) => {
    setMaturityScores(scores);
    setRecommendedAgents(recommended);
    setShowOnboarding(false);
    
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
  }, []);

  const handleSelectAgent = useCallback((agentId: string) => {
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  }, []);

  const handleBackFromAgentDetails = useCallback(() => {
    setSelectedAgent(null);
    setActiveSection('dashboard');
  }, []);

  const checkLocationStateForOnboarding = useCallback((locationState: any) => {
    if (locationState?.showOnboarding) {
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
    handleOnboardingComplete,
    handleSelectAgent,
    handleBackFromAgentDetails,
    checkLocationStateForOnboarding
  };
};
