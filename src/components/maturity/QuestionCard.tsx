
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuestionOption {
  id: string;
  text: string;
  value: number;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

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
  const isMobile = useIsMobile();

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
        
        <RadioGroup
          value={selectedValue?.toString()}
          onValueChange={(value) => onSelectOption(question.id, parseInt(value))}
          className={`space-y-3 ${isMobile ? 'space-y-2' : 'space-y-3'}`}
        >
          {question.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedValue === option.value
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
              } ${isMobile ? 'min-h-[52px]' : 'min-h-[60px]'}`}
              onClick={() => onSelectOption(question.id, option.value)}
            >
              <RadioGroupItem 
                value={option.value.toString()} 
                id={option.id}
                className="mt-1 border-2 border-purple-300 text-purple-600"
              />
              <Label 
                htmlFor={option.id} 
                className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 cursor-pointer leading-relaxed flex-1`}
              >
                {option.text}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
