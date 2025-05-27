
import React from 'react';
import { Button } from '@/components/ui/button';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { BarChart3, RotateCcw } from 'lucide-react';

interface NewDashboardHeaderProps {
  onMaturityCalculatorClick: () => void;
}

export const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({
  onMaturityCalculatorClick
}) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      retakeAssessment: "Retake Maturity Assessment",
      help: "Help",
      account: "Account"
    },
    es: {
      retakeAssessment: "Repetir Evaluación de Madurez",
      help: "Ayuda",
      account: "Cuenta"
    }
  };
  
  const t = translations[language];

  return (
    <header className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-b border-purple-800/30 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <MotionLogo variant="light" className="py-1" />
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={onMaturityCalculatorClick}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {t.retakeAssessment}
          </Button>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="text-indigo-100 hover:text-white hover:bg-indigo-800/50">
              {t.help}
            </Button>
            <Button variant="ghost" size="sm" className="text-indigo-100 hover:text-white hover:bg-indigo-800/50">
              {t.account}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
