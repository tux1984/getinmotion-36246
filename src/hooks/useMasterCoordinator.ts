import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOptimizedMaturityScores } from './useOptimizedMaturityScores';
import { useUserBusinessProfile } from './useUserBusinessProfile';
import { useToast } from '@/hooks/use-toast';
import { useAgentTasks } from './useAgentTasks';
import { supabase } from '@/integrations/supabase/client';

export interface CoordinatorTask {
  id: string;
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  priority: number;
  relevance: 'high' | 'medium' | 'low';
  estimatedTime: string;
  category: string;
  isUnlocked: boolean;
  prerequisiteTasks: string[];
  steps: TaskStep[];
}

export interface TaskStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  validationRequired: boolean;
  contextualHelp: string;
}

export interface TaskDeliverable {
  id: string;
  taskId: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'txt' | 'table';
  content?: any;
  downloadUrl?: string;
  createdAt: string;
  agentId: string;
}

export const useMasterCoordinator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentScores, profileData } = useOptimizedMaturityScores();
  const { businessProfile } = useUserBusinessProfile();
  const { tasks, createTask, updateTask, deleteTask, deleteAllTasks } = useAgentTasks();
  
  const [coordinatorTasks, setCoordinatorTasks] = useState<CoordinatorTask[]>([]);
  const [currentPath, setCurrentPath] = useState<CoordinatorTask[]>([]);
  const [deliverables, setDeliverables] = useState<TaskDeliverable[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Análisis inteligente del perfil para generar tareas personalizadas
  const analyzeProfileAndGenerateTasks = useCallback(async () => {
    if (!currentScores || !profileData || !user) return;

    console.log('🧠 Master Coordinator: Analyzing profile and generating intelligent tasks');
    
    try {
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'analyze_and_generate_tasks',
          maturityScores: currentScores,
          profileData,
          businessProfile,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.tasks) {
        // Reemplazar tareas existentes con las nuevas generadas
        await deleteAllTasks();
        
        const newTasks = [];
        for (const taskData of data.tasks) {
          const newTask = await createTask({
            title: taskData.title,
            description: taskData.description,
            agent_id: taskData.agentId,
            relevance: taskData.relevance,
            priority: taskData.priority
          });
          if (newTask) newTasks.push(newTask);
        }
        
        console.log('✅ Master Coordinator: Generated and created', newTasks.length, 'intelligent tasks');
        toast({
          title: "Tareas Personalizadas Generadas",
          description: `He creado ${newTasks.length} tareas específicas para tu perfil empresarial.`,
        });
      }
    } catch (error) {
      console.error('❌ Master Coordinator: Error generating tasks:', error);
    }
  }, [currentScores, profileData, businessProfile, user, createTask, deleteAllTasks]);

  // Convertir tareas normales a tareas del coordinador con lógica de desbloqueo
  const transformToCoordinatorTasks = useMemo(() => {
    // Validaciones para evitar errores de variables no inicializadas
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    try {
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.relevance !== b.relevance) {
          const relevanceOrder = { high: 3, medium: 2, low: 1 };
          return relevanceOrder[b.relevance as keyof typeof relevanceOrder] - 
                 relevanceOrder[a.relevance as keyof typeof relevanceOrder];
        }
        return a.priority - b.priority;
      });

      return sortedTasks.slice(0, 15).map((task, index) => {
        // Validaciones adicionales para cada tarea
        if (!task || !task.id) {
          console.warn('⚠️ Invalid task found:', task);
          return null;
        }

        return {
          id: task.id,
          title: task.title || 'Tarea sin título',
          description: task.description || '',
          agentId: task.agent_id || 'general',
          agentName: getAgentName(task.agent_id || 'general'),
          priority: task.priority || 1,
          relevance: task.relevance || 'medium',
          estimatedTime: getEstimatedTime(task.title || ''),
          category: getTaskCategory(task.agent_id || 'general'),
          isUnlocked: index === 0 || tasks.filter((t, i) => i < index).some(t => t.status === 'completed'),
          prerequisiteTasks: index > 0 && sortedTasks[index - 1] ? [sortedTasks[index - 1].id] : [],
          steps: generateStepsForTask(task)
        };
      }).filter(Boolean) as CoordinatorTask[]; // Filtrar elementos null
    } catch (error) {
      console.error('❌ Error transforming tasks:', error);
      return [];
    }
  }, [tasks]);

  // Inicialización automática del coordinador cuando hay datos
  useEffect(() => {
    if (currentScores && profileData && !isInitialized && tasks.length === 0) {
      console.log('🚀 Master Coordinator: Auto-initializing with profile data');
      analyzeProfileAndGenerateTasks();
      setIsInitialized(true);
    }
  }, [currentScores, profileData, tasks.length, isInitialized, analyzeProfileAndGenerateTasks]);

  // Actualizar tareas del coordinador cuando cambien las tareas normales
  useEffect(() => {
    setCoordinatorTasks(transformToCoordinatorTasks);
  }, [transformToCoordinatorTasks]);

  // Cargar entregables del usuario
  useEffect(() => {
    if (user) {
      loadDeliverables();
    }
  }, [user]);

  const loadDeliverables = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('agent_deliverables')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform database fields to match TaskDeliverable interface
      const transformedDeliverables: TaskDeliverable[] = (data || []).map(item => ({
        id: item.id,
        taskId: item.task_id,
        title: item.title,
        description: item.description || '',
        fileType: item.file_type as 'pdf' | 'doc' | 'txt' | 'table',
        content: item.content,
        downloadUrl: item.file_url,
        createdAt: item.created_at,
        agentId: item.agent_id
      }));
      
      setDeliverables(transformedDeliverables);
    } catch (error) {
      console.error('Error loading deliverables:', error);
    }
  };

  const regenerateTasksFromProfile = async () => {
    setLoading(true);
    setIsInitialized(false);
    await analyzeProfileAndGenerateTasks();
    setIsInitialized(true);
    setLoading(false);
  };

  const startTaskJourney = async (taskId: string) => {
    const task = coordinatorTasks.find(t => t.id === taskId);
    if (!task || !task.isUnlocked) return false;

    try {
      console.log('🎯 Master Coordinator: Starting task journey for', task.title);
      
      // Crear pasos detallados para la tarea
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'create_task_steps',
          taskId,
          taskData: task,
          profileContext: { profileData, businessProfile }
        }
      });

      if (error) throw error;

      toast({
        title: "¡Misión Activada!",
        description: `Vamos paso a paso con: ${task.title}`,
      });

      return true;
    } catch (error) {
      console.error('Error starting task journey:', error);
      return false;
    }
  };

  const completeTaskStep = async (taskId: string, stepId: string, stepData: any) => {
    try {
      console.log('✅ Master Coordinator: Completing step', stepId, 'for task', taskId);
      
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'complete_step',
          taskId,
          stepId,
          stepData,
          userId: user?.id
        }
      });

      if (error) throw error;

      // Actualizar el paso en el estado local
      setCoordinatorTasks(prev => prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            steps: task.steps.map(step => 
              step.id === stepId 
                ? { ...step, isCompleted: true }
                : step
            )
          };
        }
        return task;
      }));

      // Si todos los pasos están completos, generar entregable
      const task = coordinatorTasks.find(t => t.id === taskId);
      const allStepsCompleted = task?.steps.every(step => step.isCompleted || step.id === stepId);
      
      if (allStepsCompleted) {
        await generateTaskDeliverable(taskId);
      }

      return true;
    } catch (error) {
      console.error('Error completing step:', error);
      return false;
    }
  };

  const generateTaskDeliverable = async (taskId: string) => {
    try {
      console.log('📄 Master Coordinator: Generating deliverable for task', taskId);
      
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'generate_deliverable',
          taskId,
          userId: user?.id
        }
      });

      if (error) throw error;

      await loadDeliverables();
      
      toast({
        title: "¡Entregable Generado!",
        description: "Tu documento está listo en la sección 'Mis Avances'",
      });

    } catch (error) {
      console.error('Error generating deliverable:', error);
    }
  };

  const getNextUnlockedTask = () => {
    return coordinatorTasks.find(task => task.isUnlocked && 
      tasks.find(t => t.id === task.id)?.status === 'pending');
  };

  const getCoordinatorMessage = () => {
    const nextTask = getNextUnlockedTask();
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    if (!nextTask && completedCount === 0) {
      return {
        type: 'welcome',
        message: "¡Hola! Veo que acabas de completar tu análisis de madurez. Estos son los pasos específicos que debes seguir para hacer crecer tu emprendimiento. Vamos paso a paso, yo te acompaño."
      };
    }
    
    if (nextTask) {
      return {
        type: 'guidance',
        message: `Perfecto, tu siguiente misión es: "${nextTask.title}". Haz clic aquí para activarla y te guiaré paso a paso.`,
        taskId: nextTask.id
      };
    }
    
    return {
      type: 'progress',
      message: `¡Increíble! Has completado ${completedCount} tareas. Estás construyendo algo genial. ¿Quieres que evalúe tu progreso y te recomiende los siguientes pasos?`
    };
  };

  // Helper functions
  const getAgentName = (agentId: string) => {
    const agentNames: Record<string, string> = {
      'pricing-analyst': 'Especialista en Precios',
      'market-strategist': 'Estratega de Mercado',
      'ux-designer': 'Diseñador UX',
      'business-advisor': 'Asesor de Negocios'
    };
    return agentNames[agentId] || 'Especialista';
  };

  const getEstimatedTime = (title: string) => {
    if (title.includes('precio') || title.includes('costo')) return '30-45 min';
    if (title.includes('estrategia') || title.includes('plan')) return '1-2 horas';
    if (title.includes('diseño') || title.includes('interfaz')) return '45 min - 1 hora';
    return '30-60 min';
  };

  const getTaskCategory = (agentId: string) => {
    const categories: Record<string, string> = {
      'pricing-analyst': 'Monetización',
      'market-strategist': 'Marketing',
      'ux-designer': 'Experiencia de Usuario',
      'business-advisor': 'Estrategia'
    };
    return categories[agentId] || 'General';
  };

  const generateStepsForTask = (task: any): TaskStep[] => {
    // Generar pasos básicos - estos se expandirán con el coordinador
    return [
      {
        id: `${task.id}-step-1`,
        stepNumber: 1,
        title: 'Preparación inicial',
        description: 'Reunir información necesaria',
        isCompleted: false,
        isLocked: false,
        validationRequired: false,
        contextualHelp: 'Te ayudaré a identificar exactamente qué información necesitas.'
      },
      {
        id: `${task.id}-step-2`,
        stepNumber: 2,
        title: 'Desarrollo',
        description: 'Trabajo principal de la tarea',
        isCompleted: false,
        isLocked: true,
        validationRequired: true,
        contextualHelp: 'Trabajaremos juntos en cada detalle para asegurar el éxito.'
      },
      {
        id: `${task.id}-step-3`,
        stepNumber: 3,
        title: 'Finalización',
        description: 'Revisión y documentación',
        isCompleted: false,
        isLocked: true,
        validationRequired: true,
        contextualHelp: 'Validaremos el resultado y crearemos tu entregable personalizado.'
      }
    ];
  };

  return {
    coordinatorTasks,
    currentPath,
    deliverables,
    loading,
    coordinatorMessage: getCoordinatorMessage(),
    nextUnlockedTask: getNextUnlockedTask(),
    regenerateTasksFromProfile,
    analyzeProfileAndGenerateTasks,
    startTaskJourney,
    completeTaskStep,
    generateTaskDeliverable,
    loadDeliverables
  };
};