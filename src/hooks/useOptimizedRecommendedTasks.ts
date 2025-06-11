
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CategoryScore } from '@/types/dashboard';
import { OptimizedRecommendedTask } from './types/recommendedTasksTypes';
import { generateTasksFromScores } from './utils/taskGenerationUtils';
import { useAIRecommendations } from './useAIRecommendations';

export type { OptimizedRecommendedTask } from './types/recommendedTasksTypes';

export const useOptimizedRecommendedTasks = (maturityScores: CategoryScore | null, enabledAgents: string[] = []) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<OptimizedRecommendedTask[]>([]);
  const { fetchAIRecommendations, convertAIRecommendationsToTasks, loading } = useAIRecommendations();

  useEffect(() => {
    const loadTasks = async () => {
      if (!maturityScores) {
        console.log('No maturity scores available, cannot generate tasks');
        setTasks([]);
        return;
      }

      if (enabledAgents.length === 0) {
        console.log('No enabled agents found, cannot generate tasks');
        setTasks([]);
        return;
      }

      console.log('Loading tasks with:', {
        maturityScores,
        enabledAgents,
        enabledAgentsCount: enabledAgents.length
      });

      // Generate base tasks from maturity scores
      const scoreTasks = generateTasksFromScores(maturityScores, enabledAgents);
      console.log('Score-based tasks generated:', scoreTasks.length);
      
      // Fetch AI-powered recommendations
      const aiRecommendations = await fetchAIRecommendations(maturityScores);
      console.log('AI recommendations fetched:', aiRecommendations.length);
      
      const aiTasks = convertAIRecommendationsToTasks(aiRecommendations, enabledAgents);
      console.log('AI tasks converted:', aiTasks.length);
      
      // Combine and prioritize tasks
      const allTasks = [...aiTasks, ...scoreTasks];
      
      // Sort by priority and limit to top 6 tasks
      const prioritizedTasks = allTasks
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
        .slice(0, 6);

      console.log('Final prioritized tasks:', {
        totalTasks: allTasks.length,
        finalTasks: prioritizedTasks.length,
        taskDetails: prioritizedTasks.map(t => ({ 
          id: t.id, 
          title: t.title, 
          agentId: t.agentId, 
          priority: t.priority 
        }))
      });
      
      setTasks(prioritizedTasks);
    };

    loadTasks();
  }, [maturityScores, user, enabledAgents, fetchAIRecommendations, convertAIRecommendationsToTasks]);

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
