
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Info } from 'lucide-react';
import { Agent } from '@/types/dashboard';
import { useIsMobile } from '@/hooks/use-mobile';

interface AgentCardProps {
  agent: Agent;
  onActionClick: (id: string, action: string) => void;
  language: 'en' | 'es';
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onActionClick, language }) => {
  const isMobile = useIsMobile();
  
  const statusColors = {
    active: 'bg-green-500',
    paused: 'bg-amber-400',
    inactive: 'bg-red-400'
  };
  
  const statusText = {
    en: {
      active: 'Active',
      paused: 'Paused',
      inactive: 'Inactive'
    },
    es: {
      active: 'Activo',
      paused: 'En pausa',
      inactive: 'Inactivo'
    }
  };
  
  const t = {
    en: {
      activeTasks: 'active tasks',
      lastUsed: 'Last used',
      activateAgent: 'Activate',
      pauseAgent: 'Pause',
      viewTasks: 'View tasks',
      enter: 'Enter',
      info: 'Info'
    },
    es: {
      activeTasks: 'tareas activas',
      lastUsed: 'Último uso',
      activateAgent: 'Activar',
      pauseAgent: 'Pausar',
      viewTasks: 'Ver tareas',
      enter: 'Entrar',
      info: 'Info'
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-all">
      {/* Left section with icon and info */}
      <div className="flex items-center">
        <div className="text-xl sm:text-2xl mr-2 sm:mr-3">{agent.icon}</div>
        <div>
          <div className="flex items-center">
            <h3 className="text-sm sm:text-base font-medium">{agent.name}</h3>
            <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]} ml-2`}></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">{agent.category}</p>
          {agent.lastUsed && (
            <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">
              {t[language].lastUsed}: {agent.lastUsed}
            </p>
          )}
        </div>
      </div>
      
      {/* Right section with actions */}
      <div className="flex items-center space-x-2 mt-3 sm:mt-0">
        {agent.status === 'active' && (
          <>
            <Button 
              size={isMobile ? "sm" : "default"}
              variant="default"
              className="bg-violet-600 hover:bg-violet-700 text-xs sm:text-sm"
              onClick={() => onActionClick(agent.id, 'enter')}
            >
              {t[language].enter}
            </Button>
            <Button 
              size={isMobile ? "sm" : "default"}
              variant="outline"
              className="border-gray-200"
              onClick={() => onActionClick(agent.id, 'pause')}
            >
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </>
        )}
        
        {agent.status === 'paused' && (
          <>
            <Button 
              size={isMobile ? "sm" : "default"}
              variant="default"
              className="bg-violet-600 hover:bg-violet-700 text-xs sm:text-sm"
              onClick={() => onActionClick(agent.id, 'activate')}
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {t[language].activateAgent}
            </Button>
            <Button 
              size={isMobile ? "sm" : "default"}
              variant="outline"
              className="border-gray-200 text-xs sm:text-sm"
              onClick={() => onActionClick(agent.id, 'viewTasks')}
            >
              {t[language].viewTasks}
            </Button>
          </>
        )}
        
        {agent.status === 'inactive' && (
          <>
            <Button 
              size={isMobile ? "sm" : "default"}
              variant="default"
              className="bg-violet-600 hover:bg-violet-700 text-xs sm:text-sm"
              onClick={() => onActionClick(agent.id, 'activate')}
            >
              {t[language].activateAgent}
            </Button>
            <Button 
              size={isMobile ? "sm" : "default"}
              variant="outline"
              className="border-gray-200"
              onClick={() => onActionClick(agent.id, 'info')}
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
