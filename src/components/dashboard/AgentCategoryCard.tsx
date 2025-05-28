
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Clock, Loader2 } from 'lucide-react';
import { CulturalAgent } from '@/data/agentsDatabase';

interface AgentCategoryCardProps {
  category: string;
  categoryName: string;
  agents: CulturalAgent[];
  activeCount: number;
  totalCount: number;
  recommendedCount: number;
  getUserAgentData: (agentId: string) => any;
  isAgentRecommended: (agentId: string) => boolean;
  onToggleAgent: (agentId: string, currentEnabled: boolean) => Promise<void>;
  togglingAgents: Set<string>;
  language: 'en' | 'es';
}

export const AgentCategoryCard: React.FC<AgentCategoryCardProps> = ({
  category,
  categoryName,
  agents,
  activeCount,
  totalCount,
  recommendedCount,
  getUserAgentData,
  isAgentRecommended,
  onToggleAgent,
  togglingAgents,
  language
}) => {
  const translations = {
    en: {
      active: "Active",
      inactive: "Inactive",
      activate: "Activate",
      deactivate: "Deactivate",
      recommended: "Recommended",
      usageCount: "uses",
      lastUsed: "Last used",
      never: "Never",
      activating: "Activating...",
      deactivating: "Deactivating..."
    },
    es: {
      active: "Activo",
      inactive: "Inactivo",
      activate: "Activar",
      deactivate: "Desactivar",
      recommended: "Recomendado",
      usageCount: "usos",
      lastUsed: "Último uso",
      never: "Nunca",
      activating: "Activando...",
      deactivating: "Desactivando..."
    }
  };

  const t = translations[language];

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
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">
            {categoryName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {activeCount}/{totalCount}
            </Badge>
            {recommendedCount > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                {recommendedCount} {t.recommended}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {agents.map(agent => {
          const userAgentData = getUserAgentData(agent.id);
          const isEnabled = Boolean(userAgentData?.is_enabled);
          const isToggling = togglingAgents.has(agent.id);
          const isRecommended = isAgentRecommended(agent.id);
          
          return (
            <div 
              key={agent.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isEnabled 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {agent.name}
                    </h4>
                    {isRecommended && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">
                        {t.recommended}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Badge className={`text-xs ${
                  isEnabled 
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isEnabled ? t.active : t.inactive}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{userAgentData?.usage_count || 0} {t.usageCount}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatLastUsed(userAgentData?.last_used_at)}</span>
                </div>
              </div>

              <Button
                onClick={() => onToggleAgent(agent.id, isEnabled)}
                disabled={isToggling}
                size="sm"
                className={`w-full text-xs ${
                  isEnabled
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isToggling ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    {isEnabled ? t.deactivating : t.activating}
                  </>
                ) : (
                  <>
                    {isEnabled ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        {t.deactivate}
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        {t.activate}
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
