
import React from 'react';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';
import { CategoryScore, ProfileType } from '@/components/maturity/types';

interface MaturityStepProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore) => void;
  onBack: () => void;
}

export const MaturityStep = ({ profileType, onComplete, onBack }: MaturityStepProps) => {
  const handleMaturityComplete = (scores: CategoryScore) => {
    onComplete(scores);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SimpleCulturalMaturityCalculator
        profileType={profileType}
        onComplete={handleMaturityComplete}
        onBack={onBack}
      />
    </div>
  );
};
