
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
    <div className="w-full py-12 md:py-24 bg-gradient-to-br from-indigo-900/80 to-purple-900/80">
      <div className="container mx-auto px-4">
        <ChatBoxesHeader language={language} />
        <ChatBoxCarousel agents={agents} language={language} />
      </div>
    </div>
  );
};
