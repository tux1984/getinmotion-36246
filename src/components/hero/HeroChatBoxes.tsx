
import React from 'react';
import { Language } from './types';
import { getAgents } from './agentsData';
import { ChatBoxCarousel } from './ChatBoxCarousel';
import { ChatBoxesHeader } from './ChatBoxesHeader';

interface HeroChatBoxesProps {
  language: Language;
}

export const HeroChatBoxes: React.FC<HeroChatBoxesProps> = ({ language }) => {
  const agents = getAgents();

  return (
    <div className="w-full py-8 md:py-16 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 relative">
      {/* Overlay to hide background lines */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ChatBoxesHeader language={language} />
        <ChatBoxCarousel agents={agents} language={language} />
      </div>
    </div>
  );
};
