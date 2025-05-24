
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
  
  // For profile questions step, check based on the profile type
  if (currentStepId === 'profileQuestions') {
    // This is simplified and should be expanded based on your validation needs
    return true; // We'll handle this differently in the ProfileQuestionStep component
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
