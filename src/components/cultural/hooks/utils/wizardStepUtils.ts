
import { WizardStepId } from '../types/wizardTypes';
import { UserProfileData } from '../../types/wizardTypes';
import { getQuestions } from '../../wizard-questions/index';

// Define the base steps (always shown)
export const baseSteps: WizardStepId[] = [
  'profileType', // First step for profile selection
  'results'      // Last step for results
];

// Define the steps for each profile type
export const ideaProfileSteps: WizardStepId[] = [
  'industry',
  'activities',
  'experience',
  'paymentMethods',
  'analysisChoice'
];

export const soloProfileSteps: WizardStepId[] = [
  'industry', 
  'activities', 
  'experience',
  'paymentMethods',
  'brandIdentity',
  'financialControl',
  'analysisChoice'
];

export const teamProfileSteps: WizardStepId[] = [
  'industry', 
  'activities', 
  'experience',
  'paymentMethods',
  'brandIdentity',
  'financialControl',
  'teamStructure',
  'taskOrganization',
  'decisionMaking',
  'analysisChoice'
];

// Define the detailed steps (shown only if detailed analysis is selected)
export const detailedSteps: WizardStepId[] = [
  'pricingMethod',
  'internationalSales',
  'formalizedBusiness',
  'collaboration',
  'economicSustainability'
];

// Get all steps based on profile type and analysis preference
export const getSteps = (profileData: UserProfileData, currentStepId: WizardStepId): WizardStepId[] => {
  if (!profileData.profileType || currentStepId === 'profileType') {
    // If no profile type selected or we're at the profile selection step, just return base steps
    return [...baseSteps];
  }
  
  // Get steps based on profile type
  let profileSteps: WizardStepId[] = [];
  switch (profileData.profileType) {
    case 'idea':
      profileSteps = [...ideaProfileSteps];
      break;
    case 'solo':
      profileSteps = [...soloProfileSteps];
      break;
    case 'team':
      profileSteps = [...teamProfileSteps];
      break;
    default:
      profileSteps = [];
  }
  
  // Fix: Explicitly type the array as WizardStepId[]
  let steps: WizardStepId[] = [
    'profileType',
    ...profileSteps,
    'results'
  ];
  
  // If user chose detailed analysis and has reached the analysis choice step
  if (
    profileData.analysisPreference === 'detailed' &&
    currentStepId !== 'results' &&
    profileSteps.indexOf('analysisChoice') >= 0 &&
    steps.indexOf(currentStepId) > steps.indexOf('analysisChoice')
  ) {
    // Fix: Ensure proper typing of concatenated arrays
    steps = [
      ...steps.slice(0, steps.indexOf('results')),
      ...detailedSteps,
      'results'
    ] as WizardStepId[];
  }
  
  // If user reached one of the detailed analysis steps
  if (detailedSteps.includes(currentStepId as any)) {
    // Fix: Ensure proper typing of concatenated arrays
    steps = [
      ...steps.slice(0, steps.indexOf('results')),
      ...detailedSteps,
      'results'
    ] as WizardStepId[];
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
  // Special case for profile type step
  if (currentStepId === 'profileType') {
    return !!profileData.profileType;
  }

  // For results step, always valid
  if (currentStepId === 'results') return true;
  
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
