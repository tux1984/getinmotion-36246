
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../../types/wizardTypes';

export type WizardStepId = 
  | 'industry' 
  | 'activities' 
  | 'experience'
  | 'paymentMethods'
  | 'brandIdentity'
  | 'financialControl'
  | 'teamStructure'
  | 'taskOrganization'
  | 'decisionMaking'
  | 'analysisChoice'
  | 'pricingMethod'
  | 'internationalSales'
  | 'formalizedBusiness'
  | 'collaboration'
  | 'economicSustainability'
  | 'results';

export interface WizardHookReturn {
  currentStepId: WizardStepId;
  profileData: UserProfileData;
  totalSteps: number;
  currentStepNumber: number;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  calculateMaturityScores: () => CategoryScore;
  getRecommendedAgents: (scores: CategoryScore) => RecommendedAgents;
  handleCompleteWizard: () => void;
  isCurrentStepValid: () => boolean;
}

export type WizardStep = {
  id: WizardStepId;
  baseStep?: boolean;
  detailedStep?: boolean;
}
