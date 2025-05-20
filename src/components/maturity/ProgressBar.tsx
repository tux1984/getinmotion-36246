
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = ((current) / total) * 100;
  
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
