
import React from 'react';

interface IconOptionProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const IconOption: React.FC<IconOptionProps> = ({ 
  id, 
  icon, 
  label, 
  selected, 
  onSelect 
}) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center ${
        selected 
          ? 'border-purple-400 bg-purple-50' 
          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
      }`}
      onClick={() => onSelect(id)}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        selected ? 'bg-purple-100' : 'bg-gray-100'
      }`}>
        <div className={selected ? 'text-purple-600' : 'text-gray-600'}>
          {icon}
        </div>
      </div>
      <span className={`ml-3 font-medium ${selected ? 'text-purple-900' : 'text-gray-700'}`}>{label}</span>
    </div>
  );
};
