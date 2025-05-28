
import { useMemo } from 'react';
import { Calculator, FileText, HelpCircle, Globe, Palette, Users, TrendingUp } from 'lucide-react';
import { CulturalAgent } from './types';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { agentTranslations } from './translations';

export const useAgentData = (language: 'en' | 'es') => {
  const culturalAgents: CulturalAgent[] = useMemo(() => {
    // Mapear los agentes de la base de datos al formato esperado por el sistema cultural
    return culturalAgentsDatabase.map(agent => ({
      id: agent.id,
      title: agent.name,
      description: agent.description,
      icon: getIconComponent(agent.id),
      color: getColorClass(agent.category),
      profiles: agent.profiles || [],
      priority: getPriorityNumber(agent.priority)
    }));
  }, [language]);

  return culturalAgents;
};

const getIconComponent = (agentId: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'cost-calculator': <Calculator className="w-6 h-6" />,
    'collaboration-agreement': <FileText className="w-6 h-6" />,
    'maturity-evaluator': <HelpCircle className="w-6 h-6" />,
    'export-advisor': <Globe className="w-6 h-6" />,
    'portfolio-catalog': <Palette className="w-6 h-6" />,
    'collaborator-management': <Users className="w-6 h-6" />,
    'pricing-assistant': <TrendingUp className="w-6 h-6" />,
    'contract-generator': <FileText className="w-6 h-6" />
  };
  
  return iconMap[agentId] || <HelpCircle className="w-6 h-6" />;
};

const getColorClass = (category: string) => {
  const colorMap: Record<string, string> = {
    'Financiera': 'bg-emerald-100 text-emerald-700',
    'Legal': 'bg-blue-100 text-blue-700',
    'Diagnóstico': 'bg-violet-100 text-violet-700',
    'Comercial': 'bg-pink-100 text-pink-700',
    'Operativo': 'bg-indigo-100 text-indigo-700',
    'Comunidad': 'bg-orange-100 text-orange-700'
  };
  
  return colorMap[category] || 'bg-gray-100 text-gray-700';
};

const getPriorityNumber = (priority: string): number => {
  const priorityMap: Record<string, number> = {
    'Alta': 1,
    'Media-Alta': 1,
    'Media': 2,
    'Baja': 2,
    'Muy Baja': 3
  };
  
  return priorityMap[priority] || 2;
};
