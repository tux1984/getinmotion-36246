
import { useMemo } from 'react';
import { Calculator, FileText, HelpCircle, Globe, Palette } from 'lucide-react';
import { CulturalAgent } from './types';
import { agentTranslations } from './translations';

export const useAgentData = (language: 'en' | 'es') => {
  const culturalAgents: CulturalAgent[] = useMemo(() => [
    {
      id: "cost-calculator",
      title: agentTranslations.costCalculator[language].title,
      description: agentTranslations.costCalculator[language].description,
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-700",
      profiles: ['visual-artist', 'textile-artisan', 'indigenous-artisan'],
      priority: 1
    },
    {
      id: "contract-generator",
      title: agentTranslations.contractGenerator[language].title,
      description: agentTranslations.contractGenerator[language].description,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-700",
      profiles: ['musician', 'visual-artist', 'indigenous-artisan'],
      priority: 1
    },
    {
      id: "maturity-evaluator",
      title: agentTranslations.maturityEvaluator[language].title,
      description: agentTranslations.maturityEvaluator[language].description,
      icon: <HelpCircle className="w-6 h-6" />,
      color: "bg-violet-100 text-violet-700",
      profiles: ['musician', 'visual-artist', 'textile-artisan', 'indigenous-artisan'],
      priority: 1
    },
    {
      id: "export-advisor",
      title: agentTranslations.exportAdvisor[language].title,
      description: agentTranslations.exportAdvisor[language].description,
      icon: <Globe className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-700",
      profiles: ['musician', 'visual-artist', 'textile-artisan'],
      priority: 2
    },
    {
      id: "portfolio-catalog",
      title: agentTranslations.portfolioCatalog[language].title,
      description: agentTranslations.portfolioCatalog[language].description,
      icon: <Palette className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-700",
      profiles: ['visual-artist', 'textile-artisan', 'indigenous-artisan'],
      priority: 2
    },
  ], [language]);

  return culturalAgents;
};
