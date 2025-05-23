
import React from 'react';
import { motion } from 'framer-motion';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { QuestionStep } from './QuestionStep';
import { getQuestions } from '../wizard-questions/questions';

// Define the image rotation array
const illustrationImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80"
];

interface WizardStepContentProps {
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

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
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
  // Enhanced animation variants
  const pageVariants = {
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

  // Get question configuration based on current step
  const questions = getQuestions(language);
  const questionConfig = questions[currentStepId];
  
  // Select an image based on the current step (rotate through the array)
  const getStepImage = () => {
    if (currentStepId === 'results') {
      return illustrationImages[2]; // Always use the third image for results
    }
    
    const stepKeys = Object.keys(questions);
    const stepIndex = stepKeys.indexOf(currentStepId);
    const imageIndex = stepIndex % illustrationImages.length;
    
    return illustrationImages[imageIndex];
  };

  // Render active step content
  const renderStepContent = () => {
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
    
    // Handle all question steps individually
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

  return (
    <motion.div
      key={currentStepId}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full min-h-[400px]"
    >
      {renderStepContent()}
    </motion.div>
  );
};
