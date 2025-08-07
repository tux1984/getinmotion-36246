import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskStep } from '@/hooks/types/taskStepTypes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { StepExamplesSection } from './StepExamplesSection';
import { AIReviewer } from './AIReviewer';
import { ModernStepCard } from './ModernStepCard';
import { cn } from '@/lib/utils';

interface StepExecutionModuleProps {
  step: TaskStep;
  stepIndex: number;
  totalSteps: number;
  isCurrentStep: boolean;
  canAdvance: boolean;
  onUpdateData: (stepId: string, data: any) => void;
  onValidateStep: (stepId: string, type: 'manual', confirmation?: string) => Promise<boolean>;
  onMoveNext: () => void;
  onMovePrevious: () => void;
  onSelectStep: (index: number) => void;
}

export const StepExecutionModule: React.FC<StepExecutionModuleProps> = ({
  step,
  stepIndex,
  totalSteps,
  isCurrentStep,
  canAdvance,
  onUpdateData,
  onValidateStep,
  onMoveNext,
  onMovePrevious,
  onSelectStep
}) => {
  const [inputValue, setInputValue] = useState(step.user_input_data?.text || '');
  const [isValidating, setIsValidating] = useState(false);
  const [aiApproval, setAiApproval] = useState<{ isValid: boolean; feedback?: string } | null>(null);
  
  const isCompleted = step.completion_status === 'completed';
  const isInProgress = step.completion_status === 'in_progress';

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onUpdateData(step.id, { text: value });
  };

  const handleAIReview = (isValid: boolean, feedback?: string) => {
    setAiApproval({ isValid, feedback });
  };

  const handleValidateStep = async () => {
    if (!inputValue.trim() || !aiApproval?.isValid) return;
    
    setIsValidating(true);
    const success = await onValidateStep(step.id, 'manual', aiApproval.feedback || 'Paso completado por el usuario');
    if (success && canAdvance) {
      setTimeout(() => onMoveNext(), 1000);
    }
    setIsValidating(false);
  };

  const getPlaceholderText = () => {
    const title = step.title.toLowerCase();
    
    if (title.includes('características') || title.includes('features')) {
      return "Ejemplo: Productos hechos a mano con materiales naturales, diseños únicos personalizables, técnica artesanal tradicional...";
    }
    if (title.includes('beneficios') || title.includes('benefits')) {
      return "Ejemplo: Mis clientes obtienen productos únicos que expresan su personalidad, materiales duraderos que dan valor por años...";
    }
    if (title.includes('precio') || title.includes('pricing')) {
      return "Ejemplo: Precios desde $50 para productos básicos hasta $200 para piezas personalizadas, competitivos con productos artesanales similares...";
    }
    
    return "Describe tu respuesta de manera específica y detallada...";
  };

  const renderStepInput = () => {
    switch (step.input_type) {
      case 'text':
        return (
          <Textarea
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="min-h-[120px]"
            disabled={isCompleted}
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="https://ejemplo.com"
            disabled={isCompleted}
          />
        );
      default:
        return (
          <Textarea
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="min-h-[120px]"
            disabled={isCompleted}
          />
        );
    }
  };

  const canCompleteStep = () => {
    return inputValue.length >= 20 && aiApproval?.isValid;
  };

  return (
    <ModernStepCard
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title={step.title}
      description={step.description}
      isCurrentStep={isCurrentStep}
      isCompleted={isCompleted}
      isInProgress={isInProgress}
      onClick={() => onSelectStep(stepIndex)}
    >
      <div className="space-y-6">
        {/* Examples Section - Always visible when step is active */}
        {isCurrentStep && (
          <StepExamplesSection 
            stepTitle={step.title}
            stepDescription={step.description}
          />
        )}

        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Tu respuesta:
            </label>
            {renderStepInput()}
          </div>

          {/* AI Reviewer - Auto-reviews content */}
          {isCurrentStep && inputValue.length >= 10 && (
            <AIReviewer
              content={inputValue}
              stepTitle={step.title}
              onReviewComplete={handleAIReview}
              disabled={isCompleted}
            />
          )}
        </div>

        {/* Validation Section */}
        {isCurrentStep && inputValue.trim() && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Button
              onClick={handleValidateStep}
              disabled={!canCompleteStep() || isValidating}
              className="w-full"
              size="lg"
            >
              {isValidating ? (
                <>Completando paso...</>
              ) : (
                <>
                  Completar paso {stepIndex + 1}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            
            {/* Status messages */}
            {inputValue.length < 20 && (
              <p className="text-xs text-muted-foreground text-center">
                Necesitas al menos 20 caracteres para que la IA pueda revisar tu respuesta
              </p>
            )}
            
            {inputValue.length >= 20 && !aiApproval && (
              <p className="text-xs text-muted-foreground text-center">
                La IA está revisando tu respuesta...
              </p>
            )}
            
            {aiApproval && !aiApproval.isValid && (
              <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                Mejora tu respuesta según las sugerencias de la IA para continuar
              </p>
            )}
            
            {aiApproval?.isValid && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
                ✓ Tu respuesta está lista. Puedes completar este paso.
              </p>
            )}
          </motion.div>
        )}

        {/* Navigation */}
        {isCurrentStep && (stepIndex > 0 || (isCompleted && stepIndex < totalSteps - 1)) && (
          <div className="flex justify-between pt-4 border-t border-border/30">
            {stepIndex > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMovePrevious}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
            )}
            
            {isCompleted && stepIndex < totalSteps - 1 && (
              <Button
                size="sm"
                onClick={onMoveNext}
                className="ml-auto"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>
    </ModernStepCard>
  );
};