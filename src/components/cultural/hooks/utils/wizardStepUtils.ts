
import { WizardStepId } from '../types/wizardTypes';
import { UserProfileData } from '../../types/wizardTypes';
import { getQuestions } from '../../wizard-questions/index';

// Define the base steps (always shown)
export const baseSteps: WizardStepId[] = [
  'industry', 
  'activities', 
  'experience',
  'paymentMethods',
  'brandIdentity',
  'financialControl',
  'teamStructure',
  'taskOrganization',
  'decisionMaking',
  'analysisChoice',
  'results'
];

// Define the detailed steps (shown only if detailed analysis is selected)
export const detailedSteps: WizardStepId[] = [
  'pricingMethod',
  'internationalSales',
  'formalizedBusiness',
  'collaboration',
  'economicSustainability'
];

// Get all steps based on analysis preference
export const getSteps = (profileData: UserProfileData, currentStepId: WizardStepId): WizardStepId[] => {
  let steps = [...baseSteps];
  
  // If user chose detailed analysis and hasn't reached results yet
  if (
    profileData.analysisPreference === 'detailed' &&
    currentStepId !== 'results' &&
    baseSteps.indexOf(currentStepId) > baseSteps.indexOf('analysisChoice')
  ) {
    // Insert detailed steps before results
    steps = [
      ...baseSteps.slice(0, baseSteps.indexOf('results')),
      ...detailedSteps,
      'results'
    ];
  }
  
  // If user reached one of the detailed analysis steps
  if (detailedSteps.includes(currentStepId as any)) {
    steps = [
      ...baseSteps.slice(0, baseSteps.indexOf('results')),
      ...detailedSteps,
      'results'
    ];
  }
  
  return steps;
};

// Calculate current step number and total steps
export const getCurrentStepInfo = (profileData: UserProfileData, currentStepId: WizardStepId) => {
  const steps = getSteps(profileData, currentStepId);
  const currentStepIndex = steps.indexOf(currentStepId);
  const totalSteps = steps.length;
  
  return {
    currentStepNumber: currentStepIndex + 1,
    totalSteps,
    steps
  };
};

// Check if current step is valid (has been answered)
export const isStepValid = (currentStepId: WizardStepId, profileData: UserProfileData): boolean => {
  const language = 'en'; // Default to English
  const questions = getQuestions(language);
  const question = questions[currentStepId];
  
  if (!question || currentStepId === 'results') return true;
  
  switch (question.type) {
    case 'radio':
    case 'icon-select':
      return !!profileData[question.fieldName as keyof UserProfileData];
    case 'checkbox':
      return (profileData[question.fieldName as keyof UserProfileData] as string[] || []).length > 0;
    default:
      return true;
  }
};
