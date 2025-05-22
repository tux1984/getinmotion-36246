
import React from 'react';

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  title, 
  subtitle,
  children
}) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};
