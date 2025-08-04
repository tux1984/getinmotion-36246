import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TaskStep, StepValidation, StepInputData } from './types/taskStepTypes';

export function useTaskSteps(taskId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const fetchSteps = useCallback(async () => {
    if (!user || !taskId) return;

    try {
      const { data, error } = await supabase
        .from('task_steps')
        .select('*')
        .eq('task_id', taskId)
        .order('step_number', { ascending: true });

      if (error) throw error;
      
      setSteps(data || []);
      
      // Find first incomplete step
      const firstIncomplete = data?.findIndex(step => step.completion_status !== 'completed') ?? 0;
      setCurrentStepIndex(Math.max(0, firstIncomplete));
    } catch (error) {
      console.error('Error fetching task steps:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pasos de la tarea',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, taskId, toast]);

  const updateStepData = useCallback(async (stepId: string, inputData: any) => {
    try {
      const { error } = await supabase
        .from('task_steps')
        .update({
          user_input_data: inputData,
          completion_status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', stepId);

      if (error) throw error;
      
      // Update local state
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, user_input_data: inputData, completion_status: 'in_progress' }
          : step
      ));
    } catch (error) {
      console.error('Error updating step data:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el paso',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const validateStep = useCallback(async (
    stepId: string, 
    validationType: 'automatic' | 'ai_assisted' | 'manual',
    userConfirmation?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Create validation record
      const validationData = {
        step_id: stepId,
        user_id: user.id,
        validation_type: validationType,
        validation_result: 'pending',
        user_confirmation: userConfirmation,
        created_at: new Date().toISOString()
      };

      const { data: validation, error: validationError } = await supabase
        .from('step_validations')
        .insert(validationData)
        .select()
        .single();

      if (validationError) throw validationError;

      // For now, manual validation always passes if user confirms
      if (validationType === 'manual' && userConfirmation) {
        const { error: updateError } = await supabase
          .from('step_validations')
          .update({ validation_result: 'passed' })
          .eq('id', validation.id);

        if (updateError) throw updateError;

        // Mark step as completed
        await supabase
          .from('task_steps')
          .update({ completion_status: 'completed' })
          .eq('id', stepId);

        // Update local state
        setSteps(prev => prev.map(step => 
          step.id === stepId 
            ? { ...step, completion_status: 'completed' }
            : step
        ));

        toast({
          title: 'Paso completado',
          description: 'El paso ha sido marcado como completado',
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating step:', error);
      toast({
        title: 'Error',
        description: 'No se pudo validar el paso',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

  const moveToNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const moveToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const canAdvanceToStep = useCallback((targetIndex: number) => {
    // Can always go to previous steps
    if (targetIndex <= currentStepIndex) return true;
    
    // Can only advance if all previous steps are completed
    for (let i = 0; i < targetIndex; i++) {
      if (steps[i]?.completion_status !== 'completed') {
        return false;
      }
    }
    return true;
  }, [currentStepIndex, steps]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`task-steps-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_steps',
          filter: `task_id=eq.${taskId}`,
        },
        () => {
          fetchSteps();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, fetchSteps]);

  return {
    steps,
    loading,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    updateStepData,
    validateStep,
    moveToNextStep,
    moveToPreviousStep,
    canAdvanceToStep,
    setCurrentStepIndex: (index: number) => {
      if (canAdvanceToStep(index)) {
        setCurrentStepIndex(index);
      }
    },
    refreshSteps: fetchSteps
  };
}