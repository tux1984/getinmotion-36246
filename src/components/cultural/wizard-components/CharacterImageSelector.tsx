
import { WizardStepId } from '../hooks/types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';

// Define the cute monster images array
const characterImages = [
  "/lovable-uploads/cfd16f14-72a3-4b55-bfd2-67adcd44eb78.png", // Community monster
  "/lovable-uploads/a2ebe4fd-31ed-43ec-9f9f-35fe6b529ad2.png", // Creative monster
  "/lovable-uploads/4da82626-7a63-45bd-a402-64023f2f2d44.png", // Design monster
  "/lovable-uploads/390caed4-1006-489e-9da8-b17d9f8fb814.png", // Finance monster
  "/lovable-uploads/c131a30d-0ce5-4b65-ae3c-5715f73e4f4c.png", // Planning monster
  "/lovable-uploads/aad610ec-9f67-4ed0-93dc-8c2b3e8f98d3.png", // Business monster
  "/lovable-uploads/e5849e7b-cac1-4c76-9858-c7d5222cce96.png", // Analytics monster
];

export const getStepImage = (
  currentStepId: WizardStepId,
  calculateMaturityScores?: () => CategoryScore
): string => {
  // For the profile type selection step
  if (currentStepId === 'profileType') {
    return characterImages[0]; // Use the community monster for profile type
  }

  // For the results step, use a character based on the highest score
  if (currentStepId === 'results' && calculateMaturityScores) {
    const scores = calculateMaturityScores();
    const categories = ['ideaValidation', 'userExperience', 'marketFit', 'monetization'];
    const highestCategory = categories.reduce((a, b) => 
      scores[a as keyof CategoryScore] > scores[b as keyof CategoryScore] ? a : b
    );
    
    // Map category to character
    switch(highestCategory) {
      case 'ideaValidation': return characterImages[1]; // Creative monster for idea validation
      case 'userExperience': return characterImages[2]; // Design monster for UX
      case 'marketFit': return characterImages[5]; // Business monster for market fit
      case 'monetization': return characterImages[3]; // Finance monster for monetization
      default: return characterImages[2]; // Default to design monster
    }
  }
  
  // For cultural profile steps, use different characters
  if (currentStepId === 'culturalProfile') {
    return characterImages[1]; // Creative monster for cultural profile
  }
  
  if (currentStepId === 'businessMaturity') {
    return characterImages[3]; // Finance monster for business maturity
  }
  
  if (currentStepId === 'managementStyle') {
    return characterImages[4]; // Planning monster for management
  }
  
  if (currentStepId === 'bifurcation') {
    return characterImages[6]; // Analytics monster for analysis choice
  }
  
  if (currentStepId === 'extendedQuestions') {
    return characterImages[1]; // Creative monster for extended questions
  }
  
  // Fallback
  return characterImages[0];
};
