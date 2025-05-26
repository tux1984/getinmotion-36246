
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
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 py-24 md:py-32 relative overflow-hidden">
      <HeroBackground />
      
      <div className="container mx-auto px-4 relative z-10">
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
      
      <HeroChatBoxes language={language} />
      
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
  );
};
