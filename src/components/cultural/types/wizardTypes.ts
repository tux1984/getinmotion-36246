
export type ProfileType = 'idea' | 'solo' | 'team';

export interface UserProfileData {
  profileType: ProfileType;
  
  // Cultural profile questions
  industry: string;
  activities: string[];
  experience: string;
  
  // Business maturity questions
  paymentMethods: string[];
  brandIdentity: string;
  financialControl: string;
  
  // Management style questions
  teamStructure: string;
  taskOrganization: string;
  decisionMaking: string;
  
  // Analysis preference
  analysisPreference?: 'quick' | 'deep';
  
  // Extended questions for deep analysis
  pricingMethod: string;
  internationalSales: string;
  formalizedBusiness: string;
  collaboration: string;
  economicSustainability: string;
  
  // Dynamic questions answers
  dynamicQuestionAnswers?: Record<string, string>;
}

export interface WizardStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious?: () => void;
  isStepValid: boolean;
}
