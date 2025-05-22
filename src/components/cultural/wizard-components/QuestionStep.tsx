
import React from 'react';
import { motion } from 'framer-motion';
import { StepContainer } from './StepContainer';
import { RadioCards } from './RadioCards';
import { CheckboxCards } from './CheckboxCards';
import { IconOption } from './IconOption';
import { UserProfileData } from '../types/wizardTypes';

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
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  profileData,
  updateProfileData,
  language,
  industry
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {question.options.map(option => (
              <IconOption
                key={option.id}
                id={option.id}
                label={option.label}
                icon={option.icon}
                selected={profileData[question.fieldName as keyof UserProfileData] === option.id}
                onClick={() => handleSingleSelect(option.id)}
              />
            ))}
          </div>
        );
      
      default:
        return <p>Question type not supported</p>;
    }
  };

  return (
    <StepContainer
      title={question.title}
      subtitle={question.subtitle}
      industry={industry}
      fullWidth={false}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {renderQuestionInput()}
      </motion.div>
    </StepContainer>
  );
};
