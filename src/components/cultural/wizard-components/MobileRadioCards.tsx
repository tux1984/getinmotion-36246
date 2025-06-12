
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';

interface RadioOption {
  id: string;
  label: string;
  value?: number | string;
  icon?: React.ReactNode;
}

interface MobileRadioCardsProps {
  options: RadioOption[];
  selectedValue?: number | string;
  onSelectionChange?: (value: number | string) => void;
  onChange?: (value: string) => void;
  name?: string;
  withIcons?: boolean;
}

export const MobileRadioCards: React.FC<MobileRadioCardsProps> = ({
  options,
  selectedValue,
  onSelectionChange,
  onChange,
  name,
  withIcons = false
}) => {
  const handleValueChange = (value: string) => {
    const option = options.find(opt => (opt.value || opt.id).toString() === value);
    if (option) {
      const finalValue = option.value || option.id;
      if (onSelectionChange) {
        onSelectionChange(finalValue);
      }
      if (onChange) {
        onChange(value);
      }
    }
  };

  return (
    <RadioGroup 
      value={selectedValue?.toString()} 
      onValueChange={handleValueChange}
      name={name}
      className="space-y-3"
    >
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <label className={`
            flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[60px]
            ${selectedValue?.toString() === (option.value || option.id).toString()
              ? 'border-purple-500 bg-purple-50 shadow-sm' 
              : 'border-gray-200 hover:border-purple-300 bg-white active:bg-purple-25'
            }
          `}>
            <RadioGroupItem
              value={(option.value || option.id).toString()}
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
      ))}
    </RadioGroup>
  );
};
