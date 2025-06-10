
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';

interface CheckboxOption {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
}

interface CheckboxCardsProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onSelectionChange?: (values: string[]) => void;
  onChange?: (value: string, checked: boolean) => void;
  title?: string;
  description?: string;
  withIcons?: boolean;
}

export const CheckboxCards: React.FC<CheckboxCardsProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  onChange,
  title,
  description,
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
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-900 mb-3">{title}</h3>
          {description && (
            <p className="text-gray-600 text-lg">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid gap-4">
        {options.map((option, index) => {
          const value = option.value || option.id;
          const isSelected = selectedValues.includes(value);
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <label className={`
                flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-25'
                }
              `}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                  className="w-5 h-5"
                />
                {withIcons && option.icon && (
                  <div className="flex-shrink-0">
                    {option.icon}
                  </div>
                )}
                <span className="flex-1 text-gray-800 font-medium">
                  {option.label}
                </span>
              </label>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
