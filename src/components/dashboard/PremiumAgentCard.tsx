
import React from 'react';
import { motion } from 'framer-motion';
import { Agent } from '@/types/dashboard';
import { ArrowRight, Zap } from 'lucide-react';

interface PremiumAgentCardProps {
  agent: Agent;
  language: 'en' | 'es';
  onSelect: () => void;
}

export const PremiumAgentCard: React.FC<PremiumAgentCardProps> = ({
  agent,
  language,
  onSelect
}) => {
  const t = {
    en: {
      chat: 'Chat',
      tasks: 'tasks active'
    },
    es: {
      chat: 'Chatear',
      tasks: 'tareas activas'
    }
  };

  const renderIcon = () => {
    if (typeof agent.icon === 'string') {
      return <span className="text-lg">{agent.icon}</span>;
    }
  
    if (React.isValidElement(agent.icon)) {
      return agent.icon;
    }

    // The type of agent.icon is ReactNode, which is too broad.
    // We cast to `unknown` first to safely convert to a component type, resolving the TS error.
    const IconComponent = agent.icon as unknown as React.ComponentType<{ className: string }>;
    
    // This runtime check ensures we only try to render if it's a function (i.e., a component).
    if (typeof IconComponent === 'function') {
      try {
        return <IconComponent className="w-5 h-5" />;
      } catch (e) {
        console.error("Failed to render icon component", e);
      }
    }
  
    // Fallback for all other cases or if rendering fails.
    return <Zap className="w-5 h-5" />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 cursor-pointer transition-all group"
    >
      <div className={`w-10 h-10 rounded-lg ${agent.color || 'bg-purple-500'} flex items-center justify-center text-white mr-3 group-hover:scale-110 transition-transform`}>
        {renderIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{agent.name}</div>
        <div className="text-xs text-gray-500">
          {agent.activeTasks || 0} {t[language].tasks}
        </div>
      </div>
      
      <div className="flex items-center text-purple-600 group-hover:text-purple-700">
        <span className="text-sm font-medium mr-1">{t[language].chat}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};
