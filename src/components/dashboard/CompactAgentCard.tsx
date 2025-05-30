
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAgentTranslation } from '@/data/agentTranslations';
import { Play } from 'lucide-react';

interface CompactAgentCardProps {
  agent: {
    id: string;
    name: string;
    category: string;
    icon: string;
    color: string;
    isEnabled: boolean;
    usageCount: number;
  };
  onEnable: (agentId: string) => void;
  language: 'en' | 'es';
}

export const CompactAgentCard: React.FC<CompactAgentCardProps> = ({
  agent,
  onEnable,
  language
}) => {
  const translations = {
    en: {
      enable: "Enable",
      inactive: "Inactive"
    },
    es: {
      enable: "Habilitar",
      inactive: "Inactivo"
    }
  };

  const t = translations[language];
  const agentTranslation = getAgentTranslation(agent.id, language);

  return (
    <div className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 ${
      !agent.isEnabled ? 'opacity-60' : ''
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
          {agent.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">
            {agentTranslation.name}
          </h4>
          <p className="text-purple-200 text-xs">{agent.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${
            agent.isEnabled 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
              : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
          }`}>
            {agent.isEnabled ? agent.usageCount : t.inactive}
          </Badge>
          {!agent.isEnabled && (
            <Button 
              onClick={() => onEnable(agent.id)}
              size="sm"
              className="h-6 px-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 text-xs"
            >
              <Play className="w-3 h-3 mr-1" />
              {t.enable}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
