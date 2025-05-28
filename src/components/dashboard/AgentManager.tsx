
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent } from '@/types/dashboard';

interface AgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => void;
  language: 'en' | 'es';
}

interface AvailableAgent {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'finance' | 'legal' | 'operations' | 'cultural' | 'specialized';
  icon: string;
  color: string;
  isRecommended?: boolean;
  isPremium?: boolean;
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
        business: "Business",
        finance: "Finance",
        legal: "Legal", 
        operations: "Operations",
        cultural: "Cultural",
        specialized: "Specialized"
      },
      recommended: "Recommended",
      premium: "Premium",
      enabled: "Enabled",
      disabled: "Disabled",
      activate: "Activate",
      deactivate: "Deactivate"
    },
    es: {
      title: "Gestor de Agentes",
      subtitle: "Activa y gestiona tus agentes IA",
      categories: {
        business: "Negocios",
        finance: "Finanzas",
        legal: "Legal",
        operations: "Operaciones", 
        cultural: "Cultural",
        specialized: "Especializados"
      },
      recommended: "Recomendado",
      premium: "Premium",
      enabled: "Activado",
      disabled: "Desactivado",
      activate: "Activar",
      deactivate: "Desactivar"
    }
  };

  const t = translations[language];

  const availableAgents: AvailableAgent[] = [
    {
      id: 'admin',
      name: language === 'en' ? 'Administrative Assistant' : 'Asistente Administrativo',
      description: language === 'en' ? 'Helps with organization and admin tasks' : 'Ayuda con organización y tareas administrativas',
      category: 'business',
      icon: '📋',
      color: 'bg-blue-500',
      isRecommended: true
    },
    {
      id: 'cultural',
      name: language === 'en' ? 'Cultural Creator Agent' : 'Agente Creador Cultural',
      description: language === 'en' ? 'Specialized in cultural projects and creative industries' : 'Especializado en proyectos culturales e industrias creativas',
      category: 'cultural',
      icon: '🎨',
      color: 'bg-pink-500',
      isRecommended: true
    },
    {
      id: 'accounting',
      name: language === 'en' ? 'Accounting Copilot' : 'Copiloto Contable',
      description: language === 'en' ? 'Financial management and accounting support' : 'Gestión financiera y soporte contable',
      category: 'finance',
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      id: 'legal',
      name: language === 'en' ? 'Legal Advisor' : 'Asesor Legal',
      description: language === 'en' ? 'Legal guidance and contract support' : 'Orientación legal y soporte de contratos',
      category: 'legal',
      icon: '⚖️',
      color: 'bg-red-500'
    },
    {
      id: 'operations',
      name: language === 'en' ? 'Operations Manager' : 'Gestor de Operaciones',
      description: language === 'en' ? 'Process optimization and workflow management' : 'Optimización de procesos y gestión de flujos',
      category: 'operations',
      icon: '⚙️',
      color: 'bg-amber-500'
    },
    {
      id: 'contract-generator',
      name: language === 'en' ? 'Contract Generator' : 'Generador de Contratos',
      description: language === 'en' ? 'Creates professional contracts for cultural projects' : 'Crea contratos profesionales para proyectos culturales',
      category: 'specialized',
      icon: '📄',
      color: 'bg-purple-500'
    },
    {
      id: 'cost-calculator',
      name: language === 'en' ? 'Cost Calculator' : 'Calculadora de Costos',
      description: language === 'en' ? 'Calculates project costs and pricing strategies' : 'Calcula costos de proyectos y estrategias de precios',
      category: 'specialized',
      icon: '🧮',
      color: 'bg-teal-500'
    }
  ];

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

  const groupedAgents = availableAgents.reduce((groups, agent) => {
    if (!groups[agent.category]) {
      groups[agent.category] = [];
    }
    groups[agent.category].push(agent);
    return groups;
  }, {} as Record<string, AvailableAgent[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {Object.keys(groupedAgents).map(category => (
            <TabsTrigger key={category} value={category}>
              {t.categories[category as keyof typeof t.categories]}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedAgents).map(([category, agents]) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents.map(agent => {
                const isEnabled = enabledAgents.has(agent.id);
                
                return (
                  <Card key={agent.id} className={`transition-all ${isEnabled ? 'ring-2 ring-purple-200' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center text-white text-lg`}>
                            {agent.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">{agent.name}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              {agent.isRecommended && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {t.recommended}
                                </Badge>
                              )}
                              {agent.isPremium && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                  {t.premium}
                                </Badge>
                              )}
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
                      <CardDescription className="text-sm">
                        {agent.description}
                      </CardDescription>
                      <div className="mt-3">
                        <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
                          {isEnabled ? t.enabled : t.disabled}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
