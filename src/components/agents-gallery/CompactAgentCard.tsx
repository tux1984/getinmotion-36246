
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CulturalAgent } from '@/data/agentsDatabase';

interface CompactAgentCardProps {
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

export const CompactAgentCard: React.FC<CompactAgentCardProps> = ({
  agent,
  translations
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md overflow-hidden bg-white h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Compact Header */}
        <div className={`bg-gradient-to-r ${getAgentColor(agent.category)} p-4 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">{agent.icon}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {translations.categories[agent.category] || agent.category}
              </span>
            </div>
            
            <h3 className="font-bold text-sm mb-2 leading-tight line-clamp-2" title={agent.name}>
              {agent.name}
            </h3>
            <p className="text-white/90 text-xs leading-relaxed line-clamp-2" title={agent.description}>
              {agent.description}
            </p>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Example Q&A - Only if available */}
          {agent.exampleQuestion && agent.exampleAnswer && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3 flex-1">
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {translations.exampleQuestion}
                </p>
                <p className="text-xs text-gray-700 font-medium line-clamp-2" title={agent.exampleQuestion}>
                  "{agent.exampleQuestion}"
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {translations.exampleAnswer}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3" title={agent.exampleAnswer}>
                  "{agent.exampleAnswer}"
                </p>
              </div>
            </div>
          )}

          {/* Compact Stats */}
          <div className="flex gap-2 mt-auto">
            <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">{translations.priority}</p>
              <p className="text-xs font-semibold text-gray-700">{agent.priority}</p>
            </div>
            <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-medium">{translations.impact}</p>
              <p className="text-xs font-semibold text-gray-700">{agent.impact}/4</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
