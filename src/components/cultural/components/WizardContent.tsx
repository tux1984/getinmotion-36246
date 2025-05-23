
import React from 'react';
import { motion } from 'framer-motion';
import { WizardHeader } from '../wizard-components/WizardHeader';
import { StepProgress } from '../wizard-components/StepProgress';
import { WizardNavigation } from '../wizard-components/WizardNavigation';
import { WizardStepContent } from '../wizard-components/WizardStepContent';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';

interface WizardContentProps {
  currentStepId: WizardStepId;
  currentStepNumber: number;
  totalSteps: number;
  profileData: UserProfileData;
  language: 'en' | 'es';
  isCurrentStepValid: () => boolean;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  calculateMaturityScores: () => any;
  getRecommendedAgents: (scores: any) => any;
  handleCompleteWizard: () => void;
}

export const WizardContent: React.FC<WizardContentProps> = ({
  currentStepId,
  currentStepNumber,
  totalSteps,
  profileData,
  language,
  isCurrentStepValid,
  updateProfileData,
  handleNext,
  handlePrevious,
  calculateMaturityScores,
  getRecommendedAgents,
  handleCompleteWizard
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col bg-white shadow-xl rounded-none overflow-hidden"
    >
      <WizardHeader 
        step={currentStepNumber} 
        totalSteps={totalSteps} 
        language={language} 
        industry={profileData.industry} 
      />
      
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-auto">
        {/* Step progress positioned before the content */}
        <div className="mb-6">
          <StepProgress 
            currentStep={currentStepNumber}
            totalSteps={totalSteps}
            language={language}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
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
        
        {/* Navigation outside of step content at bottom */}
        <div className="mt-8">
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
