
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CulturalAgent } from '@/data/agentsDatabase';
import { Zap, Loader2, Clock } from 'lucide-react';

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
      recommended: "Recommended",
      priority: "Priority",
      impact: "Impact",
      activate: "Activate",
      deactivate: "Deactivate",
      usageCount: "Uses",
      lastUsed: "Last used",
      never: "Never"
    },
    es: {
      active: "Activos",
      recommended: "Recomendado",
      priority: "Prioridad", 
      impact: "Impacto",
      activate: "Activar",
      deactivate: "Desactivar",
      usageCount: "Usos",
      lastUsed: "Último uso",
      never: "Nunca"
    }
  };

  const t = translations[language];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media-Alta': return 'bg-orange-100 text-orange-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-blue-100 text-blue-800';
      case 'Muy Baja': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: number) => {
    switch (impact) {
      case 4: return 'bg-green-100 text-green-800';
      case 3: return 'bg-lime-100 text-lime-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    <Card className="h-full bg-gradient-to-br from-white to-gray-50/50 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800 mb-2">
              {categoryName}
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {activeCount} {t.active}
              </Badge>
              <Badge variant="outline" className="text-gray-600">
                {totalCount} total
              </Badge>
              {recommendedCount > 0 && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Zap className="w-3 h-3 mr-1" />
                  {recommendedCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {agents.map((agent) => {
          const userAgent = getUserAgentData(agent.id);
          const isEnabled = userAgent?.is_enabled || false;
          const isRecommended = isAgentRecommended(agent.id);
          const usageCount = userAgent?.usage_count || 0;
          const lastUsed = userAgent?.last_used_at;
          const isToggling = togglingAgents.has(agent.id);
          const isRecentlyChanged = userAgent && new Date(userAgent.updated_at).getTime() > Date.now() - 5000;
          
          return (
            <div
              key={agent.id}
              className={`p-3 rounded-lg border transition-all ${
                isEnabled 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              } ${isRecentlyChanged ? 'ring-2 ring-green-300 animate-pulse' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full ${agent.color} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                    {agent.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-800 truncate">
                        {agent.name}
                      </h4>
                      {isRecommended && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 text-xs px-1.5 py-0.5">
                          <Zap className="w-2.5 h-2.5" />
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 mb-1">
                      <Badge className={`text-xs px-1.5 py-0.5 ${getPriorityColor(agent.priority)}`}>
                        {agent.priority}
                      </Badge>
                      <Badge className={`text-xs px-1.5 py-0.5 ${getImpactColor(agent.impact)}`}>
                        ★{agent.impact}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isToggling && (
                    <Loader2 className="w-3 h-3 animate-spin text-purple-500" />
                  )}
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => onToggleAgent(agent.id, isEnabled)}
                    disabled={isToggling}
                    className="scale-75"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {agent.description}
              </p>
              
              {isEnabled && (
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{t.usageCount}: {usageCount}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatLastUsed(lastUsed)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
