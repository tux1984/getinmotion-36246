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
  console.log('Generating recommendations for scores:', scores);
  
  // Create recommendations compatible with both new and legacy formats
  const recommendations: RecommendedAgents = {
    primary: ['admin', 'cultural'], // Always include these for cultural creators
    secondary: [],
    // Legacy format for backward compatibility
    admin: true,
    cultural: true,
    accounting: false,
    legal: false,
    operations: false
  };

  // Determine additional recommendations based on lowest scores (areas needing most help)
  const needsAssessment = [
    { category: 'accounting', score: scores.monetization, legacy: 'accounting' as const },
    { category: 'legal', score: scores.marketFit, legacy: 'legal' as const },
    { category: 'operations', score: scores.userExperience, legacy: 'operations' as const }
  ];

  // Sort by lowest scores first (areas needing most help)
  needsAssessment.sort((a, b) => a.score - b.score);

  // Add the most needed agent to primary if score is low enough
  const mostNeeded = needsAssessment[0];
  if (mostNeeded.score < 60) {
    recommendations.primary?.push(mostNeeded.category);
    (recommendations as any)[mostNeeded.legacy] = true;
  }

  // Add secondary recommendations for scores below 50
  needsAssessment.forEach(item => {
    if (item.score < 50 && !recommendations.primary?.includes(item.category)) {
      recommendations.secondary?.push(item.category);
      (recommendations as any)[item.legacy] = true;
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
