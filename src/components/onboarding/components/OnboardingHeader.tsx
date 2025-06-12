
import React from 'react';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';

export const OnboardingHeader: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40 ${
      isMobile ? 'px-3 py-3' : 'px-4 py-4'
    }`}>
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex-shrink-0">
          <MotionLogo variant="dark" size={isMobile ? "sm" : "md"} />
        </div>
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};
