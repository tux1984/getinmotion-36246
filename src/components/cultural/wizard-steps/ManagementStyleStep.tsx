
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';
import { getManagementQuestions } from '../wizard-questions/managementQuestions';

interface ManagementStyleStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
}

export const ManagementStyleStep: React.FC<ManagementStyleStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isStepValid
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = getManagementQuestions(language);
  const currentQuestion = questions[currentQuestionIndex];

  const handleSingleSelect = (value: string) => {
    updateProfileData({ [currentQuestion.fieldName]: value });
  };

  const handleNext = () => {
    const totalQuestions = questions.length;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onPrevious();
    }
  };

  const isCurrentQuestionValid = () => {
    return !!profileData[currentQuestion.fieldName as keyof UserProfileData];
  };

  const t = {
    en: {
      step: `Step ${currentStepNumber} of ${totalSteps}`,
      question: `Question ${currentQuestionIndex + 1} of ${questions.length}`,
      previous: "Previous",
      next: "Next",
      continue: "Continue"
    },
    es: {
      step: `Paso ${currentStepNumber} de ${totalSteps}`,
      question: `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`,
      previous: "Anterior",
      next: "Siguiente",
      continue: "Continuar"
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const totalQuestions = questions.length;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
          {t[language].step}
        </span>
        <h2 className="text-2xl font-bold text-purple-800 mt-4 mb-2">{currentQuestion.title}</h2>
        {currentQuestion.subtitle && (
          <p className="text-gray-600">{currentQuestion.subtitle}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">{t[language].question}</p>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto">
        <RadioCards
          name={currentQuestion.id}
          options={currentQuestion.options}
          selectedValue={profileData[currentQuestion.fieldName as keyof UserProfileData] as string}
          onChange={handleSingleSelect}
          withIcons
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6 py-3"
        >
          {t[language].previous}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isCurrentQuestionValid()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3"
        >
          {currentQuestionIndex === (totalQuestions - 1) ? t[language].continue : t[language].next}
        </Button>
      </div>
    </div>
  );
};
