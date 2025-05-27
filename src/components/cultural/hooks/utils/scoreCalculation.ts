
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
  // Determine recommended agents based on scores and profile
  const recommendations: RecommendedAgents = {
    primary: [],
    secondary: []
  };

  // Primary recommendations based on lowest scores (areas needing most help)
  const scoresArray = [
    { category: 'ideaValidation', score: scores.ideaValidation, agent: 'idea-validator' },
    { category: 'userExperience', score: scores.userExperience, agent: 'ux-designer' },
    { category: 'marketFit', score: scores.marketFit, agent: 'market-analyst' },
    { category: 'monetization', score: scores.monetization, agent: 'finance-advisor' }
  ];

  // Sort by lowest scores first
  scoresArray.sort((a, b) => a.score - b.score);

  // Recommend top 2 lowest scoring areas as primary
  recommendations.primary = scoresArray.slice(0, 2).map(item => item.agent);

  // Recommend next 2 as secondary
  recommendations.secondary = scoresArray.slice(2, 4).map(item => item.agent);

  return recommendations;
};
