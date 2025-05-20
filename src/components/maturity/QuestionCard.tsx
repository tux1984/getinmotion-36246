
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Question } from './types';
import { QuestionOption } from './QuestionOption';

interface QuestionCardProps {
  question: Question;
  selectedValue?: number;
  onSelectOption: (questionId: string, value: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  selectedValue, 
  onSelectOption 
}) => {
  return (
    <div className="py-4">
      <h4 className="text-lg font-medium mb-4">{question.question}</h4>
      
      <RadioGroup>
        <div className="grid gap-4">
          {question.options.map(option => (
            <QuestionOption
              key={option.id}
              option={option}
              questionId={question.id}
              isSelected={selectedValue === option.value}
              onSelect={onSelectOption}
            />
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
