
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CulturalAgent } from '@/data/agentsDatabase';
import { Zap, Clock, Loader2 } from 'lucide-react';

interface AgentCardProps {
  agent: CulturalAgent;
  userAgent: any;
  isEnabled: boolean;
  isRecommended: boolean;
  usageCount: number;
  lastUsed: string | null;
  isToggling: boolean;
  isRecentlyChanged: boolean;
  onToggleAgent: (agentId: string, currentEnabled: boolean) => Promise<void>;
  formatLastUsed: (lastUsed: string | null) => string;
  getPriorityColor: (priority: string) => string;
  getImpactColor: (impact: number) => string;
  translations: {
    priority: string;
    impact: string;
    enabled: string;
    disabled: string;
    recommended: string;
    usageCount: string;
    lastUsed: string;
  };
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  userAgent,
  isEnabled,
  isRecommended,
  usageCount,
  lastUsed,
  isToggling,
  isRecentlyChanged,
  onToggleAgent,
  formatLastUsed,
  getPriorityColor,
  getImpactColor,
  translations
}) => {
  return (
    <Card className={`transition-all relative ${
      isEnabled ? 'ring-2 ring-purple-200 bg-purple-50/50' : ''
    } ${isRecentlyChanged ? 'ring-2 ring-green-300 shadow-green-200' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 font-medium">
            <Zap className="w-3 h-3 mr-1" />
            {translations.recommended}
          </Badge>
        </div>
      )}

      {isRecentlyChanged && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-black border-0 font-medium animate-pulse">
            {isEnabled ? 'Activado' : 'Desactivado'}
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center text-white text-xl shadow-lg`}>
              {agent.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {agent.code}
                </Badge>
              </div>
              <CardTitle className="text-base leading-tight">{agent.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={`text-xs ${getPriorityColor(agent.priority)}`}>
                  {translations.priority}: {agent.priority}
                </Badge>
                <Badge className={`text-xs ${getImpactColor(agent.impact)}`}>
                  {translations.impact}: {agent.impact}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isToggling && (
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            )}
            <Switch
              checked={isEnabled}
              onCheckedChange={() => onToggleAgent(agent.id, isEnabled)}
              disabled={isToggling}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-3">
          {agent.description}
        </CardDescription>
        
        {/* Usage Stats */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <span>{translations.usageCount}: {usageCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{translations.lastUsed}: {formatLastUsed(lastUsed)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Badge 
            variant={isEnabled ? "default" : "secondary"} 
            className={`text-xs ${isEnabled ? 'bg-green-100 text-green-800' : ''}`}
          >
            {isEnabled ? translations.enabled : translations.disabled}
          </Badge>
          {agent.profiles && (
            <div className="text-xs text-gray-500">
              Perfiles: {agent.profiles.length}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
