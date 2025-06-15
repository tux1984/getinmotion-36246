
import { useState, useEffect } from 'react';
import { CategoryScore } from '@/types/dashboard';
import { OptimizedRecommendedTask } from './types/recommendedTasksTypes';
import { generateRobustTasksFromScores } from './utils/taskGenerationUtils';
import { useRobustAIRecommendations } from './useRobustAIRecommendations';

export type { OptimizedRecommendedTask } from './types/recommendedTasksTypes';

export const useOptimizedRecommendedTasks = (maturityScores: CategoryScore | null, agentPool: string[] = []) => {
  const [tasks, setTasks] = useState<OptimizedRecommendedTask[]>([]);
  const { fetchRecommendationsWithFallback, loading } = useRobustAIRecommendations();

  useEffect(() => {
    const loadRobustTasks = async () => {
      if (!maturityScores) {
        console.log('No maturity scores available, cannot generate tasks');
        setTasks([]);
        return;
      }

      console.log('Loading robust tasks with:', {
        maturityScores,
        agentPool: agentPool,
        agentPoolCount: agentPool.length
      });

      try {
        // Generar tareas base desde maturity scores (siempre funciona)
        const scoreTasks = generateRobustTasksFromScores(maturityScores, agentPool);
        console.log('Score-based tasks generated:', scoreTasks.length);
        
        // Intentar obtener recomendaciones de IA con fallback inteligente
        const aiRecommendations = await fetchRecommendationsWithFallback(maturityScores);
        console.log('AI recommendations obtained:', aiRecommendations.length);
        
        // Convertir recomendaciones de IA a tareas
        const aiTasks = convertAIRecommendationsToTasks(aiRecommendations, agentPool);
        console.log('AI tasks converted:', aiTasks.length);
        
        // Combinar y priorizar tareas
        const allTasks = [...aiTasks, ...scoreTasks];
        
        // Remover duplicados y limitar a 6 tareas
        const uniqueTasks = removeDuplicateTasks(allTasks);
        const finalTasks = prioritizeAndLimitTasks(uniqueTasks, 6);

        console.log('Final robust tasks:', {
          totalTasks: allTasks.length,
          uniqueTasks: uniqueTasks.length,
          finalTasks: finalTasks.length
        });
        
        setTasks(finalTasks);
      } catch (error) {
        console.error('Error loading robust tasks:', error);
        // En caso de error total, usar tareas de emergencia
        const emergencyTasks = generateRobustTasksFromScores(maturityScores, agentPool);
        setTasks(emergencyTasks);
      }
    };

    loadRobustTasks();
  }, [maturityScores, agentPool, fetchRecommendationsWithFallback]);

  const convertAIRecommendationsToTasks = (recommendations: any[], agentPool: string[]): OptimizedRecommendedTask[] => {
    if (!recommendations.length || !agentPool.length) return [];

    return recommendations.map((rec, index) => {
      // Usar el primer agente disponible o rotar entre agentes
      const agentIndex = index % agentPool.length;
      const agentId = agentPool[agentIndex];
      
      const priority = (rec.priority === 'Alta' || rec.priority === 'High') ? 'high' : 
                      (rec.priority === 'Media' || rec.priority === 'Medium') ? 'medium' : 'low';

      return {
        id: `ai-rec-${index}`,
        title: rec.title,
        description: rec.description,
        agentId,
        agentName: `Agente IA ${index + 1}`,
        priority,
        category: 'IA Recomendado',
        estimatedTime: rec.timeframe || '1-2 horas',
        prompt: `Basado en mi evaluación: "${rec.title}". ${rec.description}. ¿Puedes ayudarme a desarrollar un plan específico?`,
        completed: false,
        isRealAgent: true
      };
    });
  };

  const removeDuplicateTasks = (tasks: OptimizedRecommendedTask[]): OptimizedRecommendedTask[] => {
    const seen = new Set<string>();
    return tasks.filter(task => {
      const key = task.title.toLowerCase().substring(0, 30);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const prioritizeAndLimitTasks = (tasks: OptimizedRecommendedTask[], limit: number): OptimizedRecommendedTask[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return tasks
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, limit);
  };

  const markTaskCompleted = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  return {
    tasks,
    loading,
    markTaskCompleted
  };
};
