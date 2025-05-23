
import React from 'react';
import { Steps } from '@/components/ui/steps';

interface StepInfo {
  title: string;
  description: string;
}

interface StepsHeaderProps {
  currentStep: number;
  steps: StepInfo[];
}

export const StepsHeader: React.FC<StepsHeaderProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <Steps currentStep={currentStep} steps={steps} />
    </div>
  );
};
