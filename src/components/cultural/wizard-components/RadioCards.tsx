
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

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
          <div
            key={option.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isSelected 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
            }`}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  id={`${name}-${option.id}`}
                  value={option.id}
                  checked={isSelected}
                />
                
                {withIcons && option.icon && (
                  <div className={`text-${isSelected ? 'purple' : 'gray'}-500`}>
                    {option.icon}
                  </div>
                )}
                
                <Label
                  htmlFor={`${name}-${option.id}`}
                  className={`cursor-pointer ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}
                >
                  {option.label}
                </Label>
              </div>
              
              {isSelected && (
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
              )}
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};
