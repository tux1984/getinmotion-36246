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
import { useSiteImages } from '@/hooks/useSiteImages';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSectionProps {
  language: 'en' | 'es';
  onJoinWaitlist: () => void;
}

export const HeroSection = ({ language, onJoinWaitlist }: HeroSectionProps) => {
  const t = heroTranslations[language];
  const { images: heroImages, isLoading: isLoadingImages } = useSiteImages('hero');

  const slides = React.useMemo(() => {
    return heroImages.map((image, index) => {
      // Usamos la 'key' de la base de datos, que es más fiable que el índice.
      const slideKey = image.key as keyof typeof t;
      const slideContentCandidate = t[slideKey];
      
      const defaultSlideContent = { title: 'Creative Power', subtitle: 'Unleash your potential with our tools.', cta: 'Learn More' };
      
      // Esto asegura que slideContent sea siempre un objeto, corrigiendo el error del operador spread.
      const slideContent = (typeof slideContentCandidate === 'object' && slideContentCandidate !== null && 'title' in slideContentCandidate)
        ? slideContentCandidate
        : defaultSlideContent;
      
      const isLastSlide = index === heroImages.length - 1;
      const action = isLastSlide ? onJoinWaitlist : () => {
        const valuePropEl = document.querySelector('[data-section="value-proposition"]');
        if (valuePropEl) {
          valuePropEl.scrollIntoView({ behavior: 'smooth' });
        }
      };

      return {
        ...slideContent,
        image: image.image_url,
        imageAlt: image.alt_text || slideContent.title,
        action: action,
        isLastSlide: isLastSlide,
      };
    });
  }, [heroImages, t, onJoinWaitlist]);

  const autoplay = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  if (isLoadingImages) {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden py-16 md:py-24">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl w-full space-y-6 text-center md:text-left">
                <Skeleton className="h-12 w-3/4 mx-auto md:mx-0" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
                <Skeleton className="h-12 w-40 mx-auto md:mx-0" />
              </div>
              <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
                <Skeleton className="w-full aspect-video" />
              </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 to-purple-900 relative overflow-hidden">
      <HeroBackground />
      
      <div className="relative z-10">
        <Carousel
          opts={{
            align: "start",
            loop: slides.length > 1,
          }}
          plugins={[autoplay.current]}
          className="w-full"
          onMouseEnter={() => slides.length > 1 && autoplay.current.stop()}
          onMouseLeave={() => slides.length > 1 && autoplay.current.reset()}
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
          
          {slides.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white z-20" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white z-20" />
            </>
          )}
        </Carousel>
      </div>
      
      <HeroChatBoxes language={language} />
      
      <div className="w-full py-12 md:py-16" id="product-explanation" data-section="value-proposition">
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
