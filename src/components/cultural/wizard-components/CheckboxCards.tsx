
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
          <div
            key={option.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isSelected 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
            }`}
            onClick={() => onChange(option.id)}
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                id={option.id}
                checked={isSelected}
                onCheckedChange={() => onChange(option.id)}
              />
              {option.icon && (
                <div className={`text-${isSelected ? 'purple' : 'gray'}-600`}>
                  {option.icon}
                </div>
              )}
              <Label
                htmlFor={option.id}
                className={`flex-1 cursor-pointer ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}
              >
                {option.label}
              </Label>
            </div>
          </div>
        );
      })}
    </div>
  );
};
