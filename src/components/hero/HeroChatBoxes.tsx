
import React from 'react';
import { Language } from './types';
import { getAgents } from './agentsData';
import { ChatBoxCarousel } from './ChatBoxCarousel';
import { ChatBoxesHeader } from './ChatBoxesHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

interface HeroChatBoxesProps {
  language?: Language;
}

export const HeroChatBoxes: React.FC<HeroChatBoxesProps> = ({ language }) => {
  const agents = getAgents();
  const { t } = useTranslations();

  return (
    <div className="w-full py-8 md:py-12 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChatBoxesHeader language={language} />
        <ChatBoxCarousel agents={agents} language={language} />
        
        {/* CTA to view all agents */}
        <div className="text-center mt-8 md:mt-12">
          <Link to="/agents">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              {t.heroChatBoxes.viewAllAgents}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-indigo-200 text-sm mt-3">
            {t.heroChatBoxes.exploreComplete}
          </p>
        </div>
      </div>
    </div>
  );
};
