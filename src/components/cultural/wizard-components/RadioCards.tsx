
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';

interface RadioOption {
  id: string;
  text: string;
  value: number | string;
}

interface RadioCardsProps {
  options: RadioOption[];
  selectedValue?: number | string;
  onSelectionChange: (value: number | string) => void;
  title: string;
  description?: string;
}

export const RadioCards: React.FC<RadioCardsProps> = ({
  options,
  selectedValue,
  onSelectionChange,
  title,
  description
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-900 mb-3">{title}</h3>
        {description && (
          <p className="text-gray-600 text-lg">{description}</p>
        )}
      </div>
      
      <RadioGroup value={selectedValue?.toString()} onValueChange={(value) => {
        const option = options.find(opt => opt.value.toString() === value);
        if (option) {
          onSelectionChange(option.value);
        }
      }}>
        <div className="grid gap-4">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <label className={`
                flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedValue?.toString() === option.value.toString()
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-25'
                }
              `}>
                <RadioGroupItem
                  value={option.value.toString()}
                  className="w-5 h-5"
                />
                <span className="flex-1 text-gray-800 font-medium">
                  {option.text}
                </span>
              </label>
            </motion.div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
