
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../../types/wizardTypes';

export type WizardStepId = 
  | 'profileType'  // First step to select profile type
  | 'profileQuestions' // Step for profile-specific questions
  | 'culturalProfile'  // Cultural profile step
  | 'businessMaturity' // Business maturity step
  | 'managementStyle'  // Management style step
  | 'bifurcation'      // Analysis choice step
  | 'extendedQuestions' // Extended questions for deep analysis
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
  // New properties for bifurcation
  showBifurcation?: boolean;
  analysisType?: 'quick' | 'deep' | null;
  handleAnalysisChoice?: (type: 'quick' | 'deep') => void;
}

export type WizardStep = {
  id: WizardStepId;
  baseStep?: boolean;
  detailedStep?: boolean;
}
