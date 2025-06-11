
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getAgentInfo } from '@/utils/agentMappings';

interface AgentRecommendationCardProps {
  agentKey: string;
  enabled: boolean;
  language: 'en' | 'es';
}

export const AgentRecommendationCard: React.FC<AgentRecommendationCardProps> = ({
  agentKey,
  enabled,
  language
}) => {
  if (!enabled) return null;

  const agentInfo = getAgentInfo(agentKey, language);
  
  if (!agentInfo) return null;

  return (
    <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
        <agentInfo.icon className="w-6 h-6 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">{agentInfo.name}</h4>
        <p className="text-gray-600 text-xs line-clamp-2">{agentInfo.description}</p>
      </div>
      
      <CheckCircle className="w-6 h-6 text-green-500 ml-4 flex-shrink-0" />
    </div>
  );
};
