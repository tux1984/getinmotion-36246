
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { WizardHeader } from './wizard-components/WizardHeader';
import { StepProgress } from './wizard-components/StepProgress';
import { WizardBackground } from './wizard-components/WizardBackground';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { WizardNavigation } from './wizard-components/WizardNavigation';
import { WizardStepContent } from './wizard-components/WizardStepContent';
import { useMaturityWizard } from './hooks/useMaturityWizard';

export const CulturalMaturityWizard: React.FC<{
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}> = ({ onComplete }) => {
  const { language } = useLanguage();
  
  const {
    currentStepId,
    profileData,
    totalSteps,
    currentStepNumber,
    updateProfileData,
    handleNext,
    handlePrevious,
    calculateMaturityScores,
    getRecommendedAgents,
    handleCompleteWizard,
    isCurrentStepValid
  } = useMaturityWizard(onComplete);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full mx-auto h-full flex flex-col"
    >
      <WizardHeader 
        step={currentStepNumber} 
        totalSteps={totalSteps} 
        language={language} 
        industry={profileData.industry} 
      />
      
      <div className="flex-1 flex flex-col p-4 md:p-8">
        <StepProgress 
          currentStep={currentStepNumber}
          totalSteps={totalSteps}
          language={language}
        />
        
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <WizardStepContent
            currentStepId={currentStepId}
            profileData={profileData}
            updateProfileData={updateProfileData}
            language={language}
            calculateMaturityScores={calculateMaturityScores}
            getRecommendedAgents={getRecommendedAgents}
            onComplete={handleCompleteWizard}
          />
        </div>
        
        <div className="z-10">
          <WizardNavigation
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={currentStepNumber === 1}
            isLastStep={currentStepId === 'results'}
            language={language}
            currentStepId={currentStepId}
            profileData={profileData}
            isValid={isCurrentStepValid()}
          />
        </div>
      </div>
    </motion.div>
  );
};
