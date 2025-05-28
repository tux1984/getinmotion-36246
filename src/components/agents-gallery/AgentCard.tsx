
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CulturalAgent } from '@/data/agentsDatabase';

interface AgentCardProps {
  agent: CulturalAgent;
  isListView?: boolean;
  translations: {
    priority: string;
    impact: string;
    categories: Record<string, string>;
  };
}

const getAgentColor = (category: string) => {
  const colors = {
    'Financiera': 'bg-purple-500',
    'Legal': 'bg-blue-500',
    'Diagnóstico': 'bg-purple-500',
    'Comercial': 'bg-pink-500',
    'Operativo': 'bg-pink-500',
    'Comunidad': 'bg-blue-500'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-500';
};

const getCategoryColor = (category: string) => {
  const colors = {
    'Financiera': 'bg-purple-50 text-purple-700 border-purple-200',
    'Legal': 'bg-blue-50 text-blue-700 border-blue-200',
    'Diagnóstico': 'bg-purple-50 text-purple-700 border-purple-200',
    'Comercial': 'bg-pink-50 text-pink-700 border-pink-200',
    'Operativo': 'bg-pink-50 text-pink-700 border-pink-200',
    'Comunidad': 'bg-blue-50 text-blue-700 border-blue-200'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isListView = false,
  translations
}) => {
  if (isListView) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className={`w-16 h-16 ${getAgentColor(agent.category)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-2xl text-white">{agent.icon}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                <Badge className={getCategoryColor(agent.category)}>
                  {translations.categories[agent.category] || agent.category}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{agent.description}</p>
              
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs font-medium">
                  {translations.priority}: {agent.priority}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  {translations.impact}: {agent.impact}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 ${getAgentColor(agent.category)} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <span className="text-2xl text-white">{agent.icon}</span>
            </div>
            <Badge className={getCategoryColor(agent.category)}>
              {translations.categories[agent.category] || agent.category}
            </Badge>
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 leading-tight">{agent.name}</h3>
          <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">{agent.description}</p>
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-medium bg-gray-50">
              {translations.priority}: {agent.priority}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium bg-gray-50">
              {translations.impact}: {agent.impact}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
