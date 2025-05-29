
export interface UserProfileData {
  profileType: 'solo' | 'idea' | 'team';
  industry: string;
  activities: string[];
  experience: string;
  paymentMethods: string | string[]; // Can be single or multiple
  brandIdentity: string;
  financialControl: string;
  teamStructure: string;
  taskOrganization: string | string[]; // Can be single or multiple
  decisionMaking: string;
  analysisPreference?: 'quick' | 'deep';
  // Extended questions for deep analysis
  pricingMethod: string;
  internationalSales: string;
  formalizedBusiness: string;
  collaboration: string | string[]; // Can be single or multiple
  economicSustainability: string;
}

export type WizardStepId = 
  | 'culturalProfile'
  | 'businessMaturity' 
  | 'managementStyle'
  | 'bifurcation'
  | 'extendedQuestions'
  | 'results';

export interface WizardHookReturn {
  currentStepId: WizardStepId;
  profileData: UserProfileData;
  totalSteps: number;
  currentStepNumber: number;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  calculateMaturityScores: () => any;
  getRecommendedAgents: (scores: any) => any;
  handleCompleteWizard: () => void;
  isCurrentStepValid: () => boolean;
  showBifurcation: boolean;
  analysisType: 'quick' | 'deep' | null;
  handleAnalysisChoice: (type: 'quick' | 'deep') => void;
}
