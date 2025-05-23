
import React from 'react';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const OnboardingHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm flex justify-between items-center">
      <div className="flex-shrink-0">
        <MotionLogo variant="dark" size="sm" />
      </div>
      <div className="flex items-center">
        <LanguageSwitcher />
      </div>
    </div>
  );
};
