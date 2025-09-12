
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Grid3X3 } from 'lucide-react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  language: 'en' | 'es';
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ language }) => {
  const { signOut } = useRobustAuth();

  const translations = {
    en: {
      dashboard: "Dashboard",
      viewAgents: "All Agents", 
      logout: "Logout"
    },
    es: {
      dashboard: "Dashboard",
      viewAgents: "Todos los Agentes",
      logout: "Cerrar Sesión"
    }
  };

  const t = translations[language];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
          <Link to="/agents">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              {t.viewAgents}
            </Button>
          </Link>
        </div>
        
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </Button>
      </div>
    </header>
  );
};
