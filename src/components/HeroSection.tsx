
import React from 'react';
import { heroTranslations } from './hero/heroTranslations';
import { HeroBackground } from './hero/HeroBackground';
import { HeroSlide } from './hero/HeroSlide';
import { HeroChatBoxes } from './hero/HeroChatBoxes';
import { FeatureCards } from './hero/FeatureCards';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface HeroSectionProps {
  language: 'en' | 'es';
  onJoinWaitlist: () => void;
}

export const HeroSection = ({ language, onJoinWaitlist }: HeroSectionProps) => {
  const t = heroTranslations[language];

  // Slide data
  const slides = [
    {
      ...t.slide1,
      image: '/lovable-uploads/e8a28766-b792-4f42-a39b-4efa30630520.png',
      imageAlt: 'GET IN MOTION Platform for Creative Artists',
      action: () => {
        document.getElementById('user-profile-section')?.scrollIntoView({ behavior: 'smooth' });
      },
      isLastSlide: false
    },
    {
      ...t.slide2,
      image: '/lovable-uploads/29ee6c88-14b5-4d1e-a714-025b093eaaa7.png',
      imageAlt: 'AI-Powered Creative Tools',
      action: () => {
        document.getElementById('product-explanation')?.scrollIntoView({ behavior: 'smooth' });
      },
      isLastSlide: false
    },
    {
      ...t.slide3,
      image: '/lovable-uploads/e8a28766-b792-4f42-a39b-4efa30630520.png',
      imageAlt: 'Join Creative Community',
      action: onJoinWaitlist,
      isLastSlide: true
    }
  ];

  const autoplay = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
      <HeroBackground />
      
      {/* Carousel Hero Section */}
      <div className="relative z-10">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplay.current]}
          className="w-full"
          onMouseEnter={() => autoplay.current.stop()}
          onMouseLeave={() => autoplay.current.reset()}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <HeroSlide
                  title={slide.title}
                  subtitle={slide.subtitle}
                  cta={slide.cta}
                  image={slide.image}
                  imageAlt={slide.imageAlt}
                  onCtaClick={slide.action}
                  isLastSlide={slide.isLastSlide}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Controls */}
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white z-20" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white z-20" />
        </Carousel>
      </div>
      
      {/* Chat boxes section integrated without gap */}
      <HeroChatBoxes language={language} />
      
      {/* Feature cards section integrated */}
      <div className="w-full py-12 md:py-16" id="product-explanation">
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
