
import React from 'react';
import { Button } from '@/components/ui/button';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Link } from 'react-router-dom';

interface HeaderProps {
  translations: {
    navAgents: string;
    navAccess: string;
  };
  onAccessClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ translations, onAccessClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-indigo-950/80 border-b border-indigo-800/30 shadow-md">
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <MotionLogo variant="light" size="lg" />
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-indigo-900/40 p-2 rounded-lg">
            <LanguageSwitcher />
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Link to="/agents">
              <Button variant="ghost" className="text-indigo-100 hover:text-white hover:bg-indigo-800/50">
                {translations.navAgents}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="text-xs sm:text-sm md:text-base border-pink-500 text-pink-200 hover:bg-pink-900/30 hover:text-pink-100 px-2 sm:px-4"
              onClick={onAccessClick}
            >
              {translations.navAccess}
            </Button>
            <Link to="/admin">
              <Button 
                variant="ghost"
                size="icon"
                className="text-indigo-300 hover:text-white hover:bg-indigo-800/50 hidden sm:flex"
              >
                <span className="sr-only">Admin</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="m22 12-3-3m0 0-3 3m3-3v9"></path>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
