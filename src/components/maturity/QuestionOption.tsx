
import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { QuestionOption as QuestionOptionType } from './types';

interface QuestionOptionProps {
  option: QuestionOptionType;
  questionId: string;
  isSelected: boolean;
  onSelect: (questionId: string, value: number) => void;
}

export const QuestionOption: React.FC<QuestionOptionProps> = ({ 
  option, 
  questionId, 
  isSelected, 
  onSelect
}) => {
  return (
    <div 
      key={option.id}
      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
        ${isSelected 
          ? 'border-purple-400 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-200'}`}
      onClick={() => onSelect(questionId, option.value)}
    >
      <RadioGroupItem 
        value={option.id} 
        id={option.id}
        checked={isSelected}
        className="mr-3"
      />
      <div className="flex items-center flex-1">
        {option.icon && <span className="mr-3 text-purple-600">{option.icon}</span>}
        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
          {option.text}
        </Label>
      </div>
      {isSelected && (
        <CheckCircle2 className="h-5 w-5 text-purple-600" />
      )}
    </div>
  );
};
