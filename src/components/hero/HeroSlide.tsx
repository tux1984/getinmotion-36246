
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSlideProps {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  imageAlt: string;
  onCtaClick: () => void;
  isLastSlide?: boolean;
}

export const HeroSlide: React.FC<HeroSlideProps> = ({
  title,
  subtitle,
  cta,
  image,
  imageAlt,
  onCtaClick,
  isLastSlide = false
}) => {
  return (
    <div className="w-full py-16 md:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="max-w-xl text-center md:text-left px-4 md:px-0">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-serif tracking-tight">
              {title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-6 md:mb-10 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex justify-center md:justify-start">
              <Button 
                size="lg"
                className={`border-none text-base sm:text-lg ${
                  isLastSlide 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                }`}
                onClick={onCtaClick}
              >
                {cta}
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
            {/* Enhanced glass morphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-indigo-600/30 rounded-xl blur-md -m-1 z-10"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/60 to-purple-600/60 rounded-xl blur-sm opacity-70 z-0"></div>
            
            {/* Main image container with enhanced styling */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl z-20 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent z-10"></div>
              <img 
                src={image}
                alt={imageAlt}
                className="w-full h-auto object-cover bg-indigo-900/80"
              />
              
              {/* Subtle overlay pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTIxMjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTMwIDMwYzAgMTYuNTY4LTEzLjQzMiAzMC0zMCAzMHYtNjBjMTYuNTY4IDAgMzAgMTMuNDMyIDMwIDMweiIgLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 mix-blend-overlay"></div>
            </div>
            
            {/* Enhanced musical notes decoration with subtle animation */}
            <div className="absolute -top-6 -right-6 text-pink-300/60 text-5xl opacity-70 rotate-12 animate-pulse" style={{animationDuration: '3s'}}>♪</div>
            <div className="absolute top-1/4 -left-8 text-indigo-300/60 text-4xl opacity-60 -rotate-6 animate-pulse" style={{animationDuration: '4s'}}>♫</div>
            <div className="absolute bottom-10 right-5 text-purple-300/60 text-6xl opacity-70 rotate-3 animate-pulse" style={{animationDuration: '5s'}}>♬</div>
            
            {/* Added decorative elements */}
            <div className="absolute top-10 right-10 w-20 h-1 bg-gradient-to-r from-pink-400/30 to-transparent rotate-45"></div>
            <div className="absolute bottom-20 left-5 w-16 h-1 bg-gradient-to-r from-indigo-400/30 to-transparent -rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
