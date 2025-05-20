
import React from 'react';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { MotionLogo } from '@/components/MotionLogo';
import { Home, BarChart3, Calendar, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onMaturityCalculatorClick: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeSection,
  onSectionChange,
  onMaturityCalculatorClick
}) => {
  const { language } = useLanguage();
  
  const t = {
    en: {
      search: "Search...",
      dashboard: "Dashboard",
      maturityCalculator: "Maturity Calculator",
      calendar: "Calendar",
      settings: "Settings",
      help: "Get Help",
      configureAccount: "Configure account"
    },
    es: {
      search: "Buscar...",
      dashboard: "Dashboard",
      maturityCalculator: "Calculadora de Madurez",
      calendar: "Calendario",
      settings: "Configuración",
      help: "Obtener Ayuda",
      configureAccount: "Configurar cuenta"
    }
  };
  
  const menuItems = [
    {
      title: t[language].dashboard,
      id: 'dashboard',
      icon: Home
    },
    {
      title: t[language].maturityCalculator,
      id: 'maturity',
      icon: BarChart3
    },
    {
      title: t[language].calendar,
      id: 'calendar',
      icon: Calendar
    },
    {
      title: t[language].settings,
      id: 'settings',
      icon: Settings
    }
  ];

  return (
    <Sidebar variant="inset" className="w-[280px]">
      <SidebarHeader className="flex items-center justify-between p-4">
        <MotionLogo />
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-4 mb-4">
          <Input
            placeholder={t[language].search}
            className="bg-gray-50"
          />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t[language].dashboard}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={() => {
                      if (item.id === 'maturity') {
                        onMaturityCalculatorClick();
                      } else {
                        onSectionChange(item.id);
                      }
                    }}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button variant="outline" size="sm" className="w-full text-sm">
          {t[language].help}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
