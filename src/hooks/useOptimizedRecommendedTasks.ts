import { useState, useEffect } from 'react';
import { CategoryScore } from '@/types/dashboard';
import { OptimizedRecommendedTask } from './types/recommendedTasksTypes';
import { generateRobustTasksFromScores } from './utils/taskGenerationUtils';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export type { OptimizedRecommendedTask } from './types/recommendedTasksTypes';

export const useOptimizedRecommendedTasks = (maturityScores: CategoryScore | null, profileData: any | null, agentPool: string[] = []) => {
  const [tasks, setTasks] = useState<OptimizedRecommendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadRobustTasks = async () => {
      setLoading(true);
      try {
        if (!maturityScores) {
          console.log('No maturity scores available, cannot generate tasks');
          setTasks([]);
          return;
        }

        console.log('Loading robust tasks with:', {
          maturityScores,
          profileData,
          agentPool: agentPool,
          agentPoolCount: agentPool.length
        });

        // Generar tareas base desde maturity scores (siempre funciona como fallback)
        const scoreTasks = generateRobustTasksFromScores(maturityScores, agentPool);
        console.log('Score-based tasks generated:', scoreTasks.length);
        
        let combinedTasks = [...scoreTasks];

        if (profileData) {
            try {
                const { data, error } = await supabase.functions.invoke('maturity-analysis', {
                    body: { scores: maturityScores, profileData, language }
                });

                if (error) throw error;
                
                if (data?.recommendations?.length > 0) {
                  console.log('AI recommendations obtained:', data.recommendations.length);
                  const aiTasks = convertAIRecommendationsToTasks(data.recommendations, agentPool);
                  console.log('AI tasks converted:', aiTasks.length);
                  combinedTasks = [...aiTasks, ...scoreTasks];
                } else {
                    console.log('AI analysis completed but returned no recommendations.');
                }
            } catch (e) {
                console.error("AI recommendations fetch failed, using score-based tasks as fallback.", e);
            }
        }
        
        // Combinar, priorizar y limitar tareas
        const uniqueTasks = removeDuplicateTasks(combinedTasks);
        const finalTasks = prioritizeAndLimitTasks(uniqueTasks, 6);

        console.log('Final robust tasks:', {
          totalCombined: combinedTasks.length,
          uniqueTasks: uniqueTasks.length,
          finalTasksCount: finalTasks.length
        });
        
        setTasks(finalTasks);
      } catch (error) {
        console.error('Error loading robust tasks:', error);
        // En caso de error total, usar tareas de emergencia (que son las de scores)
        if (maturityScores) {
            const emergencyTasks = generateRobustTasksFromScores(maturityScores, agentPool);
            setTasks(prioritizeAndLimitTasks(emergencyTasks, 6));
        } else {
            setTasks([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRobustTasks();
  }, [maturityScores, profileData, agentPool.join(','), language]); // Added agentPool to dependency array

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
