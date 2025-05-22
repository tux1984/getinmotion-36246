
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface RadioCardsProps {
  name: string;
  options: Option[];
  selectedValue?: string;
  onChange: (value: string) => void;
  withIcons?: boolean;
  compact?: boolean;
}

export const RadioCards: React.FC<RadioCardsProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  withIcons = false,
  compact = false
}) => {
  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={onChange}
      className={`grid grid-cols-1 ${compact ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-4`}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.id;
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex items-start p-6 rounded-2xl border-2 cursor-pointer ${
              isSelected
                ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-md'
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
            }`}
            onClick={() => onChange(option.id)}
            layout
          >
            <div className={`flex ${compact ? 'flex-row items-center' : 'flex-row items-center'} w-full`}>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center mr-3 mt-1">
                <RadioGroupItem 
                  value={option.id} 
                  id={`${name}-${option.id}`} 
                  className="border-2 border-purple-200 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
                />
              </div>
              
              {withIcons && option.icon && (
                <div className={`${compact ? 'mr-4' : 'mr-4'} w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {option.icon}
                </div>
              )}
              
              <Label 
                htmlFor={`${name}-${option.id}`} 
                className={`cursor-pointer flex-1 text-lg ${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}`}
              >
                {option.label}
              </Label>
              
              {isSelected && !compact && (
                <div className="hidden md:flex ml-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-purple-600" />
                  </motion.div>
                </div>
              )}
            </div>
            
            {isSelected && (
              <motion.div 
                className="absolute -inset-px rounded-2xl bg-purple-300/10 blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        );
      })}
    </RadioGroup>
  );
};
