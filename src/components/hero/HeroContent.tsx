
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroContentProps {
  title: string;
  subtitle: string;
  waitlist: string;
  learnMore: string;
  onJoinWaitlist: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ 
  title, subtitle, waitlist, learnMore, onJoinWaitlist 
}) => {
  return (
    <div className="max-w-xl text-center md:text-left px-4 md:px-0">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-serif tracking-tight">
        {title}
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-6 md:mb-10 leading-relaxed">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none text-base sm:text-lg"
          onClick={onJoinWaitlist}
        >
          {waitlist}
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="border-pink-300 text-pink-300 hover:bg-pink-900/20 text-base sm:text-lg"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {learnMore}
        </Button>
      </div>
    </div>
  );
};
