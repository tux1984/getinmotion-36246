import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { getAgentById } from '@/data/agentsDatabase';
import { DashboardBackground } from './DashboardBackground';
import { GuidedTaskExecution } from '@/components/tasks/GuidedTaskExecution';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TaskExecutionInterfaceProps {
  agentId: string;
  language: 'en' | 'es';
  onComplete: () => void;
  onReturnToCoordinator: () => void;
}

export const TaskExecutionInterface: React.FC<TaskExecutionInterfaceProps> = ({
  agentId,
  language,
  onComplete,
  onReturnToCoordinator
}) => {
  const { user } = useAuth();
  const { tasks, createTask } = useAgentTasks(agentId);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  const agent = getAgentById(agentId);
  
  useEffect(() => {
    // Auto-create a task if none exists for this agent
    if (user && tasks.length === 0 && !isCreatingTask && agent) {
      setIsCreatingTask(true);
      createDefaultTask();
    }
  }, [user, tasks, agentId, agent]);

  const createDefaultTask = async () => {
    const defaultSteps = getStepsForAgent(agentId);
    
    try {
      const newTask = await createTask({
        agent_id: agentId,
        title: `Trabajo con ${agent?.name || 'Agente'}`,
        description: `Tarea paso a paso con ${agent?.name || 'el agente'} para alcanzar tus objetivos`,
        status: 'in_progress',
        relevance: 'high',
        priority: 1
      });

      if (newTask) {
        // Create steps for the task
        await createTaskSteps(newTask.id, defaultSteps);
        setSelectedTask(newTask);
      }
    } catch (error) {
      console.error('Error creating default task:', error);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const createTaskSteps = async (taskId: string, stepTitles: string[]) => {
    for (let i = 0; i < stepTitles.length; i++) {
      const stepData = {
        task_id: taskId,
        step_number: i + 1,
        title: stepTitles[i],
        description: getHelpContent(agentId, i + 1),
        input_type: 'text',
        ai_context_prompt: `Ayuda al usuario a completar: ${stepTitles[i]}. Contexto del agente: ${agent?.description || 'Agente especializado'}`,
        validation_criteria: {},
        completion_status: 'pending',
        user_input_data: {},
        ai_assistance_log: []
      };

      await supabase.from('task_steps').insert(stepData);
    }
  };

  const getStepsForAgent = (agentId: string) => {
    const stepsByAgent = {
      'cost-calculator': [
        'Identificar todos los materiales necesarios',
        'Calcular costos de mano de obra',
        'Determinar gastos generales',
        'Establecer margen de ganancia',
        'Definir precio final de venta'
      ],
      'cultural-consultant': [
        'Definir tu propuesta creativa única',
        'Identificar tu audiencia objetivo',
        'Analizar la competencia',
        'Validar demanda del mercado',
        'Crear plan de lanzamiento'
      ],
      'collaboration-agreement': [
        'Definir términos de colaboración',
        'Establecer derechos de propiedad',
        'Determinar responsabilidades',
        'Acordar compensación',
        'Firmar y ejecutar acuerdo'
      ],
      'marketing-advisor': [
        'Analizar tu mercado objetivo',
        'Definir mensaje de marca',
        'Seleccionar canales de marketing',
        'Crear calendario de contenido',
        'Medir y optimizar resultados'
      ],
      'project-manager': [
        'Planificar estructura del proyecto',
        'Definir entregables y timeline',
        'Asignar recursos necesarios',
        'Establecer sistema de seguimiento',
        'Implementar flujo de trabajo'
      ]
    };

    return stepsByAgent[agentId] || [
      'Analizar situación actual',
      'Definir objetivos específicos',
      'Crear plan de acción',
      'Implementar soluciones',
      'Evaluar resultados'
    ];
  };

  const getHelpContent = (agentId: string, step: number) => {
    const helpByAgent = {
      'cost-calculator': [
        'Incluye materiales directos, herramientas, y cualquier insumo específico para tu obra.',
        'Calcula las horas invertidas y multiplica por tu tarifa horaria deseada.',
        'Considera electricidad, alquiler del espacio, seguros, y otros costos indirectos.',
        'Un margen del 20-40% es común en productos creativos, dependiendo del mercado.',
        'Redondea a números amigables y considera la percepción de valor del cliente.'
      ]
    };

    return helpByAgent[agentId]?.[step - 1] || 'Completa este paso siguiendo las instrucciones del agente.';
  };

  if (!agent) {
    return (
      <DashboardBackground>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <p>Agente no encontrado</p>
            <Button onClick={onReturnToCoordinator} className="mt-4">
              Volver al Coordinador Maestro
            </Button>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  if (isCreatingTask) {
    return (
      <DashboardBackground showGlobalComponents={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Preparando tu sesión con {agent.name}...</p>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  const currentTask = selectedTask || tasks[0];

  return (
    <DashboardBackground showGlobalComponents={false}>
      <div className="min-h-screen">
        {/* Header with Agent Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={onReturnToCoordinator}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Coordinador
                </Button>
                <div className="h-6 w-px bg-gray-600" />
                <div className="flex items-center gap-3">
                  <Avatar className={`h-10 w-10 ${agent.color}`}>
                    <AvatarFallback className="text-white">
                      <agent.icon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                    <Badge variant="secondary" className="text-xs">
                      {agent.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {currentTask ? (
            <GuidedTaskExecution task={currentTask} />
          ) : (
            <Card>
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  No hay tareas activas para este agente.
                </p>
                <Button onClick={createDefaultTask} className="mt-4">
                  Crear nueva tarea
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardBackground>
  );
};