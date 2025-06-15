
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WizardHeader } from '../wizard-components/WizardHeader';
import { WizardStepContent } from '../wizard-components/WizardStepContent';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';
import { AIAssistantIntegrated } from '@/components/assistant/AIAssistantIntegrated';

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
  showBifurcation?: boolean;
  analysisType?: 'quick' | 'deep' | null;
  handleAnalysisChoice?: (type: 'quick' | 'deep') => void;
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
  handleCompleteWizard,
  analysisType,
  handleAnalysisChoice
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden"
    >
      <WizardHeader 
        step={currentStepNumber} 
        totalSteps={totalSteps} 
        language={language} 
        industry={profileData.industry} 
      />
      
      <div className="flex-1 flex flex-col p-6 md:p-8 overflow-auto">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <WizardStepContent
              currentStepId={currentStepId}
              profileData={profileData}
              updateProfileData={updateProfileData}
              language={language}
              calculateMaturityScores={calculateMaturityScores}
              getRecommendedAgents={getRecommendedAgents}
              onComplete={handleCompleteWizard}
              currentStepNumber={currentStepNumber}
              totalSteps={totalSteps}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              isCurrentStepValid={isCurrentStepValid}
              analysisType={analysisType}
              handleAnalysisChoice={handleAnalysisChoice}
            />
          </AnimatePresence>
        </div>
        <AIAssistantIntegrated stepContext={currentStepId} />
      </div>
    </motion.div>
  );
};
