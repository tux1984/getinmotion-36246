
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase, CulturalAgent } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { Zap, Clock, Loader2 } from 'lucide-react';

interface AgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
  language: 'en' | 'es';
}

export const AgentManager: React.FC<AgentManagerProps> = ({
  currentAgents,
  onAgentToggle,
  language
}) => {
  const { agents: userAgents, loading } = useUserData();
  const [togglingAgents, setTogglingAgents] = useState<Set<string>>(new Set());

  const translations = {
    en: {
      title: "Agent Manager",
      subtitle: "Activate and manage your AI agents",
      categories: {
        Financiera: "Financial",
        Legal: "Legal",
        Diagnóstico: "Diagnostic",
        Comercial: "Commercial",
        Operativo: "Operations",
        Comunidad: "Community"
      },
      priority: "Priority",
      impact: "Impact",
      enabled: "Enabled",
      disabled: "Disabled",
      activate: "Activate",
      deactivate: "Deactivate",
      allAgents: "All Agents",
      recommended: "Recommended",
      usageCount: "Usage count",
      lastUsed: "Last used",
      never: "Never",
      activating: "Activating...",
      deactivating: "Deactivating..."
    },
    es: {
      title: "Gestor de Agentes",
      subtitle: "Activa y gestiona tus agentes IA",
      categories: {
        Financiera: "Financiera",
        Legal: "Legal",
        Diagnóstico: "Diagnóstico",
        Comercial: "Comercial",
        Operativo: "Operativo",
        Comunidad: "Comunidad"
      },
      priority: "Prioridad",
      impact: "Impacto",
      enabled: "Activado",
      disabled: "Desactivado",
      activate: "Activar",
      deactivate: "Desactivar",
      allAgents: "Todos los Agentes",
      recommended: "Recomendado",
      usageCount: "Contador de uso",
      lastUsed: "Último uso",
      never: "Nunca",
      activating: "Activando...",
      deactivating: "Desactivando..."
    }
  };

  const t = translations[language];

  // Get user agent data for each agent
  const getUserAgentData = (agentId: string) => {
    return userAgents.find(ua => ua.agent_id === agentId);
  };

  // Check if agent is recommended (you can customize this logic)
  const isAgentRecommended = (agentId: string) => {
    // This could be based on user profile, maturity scores, etc.
    const recommendedIds = ['cultural-consultant', 'project-manager', 'cost-calculator', 'content-creator'];
    return recommendedIds.includes(agentId);
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

  const handleToggleAgent = async (agentId: string, currentEnabled: boolean) => {
    console.log('AgentManager: Toggling agent', agentId, 'from', currentEnabled, 'to', !currentEnabled);
    
    // Add to toggling set
    setTogglingAgents(prev => new Set(prev).add(agentId));
    
    try {
      await onAgentToggle(agentId, !currentEnabled);
      console.log('AgentManager: Agent toggle completed successfully');
    } catch (error) {
      console.error('AgentManager: Error toggling agent:', error);
    } finally {
      // Remove from toggling set
      setTogglingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

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

  const groupedAgents = culturalAgentsDatabase.reduce((groups, agent) => {
    if (!groups[agent.category]) {
      groups[agent.category] = [];
    }
    groups[agent.category].push(agent);
    return groups;
  }, {} as Record<string, CulturalAgent[]>);

  const AgentCard = ({ agent }: { agent: CulturalAgent }) => {
    const userAgent = getUserAgentData(agent.id);
    const isEnabled = userAgent?.is_enabled || false;
    const isRecommended = isAgentRecommended(agent.id);
    const usageCount = userAgent?.usage_count || 0;
    const lastUsed = userAgent?.last_used_at;
    const isToggling = togglingAgents.has(agent.id);
    const isRecentlyChanged = userAgent && new Date(userAgent.updated_at).getTime() > Date.now() - 5000;
    
    return (
      <Card className={`transition-all relative ${
        isEnabled ? 'ring-2 ring-purple-200 bg-purple-50/50' : ''
      } ${isRecentlyChanged ? 'ring-2 ring-green-300 shadow-green-200' : ''}`}>
        {isRecommended && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 font-medium">
              <Zap className="w-3 h-3 mr-1" />
              {t.recommended}
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
                    {t.priority}: {agent.priority}
                  </Badge>
                  <Badge className={`text-xs ${getImpactColor(agent.impact)}`}>
                    {t.impact}: {agent.impact}
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
                onCheckedChange={() => handleToggleAgent(agent.id, isEnabled)}
                disabled={loading || isToggling}
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
              <span>{t.usageCount}: {usageCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{t.lastUsed}: {formatLastUsed(lastUsed)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Badge 
              variant={isEnabled ? "default" : "secondary"} 
              className={`text-xs ${isEnabled ? 'bg-green-100 text-green-800' : ''}`}
            >
              {isEnabled ? t.enabled : t.disabled}
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
        <p className="text-sm text-purple-600 mt-1">
          {culturalAgentsDatabase.length} agentes disponibles • {userAgents.filter(ua => ua.is_enabled).length} activos
        </p>
      </div>

      <Tabs defaultValue="Financiera" className="space-y-4">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {Object.keys(groupedAgents).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {t.categories[category as keyof typeof t.categories]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedAgents).map(([category, agents]) => (
          <TabsContent key={category} value={category}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">
                {t.categories[category as keyof typeof t.categories]}
              </h3>
              <p className="text-sm text-gray-600">
                {agents.length} agentes en esta categoría • {agents.filter(agent => getUserAgentData(agent.id)?.is_enabled).length} activos
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
