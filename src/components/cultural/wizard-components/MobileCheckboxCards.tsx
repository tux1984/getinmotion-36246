
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

interface CheckboxOption {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
}

interface MobileCheckboxCardsProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onSelectionChange?: (values: string[]) => void;
  onChange?: (value: string, checked: boolean) => void;
  withIcons?: boolean;
}

export const MobileCheckboxCards: React.FC<MobileCheckboxCardsProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  onChange,
  withIcons = false
}) => {
  const handleCheckboxChange = (option: CheckboxOption, checked: boolean) => {
    const value = option.value || option.id;
    
    if (onChange) {
      onChange(value, checked);
    }
    
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedValues, value]);
      } else {
        onSelectionChange(selectedValues.filter(v => v !== value));
      }
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const value = option.value || option.id;
        const isSelected = selectedValues.includes(value);
        
        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <label className={`
              flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[60px]
              ${isSelected 
                ? 'border-purple-500 bg-purple-50 shadow-sm' 
                : 'border-gray-200 hover:border-purple-300 bg-white active:bg-purple-25'
              }
            `}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                className="w-5 h-5 flex-shrink-0"
              />
              {withIcons && option.icon && (
                <div className="flex-shrink-0 text-purple-600">
                  {option.icon}
                </div>
              )}
              <span className="flex-1 text-gray-800 font-medium text-base leading-relaxed">
                {option.label}
              </span>
            </label>
          </motion.div>
        );
      })}
    </div>
  );
};
