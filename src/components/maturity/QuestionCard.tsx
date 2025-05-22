
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Question } from './types';
import { QuestionOption } from './QuestionOption';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="text-2xl font-bold text-purple-900 mb-6">{question.question}</h4>
      
      <RadioGroup>
        <div className="grid gap-5">
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
    </motion.div>
  );
};
