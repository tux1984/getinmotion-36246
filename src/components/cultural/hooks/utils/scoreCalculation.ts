
import { UserProfileData } from '../../types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';

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
  
  const recommendations: RecommendedAgents = {
    primary: [],
    secondary: []
  };

  // Siempre incluir agentes básicos de alta prioridad
  const highPriorityAgents = culturalAgentsDatabase.filter(agent => 
    agent.priority === 'Alta'
  ).map(agent => agent.id);
  
  recommendations.primary = [...highPriorityAgents];

  // Agregar agentes según puntuaciones bajas (necesitan más ayuda)
  const needsAssessment = [
    { category: 'cost-calculator', score: scores.monetization },
    { category: 'contract-generator', score: scores.marketFit },
    { category: 'maturity-evaluator', score: scores.ideaValidation },
    { category: 'export-advisor', score: scores.marketFit },
    { category: 'pricing-assistant', score: scores.monetization }
  ];

  // Ordenar por puntuaciones más bajas primero
  needsAssessment.sort((a, b) => a.score - b.score);

  // Agregar agentes más necesarios a primary
  needsAssessment.slice(0, 2).forEach(item => {
    if (item.score < 60 && !recommendations.primary?.includes(item.category)) {
      recommendations.primary?.push(item.category);
    }
  });

  // Agregar agentes secundarios basados en perfil y industria
  if (profileData.industry) {
    const industryAgents = culturalAgentsDatabase.filter(agent => 
      agent.profiles?.includes(profileData.industry) && 
      !recommendations.primary?.includes(agent.id)
    ).slice(0, 3).map(agent => agent.id);
    
    recommendations.secondary = [...(recommendations.secondary || []), ...industryAgents];
  }

  // Agregar agentes de prioridad media para completar recomendaciones
  const mediumPriorityAgents = culturalAgentsDatabase.filter(agent => 
    (agent.priority === 'Media' || agent.priority === 'Media-Alta') &&
    !recommendations.primary?.includes(agent.id) &&
    !recommendations.secondary?.includes(agent.id)
  ).slice(0, 4).map(agent => agent.id);

  recommendations.secondary = [...(recommendations.secondary || []), ...mediumPriorityAgents];

  // Mantener compatibilidad con formato legacy
  recommendations.admin = true;
  recommendations.cultural = true;
  recommendations.accounting = recommendations.primary?.includes('cost-calculator') || recommendations.secondary?.includes('income-calculator');
  recommendations.legal = recommendations.primary?.includes('contract-generator') || recommendations.secondary?.includes('collaboration-agreement');
  recommendations.operations = recommendations.primary?.includes('collaborator-management') || recommendations.secondary?.includes('stakeholder-matching');

  console.log('Generated recommendations:', recommendations);
  return recommendations;
};
