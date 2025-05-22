
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <RadioGroup className={`grid ${compact ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-3`}>
      {options.map((option) => {
        const isSelected = selectedValue === option.id;
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            layout
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected 
                ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md' 
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
            }`}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <RadioGroupItem
                  id={`${name}-${option.id}`}
                  value={option.id}
                  checked={isSelected}
                  className="h-5 w-5"
                />
                
                {withIcons && option.icon && (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {option.icon}
                  </div>
                )}
                
                <Label
                  htmlFor={`${name}-${option.id}`}
                  className={`flex-1 cursor-pointer ${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}`}
                >
                  {option.label}
                </Label>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </RadioGroup>
  );
};
