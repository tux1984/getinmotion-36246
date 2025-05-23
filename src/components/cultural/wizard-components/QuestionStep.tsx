
import React from 'react';
import { motion } from 'framer-motion';
import { StepContainer } from './StepContainer';
import { RadioCards } from './RadioCards';
import { CheckboxCards } from './CheckboxCards';
import { IconOption } from './IconOption';
import { UserProfileData } from '../types/wizardTypes';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export interface QuestionConfig {
  id: string;
  type: 'radio' | 'checkbox' | 'icon-select';
  title: string;
  subtitle?: string;
  fieldName: keyof UserProfileData | string;
  options: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    value?: string;
  }>;
}

interface QuestionStepProps {
  question: QuestionConfig;
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  industry?: string;
  illustration?: string;
  currentStepNumber?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  currentStepId?: string;
  isStepValid?: boolean;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  profileData,
  updateProfileData,
  language,
  industry,
  illustration,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isFirstStep,
  currentStepId,
  isStepValid = true
}) => {
  const handleSingleSelect = (value: string) => {
    // For radio buttons and icon selects
    updateProfileData({ [question.fieldName]: value } as any);
  };

  const handleMultiSelect = (value: string, isChecked: boolean) => {
    // For checkbox selections
    const currentValues = [...(profileData[question.fieldName as keyof UserProfileData] as string[] || [])];
    
    if (isChecked && !currentValues.includes(value)) {
      updateProfileData({ 
        [question.fieldName]: [...currentValues, value] 
      } as any);
    } else if (!isChecked && currentValues.includes(value)) {
      updateProfileData({ 
        [question.fieldName]: currentValues.filter(item => item !== value) 
      } as any);
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioCards
            name={question.id}
            options={question.options}
            selectedValue={profileData[question.fieldName as keyof UserProfileData] as string}
            onChange={handleSingleSelect}
            withIcons
          />
        );
      
      case 'checkbox':
        return (
          <CheckboxCards
            options={question.options}
            selectedValues={profileData[question.fieldName as keyof UserProfileData] as string[] || []}
            onChange={handleMultiSelect}
            withIcons
          />
        );
      
      case 'icon-select':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {question.options.map(option => (
              <IconOption
                key={option.id}
                id={option.id}
                label={option.label}
                icon={option.icon}
                selected={profileData[question.fieldName as keyof UserProfileData] === option.id}
                onClick={handleSingleSelect}
              />
            ))}
          </div>
        );
      
      default:
        return <p>Question type not supported</p>;
    }
  };
  
  // Sticky header with logo and language switcher
  const StickyHeader = () => (
    <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm flex justify-between items-center">
      <div className="flex-shrink-0">
        <MotionLogo variant="dark" size="sm" />
      </div>
      <div className="flex items-center">
        <LanguageSwitcher />
      </div>
    </div>
  );

  return (
    <StepContainer
      title={question.title}
      subtitle={question.subtitle}
      industry={industry}
      illustration={illustration}
      currentStep={currentStepNumber}
      totalSteps={totalSteps}
      language={language}
      showNavigation={!!onNext && !!onPrevious}
      onNext={onNext}
      onPrevious={onPrevious}
      isFirstStep={isFirstStep}
      currentStepId={currentStepId}
      profileData={profileData}
      isStepValid={isStepValid}
      className="w-full max-w-full"
      stickyHeader={<StickyHeader />}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="rounded-lg">
          {renderQuestionInput()}
        </div>
      </motion.div>
    </StepContainer>
  );
};
