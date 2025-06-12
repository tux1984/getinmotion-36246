
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface CheckboxOption {
  id: string;
  text: string;
  value: string;
}

interface CheckboxQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: CheckboxOption[];
}

interface CheckboxQuestionCardProps {
  question: CheckboxQuestion;
  selectedValues: string[];
  onSelectOption: (questionId: string, values: string[]) => void;
}

export const CheckboxQuestionCard: React.FC<CheckboxQuestionCardProps> = ({
  question,
  selectedValues,
  onSelectOption
}) => {
  const isMobile = useIsMobile();

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    let newValues: string[];
    
    if (checked) {
      newValues = [...selectedValues, optionValue];
    } else {
      newValues = selectedValues.filter(value => value !== optionValue);
    }
    
    onSelectOption(question.id, newValues);
  };

  return (
    <Card className="border-2 border-purple-100 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm">
      <CardContent className={`${isMobile ? 'pt-6 px-4 pb-4' : 'pt-8 px-8 pb-6'}`}>
        <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-purple-900 mb-2`}>
            {question.title}
          </h3>
          {question.subtitle && (
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {question.subtitle}
            </p>
          )}
        </div>
        
        <div className={`space-y-3 ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
          {question.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedValues.includes(option.value)
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
              } ${isMobile ? 'min-h-[52px]' : 'min-h-[60px]'}`}
              onClick={() => handleCheckboxChange(option.value, !selectedValues.includes(option.value))}
            >
              <Checkbox
                id={option.id}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <label 
                htmlFor={option.id} 
                className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 cursor-pointer leading-relaxed flex-1`}
              >
                {option.text}
              </label>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
