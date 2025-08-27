
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { useMaturityWizard } from './hooks/useMaturityWizard';
import { WizardContent } from './components/WizardContent';
import { UserProfileData } from './types/wizardTypes';
import { useTaskGenerationControl } from '@/hooks/useTaskGenerationControl';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

interface AIQuestion {
  question: string;
  context: string;
}

export const CulturalMaturityWizard: React.FC<{
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData, aiQuestions?: AIQuestion[]) => void;
}> = ({ onComplete }) => {
  const { language } = useLanguage();
  const { enableAutoGeneration } = useTaskGenerationControl();
  
  const handleMaturityComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData, aiQuestions?: AIQuestion[]) => {
    // Enable automatic task generation after maturity test completion
    console.log('🎯 Maturity test completed - enabling automatic task generation');
    enableAutoGeneration();
    
    // Call the original onComplete handler
    onComplete(scores, recommendedAgents, profileData, aiQuestions);
  };

  const compatibleLanguage = mapToLegacyLanguage(language);
  
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
    isCurrentStepValid,
    analysisType,
    handleAnalysisChoice
  } = useMaturityWizard(handleMaturityComplete, compatibleLanguage);

  return (
    <WizardContent
      currentStepId={currentStepId}
      currentStepNumber={currentStepNumber}
      totalSteps={totalSteps}
      profileData={profileData}
      language={compatibleLanguage}
      isCurrentStepValid={isCurrentStepValid}
      updateProfileData={updateProfileData}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      calculateMaturityScores={calculateMaturityScores}
      getRecommendedAgents={getRecommendedAgents}
      handleCompleteWizard={handleCompleteWizard}
      analysisType={analysisType}
      handleAnalysisChoice={handleAnalysisChoice}
    />
  );
};
