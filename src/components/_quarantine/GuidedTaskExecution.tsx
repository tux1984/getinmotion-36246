import React from 'react';
import { motion } from 'framer-motion';
import { AgentTask } from '@/hooks/types/agentTaskTypes';
import { useTaskSteps } from '@/hooks/useTaskSteps';
import { StepExecutionModule } from './StepExecutionModule';
import { TaskContextCard } from './TaskContextCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidedTaskExecutionProps {
  task: AgentTask;
}

export const GuidedTaskExecution: React.FC<GuidedTaskExecutionProps> = ({ task }) => {
  const {
    steps,
    loading,
    currentStepIndex,
    currentStep,
    updateStepData,
    validateStep,
    moveToNextStep,
    moveToPreviousStep,
    canAdvanceToStep,
    setCurrentStepIndex
  } = useTaskSteps(task.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">
            {!steps.length && task.status === 'in_progress' 
              ? 'Generando pasos de la tarea...' 
              : 'Cargando pasos de la tarea...'
            }
          </p>
        </div>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {task.status === 'pending' ? 'Tarea pendiente' : 'Generando pasos...'}
          </h3>
          <p className="text-muted-foreground">
            {task.status === 'pending' 
              ? 'Esta tarea está pendiente. Inicia la tarea para generar los pasos automáticamente.'
              : 'Los pasos se están generando automáticamente. Esto puede tomar unos momentos...'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedSteps = steps.filter(step => step.completion_status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Task Context - What will you achieve */}
      <TaskContextCard 
        task={task} 
        currentStepIndex={currentStepIndex} 
        totalSteps={steps.length} 
      />

      {/* Task Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
            <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
              {task.status === 'completed' ? 'Completada' : 'En progreso'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso general</span>
              <span className="font-medium">
                {completedSteps} de {steps.length} pasos completados
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            {/* Step Indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => canAdvanceToStep(index) && setCurrentStepIndex(index)}
                  disabled={!canAdvanceToStep(index)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all",
                    step.completion_status === 'completed'
                      ? "bg-success/20 text-success hover:bg-success/30"
                      : index === currentStepIndex
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : canAdvanceToStep(index)
                      ? "bg-muted hover:bg-muted/80"
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {step.completion_status === 'completed' ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : index === currentStepIndex ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-current" />
                  )}
                  Paso {index + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps Execution */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <StepExecutionModule
            key={step.id}
            step={step}
            stepIndex={index}
            totalSteps={steps.length}
            isCurrentStep={index === currentStepIndex}
            canAdvance={canAdvanceToStep(index + 1)}
            onUpdateData={updateStepData}
            onValidateStep={validateStep}
            onMoveNext={moveToNextStep}
            onMovePrevious={moveToPreviousStep}
            onSelectStep={setCurrentStepIndex}
          />
        ))}
      </div>

      {/* Completion Message */}
      {completedSteps === steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-success bg-success/5">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-success">¡Tarea completada!</h3>
              <p className="text-muted-foreground">
                Has completado todos los pasos de esta tarea. ¡Excelente trabajo!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};