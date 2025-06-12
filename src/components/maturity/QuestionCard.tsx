
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

  // Mobile version
  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3 leading-tight">
            {question.title}
          </h3>
          {question.subtitle && (
            <p className="text-gray-600 text-base leading-relaxed">
              {question.subtitle}
            </p>
          )}
        </div>
        
        <RadioGroup
          value={selectedValue?.toString()}
          onValueChange={(value) => onSelectOption(question.id, parseInt(value))}
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer min-h-[68px] ${
                selectedValue === option.value
                  ? 'border-purple-500 bg-purple-50 shadow-md scale-[1.02]'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm bg-white'
              }`}
              onClick={() => onSelectOption(question.id, option.value)}
            >
              <RadioGroupItem 
                value={option.value.toString()} 
                id={option.id}
                className="mt-1 border-2 border-purple-300 text-purple-600 flex-shrink-0 w-5 h-5"
              />
              <Label 
                htmlFor={option.id} 
                className="text-base text-gray-700 cursor-pointer leading-relaxed flex-1 ml-4 font-medium"
              >
                {option.text}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // Desktop version - keep existing
  return (
    <Card className="border-2 border-purple-100 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm">
      <CardContent className="pt-8 px-8 pb-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-purple-900 mb-2">
            {question.title}
          </h3>
          {question.subtitle && (
            <p className="text-gray-600 text-base">
              {question.subtitle}
            </p>
          )}
        </div>
        
        <RadioGroup
          value={selectedValue?.toString()}
          onValueChange={(value) => onSelectOption(question.id, parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-3 rounded-xl border-2 transition-all cursor-pointer min-h-[60px] ${
                selectedValue === option.value
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
              }`}
              onClick={() => onSelectOption(question.id, option.value)}
            >
              <RadioGroupItem 
                value={option.value.toString()} 
                id={option.id}
                className="mt-1 border-2 border-purple-300 text-purple-600"
              />
              <Label 
                htmlFor={option.id} 
                className="text-base text-gray-700 cursor-pointer leading-relaxed flex-1"
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
