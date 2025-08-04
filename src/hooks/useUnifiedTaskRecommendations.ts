import { useMemo } from 'react';
import { CategoryScore } from '@/types/dashboard';
import { OptimizedRecommendedTask } from './types/recommendedTasksTypes';
import { getTranslations } from '@/translations';
import { v4 as uuidv4 } from 'uuid';

interface UseUnifiedTaskRecommendationsProps {
  maturityScores: CategoryScore | null;
  language?: 'en' | 'es';
}

export const useUnifiedTaskRecommendations = ({ 
  maturityScores, 
  language = 'en' 
}: UseUnifiedTaskRecommendationsProps): OptimizedRecommendedTask[] => {
  
  return useMemo(() => {
    if (!maturityScores) return [];

    const t = getTranslations(language);

    // Calculate maturity level
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    let maturityLevel: 'explorador' | 'constructor' | 'estratega' | 'visionario' = 'explorador';
    if (average >= 80) maturityLevel = 'visionario';
    else if (average >= 60) maturityLevel = 'estratega';
    else if (average >= 40) maturityLevel = 'constructor';

    const tasksByLevel = {
      'explorador': [
        { 
          title: t.recommendedTasks.explorador.validateBusiness.title,
          description: t.recommendedTasks.explorador.validateBusiness.description,
          agent: 'cultural-consultant',
          agentName: t.recommendedTasks.agents.culturalConsultant,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.validation,
          estimatedTime: t.timeEstimates.hours_2_3,
          prompt: t.recommendedTasks.explorador.validateBusiness.prompt
        },
        { 
          title: t.recommendedTasks.explorador.calculateCosts.title,
          description: t.recommendedTasks.explorador.calculateCosts.description,
          agent: 'cost-calculator',
          agentName: t.recommendedTasks.agents.costCalculator,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.finances,
          estimatedTime: t.timeEstimates.hours_1_2,
          prompt: t.recommendedTasks.explorador.calculateCosts.prompt
        },
        { 
          title: t.recommendedTasks.explorador.legalStructure.title,
          description: t.recommendedTasks.explorador.legalStructure.description,
          agent: 'collaboration-agreement',
          agentName: t.recommendedTasks.agents.legalAdvisor,
          priority: 'medium' as const,
          category: t.recommendedTasks.categories.legal,
          estimatedTime: t.timeEstimates.hours_2_4,
          prompt: t.recommendedTasks.explorador.legalStructure.prompt
        }
      ],
      'constructor': [
        { 
          title: t.recommendedTasks.constructor.digitalMarketing.title,
          description: t.recommendedTasks.constructor.digitalMarketing.description,
          agent: 'marketing-advisor',
          agentName: t.recommendedTasks.agents.marketingAdvisor,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.marketing,
          estimatedTime: t.timeEstimates.hours_3_5,
          prompt: t.recommendedTasks.constructor.digitalMarketing.prompt
        },
        { 
          title: t.recommendedTasks.constructor.projectManagement.title,
          description: t.recommendedTasks.constructor.projectManagement.description,
          agent: 'project-manager',
          agentName: t.recommendedTasks.agents.projectManager,
          priority: 'medium' as const,
          category: t.recommendedTasks.categories.operations,
          estimatedTime: t.timeEstimates.hours_2_3,
          prompt: t.recommendedTasks.constructor.projectManagement.prompt
        },
        { 
          title: t.recommendedTasks.constructor.pricingSystem.title,
          description: t.recommendedTasks.constructor.pricingSystem.description,
          agent: 'pricing-assistant',
          agentName: t.recommendedTasks.agents.pricingAssistant,
          priority: 'medium' as const,
          category: t.recommendedTasks.categories.strategy,
          estimatedTime: t.timeEstimates.hours_1_2,
          prompt: t.recommendedTasks.constructor.pricingSystem.prompt
        }
      ],
      'estratega': [
        { 
          title: t.recommendedTasks.estratega.internationalMarkets.title,
          description: t.recommendedTasks.estratega.internationalMarkets.description,
          agent: 'export-advisor',
          agentName: t.recommendedTasks.agents.exportAdvisor,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.expansion,
          estimatedTime: t.timeEstimates.hours_4_6,
          prompt: t.recommendedTasks.estratega.internationalMarkets.prompt
        },
        { 
          title: t.recommendedTasks.estratega.stakeholderNetwork.title,
          description: t.recommendedTasks.estratega.stakeholderNetwork.description,
          agent: 'stakeholder-matching',
          agentName: t.recommendedTasks.agents.stakeholderConnector,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.networking,
          estimatedTime: t.timeEstimates.hours_3_4,
          prompt: t.recommendedTasks.estratega.stakeholderNetwork.prompt
        },
        { 
          title: t.recommendedTasks.estratega.personalBrand.title,
          description: t.recommendedTasks.estratega.personalBrand.description,
          agent: 'branding-strategy',
          agentName: t.recommendedTasks.agents.brandingStrategist,
          priority: 'medium' as const,
          category: t.recommendedTasks.categories.branding,
          estimatedTime: t.timeEstimates.hours_2_3,
          prompt: t.recommendedTasks.estratega.personalBrand.prompt
        }
      ],
      'visionario': [
        { 
          title: t.recommendedTasks.visionario.scalabilityStrategy.title,
          description: t.recommendedTasks.visionario.scalabilityStrategy.description,
          agent: 'business-scaling',
          agentName: t.recommendedTasks.agents.scalingSpecialist,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.growth,
          estimatedTime: t.timeEstimates.hours_5_8,
          prompt: t.recommendedTasks.visionario.scalabilityStrategy.prompt
        },
        { 
          title: t.recommendedTasks.visionario.disruptiveInnovation.title,
          description: t.recommendedTasks.visionario.disruptiveInnovation.description,
          agent: 'innovation-consultant',
          agentName: t.recommendedTasks.agents.innovationConsultant,
          priority: 'high' as const,
          category: t.recommendedTasks.categories.innovation,
          estimatedTime: t.timeEstimates.hours_4_6,
          prompt: t.recommendedTasks.visionario.disruptiveInnovation.prompt
        },
        { 
          title: t.recommendedTasks.visionario.businessEcosystem.title,
          description: t.recommendedTasks.visionario.businessEcosystem.description,
          agent: 'ecosystem-builder',
          agentName: t.recommendedTasks.agents.ecosystemBuilder,
          priority: 'medium' as const,
          category: t.recommendedTasks.categories.strategy,
          estimatedTime: t.timeEstimates.hours_6_10,
          prompt: t.recommendedTasks.visionario.businessEcosystem.prompt
        }
      ]
    };

    const selectedTasks = tasksByLevel[maturityLevel] || tasksByLevel['explorador'];
    
    return selectedTasks.map(task => ({
      id: `rec_${uuidv4()}`,
      title: task.title,
      description: task.description,
      agentId: task.agent,
      agentName: task.agentName,
      priority: task.priority,
      category: task.category,
      estimatedTime: task.estimatedTime,
      prompt: task.prompt,
      completed: false,
      isRealAgent: true
    }));
  }, [maturityScores, language]);
};