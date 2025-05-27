
import React from 'react';
import { heroTranslations } from './hero/heroTranslations';
import { HeroBackground } from './hero/HeroBackground';
import { HeroContent } from './hero/HeroContent';
import { HeroImage } from './hero/HeroImage';
import { HeroChatBoxes } from './hero/HeroChatBoxes';
import { FeatureCards } from './hero/FeatureCards';

interface HeroSectionProps {
  language: 'en' | 'es';
  onJoinWaitlist: () => void;
}

export const HeroSection = ({ language, onJoinWaitlist }: HeroSectionProps) => {
  const t = heroTranslations[language];

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
      <HeroBackground />
      
      {/* Main hero content */}
      <div className="w-full py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <HeroContent 
              title={t.title}
              subtitle={t.subtitle}
              waitlist={t.waitlist}
              onJoinWaitlist={onJoinWaitlist}
            />
            
            <HeroImage />
          </div>
        </div>
      </div>
      
      {/* Chat boxes section integrated without gap */}
      <HeroChatBoxes language={language} />
      
      {/* Feature cards section integrated */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeatureCards 
            whatIsMotion={t.whatIsMotion}
            motionDescription={t.motionDescription}
            motionPurpose={t.motionPurpose}
            creativePlatform={t.creativePlatform}
            creativePlatformDesc={t.creativePlatformDesc}
            businessSuite={t.businessSuite}
            businessSuiteDesc={t.businessSuiteDesc}
            timeProtector={t.timeProtector}
            timeProtectorDesc={t.timeProtectorDesc}
            growthPartner={t.growthPartner}
            growthPartnerDesc={t.growthPartnerDesc}
          />
        </div>
      </div>
    </div>
  );
};
