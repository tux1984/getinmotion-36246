
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from './types';
import { motion } from 'framer-motion';

interface CheckboxQuestionCardProps {
  question: Question;
  selectedValues?: string[];
  onSelectOption: (questionId: string, values: string[]) => void;
}

export const CheckboxQuestionCard: React.FC<CheckboxQuestionCardProps> = ({ 
  question, 
  selectedValues = [], 
  onSelectOption 
}) => {
  const handleOptionChange = (optionId: string, isChecked: boolean) => {
    let newValues: string[];
    
    if (isChecked) {
      newValues = [...selectedValues, optionId];
    } else {
      newValues = selectedValues.filter(id => id !== optionId);
    }
    
    onSelectOption(question.id, newValues);
  };

  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="text-2xl font-bold text-purple-900 mb-6">{question.question}</h4>
      
      <div className="grid gap-5">
        {question.options.map(option => {
          const isSelected = selectedValues.includes(option.id);
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-100 shadow-md' 
                  : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
              }`}
              onClick={() => handleOptionChange(option.id, !isSelected)}
            >
              <div className="flex items-center space-x-4">
                <Checkbox
                  id={option.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                  className="h-5 w-5 border-2 border-emerald-200 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                />
                
                <Label
                  htmlFor={option.id}
                  className={`flex-1 cursor-pointer text-lg font-medium ${
                    isSelected ? 'text-emerald-900' : 'text-gray-700'
                  }`}
                >
                  {option.text}
                </Label>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
