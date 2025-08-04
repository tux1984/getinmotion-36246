import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskStep } from '@/hooks/types/taskStepTypes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Bot, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStepAI } from '@/hooks/useStepAI';
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
  const [showAI, setShowAI] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const { messages, isLoading, sendMessage } = useStepAI(step);
  
  const isCompleted = step.completion_status === 'completed';
  const isInProgress = step.completion_status === 'in_progress';

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onUpdateData(step.id, { text: value });
  };

  const handleAIMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleValidateStep = async () => {
    if (!confirmationText.trim()) return;
    
    setIsValidating(true);
    const success = await onValidateStep(step.id, 'manual', confirmationText);
    if (success && canAdvance) {
      setTimeout(() => onMoveNext(), 1000);
    }
    setIsValidating(false);
  };

  const renderStepInput = () => {
    switch (step.input_type) {
      case 'text':
        return (
          <Textarea
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className="min-h-[100px]"
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
            placeholder="Completa este paso..."
            className="min-h-[100px]"
            disabled={isCompleted}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className={cn(
        "transition-all duration-300",
        isCurrentStep && "ring-2 ring-primary",
        isCompleted && "bg-muted/30 border-success"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectStep(stepIndex)}
                className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
              >
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <Circle className={cn(
                    "h-6 w-6",
                    isCurrentStep ? "text-primary" : "text-muted-foreground"
                  )} />
                )}
                <div>
                  <Badge variant={isCurrentStep ? "default" : "secondary"}>
                    Paso {stepIndex + 1} de {totalSteps}
                  </Badge>
                </div>
              </button>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            </div>
          </div>
        </CardHeader>

        {(isCurrentStep || isInProgress || isCompleted) && (
          <CardContent className="space-y-4">
            {/* Input Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tu respuesta:
              </label>
              {renderStepInput()}
            </div>

            {/* AI Assistant Section */}
            {isCurrentStep && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAI(!showAI)}
                  className="w-full"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  {showAI ? 'Ocultar asistente' : '🤖 ¿Necesitas ayuda con este paso?'}
                </Button>

                {showAI && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border rounded-lg p-3 bg-background/50"
                  >
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-2 rounded text-sm",
                            message.role === 'user' 
                              ? "bg-primary text-primary-foreground ml-4" 
                              : "bg-muted mr-4"
                          )}
                        >
                          {message.content}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="bg-muted mr-4 p-2 rounded text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Pregunta sobre este paso..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            handleAIMessage(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim()) {
                            handleAIMessage(input.value);
                            input.value = '';
                          }
                        }}
                        disabled={isLoading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Validation Section */}
            {isCurrentStep && inputValue.trim() && !isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 border-t pt-4"
              >
                <label className="text-sm font-medium">
                  ¿Has completado este paso? Describe brevemente qué hiciste:
                </label>
                <Textarea
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Ejemplo: 'Definí mis canales principales como redes sociales, email marketing y eventos locales'"
                  className="min-h-[60px]"
                />
                <Button
                  onClick={handleValidateStep}
                  disabled={!confirmationText.trim() || isValidating}
                  className="w-full"
                >
                  {isValidating ? 'Validando...' : 'Marcar como completado'}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Navigation */}
            {isCurrentStep && (
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={onMovePrevious}
                  disabled={stepIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                
                <Button
                  onClick={onMoveNext}
                  disabled={!isCompleted || stepIndex === totalSteps - 1}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};