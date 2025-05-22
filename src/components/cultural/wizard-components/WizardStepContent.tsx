
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { QuestionStep } from './QuestionStep';
import { getQuestions } from '../wizard-questions/questions';

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
  // Animation variants
  const pageVariants = {
    enter: {
      x: 100,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -100,
      opacity: 0
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
    <div className="min-h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial="enter"
          animate="center"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
