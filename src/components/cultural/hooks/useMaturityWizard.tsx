import { useState } from 'react';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId, WizardHookReturn } from './types/wizardTypes';
import { 
  getCurrentStepInfo, 
  isStepValid as checkStepValidity
} from './utils/wizardStepUtils';
import { 
  calculateMaturityScores as computeScores,
  getRecommendedAgents as determineRecommendedAgents
} from './utils/scoreCalculation';

export type { WizardStepId } from './types/wizardTypes';

export const useMaturityWizard = (
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void
): WizardHookReturn => {
  // Initial step is profile type selection
  const [currentStepId, setCurrentStepId] = useState<WizardStepId>('profileType');
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    profileType: undefined,
    industry: '',
    activities: [],
    experience: '',
    paymentMethods: '',
    brandIdentity: '',
    financialControl: '',
    teamStructure: '',
    taskOrganization: '',
    decisionMaking: '',
  });
  
  // Get current step information
  const { currentStepNumber, totalSteps, steps } = getCurrentStepInfo(profileData, currentStepId);
  
  // Check if current step is valid (has been answered)
  const isCurrentStepValid = () => {
    return checkStepValidity(currentStepId, profileData);
  };
  
  // Update profile data
  const updateProfileData = (data: Partial<UserProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };
  
  // Handle navigation
  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStepId);
    
    // If we're at analysis choice, determine next step based on user choice
    if (currentStepId === 'analysisChoice') {
      if (profileData.analysisPreference === 'detailed') {
        // Go to first detailed question
        setCurrentStepId('pricingMethod');
      } else {
        // Skip detailed analysis and go to results
        setCurrentStepId('results');
      }
    } 
    // If we're at profile type step, the next step depends on the profile type
    else if (currentStepId === 'profileType') {
      // Use the first step from the specific profile path
      switch (profileData.profileType) {
        case 'idea':
        case 'solo':
        case 'team':
          // All start with industry
          setCurrentStepId('industry');
          break;
        default:
          // Fallback to next in sequence
          if (currentIndex < steps.length - 1) {
            setCurrentStepId(steps[currentIndex + 1]);
          }
      }
    }
    // Otherwise go to next step in sequence
    else if (currentIndex < steps.length - 1) {
      setCurrentStepId(steps[currentIndex + 1]);
    }
  };
  
  const handlePrevious = () => {
    const currentIndex = steps.indexOf(currentStepId);
    
    if (currentIndex > 0) {
      setCurrentStepId(steps[currentIndex - 1]);
    }
  };

  // Wrapper functions for score calculation
  const calculateMaturityScores = (): CategoryScore => {
    return computeScores(profileData);
  };
  
  const getRecommendedAgents = (scores: CategoryScore): RecommendedAgents => {
    return determineRecommendedAgents(profileData, scores);
  };
  
  // Handle completion of the wizard
  const handleCompleteWizard = () => {
    const scores = calculateMaturityScores();
    const recommendedAgents = getRecommendedAgents(scores);
    onComplete(scores, recommendedAgents);
  };

  return {
    currentStepId,
    profileData,
    totalSteps,
    currentStepNumber,
    updateProfileData,
    handleNext,
    handlePrevious,
    calculateMaturityScores,
    getRecommendedAgents,
    handleCompleteWizard,
    isCurrentStepValid
  };
};
