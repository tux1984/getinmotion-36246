
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CulturalAgent } from '@/data/agentsDatabase';
import { getAgentTranslation } from '@/data/agentTranslations';
import { 
  Loader2, 
  Star, 
  Users, 
  CheckCircle,
  Circle
} from 'lucide-react';

interface AgentCategoryCardProps {
  category: string;
  categoryName: string;
  agents: CulturalAgent[];
  activeCount: number;
  totalCount: number;
  recommendedCount: number;
  getUserAgentData: (agentId: string) => any;
  isAgentRecommended: (agentId: string) => boolean;
  onToggleAgent: (agentId: string, enabled: boolean) => Promise<void>;
  togglingAgents: Set<string>;
  language: 'en' | 'es';
}

export const AgentCategoryCard: React.FC<AgentCategoryCardProps> = ({
  category,
  categoryName,
  agents,
  activeCount,
  totalCount,
  recommendedCount,
  getUserAgentData,
  isAgentRecommended,
  onToggleAgent,
  togglingAgents,
  language
}) => {
  const t = {
    en: {
      recommended: "Recommended",
      activate: "Activate",
      deactivate: "Deactivate"
    },
    es: {
      recommended: "Recomendado",
      activate: "Activar",
      deactivate: "Desactivar"
    }
  };

  // Traducciones para categorías
  const categoryTranslations = {
    en: {
      'Financiera': 'Financial',
      'Legal': 'Legal',
      'Diagnóstico': 'Diagnostic',
      'Comercial': 'Commercial',
      'Operativo': 'Operational',
      'Comunidad': 'Community'
    },
    es: {
      'Financiera': 'Financiera',
      'Legal': 'Legal',
      'Diagnóstico': 'Diagnóstico',
      'Comercial': 'Comercial',
      'Operativo': 'Operativo',
      'Comunidad': 'Comunidad'
    }
  };

  const translatedCategoryName = categoryTranslations[language][categoryName as keyof typeof categoryTranslations[typeof language]] || categoryName;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {translatedCategoryName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {recommendedCount > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                {recommendedCount}
              </Badge>
            )}
            <Badge variant="outline" className="text-gray-600">
              <Users className="w-3 h-3 mr-1" />
              {activeCount}/{totalCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {agents.map((agent) => {
          const userAgentData = getUserAgentData(agent.id);
          const isEnabled = Boolean(userAgentData?.is_enabled);
          const isRecommended = isAgentRecommended(agent.id);
          const isToggling = togglingAgents.has(agent.id);
          const translation = getAgentTranslation(agent.id, language);

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-lg border transition-all ${
                isEnabled 
                  ? 'bg-purple-50 border-purple-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{agent.icon}</span>
                    <h4 className="font-medium text-gray-800 truncate">
                      {translation.name}
                    </h4>
                    {isRecommended && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {t[language].recommended}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {translation.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-3">
                  {isEnabled ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  
                  {isToggling ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  ) : (
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) => onToggleAgent(agent.id, checked)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
