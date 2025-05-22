
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProfileStep } from '../wizard-steps/ProfileStep';
import { BusinessStep } from '../wizard-steps/BusinessStep';
import { ManagementStep } from '../wizard-steps/ManagementStep';
import { AnalysisChoiceStep } from '../wizard-steps/AnalysisChoiceStep';
import { DetailedAnalysisStep } from '../wizard-steps/DetailedAnalysisStep';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStep } from '../hooks/useMaturityWizard';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';

interface WizardStepContentProps {
  currentStep: WizardStep;
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  calculateMaturityScores: () => CategoryScore;
  getRecommendedAgents: (scores: CategoryScore) => RecommendedAgents;
  onComplete: () => void;
}

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
  currentStep,
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

  // Render active step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'profile':
        return (
          <ProfileStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'business':
        return (
          <BusinessStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'management':
        return (
          <ManagementStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'analysis-choice':
        return (
          <AnalysisChoiceStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'detailed-analysis':
        return (
          <DetailedAnalysisStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'results':
        return (
          <ResultsStep 
            profileData={profileData}
            scores={calculateMaturityScores()}
            recommendedAgents={getRecommendedAgents(calculateMaturityScores())}
            language={language}
            onComplete={onComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
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
