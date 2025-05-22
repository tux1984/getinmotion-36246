
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CheckboxCardsProps {
  options: Option[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

export const CheckboxCards: React.FC<CheckboxCardsProps> = ({ 
  options, 
  selectedValues, 
  onChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected 
                ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md' 
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
            }`}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <Checkbox
                  id={option.id}
                  checked={isSelected}
                  onCheckedChange={() => onChange(option.id)}
                  className="h-5 w-5 border-2"
                />
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-sm"
                    layoutId="checkbox-highlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </div>
              
              {option.icon && (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isSelected 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {option.icon}
                </div>
              )}
              
              <Label
                htmlFor={option.id}
                className={`flex-1 cursor-pointer ${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}`}
              >
                {option.label}
              </Label>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
