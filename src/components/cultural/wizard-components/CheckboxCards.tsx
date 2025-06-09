
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CheckboxCardsProps {
  options: Option[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
  withIcons?: boolean;
}

export const CheckboxCards: React.FC<CheckboxCardsProps> = ({
  options,
  selectedValues,
  onChange,
  withIcons = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option.id);
        
        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
            }`}
            onClick={() => onChange(option.id, !isSelected)}
          >
            <div className="p-4">
              {withIcons && option.icon && (
                <div className={`mb-3 flex justify-center ${
                  isSelected ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {option.icon}
                </div>
              )}
              
              <div className="text-center">
                <span className={`font-medium ${
                  isSelected ? 'text-purple-800' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
            
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onChange(option.id, !isSelected)}
              className="sr-only"
            />
          </motion.div>
        );
      })}
    </div>
  );
};
