import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Briefcase, Clock, Rocket } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

const features = [
  {
    icon: Palette,
    title: "AI-Powered Creative Platform",
    description: "A comprehensive platform designed specifically for creators, with intelligent tools that understand your creative process.",
    gradient: "from-pink-400 to-purple-500"
  },
  {
    icon: Briefcase,
    title: "Business Management Suite",
    description: "Simplifies contracts, payments, publishing, and outreach. Everything you need to run your creative business.",
    gradient: "from-purple-400 to-indigo-500"
  },
  {
    icon: Clock,
    title: "Creative Time Protector",
    description: "Removes daily business friction so creators can focus on their art and impact without administrative burdens.",
    gradient: "from-indigo-400 to-blue-500"
  },
  {
    icon: Rocket,
    title: "Growth Partner",
    description: "Adaptive tools that evolve alongside your journey, unlocking new features as your creative business grows.",
    gradient: "from-blue-400 to-cyan-500"
  }
];

export const LoginFeatureSlider = () => {
  return (
    <div className="h-full flex flex-col justify-center p-8 lg:p-12">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-4">
          Welcome to GET IN MOTION
        </h2>
        <p className="text-lg text-indigo-200 opacity-90">
          The platform that empowers creators to build sustainable careers without sacrificing creative energy.
        </p>
      </div>

      <Carousel
        className="w-full max-w-md mx-auto lg:max-w-lg"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true
          }),
        ]}
      >
        <CarouselContent>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <CarouselItem key={index}>
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} mr-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-indigo-200 leading-relaxed flex-1">
                      {feature.description}
                    </p>
                    
                    {/* Decorative element */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        {/* Navigation buttons */}
        <CarouselPrevious className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20 -left-4" />
        <CarouselNext className="hidden sm:flex bg-white/10 border-white/20 text-white hover:bg-white/20 -right-4" />
      </Carousel>

      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-xl"></div>
    </div>
  );
};