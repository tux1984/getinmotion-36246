
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IdeaProfileQuestions } from '@/components/onboarding/components/questions/IdeaProfileQuestions';
import { SoloProfileQuestions } from '@/components/onboarding/components/questions/SoloProfileQuestions';
import { TeamProfileQuestions } from '@/components/onboarding/components/questions/TeamProfileQuestions';
import { StepContainer } from '../wizard-components/StepContainer';
import { StepProgress } from '../wizard-components/StepProgress';
import { WizardNavigation } from '../wizard-components/WizardNavigation';
import { UserProfileData } from '../types/wizardTypes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProfileQuestionsStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
  illustration: string;
}

export const ProfileQuestionsStep: React.FC<ProfileQuestionsStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isStepValid,
  illustration,
}) => {
  // State to track the current question index for the multi-step question forms
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Handle answers from profile-specific question components
  const handleAnswer = (questionId: string, value: any) => {
    updateProfileData({ [questionId]: value });
  };

  // Determine if we need to show extended questions based on user's preference
  const showExtendedQuestions = profileData.analysisPreference === 'detailed';
  
  const translations = {
    en: {
      title: "Profile Questions",
      subtitle: "Tell us about your creative project",
      idea: "Idea Development",
      solo: "Solo Creator",
      team: "Team Management",
      next: "Next",
      previous: "Previous",
      complete: "Continue",
      questionCount: (current: number, total: number) => `Question ${current} of ${total}`
    },
    es: {
      title: "Preguntas de Perfil",
      subtitle: "Cuéntanos sobre tu proyecto creativo",
      idea: "Desarrollo de Ideas",
      solo: "Creador Individual",
      team: "Gestión de Equipo",
      next: "Siguiente",
      previous: "Anterior",
      complete: "Continuar",
      questionCount: (current: number, total: number) => `Pregunta ${current} de ${total}`
    }
  };
  
  const t = translations[language];
  
  // Get the title based on profile type
  const getTitle = () => {
    switch (profileData.profileType) {
      case 'idea': return t.idea;
      case 'solo': return t.solo;
      case 'team': return t.team;
      default: return t.title;
    }
  };

  // Get the total number of questions based on profile type
  const getTotalQuestions = () => {
    switch (profileData.profileType) {
      case 'idea': return showExtendedQuestions ? 7 : 5;
      case 'solo': return showExtendedQuestions ? 7 : 5;
      case 'team': return showExtendedQuestions ? 7 : 5;
      default: return 5;
    }
  };

  // Check if we're at the last question
  const isLastQuestion = currentQuestionIndex === getTotalQuestions() - 1;
  
  // Handle next question or complete the step
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onNext();
      // Reset question index for when user comes back
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Handle previous question or go back to previous step
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onPrevious();
    }
  };
  
  return (
    <StepContainer title={getTitle()} subtitle={t.subtitle}>
      <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <StepProgress 
            currentStep={currentStepNumber} 
            totalSteps={totalSteps}
            language={language}
          />
          
          {/* Question counter badge */}
          <div className="mt-4">
            <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1.5 rounded-full">
              {t.questionCount(currentQuestionIndex + 1, getTotalQuestions())}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Content area for questions */}
          <div className="col-span-1 md:col-span-2 order-2 md:order-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              {profileData.profileType === 'idea' && (
                <IdeaProfileQuestions
                  currentQuestionIndex={currentQuestionIndex}
                  showExtendedQuestions={showExtendedQuestions}
                  answers={profileData}
                  onAnswer={handleAnswer}
                  language={language}
                />
              )}
              
              {profileData.profileType === 'solo' && (
                <SoloProfileQuestions
                  currentQuestionIndex={currentQuestionIndex}
                  showExtendedQuestions={showExtendedQuestions}
                  answers={profileData}
                  onAnswer={handleAnswer}
                  language={language}
                />
              )}
              
              {profileData.profileType === 'team' && (
                <TeamProfileQuestions
                  currentQuestionIndex={currentQuestionIndex}
                  showExtendedQuestions={showExtendedQuestions}
                  answers={profileData}
                  onAnswer={handleAnswer}
                  language={language}
                />
              )}
              
              {/* Navigation buttons for questions */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={handlePreviousQuestion}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.previous}
                </Button>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isStepValid}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLastQuestion ? t.complete : t.next}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Illustration area */}
          <div className="col-span-1 order-1 md:order-2">
            <div className="flex justify-center items-start md:items-center h-full sticky top-8">
              <motion.img
                src={illustration}
                alt="Character illustration"
                className="w-40 h-40 md:w-56 md:h-56 object-contain"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
        
        {/* We don't need this since we have in-page navigation now */}
        {/* <WizardNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          isFirstStep={false}
          isLastStep={false}
          language={language}
          currentStepId="profileQuestions"
          profileData={profileData}
          isValid={isStepValid}
        /> */}
      </div>
    </StepContainer>
  );
};
