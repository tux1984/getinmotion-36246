
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase, CulturalAgent } from '@/data/agentsDatabase';

interface AgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => void;
  language: 'en' | 'es';
}

export const AgentManager: React.FC<AgentManagerProps> = ({
  currentAgents,
  onAgentToggle,
  language
}) => {
  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(
    new Set(currentAgents.map(agent => agent.id))
  );

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
      allAgents: "All Agents"
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
      allAgents: "Todos los Agentes"
    }
  };

  const t = translations[language];

  const handleToggleAgent = (agentId: string) => {
    const isEnabled = enabledAgents.has(agentId);
    const newEnabledAgents = new Set(enabledAgents);
    
    if (isEnabled) {
      newEnabledAgents.delete(agentId);
    } else {
      newEnabledAgents.add(agentId);
    }
    
    setEnabledAgents(newEnabledAgents);
    onAgentToggle(agentId, !isEnabled);
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
    const isEnabled = enabledAgents.has(agent.id);
    
    return (
      <Card className={`transition-all ${isEnabled ? 'ring-2 ring-purple-200' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center text-white text-xl`}>
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
            <Switch
              checked={isEnabled}
              onCheckedChange={() => handleToggleAgent(agent.id)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm mb-3">
            {agent.description}
          </CardDescription>
          <div className="flex justify-between items-center">
            <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
        <p className="text-sm text-purple-600 mt-1">
          {culturalAgentsDatabase.length} agentes disponibles (A1-A20)
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
                {agents.length} agentes en esta categoría
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
