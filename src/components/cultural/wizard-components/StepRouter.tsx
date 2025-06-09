
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
import { DynamicQuestionsStep } from '../wizard-steps/DynamicQuestionsStep';

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
  
  // Fallback image in case the primary image fails
  const fallbackImage = '/lovable-uploads/4d2abc22-b792-462b-8247-6cc413c71b23.png';

  // Common layout with character image - Enhanced with better error handling
  const renderStepWithCharacter = (stepComponent: React.ReactNode) => (
    <div className="flex gap-8 items-start max-w-6xl mx-auto">
      {/* Character Image - Always visible on desktop */}
      <div className="w-1/3 flex-shrink-0 hidden md:block">
        <div className="sticky top-4">
          <OptimizedCharacterImage
            src={characterImage || fallbackImage}
            alt="Cultural assessment guide"
            className="w-full h-auto max-w-sm mx-auto rounded-lg shadow-sm"
            preloadNext={getStepImage('results', calculateMaturityScores)}
          />
        </div>
      </div>
      
      {/* Mobile Character Image - Smaller version */}
      <div className="w-full flex justify-center mb-6 md:hidden">
        <OptimizedCharacterImage
          src={characterImage || fallbackImage}
          alt="Cultural assessment guide"
          className="w-48 h-auto rounded-lg shadow-sm"
        />
      </div>
      
      {/* Step Content */}
      <div className="flex-1 min-w-0 md:w-2/3">
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

    case 'dynamicQuestions':
      return renderStepWithCharacter(
        <DynamicQuestionsStep
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
          illustration={characterImage || fallbackImage}
        />
      );
    
    default:
      return null;
  }
};
