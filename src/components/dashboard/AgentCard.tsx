
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'inactive';
  category: string;
  activeTasks: number;
  lastUsed?: string;
  color: string;
  icon: React.ReactNode;
}

interface AgentCardProps {
  agent: Agent;
  onActionClick: (id: string, action: string) => void;
  language: 'en' | 'es';
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onActionClick, language }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-amber-100 text-amber-800 border-amber-200',
    inactive: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIndicators = {
    active: '🟢',
    paused: '🟡',
    inactive: '🔴'
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
    <Card className="p-6 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{agent.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base">{agent.name}</h3>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[agent.status]}>
            {statusIndicators[agent.status]} {statusText[language][agent.status]}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">• {t[language].lastUsed}: {agent.lastUsed || '-'}</p>
        <p className="text-sm text-gray-600">• {agent.category}</p>
        {agent.activeTasks > 0 && (
          <p className="text-sm text-gray-600">• {agent.activeTasks} {t[language].activeTasks}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {agent.status === 'active' && (
          <>
            <Button 
              size="sm" 
              variant="default" 
              onClick={() => onActionClick(agent.id, 'enter')}
            >
              {t[language].enter}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onActionClick(agent.id, 'pause')}
            >
              {t[language].pauseAgent}
            </Button>
          </>
        )}
        
        {agent.status === 'paused' && (
          <>
            <Button 
              size="sm" 
              variant="default" 
              onClick={() => onActionClick(agent.id, 'activate')}
            >
              {t[language].activateAgent}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onActionClick(agent.id, 'viewTasks')}
            >
              {t[language].viewTasks}
            </Button>
          </>
        )}
        
        {agent.status === 'inactive' && (
          <>
            <Button 
              size="sm" 
              variant="default" 
              onClick={() => onActionClick(agent.id, 'activate')}
            >
              {t[language].activateAgent}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onActionClick(agent.id, 'info')}
            >
              {t[language].info}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
