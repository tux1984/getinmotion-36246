import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOptimizedMaturityScores } from './useOptimizedMaturityScores';
import { useUserBusinessProfile } from './useUserBusinessProfile';
import { useToast } from '@/hooks/use-toast';
import { useAgentTasks } from './useAgentTasks';
import { useTaskLimits } from './useTaskLimits';
import { useTaskGenerationControl } from './useTaskGenerationControl';
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
  const { isAtLimit, getLimitMessage } = useTaskLimits(tasks);
  const { allowAutoGeneration } = useTaskGenerationControl();
  
  const [coordinatorTasks, setCoordinatorTasks] = useState<CoordinatorTask[]>([]);
  const [currentPath, setCurrentPath] = useState<CoordinatorTask[]>([]);
  const [deliverables, setDeliverables] = useState<TaskDeliverable[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // FASE 1: Análisis inteligente del perfil para generar tareas personalizadas
  const analyzeProfileAndGenerateTasks = useCallback(async () => {
    if (!user || loading) {
      console.warn('🚫 Master Coordinator: No user available or already generating tasks');
      return;
    }

    // Verificar límite de tareas activas
    if (isAtLimit) {
      console.warn('🚫 Master Coordinator: Active tasks limit reached');
      toast({
        title: "Límite de Tareas Alcanzado",
        description: getLimitMessage('es'),
        variant: "destructive"
      });
      return;
    }

    console.log('🧠 Master Coordinator: Analyzing COMPLETE profile and generating INTELLIGENT tasks');
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'analyze_and_generate_tasks',
          userId: user.id,
          userProfile: profileData || null,
          maturityScores: currentScores || null,
          businessProfile: businessProfile || null
        }
      });

      if (error) {
        console.error('❌ Master Coordinator: Error from edge function:', error);
        throw error;
      }

      if (data?.tasks) {
        console.log(`✅ Master Coordinator: Generated ${data.tasks.length} ultra-personalized tasks`);
        
        toast({
          title: "¡Tareas Inteligentes Generadas!",
          description: `He creado ${data.tasks.length} tareas específicas basadas en tu perfil completo.`,
        });
        
        return data.tasks;
      } else {
        console.warn('⚠️ Master Coordinator: No tasks returned from edge function');
      }
    } catch (error) {
      console.error('❌ Master Coordinator: Error generating tasks:', error);
      toast({
        title: "Error al Generar Tareas",
        description: "Hubo un problema generando tus tareas personalizadas. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, profileData, currentScores, businessProfile, toast, isAtLimit, getLimitMessage]);

  // FASE 2: Generar preguntas inteligentes contextuales
  const generateIntelligentQuestions = useCallback(async () => {
    if (!user?.id) return [];

    console.log('🤔 Master Coordinator: Generating intelligent contextual questions');
    
    try {
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'generate_intelligent_questions',
          userId: user.id,
          userProfile: profileData || null,
          maturityScores: currentScores || null,
          businessProfile: businessProfile || null
        }
      });

      if (error) throw error;

      if (data?.questions) {
        console.log(`✅ Generated ${data.questions.length} intelligent questions`);
        return data.questions;
      }
      return [];
    } catch (error) {
      console.error('❌ Error generating intelligent questions:', error);
      return [];
    }
  }, [user?.id, profileData, currentScores, businessProfile]);

  // Convertir tareas normales a tareas del coordinador con lógica de desbloqueo
  const transformToCoordinatorTasks = useMemo(() => {
    // Validaciones para evitar errores de variables no inicializadas
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      console.log('🔍 useMasterCoordinator: No tasks available for transformation');
      return [];
    }

    try {
      const validTasks = tasks.filter(task => task && task.id);
      
      if (validTasks.length === 0) {
        console.log('🔍 useMasterCoordinator: No valid tasks found');
        return [];
      }
      
      const sortedTasks = validTasks.sort((a, b) => {
        const relevanceOrder = { high: 3, medium: 2, low: 1 };
        const aRelevance = relevanceOrder[a.relevance as keyof typeof relevanceOrder] || 2;
        const bRelevance = relevanceOrder[b.relevance as keyof typeof relevanceOrder] || 2;
        
        if (aRelevance !== bRelevance) {
          return bRelevance - aRelevance;
        }
        return (a.priority || 1) - (b.priority || 1);
      });

      console.log('🔍 useMasterCoordinator: Transforming', sortedTasks.length, 'tasks');

      return sortedTasks.slice(0, 15).map((task, index) => {
        if (!task || !task.id) {
          console.warn('🚫 useMasterCoordinator: Invalid task encountered:', task);
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
          isUnlocked: index === 0 || validTasks.slice(0, index).some(t => t.status === 'completed'),
          prerequisiteTasks: index > 0 && sortedTasks[index - 1] ? [sortedTasks[index - 1].id] : [],
          steps: generateStepsForTask(task)
        };
      }).filter(Boolean); // Remove any null entries
    } catch (error) {
      console.error('❌ Error transforming tasks:', error);
      return [];
    }
  }, [tasks]);

  // Generate initial tasks only when auto-generation is allowed (after maturity test)
  const generateInitialTasks = useCallback(async () => {
    if (!allowAutoGeneration || !user?.id || isInitialized || loading || tasks.length > 0) {
      console.log('🚫 Skipping auto task generation:', { 
        allowAutoGeneration, 
        userId: user?.id, 
        isInitialized, 
        loading, 
        tasksCount: tasks.length 
      });
      return;
    }

    console.log('🚀 Master Coordinator: Auto-generating initial tasks after maturity test completion');
    
    try {
      await analyzeProfileAndGenerateTasks();
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error in initial task generation:', error);
    }
  }, [allowAutoGeneration, user?.id, isInitialized, loading, tasks.length, analyzeProfileAndGenerateTasks]);

  // Auto-initialize only when conditions are met
  useEffect(() => {
    if (allowAutoGeneration && user?.id && !isInitialized && tasks.length === 0 && !loading) {
      // Debounce para evitar múltiples llamadas
      const timeoutId = setTimeout(generateInitialTasks, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [allowAutoGeneration, generateInitialTasks]);

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
    console.log('🎯 Master Coordinator: Starting task journey for', taskId);
    
    // First check if this is a default task or coordinator task
    const coordinatorTask = coordinatorTasks.find(t => t.id === taskId);
    const regularTask = tasks.find(t => t.id === taskId);
    
    // For default tasks, create them first
    if (taskId.startsWith('default-') && !regularTask) {
      console.log('📝 Creating new task from default recommendation');
      
      try {
        const defaultTask = coordinatorTask;
        if (!defaultTask) {
          throw new Error('Default task not found');
        }

        const { data: newTask, error: createError } = await supabase
          .from('agent_tasks')
          .insert({
            user_id: user?.id,
            agent_id: defaultTask.agentId,
            title: defaultTask.title,
            description: defaultTask.description,
            relevance: defaultTask.relevance,
            priority: defaultTask.priority,
            status: 'in_progress'
          })
          .select()
          .single();

        if (createError) throw createError;
        
        // Update the taskId to the newly created task
        taskId = newTask.id;
        console.log('✅ New task created:', newTask.id);
        
      } catch (error) {
        console.error('❌ Error creating task:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la tarea. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return false;
      }
    }

    const task = coordinatorTask || regularTask;
    if (!task) {
      console.error('❌ Task not found:', taskId);
      return false;
    }

    try {
      // Check if steps already exist for this task
      const { data: existingSteps, error: stepsError } = await supabase
        .from('task_steps')
        .select('id')
        .eq('task_id', taskId);
      
      if (stepsError) throw stepsError;
      
      // Create steps if they don't exist
      if (!existingSteps || existingSteps.length === 0) {
        console.log('📝 Creating steps for task:', task.title);
        
        const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
          body: {
            action: 'create_task_steps',
            taskId,
            taskData: task,
            profileContext: { 
              profileData: profileData || null, 
              businessProfile: businessProfile || null 
            }
          }
        });

        if (error) {
          console.error('❌ Error creating steps:', error);
          throw error;
        }
        
        console.log('✅ Steps created successfully:', data);
      } else {
        console.log('✅ Steps already exist for this task');
      }

      // Update task status to in progress
      const { error: updateError } = await supabase
        .from('agent_tasks')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
      
      if (updateError) {
        console.warn('⚠️ Could not update task status:', updateError);
        // Don't fail the entire operation for this
      }

      return true;
    } catch (error) {
      console.error('❌ Error starting task journey:', error);
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

  // FASE 4: Mensaje inteligente del coordinador
  const getCoordinatorMessage = () => {
    try {
      const nextTask = getNextUnlockedTask();
      const completedCount = tasks.filter(t => t.status === 'completed').length;
      const rawName = businessProfile?.brandName ?? businessProfile?.businessDescription;
      const businessName = typeof rawName === 'string' && rawName.trim().length > 0 ? rawName : 'tu negocio';
      
      let result;
      if (!nextTask && completedCount === 0) {
        result = {
          type: 'welcome',
          message: `¡Hola! He analizado tu perfil completo y generé tareas específicas para ${businessName}. Estas son las recomendaciones exactas que necesitas para hacer crecer tu emprendimiento. ¡Vamos paso a paso!`
        };
      } else if (nextTask) {
        result = {
          type: 'guidance',
          message: `Perfecto, tu siguiente misión para ${businessName} es: "${nextTask.title}". Haz clic en "Empezar ahora" y te guiaré paso a paso con detalles específicos.`,
          taskId: nextTask.id
        };
      } else {
        result = {
          type: 'progress',
          message: `¡Increíble! Has completado ${completedCount} tareas para ${businessName}. Estás construyendo algo realmente sólido. ¿Quieres que analice tu progreso y genere las siguientes recomendaciones?`
        };
      }
      
      console.log('🔍 useMasterCoordinator: getCoordinatorMessage result:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in getCoordinatorMessage:', error);
      return { type: 'error', message: 'Analyzing your business profile...' };
    }
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
    generateInitialTasks,
    generateIntelligentQuestions,
    startTaskJourney,
    completeTaskStep,
    generateTaskDeliverable,
    loadDeliverables
  };
};