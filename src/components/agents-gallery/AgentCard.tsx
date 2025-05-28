
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Target, Zap } from 'lucide-react';
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

const getImpactIcon = (impact: number) => {
  switch (impact) {
    case 4: return <Star className="w-4 h-4 text-yellow-500" />;
    case 3: return <Target className="w-4 h-4 text-green-500" />;
    case 2: return <Zap className="w-4 h-4 text-blue-500" />;
    default: return <div className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    'Financiera': 'bg-green-50 text-green-700 border-green-200',
    'Legal': 'bg-blue-50 text-blue-700 border-blue-200',
    'Diagnóstico': 'bg-purple-50 text-purple-700 border-purple-200',
    'Comercial': 'bg-orange-50 text-orange-700 border-orange-200',
    'Operativo': 'bg-pink-50 text-pink-700 border-pink-200',
    'Comunidad': 'bg-indigo-50 text-indigo-700 border-indigo-200'
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
      <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">{agent.icon}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                <Badge className={getCategoryColor(agent.category)}>
                  {translations.categories[agent.category] || agent.category}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4">{agent.description}</p>
              
              <div className="flex gap-3">
                <Badge className={getPriorityColor(agent.priority)}>
                  {translations.priority}: {agent.priority}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getImpactIcon(agent.impact)}
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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-3xl">{agent.icon}</span>
            </div>
            <Badge className={getCategoryColor(agent.category)}>
              {translations.categories[agent.category] || agent.category}
            </Badge>
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">{agent.name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{agent.description}</p>
          
          <div className="flex gap-2">
            <Badge className={getPriorityColor(agent.priority)}>
              {translations.priority}: {agent.priority}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getImpactIcon(agent.impact)}
              {translations.impact}: {agent.impact}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
