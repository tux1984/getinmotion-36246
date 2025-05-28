
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CulturalAgent } from '@/data/agentsDatabase';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface AgentCategoryTabsProps {
  groupedAgents: Record<string, CulturalAgent[]>;
  getUserAgentData: (agentId: string) => any;
  isAgentRecommended: (agentId: string) => boolean;
  togglingAgents: Set<string>;
  onToggleAgent: (agentId: string, currentEnabled: boolean) => Promise<void>;
  formatLastUsed: (lastUsed: string | null) => string;
  getPriorityColor: (priority: string) => string;
  getImpactColor: (impact: number) => string;
  translations: any;
}

interface CulturalAgentCardProps {
  agent: CulturalAgent;
  userAgent: any;
  isEnabled: boolean;
  isRecommended: boolean;
  usageCount: number;
  lastUsed: string | null;
  isToggling: boolean;
  isRecentlyChanged: boolean | undefined;
  onToggleAgent: (agentId: string, currentEnabled: boolean) => Promise<void>;
  formatLastUsed: (lastUsed: string | null) => string;
  getPriorityColor: (priority: string) => string;
  getImpactColor: (impact: number) => string;
  translations: any;
}

const CulturalAgentCard: React.FC<CulturalAgentCardProps> = ({
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
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      isEnabled 
        ? 'bg-white border-purple-200 shadow-sm' 
        : 'bg-gray-50 border-gray-200'
    } ${isRecentlyChanged ? 'ring-2 ring-purple-300' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center text-white text-lg`}>
            {agent.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900">{agent.name}</h3>
              {isRecommended && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  {translations.recommended}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => onToggleAgent(agent.id, isEnabled)}
            disabled={isToggling}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          <Badge className={getPriorityColor(agent.priority)}>
            {translations.priority}: {agent.priority}
          </Badge>
          <Badge className={getImpactColor(agent.impact)}>
            {translations.impact}: {agent.impact}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <span>{translations.usageCount}: {usageCount}</span>
          <span>{translations.lastUsed}: {formatLastUsed(lastUsed)}</span>
        </div>
      </div>
      
      {isToggling && (
        <div className="mt-2 text-xs text-purple-600">
          {isEnabled ? translations.deactivating : translations.activating}
        </div>
      )}
    </div>
  );
};

export const AgentCategoryTabs: React.FC<AgentCategoryTabsProps> = ({
  groupedAgents,
  getUserAgentData,
  isAgentRecommended,
  togglingAgents,
  onToggleAgent,
  formatLastUsed,
  getPriorityColor,
  getImpactColor,
  translations
}) => {
  return (
    <Tabs defaultValue="Financiera" className="space-y-4">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6">
        {Object.keys(groupedAgents).map(category => (
          <TabsTrigger key={category} value={category} className="text-xs">
            {translations.categories[category as keyof typeof translations.categories]}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(groupedAgents).map(([category, agents]) => (
        <TabsContent key={category} value={category}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">
              {translations.categories[category as keyof typeof translations.categories]}
            </h3>
            <p className="text-sm text-gray-600">
              {agents.length} agentes en esta categoría • {agents.filter(agent => getUserAgentData(agent.id)?.is_enabled).length} activos
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {agents.map(agent => {
              const userAgent = getUserAgentData(agent.id);
              const isEnabled = userAgent?.is_enabled || false;
              const isRecommended = isAgentRecommended(agent.id);
              const usageCount = userAgent?.usage_count || 0;
              const lastUsed = userAgent?.last_used_at;
              const isToggling = togglingAgents.has(agent.id);
              const isRecentlyChanged = userAgent && new Date(userAgent.updated_at).getTime() > Date.now() - 5000;
              
              return (
                <CulturalAgentCard
                  key={agent.id}
                  agent={agent}
                  userAgent={userAgent}
                  isEnabled={isEnabled}
                  isRecommended={isRecommended}
                  usageCount={usageCount}
                  lastUsed={lastUsed}
                  isToggling={isToggling}
                  isRecentlyChanged={isRecentlyChanged}
                  onToggleAgent={onToggleAgent}
                  formatLastUsed={formatLastUsed}
                  getPriorityColor={getPriorityColor}
                  getImpactColor={getImpactColor}
                  translations={translations}
                />
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
