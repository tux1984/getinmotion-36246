
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Settings, LogOut, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface NewDashboardHeaderProps {
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick?: () => void;
}

export const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({ 
  onMaturityCalculatorClick,
  onAgentManagerClick
}) => {
  const { signOut } = useAuth();
  const { language } = useLanguage();

  const translations = {
    en: {
      maturityCalculator: "Maturity Calculator",
      agentManager: "Agent Manager",
      settings: "Settings",
      signOut: "Sign Out"
    },
    es: {
      maturityCalculator: "Calculadora de Madurez",
      agentManager: "Gestor de Agentes",
      settings: "Configuración",
      signOut: "Cerrar Sesión"
    }
  };

  const t = translations[language];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <MotionLogo variant="dark" />
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onMaturityCalculatorClick}
            className="flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">{t.maturityCalculator}</span>
          </Button>
          
          {onAgentManagerClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAgentManagerClick}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{t.agentManager}</span>
            </Button>
          )}
          
          <LanguageSwitcher />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t.signOut}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
