
import { WizardStepId } from '../types/wizardTypes';
import { UserProfileData } from '../../types/wizardTypes';
import { getQuestions } from '../../wizard-questions/index';

// Define the base steps (always shown)
export const baseSteps: WizardStepId[] = [
  'profileType', // First step for profile selection
  'profileQuestions', // Step to show profile-specific questions
  'results'      // Last step for results
];

// Get all steps based on profile type
export const getSteps = (profileData: UserProfileData, currentStepId: WizardStepId): WizardStepId[] => {
  if (!profileData.profileType || currentStepId === 'profileType') {
    // If no profile type selected or we're at the profile selection step, just return base steps
    return [...baseSteps];
  }
  
  // Always return the same 3 steps: profile type selection, profile-specific questions, and results
  const steps: WizardStepId[] = [
    'profileType',
    'profileQuestions',
    'results'
  ];
  
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
  // Special case for profile type step
  if (currentStepId === 'profileType') {
    return !!profileData.profileType;
  }

  // For results step, always valid
  if (currentStepId === 'results') return true;
  
  // For bifurcation step, check if analysis type is selected
  if (currentStepId === 'bifurcation') {
    return !!profileData.analysisPreference;
  }
  
  // For extended questions step, check if all required fields are filled
  if (currentStepId === 'extendedQuestions') {
    return !!(profileData.pricingMethod && profileData.internationalSales && profileData.formalizedBusiness);
  }
  
  // For cultural profile questions
  if (currentStepId === 'culturalProfile') {
    return !!(profileData.industry && profileData.activities?.length > 0);
  }
  
  // For business maturity questions
  if (currentStepId === 'businessMaturity') {
    return !!(profileData.experience && profileData.paymentMethods && profileData.brandIdentity);
  }
  
  // For management style questions
  if (currentStepId === 'managementStyle') {
    return !!(profileData.financialControl && profileData.teamStructure && profileData.taskOrganization && profileData.decisionMaking);
  }
  
  // For profile questions step, check based on the profile type
  if (currentStepId === 'profileQuestions') {
    // This is simplified since the actual validation happens inside the ProfileQuestionsStep
    // component when moving between questions
    return true;
  }
  
  const language = 'en'; // Default to English
  const questions = getQuestions(language);
  const question = questions[currentStepId];
  
  if (!question) return true;
  
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
