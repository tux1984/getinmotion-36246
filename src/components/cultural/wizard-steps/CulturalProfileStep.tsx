
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';
import { CheckboxCards } from '../wizard-components/CheckboxCards';
import { getProfileQuestions } from '../wizard-questions/profileQuestions';

interface CulturalProfileStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  isStepValid: boolean;
}

export const CulturalProfileStep: React.FC<CulturalProfileStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  isStepValid
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = getProfileQuestions(language);
  const questionsArray = Object.values(questions);
  const currentQuestion = questionsArray[currentQuestionIndex];

  console.log('CulturalProfileStep - questionsArray:', questionsArray);
  console.log('CulturalProfileStep - currentQuestion:', currentQuestion);
  console.log('CulturalProfileStep - currentQuestionIndex:', currentQuestionIndex);

  const handleSingleSelect = (value: string) => {
    if (currentQuestion) {
      console.log('CulturalProfileStep - handleSingleSelect:', value, currentQuestion.fieldName);
      updateProfileData({ [currentQuestion.fieldName]: value });
    }
  };

  const handleMultiSelect = (value: string, isChecked: boolean) => {
    if (!currentQuestion) return;
    
    const currentValues = [...(profileData[currentQuestion.fieldName as keyof UserProfileData] as string[] || [])];
    
    if (isChecked && !currentValues.includes(value)) {
      updateProfileData({ 
        [currentQuestion.fieldName]: [...currentValues, value] 
      });
    } else if (!isChecked && currentValues.includes(value)) {
      updateProfileData({ 
        [currentQuestion.fieldName]: currentValues.filter(item => item !== value) 
      });
    }
  };

  const handleNext = () => {
    const totalQuestions = questionsArray.length;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isCurrentQuestionValid = () => {
    if (!currentQuestion) return false;
    
    if (currentQuestion.type === 'radio') {
      return !!profileData[currentQuestion.fieldName as keyof UserProfileData];
    }
    if (currentQuestion.type === 'checkbox') {
      const values = profileData[currentQuestion.fieldName as keyof UserProfileData] as string[];
      return values && values.length > 0;
    }
    return false;
  };

  const t = {
    en: {
      step: `Step ${currentStepNumber} of ${totalSteps}`,
      question: `Question ${currentQuestionIndex + 1} of ${questionsArray.length}`,
      previous: "Previous",
      next: "Next",
      continue: "Continue"
    },
    es: {
      step: `Paso ${currentStepNumber} de ${totalSteps}`,
      question: `Pregunta ${currentQuestionIndex + 1} de ${questionsArray.length}`,
      previous: "Anterior",
      next: "Siguiente",
      continue: "Continuar"
    }
  };

  if (!currentQuestion) {
    console.log('CulturalProfileStep - No current question, questions:', questions);
    return <div>Loading questions...</div>;
  }

  if (!currentQuestion.options || currentQuestion.options.length === 0) {
    console.log('CulturalProfileStep - No options for question:', currentQuestion);
    return <div>No options available for this question.</div>;
  }

  const totalQuestions = questionsArray.length;

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
        {currentQuestion.type === 'radio' && (
          <RadioCards
            name={currentQuestion.id}
            options={currentQuestion.options}
            selectedValue={profileData[currentQuestion.fieldName as keyof UserProfileData] as string}
            onChange={handleSingleSelect}
            withIcons
          />
        )}
        
        {currentQuestion.type === 'checkbox' && (
          <CheckboxCards
            options={currentQuestion.options}
            selectedValues={profileData[currentQuestion.fieldName as keyof UserProfileData] as string[] || []}
            onChange={handleMultiSelect}
            withIcons
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
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
