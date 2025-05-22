
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
    <div className="mt-12 md:mt-24 max-w-5xl mx-auto px-4 relative z-10">
      <ChatBoxesHeader language={language} />
      
      <div className="relative rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/50 to-purple-900/50 z-10 rounded-xl"></div>
        <div className="bg-black/30 p-4 md:p-8 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
          <ChatBoxCarousel agents={agents} language={language} />
        </div>
      </div>
    </div>
  );
};
