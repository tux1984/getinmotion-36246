
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
    <div className="w-full py-8 md:py-12 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChatBoxesHeader language={language} />
        <ChatBoxCarousel agents={agents} language={language} />
      </div>
    </div>
  );
};
