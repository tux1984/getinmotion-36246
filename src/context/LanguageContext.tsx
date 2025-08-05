
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to get browser language preference
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  return browserLang.startsWith('es') ? 'es' : 'en';
};

// Helper to get stored language preference
const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('user-language');
  if (stored === 'en' || stored === 'es') return stored;
  
  return getBrowserLanguage();
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('user-language', newLanguage);
  };

  // Initialize language on mount
  useEffect(() => {
    const initialLanguage = getStoredLanguage();
    if (initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
