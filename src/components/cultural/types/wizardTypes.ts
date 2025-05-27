
export type ProfileType = 'solo' | 'idea' | 'team' | 'cultural';

export interface UserProfileData {
  profileType: ProfileType;
  industry: string;
  activities: string[];
  experience: string;
  paymentMethods: string;
  brandIdentity: string;
  financialControl: string;
  teamStructure: string;
  taskOrganization: string;
  decisionMaking: string;
  analysisPreference?: 'quick' | 'deep';
  // Extended questions for deep analysis
  pricingMethod: string;
  internationalSales: string;
  formalizedBusiness: string;
  collaboration: string;
  economicSustainability: string;
}
