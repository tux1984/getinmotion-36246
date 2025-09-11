
import React from 'react';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcherButton } from '@/components/language/LanguageSwitcherButton';
import { LanguageSwitcherModal } from '@/components/language/LanguageSwitcherModal';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

import { Button } from '@/components/ui/button';
import { Menu, X, UserPlus, LogIn, Settings } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onAccessClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAccessClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen: isLanguageModalOpen, openModal: openLanguageModal, closeModal: closeLanguageModal } = useLanguageSwitcher();

  return (
    <header className="fixed top-6 left-6 right-6 z-50">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <MotionLogo variant="dark" size="lg" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <a 
            href="/agents" 
            className="group flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl border border-transparent hover:border-purple-200 hover:shadow-lg hover:scale-105 transform"
          >
            <span className="group-hover:scale-110 transition-transform duration-200">🤖</span>
            Agents
          </a>
          
          <a 
            href="/tiendas" 
            className="group flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl border border-transparent hover:border-purple-200 hover:shadow-lg hover:scale-105 transform"
          >
            <span className="group-hover:scale-110 transition-transform duration-200">🏪</span>
            Tiendas
          </a>
          
          <LanguageSwitcherButton onClick={openLanguageModal} />

          <Button
            onClick={() => window.location.href = '/login'}
            variant="outline"
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-md rounded-xl px-6 py-2 font-medium"
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            Login
          </Button>
          
          <Button
            onClick={onAccessClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-110 hover:shadow-xl transform hover:shadow-purple-500/25 active:scale-95"
          >
            <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            Get Access
          </Button>

          {/* Discrete Admin Link */}
          <a 
            href="/admin"
            className="group p-2 text-gray-400 hover:text-purple-600 transition-all duration-200 hover:scale-110 transform opacity-50 hover:opacity-100"
            title="Admin"
          >
            <Settings className="w-4 h-4" />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110 transform"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 space-y-3">
          <a 
            href="/agents" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 hover:bg-purple-50 rounded-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>🤖</span>
            Agents
          </a>

          <a 
            href="/tiendas" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 hover:bg-purple-50 rounded-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>🏪</span>
            Tiendas
          </a>

          <LanguageSwitcherButton 
            variant="mobile" 
            onClick={() => {
              openLanguageModal();
              setIsMenuOpen(false);
            }} 
          />

          <a 
            href="/login" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <LogIn className="w-4 h-4" />
            Login
          </a>
          
          
          <Button
            onClick={() => {
              onAccessClick();
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            Get Access
          </Button>

          {/* Admin link in mobile menu */}
          <a 
            href="/admin"
            className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-purple-600 text-sm transition-all duration-200 hover:bg-purple-50 rounded-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Admin
          </a>
        </div>
      )}
      
      <LanguageSwitcherModal 
        isOpen={isLanguageModalOpen} 
        onClose={closeLanguageModal} 
      />
    </header>
  );
};
