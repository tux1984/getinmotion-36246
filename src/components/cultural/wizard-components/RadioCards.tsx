
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
      className={`grid grid-cols-1 ${compact ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.id;
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex items-start p-5 rounded-2xl border-2 cursor-pointer ${
              isSelected
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-100 shadow-md'
                : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
            }`}
            onClick={() => onChange(option.id)}
            layout
          >
            <div className={`flex ${compact ? 'flex-row items-center' : 'flex-col md:flex-row md:items-center'} w-full`}>
              <div className="flex h-5 w-5 shrink-0 items-center justify-center mr-3 mt-1">
                <RadioGroupItem 
                  value={option.id} 
                  id={`${name}-${option.id}`} 
                  className="border-2 border-emerald-200 text-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                />
              </div>
              
              {withIcons && option.icon && (
                <div className={`${compact ? 'mr-3' : 'mb-3 md:mb-0 md:mr-3'} w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {option.icon}
                </div>
              )}
              
              <Label 
                htmlFor={`${name}-${option.id}`} 
                className={`cursor-pointer flex-1 text-lg ${isSelected ? 'text-emerald-900 font-medium' : 'text-gray-700'}`}
              >
                {option.label}
              </Label>
              
              {isSelected && !compact && (
                <div className="hidden md:flex ml-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                  </motion.div>
                </div>
              )}
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
    </RadioGroup>
  );
};
