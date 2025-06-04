
import React from 'react';
import { CulturalProfileStep } from '../wizard-steps/CulturalProfileStep';
import { BusinessMaturityStep } from '../wizard-steps/BusinessMaturityStep';
import { ManagementStyleStep } from '../wizard-steps/ManagementStyleStep';
import { BifurcationStep } from '../wizard-steps/BifurcationStep';
import { ExtendedQuestionsStep } from '../wizard-steps/ExtendedQuestionsStep';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { getStepImage } from './CharacterImageSelector';
import { OptimizedCharacterImage } from '../components/OptimizedCharacterImage';

interface StepRouterProps {
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
  analysisType?: 'quick' | 'deep' | null;
  handleAnalysisChoice?: (type: 'quick' | 'deep') => void;
}

export const StepRouter: React.FC<StepRouterProps> = ({
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
  isCurrentStepValid,
  analysisType,
  handleAnalysisChoice
}) => {
  const characterImage = getStepImage(currentStepId, calculateMaturityScores);

  // Common layout with character image
  const renderStepWithCharacter = (stepComponent: React.ReactNode) => (
    <div className="flex gap-8 items-start max-w-6xl mx-auto">
      {/* Character Image */}
      <div className="w-1/3 flex-shrink-0 hidden md:block">
        <OptimizedCharacterImage
          src={characterImage}
          alt="Character guide"
          className="w-full h-auto max-w-sm mx-auto"
        />
      </div>
      
      {/* Step Content */}
      <div className="flex-1 min-w-0">
        {stepComponent}
      </div>
    </div>
  );

  // Route to appropriate step component
  switch (currentStepId) {
    case 'culturalProfile':
      return renderStepWithCharacter(
        <CulturalProfileStep
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
          onNext={handleNext}
          isStepValid={isCurrentStepValid()}
        />
      );
    
    case 'businessMaturity':
      return renderStepWithCharacter(
        <BusinessMaturityStep
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isStepValid={isCurrentStepValid()}
        />
      );
    
    case 'managementStyle':
      return renderStepWithCharacter(
        <ManagementStyleStep
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isStepValid={isCurrentStepValid()}
        />
      );
    
    case 'bifurcation':
      return renderStepWithCharacter(
        <BifurcationStep
          profileData={profileData}
          language={language}
          selectedAnalysisType={analysisType}
          onAnalysisChoice={handleAnalysisChoice!}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
        />
      );
    
    case 'extendedQuestions':
      return renderStepWithCharacter(
        <ExtendedQuestionsStep
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isStepValid={isCurrentStepValid()}
        />
      );

    case 'results':
      return renderStepWithCharacter(
        <ResultsStep 
          profileData={profileData}
          scores={calculateMaturityScores()}
          recommendedAgents={getRecommendedAgents(calculateMaturityScores())}
          language={language}
          onComplete={onComplete}
          illustration={characterImage}
        />
      );
    
    default:
      return null;
  }
};
