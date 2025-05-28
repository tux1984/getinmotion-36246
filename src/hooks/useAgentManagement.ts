
import React, { useState, useEffect, useCallback } from 'react';
import { Agent, CategoryScore, RecommendedAgents, ProfileType } from '@/types/dashboard';
import { calculateMaturityScores, getRecommendedAgents } from '@/components/cultural/hooks/utils/scoreCalculation';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { UserProfileData } from '@/components/cultural/types/wizardTypes';
import { useUserData } from './useUserData';
import { useMaturityScores } from './useMaturityScores';

type ActiveSection = 'dashboard' | 'agent-details' | 'agent-manager';

export const useAgentManagement = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType>('idea');
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use real data hooks
  const { 
    profile, 
    projects, 
    agents: userAgents, 
    loading: userDataLoading,
    error: userDataError 
  } = useUserData();
  
  const { 
    currentScores, 
    loading: scoresLoading,
    error: scoresError,
    saveMaturityScores 
  } = useMaturityScores();

  // Convert user agents to Agent format
  const agents: Agent[] = culturalAgentsDatabase.map(agentInfo => {
    const userAgent = userAgents.find(ua => ua.agent_id === agentInfo.id);
    
    return {
      id: agentInfo.id,
      name: agentInfo.name,
      status: userAgent?.is_enabled ? 'active' : 'inactive',
      category: agentInfo.category,
      activeTasks: userAgent?.usage_count || 0,
      lastUsed: userAgent?.last_used_at ? new Date(userAgent.last_used_at).toLocaleDateString() : undefined,
      color: agentInfo.color,
      icon: agentInfo.icon
    };
  });

  // Generate recommendations based on current scores
  const recommendedAgents: RecommendedAgents = React.useMemo(() => {
    if (!currentScores) {
      // Default recommendations for new users
      return {
        primary: ['cultural-consultant', 'project-manager', 'cost-calculator'],
        secondary: ['content-creator', 'marketing-advisor', 'legal-advisor'],
        admin: true,
        cultural: true,
        accounting: false,
        legal: false,
        operations: true
      };
    }

    // Generate recommendations based on scores
    const profileData: Partial<UserProfileData> = {
      industry: 'musica', // Default - this should come from user profile
      experience: currentScores.ideaValidation < 50 ? 'beginner' : 
                 currentScores.ideaValidation < 80 ? 'intermediate' : 'advanced'
    };

    return getRecommendedAgents(profileData as UserProfileData, currentScores);
  }, [currentScores]);

  // Combined loading state
  useEffect(() => {
    setIsLoading(userDataLoading || scoresLoading);
  }, [userDataLoading, scoresLoading]);

  // Combined error state
  useEffect(() => {
    setError(userDataError || scoresError || null);
  }, [userDataError, scoresError]);

  // Check if user needs onboarding
  useEffect(() => {
    if (!isLoading && !error) {
      // Show onboarding if:
      // 1. No maturity scores exist
      // 2. No enabled agents exist
      const hasScores = !!currentScores;
      const hasEnabledAgents = userAgents.some(agent => agent.is_enabled);
      
      console.log('Onboarding check:', { hasScores, hasEnabledAgents });
      
      if (!hasScores && !hasEnabledAgents) {
        setShowOnboarding(true);
      }
    }
  }, [currentScores, userAgents, isLoading, error]);

  const handleOnboardingComplete = useCallback(async (data: {
    profileType: ProfileType;
    maturityScores: CategoryScore;
    profileData: UserProfileData;
    selectedAgents: string[];
  }) => {
    console.log('Onboarding completed with data:', data);
    
    try {
      // Save maturity scores
      await saveMaturityScores(data.maturityScores, data.profileData);
      
      // Enable selected agents (this will be handled by the useUserData hook)
      // The agents will be enabled when the user first interacts with them
      
      setProfileType(data.profileType);
      setShowOnboarding(false);
      
      console.log('Onboarding data saved successfully');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setError('Error al guardar los datos del onboarding');
    }
  }, [saveMaturityScores]);

  const handleSelectAgent = useCallback((agentId: string) => {
    console.log('Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  }, []);

  const handleBackFromAgentDetails = useCallback(() => {
    console.log('Returning from agent details');
    setSelectedAgent(null);
    setActiveSection('dashboard');
  }, []);

  const handleOpenAgentManager = useCallback(() => {
    console.log('Opening agent manager');
    setActiveSection('agent-manager');
  }, []);

  const handleBackFromAgentManager = useCallback(() => {
    console.log('Returning from agent manager');
    setActiveSection('dashboard');
  }, []);

  const checkLocationStateForOnboarding = useCallback((locationState: any) => {
    if (locationState?.showOnboarding) {
      console.log('Location state indicates onboarding should be shown');
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
    maturityScores: currentScores,
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
