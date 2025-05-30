
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock } from 'lucide-react';
import { getAgentTranslation } from '@/data/agentTranslations';

interface MediumAgentCardProps {
  agent: {
    id: string;
    name: string;
    category: string;
    icon: string;
    color: string;
    isEnabled: boolean;
    usageCount: number;
    lastUsed: string | null;
  };
  onEnable: (agentId: string) => void;
  language: 'en' | 'es';
  isRecommended?: boolean;
  recommendationReason?: string;
  isToggling?: boolean;
}

export const MediumAgentCard: React.FC<MediumAgentCardProps> = ({
  agent,
  onEnable,
  language,
  isRecommended = false,
  recommendationReason,
  isToggling = false
}) => {
  const translations = {
    en: {
      enable: "Enable",
      inactive: "Inactive",
      uses: "uses",
      lastUsed: "Last used",
      never: "Never",
      recommended: "Recommended"
    },
    es: {
      enable: "Habilitar",
      inactive: "Inactivo", 
      uses: "usos",
      lastUsed: "Último uso",
      never: "Nunca",
      recommended: "Recomendado"
    }
  };

  const t = translations[language];
  const agentTranslation = getAgentTranslation(agent.id, language);

  const formatLastUsed = (lastUsed: string | null) => {
    if (!lastUsed) return t.never;
    
    const date = new Date(lastUsed);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`group relative bg-white/8 backdrop-blur-xl border border-white/20 rounded-xl p-5 hover:bg-white/12 transition-all duration-300 hover:scale-102 hover:shadow-xl ${
      !agent.isEnabled ? 'opacity-70' : ''
    }`}>
      {isRecommended && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 font-medium">
            {t.recommended}
          </Badge>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg shadow-lg">
            {agent.icon}
          </div>
          <div>
            <h4 className="font-semibold text-white text-base group-hover:text-purple-200 transition-colors">
              {agentTranslation.name}
            </h4>
            <p className="text-purple-200 text-sm">{agent.category}</p>
          </div>
        </div>
        
        <Badge className={`text-xs ${
          agent.isEnabled 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
            : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
        }`}>
          {agent.isEnabled ? `${agent.usageCount} ${t.uses}` : t.inactive}
        </Badge>
      </div>

      {recommendationReason && (
        <div className="mb-3 p-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
          <p className="text-yellow-200 text-xs">{recommendationReason}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{t.lastUsed}: {formatLastUsed(agent.lastUsed)}</span>
        </div>
      </div>

      {!agent.isEnabled && (
        <Button 
          onClick={() => onEnable(agent.id)}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 rounded-lg font-medium transition-all duration-200 hover:scale-105"
          size="sm"
          disabled={isToggling}
        >
          <Play className="w-4 h-4 mr-2" />
          {t.enable}
        </Button>
      )}
    </div>
  );
};
