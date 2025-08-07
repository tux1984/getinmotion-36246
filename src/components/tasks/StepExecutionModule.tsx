import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskStep } from '@/hooks/types/taskStepTypes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Bot, Send, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useStepAI } from '@/hooks/useStepAI';
import { StepGuideCard } from './StepGuideCard';
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
    if (!inputValue.trim()) return;
    
    setIsValidating(true);
    const success = await onValidateStep(step.id, 'manual', 'Paso completado por el usuario');
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
          <CardContent className="space-y-6">
            {/* Guide Section - Only show for current step */}
            {isCurrentStep && (
              <StepGuideCard step={step} />
            )}

            {/* Input Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">
                  Tu respuesta:
                </label>
                {inputValue.trim() && (
                  <Badge variant="secondary" className="text-xs">
                    {inputValue.length} caracteres
                  </Badge>
                )}
              </div>
              {renderStepInput()}
              
              {/* Character count and validation hint */}
              {isCurrentStep && inputValue.length < 50 && (
                <p className="text-xs text-muted-foreground">
                  💡 Sé específico: Respuestas más detalladas (al menos 50 caracteres) generan mejores resultados
                </p>
              )}
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
                  <Sparkles className="h-4 w-4 mr-2" />
                  {showAI ? 'Ocultar asistente IA' : '✨ Obtener ayuda personalizada'}
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
                    
                    <div className="space-y-2 mt-3">
                      {/* Quick suggestion buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAIMessage("Dame 3 ejemplos específicos para mi tipo de negocio")}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          Ver ejemplos
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAIMessage("¿Cómo puedo hacer mi respuesta más específica y efectiva?")}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          Mejorar respuesta
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAIMessage("¿Qué información debería incluir que tal vez no estoy considerando?")}
                          disabled={isLoading}
                          className="text-xs"
                        >
                          Qué agregar
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Haz una pregunta específica..."
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    ¿Completaste tu respuesta?
                  </label>
                  {inputValue.length >= 50 && (
                    <Badge variant="secondary" className="text-xs text-green-700 bg-green-50">
                      ✓ Respuesta completa
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={handleValidateStep}
                  disabled={inputValue.length < 20 || isValidating}
                  className="w-full"
                  size="lg"
                >
                  {isValidating ? 'Completando paso...' : 'Completar este paso'}
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
                
                {inputValue.length < 20 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Necesitas al menos 20 caracteres para completar el paso
                  </p>
                )}
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