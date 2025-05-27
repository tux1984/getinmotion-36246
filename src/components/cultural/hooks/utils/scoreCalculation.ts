
import { UserProfileData } from '../../types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';

export const calculateMaturityScores = (profileData: UserProfileData): CategoryScore => {
  // Initialize scores
  let ideaValidation = 0;
  let userExperience = 0;
  let marketFit = 0;
  let monetization = 0;

  // Cultural Profile scoring
  if (profileData.industry) {
    ideaValidation += 20;
    marketFit += 15;
  }

  if (profileData.activities && profileData.activities.length > 0) {
    userExperience += 15;
    ideaValidation += 10;
  }

  // Business Maturity scoring
  if (profileData.experience) {
    switch (profileData.experience) {
      case 'beginner':
        ideaValidation += 10;
        break;
      case 'intermediate':
        ideaValidation += 20;
        userExperience += 15;
        break;
      case 'advanced':
        ideaValidation += 30;
        userExperience += 25;
        marketFit += 20;
        break;
    }
  }

  if (profileData.paymentMethods) {
    monetization += 25;
    marketFit += 15;
  }

  if (profileData.brandIdentity) {
    userExperience += 20;
    marketFit += 15;
  }

  // Management Style scoring
  if (profileData.financialControl) {
    monetization += 20;
  }

  if (profileData.teamStructure) {
    userExperience += 15;
    marketFit += 10;
  }

  if (profileData.taskOrganization) {
    userExperience += 15;
    ideaValidation += 10;
  }

  if (profileData.decisionMaking) {
    marketFit += 15;
    ideaValidation += 10;
  }

  // Extended questions bonus (for deep analysis)
  if (profileData.analysisPreference === 'deep') {
    if (profileData.pricingMethod) {
      monetization += 15;
    }
    if (profileData.internationalSales) {
      marketFit += 10;
    }
    if (profileData.formalizedBusiness) {
      monetization += 10;
      marketFit += 10;
    }
  }

  // Ensure scores don't exceed 100
  return {
    ideaValidation: Math.min(100, ideaValidation),
    userExperience: Math.min(100, userExperience),
    marketFit: Math.min(100, marketFit),
    monetization: Math.min(100, monetization)
  };
};

export const getRecommendedAgents = (profileData: UserProfileData, scores: CategoryScore): RecommendedAgents => {
  // Create recommendations compatible with both new and legacy formats
  const recommendations: RecommendedAgents = {
    primary: [],
    secondary: [],
    // Legacy format for backward compatibility
    admin: true, // Always recommend admin
    accounting: false,
    legal: false,
    operations: false,
    cultural: true // Always recommend cultural for cultural creators
  };

  // Determine primary recommendations based on lowest scores (areas needing most help)
  const scoresArray = [
    { category: 'finance-advisor', score: scores.monetization, legacy: 'accounting' },
    { category: 'legal', score: scores.marketFit, legacy: 'legal' },
    { category: 'operations', score: scores.userExperience, legacy: 'operations' },
    { category: 'cultural', score: scores.ideaValidation, legacy: 'cultural' }
  ];

  // Sort by lowest scores first (areas needing most help)
  scoresArray.sort((a, b) => a.score - b.score);

  // Always include admin and cultural in primary
  recommendations.primary = ['admin', 'cultural'];
  
  // Add the most needed agent to primary
  const mostNeeded = scoresArray[0];
  if (mostNeeded.category !== 'cultural') {
    recommendations.primary.push(mostNeeded.category);
    // Set legacy format
    (recommendations as any)[mostNeeded.legacy] = true;
  }

  // Add secondary recommendations
  recommendations.secondary = [];
  const secondaryNeeded = scoresArray.slice(1, 3);
  
  secondaryNeeded.forEach(item => {
    if (item.category !== 'cultural' && !recommendations.primary?.includes(item.category)) {
      recommendations.secondary?.push(item.category);
      // Set legacy format for potential secondary agents
      if (item.score < 40) { // Only recommend if score is low enough
        (recommendations as any)[item.legacy] = true;
      }
    }
  });

  // Enhanced recommendations for deep analysis
  if (profileData.analysisPreference === 'deep') {
    recommendations.extended = {
      ...recommendations
    };
  }

  console.log('Generated recommendations:', recommendations);
  return recommendations;
};
