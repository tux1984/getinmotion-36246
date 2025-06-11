
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Users, Settings, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface MobileBottomNavProps {
  language: 'en' | 'es';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ language }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const translations = {
    en: {
      dashboard: 'Dashboard',
      agents: 'Agents',
      analytics: 'Analytics',
      settings: 'Settings'
    },
    es: {
      dashboard: 'Panel',
      agents: 'Agentes',
      analytics: 'Analíticas',
      settings: 'Ajustes'
    }
  };

  const t = translations[language];

  const navItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: Home,
      path: '/dashboard',
      isActive: location.pathname === '/dashboard' || location.pathname === '/'
    },
    {
      id: 'agents',
      label: t.agents,
      icon: Users,
      path: '/agent-manager',
      isActive: location.pathname.includes('/agent')
    },
    {
      id: 'analytics',
      label: t.analytics,
      icon: BarChart3,
      path: '/maturity-calculator',
      isActive: location.pathname.includes('/maturity')
    },
    {
      id: 'settings',
      label: t.settings,
      icon: Settings,
      path: '/dashboard',
      isActive: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                item.isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
