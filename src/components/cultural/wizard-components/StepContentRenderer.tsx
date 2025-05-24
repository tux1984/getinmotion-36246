
import React from 'react';
import { motion } from 'framer-motion';
import { ProfileTypeStep } from '../wizard-steps/ProfileTypeStep';
import { ProfileQuestionsStep } from '../wizard-steps/ProfileQuestionsStep';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { QuestionStep } from './QuestionStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { getQuestions } from '../wizard-questions/index';

// Animation variants for page transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    x: 30,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.98,
    transition: {
      duration: 0.2
    }
  }
};

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

interface StepContentRendererProps {
  currentStepId: WizardStepId;
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  calculateMaturityScores: () => CategoryScore;
  getRecommendedAgents: (scores: CategoryScore) => RecommendedAgents;
  onComplete: () => void;
  currentStepNumber: number;
  totalSteps: number;
  handleNext: () => void;
  handlePrevious: () => void;
  isCurrentStepValid: () => boolean;
}

export const StepContentRenderer: React.FC<StepContentRendererProps> = ({
  currentStepId,
  profileData,
  updateProfileData,
  language,
  calculateMaturityScores,
  getRecommendedAgents,
  onComplete,
  currentStepNumber,
  totalSteps,
  handleNext,
  handlePrevious,
  isCurrentStepValid
}) => {
  // Get question configuration based on current step
  const questions = getQuestions(language);
  const questionConfig = questions[currentStepId];
  
  // Select an image based on the current step
  const getStepImage = () => {
    // For the profile type selection step
    if (currentStepId === 'profileType') {
      return characterImages[0]; // Use the first character image for profile type
    }

    if (currentStepId === 'results') {
      return characterImages[2]; // Use design monster for results
    }
    
    // Use different characters for different profile types
    if (currentStepId === 'profileQuestions') {
      switch (profileData.profileType) {
        case 'idea':
          return characterImages[1]; // Creative monster for idea
        case 'solo':
          return characterImages[5]; // Business monster for solo
        case 'team':
          return characterImages[4]; // Planning monster for team
        default:
          return characterImages[0];
      }
    }
    
    // Fallback
    return characterImages[0];
  };

  // Render content based on the current step
  if (currentStepId === 'profileType') {
    return (
      <ProfileTypeStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  if (currentStepId === 'profileQuestions') {
    return (
      <ProfileQuestionsStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isStepValid={isCurrentStepValid()}
        illustration={getStepImage()}
      />
    );
  }

  if (currentStepId === 'results') {
    return (
      <ResultsStep 
        profileData={profileData}
        scores={calculateMaturityScores()}
        recommendedAgents={getRecommendedAgents(calculateMaturityScores())}
        language={language}
        onComplete={onComplete}
      />
    );
  }
  
  if (questionConfig) {
    return (
      <QuestionStep 
        question={questionConfig}
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        industry={profileData.industry}
        illustration={getStepImage()}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstStep={currentStepNumber === 1}
        currentStepId={currentStepId}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  return null;
};
