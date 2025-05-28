
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CulturalAgent } from '@/data/agentsDatabase';
import { Zap, Loader2, Clock, Star } from 'lucide-react';
import './masonry.css';

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
      usageCount: "Uses",
      lastUsed: "Last used",
      never: "Never"
    },
    es: {
      active: "Activos",
      recommended: "Recomendado",
      priority: "Prioridad",
      impact: "Impacto",
      usageCount: "Usos",
      lastUsed: "Último uso",
      never: "Nunca"
    }
  };

  const t = translations[language];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-50 text-red-700 border-red-200';
      case 'Media-Alta': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Media': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Baja': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Muy Baja': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getImpactColor = (impact: number) => {
    switch (impact) {
      case 4: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 3: return 'bg-green-50 text-green-700 border-green-200';
      case 2: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 1: return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <Card className="h-fit bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">{
                category === 'Financiera' ? '💰' :
                category === 'Legal' ? '⚖️' :
                category === 'Diagnóstico' ? '🔍' :
                category === 'Comercial' ? '📈' :
                category === 'Operativo' ? '⚙️' :
                category === 'Comunidad' ? '🤝' : '🤖'
              }</span>
              {categoryName}
            </CardTitle>
            <div className="flex flex-wrap gap-1.5">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
                {activeCount} {t.active}
              </Badge>
              <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs px-2 py-0.5">
                {totalCount} total
              </Badge>
              {recommendedCount > 0 && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 text-xs px-1.5 py-0.5">
                  <Zap className="w-2.5 h-2.5 mr-0.5" />
                  {recommendedCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
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
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isEnabled 
                  ? 'bg-emerald-50/80 border-emerald-200 shadow-sm hover:shadow-md' 
                  : 'bg-white/60 border-gray-200 hover:border-gray-300 hover:bg-white/80'
              } ${isRecentlyChanged ? 'ring-1 ring-emerald-300 animate-pulse' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${agent.color} flex items-center justify-center text-white text-sm flex-shrink-0 shadow-sm`}>
                    {agent.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h4 className="font-medium text-sm text-gray-800 truncate">
                        {agent.name}
                      </h4>
                      {isRecommended && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 text-xs px-1 py-0">
                          <Star className="w-2 h-2" />
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 mb-1">
                      <Badge className={`text-xs px-1.5 py-0.5 ${getPriorityColor(agent.priority)}`}>
                        {agent.priority}
                      </Badge>
                      <Badge className={`text-xs px-1.5 py-0.5 ${getImpactColor(agent.impact)}`}>
                        <Star className="w-2 h-2 mr-0.5" />
                        {agent.impact}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 flex-shrink-0">
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
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                {agent.description}
              </p>
              
              {isEnabled && (
                <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50/50 rounded px-2 py-1">
                  <span className="font-medium">{t.usageCount}: {usageCount}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
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
