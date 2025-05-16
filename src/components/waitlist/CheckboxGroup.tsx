
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxGroupProps {
  title: string;
  options: { [key: string]: string };
  selectedValues: string[];
  onChange: (id: string, checked: boolean) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  title, 
  options, 
  selectedValues, 
  onChange 
}) => {
  return (
    <div>
      <Label className="mb-2 block">{title}</Label>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox 
              id={key} 
              checked={selectedValues.includes(key)}
              onCheckedChange={(checked) => onChange(key, checked as boolean)}
            />
            <Label htmlFor={key} className="cursor-pointer">
              {value}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
