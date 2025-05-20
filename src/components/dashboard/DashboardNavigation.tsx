
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

interface DashboardNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onMaturityCalculatorClick: () => void;
  language: 'en' | 'es';
}

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({ 
  activeSection, 
  onSectionChange,
  onMaturityCalculatorClick,
  language
}) => {
  const t = {
    en: {
      configureAccount: "Configure account",
      dashboard: "Dashboard",
      maturityCalculator: "Maturity Calculator",
    },
    es: {
      configureAccount: "Configurar cuenta",
      dashboard: "Dashboard",
      maturityCalculator: "Calculadora de Madurez",
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-2">
        <Button 
          variant={activeSection === 'dashboard' ? "default" : "ghost"} 
          size="sm"
          onClick={() => onSectionChange('dashboard')}
          className="flex items-center gap-2"
        >
          {t[language].dashboard}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onMaturityCalculatorClick}
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          {t[language].maturityCalculator}
        </Button>
      </div>
      
      <Button variant="outline" size="sm" className="text-sm">
        ⚙️ {t[language].configureAccount}
      </Button>
    </div>
  );
};
