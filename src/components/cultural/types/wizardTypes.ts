
export interface UserProfileData {
  profileType?: 'idea' | 'solo' | 'team';  // Added profileType field
  industry: string;
  activities: string[];
  experience: string;
  paymentMethods: string;
  brandIdentity: string;
  financialControl: string;
  teamStructure: string;
  taskOrganization: string;
  decisionMaking: string;
  analysisPreference?: 'quick' | 'detailed';
  pricingMethod?: string;
  internationalSales?: string;
  formalizedBusiness?: string;
  collaboration?: string;
  economicSustainability?: string;
}
