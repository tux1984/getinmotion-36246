
import React from 'react';
import { WelcomeStep } from './WelcomeStep';
import { ProfileQuestions } from './ProfileQuestions';
import { RecommendedAgentsStep } from './RecommendedAgentsStep';
import { ComparisonStep } from './ComparisonStep';
import { CompletionStep } from './CompletionStep';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';

interface OnboardingContentProps {
  currentStep: number;
  profileType: ProfileType;
  language: 'en' | 'es';
  showExtendedQuestions: boolean;
  maturityScores: CategoryScore | null;
  initialRecommendations: RecommendedAgents | null;
  handleNext: () => void;
  handleMaturityComplete: (scores: CategoryScore) => void;
  setInitialRecommendations: (recommendations: RecommendedAgents) => void;
  setShowExtendedQuestions: (show: boolean) => void;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const OnboardingContent: React.FC<OnboardingContentProps> = ({
  currentStep,
  profileType,
  language,
  showExtendedQuestions,
  maturityScores,
  initialRecommendations,
  handleNext,
  handleMaturityComplete,
  setInitialRecommendations,
  setShowExtendedQuestions,
  onComplete
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-0 mb-8 overflow-hidden">
      {currentStep === 0 && (
        <WelcomeStep 
          profileType={profileType}
          onNext={handleNext}
          language={language}
        />
      )}
      
      {currentStep === 1 && (
        <ProfileQuestions
          profileType={profileType}
          onComplete={(initialRecs) => {
            setInitialRecommendations(initialRecs);
            handleNext();
          }}
          showExtendedQuestions={false}
          language={language}
        />
      )}
      
      {currentStep === 2 && !showExtendedQuestions && (
        <RecommendedAgentsStep 
          profileType={profileType}
          maturityScores={null}
          initialRecommendations={initialRecommendations}
          onExtendedAnalysisRequested={() => {
            setShowExtendedQuestions(true);
            handleNext();
          }}
          onContinue={handleNext}
          language={language}
        />
      )}
      
      {currentStep === 2 && showExtendedQuestions && (
        <ProfileQuestions
          profileType={profileType}
          onComplete={(extendedRecs) => {
            // Create a new recommendations object with the extended property
            if (initialRecommendations) {
              const updatedRecommendations: RecommendedAgents = {
                ...initialRecommendations,
                extended: extendedRecs
              };
              setInitialRecommendations(updatedRecommendations);
            } else {
              // If initialRecommendations is null, create a new object with extended property
              const newRecommendations: RecommendedAgents = {
                admin: true,
                accounting: false,
                legal: false,
                operations: false,
                cultural: false,
                extended: extendedRecs
              };
              setInitialRecommendations(newRecommendations);
            }
            handleNext();
          }}
          showExtendedQuestions={true}
          language={language}
        />
      )}
      
      {currentStep === 3 && showExtendedQuestions && (
        <ComparisonStep 
          initialRecommendations={initialRecommendations}
          extendedRecommendations={initialRecommendations?.extended || null}
          onContinue={handleNext}
          language={language}
        />
      )}
      
      {((currentStep === 3 && !showExtendedQuestions) || (currentStep === 4 && showExtendedQuestions)) && (
        <CompletionStep 
          language={language}
          onComplete={() => onComplete(
            maturityScores || {
              ideaValidation: 20,
              userExperience: 15,
              marketFit: 10,
              monetization: 5
            }, 
            showExtendedQuestions && initialRecommendations?.extended 
              ? initialRecommendations.extended 
              : initialRecommendations || {
                  admin: true,
                  accounting: profileType !== 'idea',
                  legal: false,
                  operations: profileType === 'team',
                  cultural: true
                }
          )}
        />
      )}
    </div>
  );
};
