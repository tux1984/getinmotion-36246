
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
  onChange: (value: string, isChecked: boolean) => void;
  withIcons?: boolean;
}

export const CheckboxCards: React.FC<CheckboxCardsProps> = ({ 
  options, 
  selectedValues, 
  onChange,
  withIcons 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.id);
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            layout
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              isSelected 
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-100 shadow-md' 
                : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
            }`}
            onClick={() => onChange(option.id, !isSelected)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <Checkbox
                  id={option.id}
                  checked={isSelected}
                  onCheckedChange={() => onChange(option.id, !isSelected)}
                  className="h-5 w-5 border-2 border-emerald-200 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
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
              
              {option.icon && withIcons && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {option.icon}
                </div>
              )}
              
              <Label
                htmlFor={option.id}
                className={`flex-1 cursor-pointer text-lg ${isSelected ? 'text-emerald-900 font-medium' : 'text-gray-700'}`}
              >
                {option.label}
              </Label>
            </div>
            
            {isSelected && (
              <motion.div 
                className="absolute -inset-px rounded-2xl bg-emerald-300/10 blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
