
import React from 'react';
import { ChatBox } from './hero/ChatBox';
import { ChatBoxesHeader } from './hero/ChatBoxesHeader';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { agents } from './hero/agentsData';
import { ChatBoxCarousel } from './hero/ChatBoxCarousel';
import { useIsMobile } from '@/hooks/use-mobile';

export const HeroChatBoxes = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="w-full max-w-full overflow-hidden pt-4 px-2">
        <ChatBoxesHeader language={language} />
        <ChatBoxCarousel language={language} />
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-full flex-grow relative pl-4 pr-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <ChatBoxesHeader language={language} />
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {agents.map((agent) => (
          <ChatBox 
            key={agent.id} 
            agent={agent}
            language={language}
          />
        ))}
      </div>
    </motion.div>
  );
};
