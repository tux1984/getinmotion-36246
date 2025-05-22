
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { ChatBox } from './ChatBox';
import { Agent, Language } from './types';

interface ChatBoxCarouselProps {
  agents: Agent[];
  language: Language;
}

export const ChatBoxCarousel: React.FC<ChatBoxCarouselProps> = ({ agents, language }) => {
  // Create a plugin array with autoplay configuration
  const plugins = [
    Autoplay({
      delay: 4000, // 4 seconds delay between slides
      stopOnInteraction: true, // stop autoplay when user interacts with carousel
      stopOnMouseEnter: true, // pause on mouse hover
    }),
  ];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={plugins}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {agents.map((agent) => (
          <CarouselItem key={agent.id} className="pl-4 sm:basis-1/2 lg:basis-1/2 xl:basis-1/2">
            <ChatBox agent={agent} language={language} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-center mt-4 gap-2">
        <CarouselPrevious className="relative hover:bg-indigo-800/50 hover:text-indigo-100 border-indigo-500/50 text-indigo-300" />
        <CarouselNext className="relative hover:bg-indigo-800/50 hover:text-indigo-100 border-indigo-500/50 text-indigo-300" />
      </div>
    </Carousel>
  );
};
