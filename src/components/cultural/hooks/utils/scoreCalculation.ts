
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../../types/wizardTypes';

// Compute maturity scores based on answers
export const calculateMaturityScores = (profileData: UserProfileData): CategoryScore => {
  let ideaValidation = 0;
  let userExperience = 0;
  let marketFit = 0;
  let monetization = 0;
  
  // Calculate idea validation score
  if (profileData.experience === 'more-than-2-years') {
    ideaValidation += 30;
  } else if (profileData.experience === '6-months-to-2-years') {
    ideaValidation += 20;
  } else {
    ideaValidation += 10;
  }
  
  if (profileData.brandIdentity === 'yes') {
    ideaValidation += 20;
  } else if (profileData.brandIdentity === 'somewhat') {
    ideaValidation += 10;
  }
  
  // Calculate user experience score
  if (profileData.activities.includes('classes') || 
      profileData.activities.includes('services')) {
    userExperience += 15;
  }
  
  if (profileData.brandIdentity === 'yes') {
    userExperience += 25;
  } else if (profileData.brandIdentity === 'somewhat') {
    userExperience += 15;
  }
  
  // Calculate market fit score
  if (profileData.activities.includes('selling-online') || 
      profileData.activities.includes('export')) {
    marketFit += 20;
  }
  
  if (profileData.teamStructure === 'team') {
    marketFit += 20;
  } else if (profileData.teamStructure === 'occasional') {
    marketFit += 10;
  }
  
  // Calculate monetization score
  if (profileData.paymentMethods === 'billing-system') {
    monetization += 25;
  } else if (profileData.paymentMethods === 'digital-platforms') {
    monetization += 15;
  } else if (profileData.paymentMethods === 'cash-or-transfer') {
    monetization += 5;
  }
  
  if (profileData.financialControl === 'detailed') {
    monetization += 25;
  } else if (profileData.financialControl === 'somewhat') {
    monetization += 15;
  } else {
    monetization += 5;
  }
  
  // Add more detailed analysis points if available
  if (profileData.analysisPreference === 'detailed') {
    if (profileData.pricingMethod === 'myself') {
      monetization += 10;
    }
    
    if (profileData.internationalSales === 'yes') {
      marketFit += 15;
    }
    
    if (profileData.formalizedBusiness === 'yes') {
      monetization += 10;
      marketFit += 10;
    }
    
    if (profileData.collaboration === 'yes') {
      userExperience += 10;
    }
    
    if (profileData.economicSustainability === 'yes') {
      marketFit += 10;
      monetization += 10;
    }
  }
  
  // Cap scores at 100
  return {
    ideaValidation: Math.min(100, ideaValidation),
    userExperience: Math.min(100, userExperience),
    marketFit: Math.min(100, marketFit),
    monetization: Math.min(100, monetization)
  };
};

// Determine recommended agents based on profile data and scores
export const getRecommendedAgents = (profileData: UserProfileData, scores: CategoryScore): RecommendedAgents => {
  const recommendedAgents: RecommendedAgents = {
    admin: false,
    accounting: false,
    legal: false,
    operations: false,
    cultural: false
  };
  
  // Admin is recommended if the user has a team or complex operations
  if (profileData.teamStructure === 'team' || 
      profileData.activities.length > 2 || 
      profileData.taskOrganization === 'digital-tools') {
    recommendedAgents.admin = true;
  }
  
  // Accounting is recommended if monetization is focus area
  if (scores.monetization < 50 || 
      profileData.financialControl !== 'detailed' || 
      profileData.activities.includes('export')) {
    recommendedAgents.accounting = true;
  }
  
  // Legal is recommended for formal businesses or international sales
  if (profileData.activities.includes('export') || 
      profileData.formalizedBusiness === 'yes' || 
      profileData.paymentMethods === 'billing-system') {
    recommendedAgents.legal = true;
  }
  
  // Operations is recommended for teams
  if (profileData.teamStructure === 'team' || 
      profileData.taskOrganization === 'digital-tools' ||
      profileData.activities.length > 3) {
    recommendedAgents.operations = true;
  }
  
  // Cultural agent is always recommended for cultural creators
  recommendedAgents.cultural = true;
  
  return recommendedAgents;
};
