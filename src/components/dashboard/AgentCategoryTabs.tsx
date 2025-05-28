
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CulturalAgent } from '@/data/agentsDatabase';
import { AgentCard } from './AgentCard';

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
                <AgentCard
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
