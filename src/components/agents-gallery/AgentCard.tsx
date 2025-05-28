
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CulturalAgent } from '@/data/agentsDatabase';

interface AgentCardProps {
  agent: CulturalAgent;
  translations: {
    priority: string;
    impact: string;
    categories: Record<string, string>;
    exampleQuestion: string;
    exampleAnswer: string;
  };
}

const getAgentColor = (category: string) => {
  const colors = {
    'Financiera': 'from-purple-500 to-purple-600',
    'Legal': 'from-blue-500 to-blue-600',
    'Diagnóstico': 'from-purple-500 to-purple-600',
    'Comercial': 'from-pink-500 to-pink-600',
    'Operativo': 'from-pink-500 to-pink-600',
    'Comunidad': 'from-blue-500 to-blue-600'
  };
  return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
};

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  translations
}) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white relative">
      <CardContent className="p-0">
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${getAgentColor(agent.category)} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">{agent.icon}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {translations.categories[agent.category] || agent.category}
              </span>
            </div>
            
            <h3 className="font-bold text-lg mb-2 leading-tight">{agent.name}</h3>
            <p className="text-white/90 text-sm leading-relaxed">{agent.description}</p>
          </div>
        </div>

        {/* Content with Q&A example */}
        <div className="p-6 space-y-4">
          {agent.exampleQuestion && agent.exampleAnswer && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {translations.exampleQuestion}
                </p>
                <p className="text-sm text-gray-700 font-medium">"{agent.exampleQuestion}"</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {translations.exampleAnswer}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">"{agent.exampleAnswer}"</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-2 pt-2">
            <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">{translations.priority}</p>
              <p className="text-sm font-semibold text-gray-700">{agent.priority}</p>
            </div>
            <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">{translations.impact}</p>
              <p className="text-sm font-semibold text-gray-700">{agent.impact}/4</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
