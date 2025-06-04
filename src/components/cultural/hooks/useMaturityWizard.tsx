
import { useState } from 'react';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId, WizardHookReturn } from './types/wizardTypes';
import { 
  isStepValid as checkStepValidity
} from './utils/wizardStepUtils';
import { 
  calculateMaturityScores as computeScores,
  getRecommendedAgents as determineRecommendedAgents
} from './utils/scoreCalculation';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

export type { WizardStepId } from './types/wizardTypes';

export const useMaturityWizard = (
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, aiRecommendations?: AIRecommendation[]) => void
): WizardHookReturn => {
  // Start with cultural profile step
  const [currentStepId, setCurrentStepId] = useState<WizardStepId>('culturalProfile');
  const [analysisType, setAnalysisType] = useState<'quick' | 'deep' | null>(null);
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    profileType: 'solo', // Default for cultural entrepreneurs
    industry: '',
    activities: [],
    experience: '',
    paymentMethods: '',
    brandIdentity: '',
    financialControl: '',
    teamStructure: '',
    taskOrganization: '',
    decisionMaking: '',
    analysisPreference: undefined,
    // Extended questions for deep analysis
    pricingMethod: '',
    internationalSales: '',
    formalizedBusiness: '',
    collaboration: '',
    economicSustainability: ''
  });
  
  // Define step sequence
  const stepSequence: WizardStepId[] = [
    'culturalProfile',    
    'businessMaturity',   
    'managementStyle',    
    'bifurcation',        
    'extendedQuestions',  
    'results'             
  ];
  
  const currentStepIndex = stepSequence.indexOf(currentStepId);
  const totalSteps = analysisType === 'deep' ? 6 : 5;
  const currentStepNumber = currentStepIndex + 1;
  
  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStepId === 'bifurcation') {
      return analysisType !== null;
    }
    return checkStepValidity(currentStepId, profileData);
  };
  
  // Update profile data
  const updateProfileData = (data: Partial<UserProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };
  
  // Handle navigation
  const handleNext = () => {
    if (currentStepId === 'bifurcation') {
      if (analysisType === 'quick') {
        setCurrentStepId('results');
      } else if (analysisType === 'deep') {
        setCurrentStepId('extendedQuestions');
      }
      updateProfileData({ analysisPreference: analysisType });
      return;
    }
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepSequence.length) {
      const nextStep = stepSequence[nextIndex];
      
      if (nextStep === 'extendedQuestions' && analysisType === 'quick') {
        setCurrentStepId('results');
      } else {
        setCurrentStepId(nextStep);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStepId === 'extendedQuestions') {
      setCurrentStepId('bifurcation');
      return;
    }
    
    if (currentStepId === 'results') {
      if (analysisType === 'deep') {
        setCurrentStepId('extendedQuestions');
      } else {
        setCurrentStepId('bifurcation');
      }
      return;
    }
    
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStepId(stepSequence[prevIndex]);
    }
  };

  // Score calculation functions
  const calculateMaturityScores = (): CategoryScore => {
    return computeScores(profileData);
  };
  
  const getRecommendedAgents = (scores: CategoryScore): RecommendedAgents => {
    return determineRecommendedAgents(profileData, scores);
  };
  
  // Handle completion
  const handleCompleteWizard = () => {
    const scores = calculateMaturityScores();
    const recommendedAgents = getRecommendedAgents(scores);
    onComplete(scores, recommendedAgents);
  };

  // Handle analysis choice
  const handleAnalysisChoice = (type: 'quick' | 'deep') => {
    setAnalysisType(type);
    updateProfileData({ analysisPreference: type });
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
    isCurrentStepValid,
    showBifurcation: true,
    analysisType,
    handleAnalysisChoice
  };
};
