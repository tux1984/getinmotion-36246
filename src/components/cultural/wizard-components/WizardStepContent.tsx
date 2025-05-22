
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { QuestionStep } from './QuestionStep';
import { getQuestions } from '../wizard-questions/questions';
import { ProfileStep } from '../wizard-steps/ProfileStep';

interface WizardStepContentProps {
  currentStepId: WizardStepId;
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  calculateMaturityScores: () => CategoryScore;
  getRecommendedAgents: (scores: CategoryScore) => RecommendedAgents;
  onComplete: () => void;
}

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
  currentStepId,
  profileData,
  updateProfileData,
  language,
  calculateMaturityScores,
  getRecommendedAgents,
  onComplete
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
    
    // Special handling for profile step
    if (currentStepId === 'industry' || currentStepId === 'activities' || currentStepId === 'experience') {
      return (
        <ProfileStep 
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
        />
      );
    }
    
    // Render individual question
    if (questionConfig) {
      return (
        <QuestionStep 
          question={questionConfig}
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
          industry={profileData.industry}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
