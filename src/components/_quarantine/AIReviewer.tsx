import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIMessageFormatter } from './AIMessageFormatter';

interface AIReviewerProps {
  content: string;
  stepTitle: string;
  onReviewComplete: (isValid: boolean, feedback?: string) => void;
  disabled?: boolean;
}

type ReviewStatus = 'idle' | 'reviewing' | 'needs_improvement' | 'approved';

export const AIReviewer: React.FC<AIReviewerProps> = ({
  content,
  stepTitle,
  onReviewComplete,
  disabled = false
}) => {
  const [status, setStatus] = useState<ReviewStatus>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-review after user stops typing
  useEffect(() => {
    if (disabled || content.length < 10) {
      setStatus('idle');
      return;
    }

    clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      if (content.length >= 20) {
        performReview();
      }
    }, 2000); // Wait 2 seconds after user stops typing

    return () => clearTimeout(timeoutRef.current);
  }, [content, disabled]);

  const performReview = async () => {
    setIsLoading(true);
    setStatus('reviewing');

    try {
      const response = await fetch('/functions/v1/step-ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Por favor revisa el siguiente contenido para el paso "${stepTitle}". Evalúa si es suficientemente detallado, específico y útil. Si necesita mejoras, da sugerencias específicas de qué agregar o cambiar. Si está bien, simplemente di que está listo para continuar.

Contenido a revisar: "${content}"

Responde en este formato:
- Si necesita mejoras: Empieza con "MEJORAR:" seguido de sugerencias específicas
- Si está aprobado: Empieza con "APROBADO:" seguido de comentarios positivos`,
          step: {
            title: stepTitle,
            description: `Revisión de contenido para ${stepTitle}`,
            input_type: 'text'
          },
          language: 'es',
          conversationHistory: []
        })
      });

      const data = await response.json();
      
      if (data.message) {
        const reviewResult = data.message;
        setFeedback(reviewResult);
        
        if (reviewResult.startsWith('APROBADO:')) {
          setStatus('approved');
          onReviewComplete(true, reviewResult.replace('APROBADO:', '').trim());
        } else if (reviewResult.startsWith('MEJORAR:')) {
          setStatus('needs_improvement');
          onReviewComplete(false, reviewResult.replace('MEJORAR:', '').trim());
        } else {
          // Fallback - analyze the tone
          const isPositive = reviewResult.toLowerCase().includes('bien') || 
                           reviewResult.toLowerCase().includes('bueno') ||
                           reviewResult.toLowerCase().includes('excelente') ||
                           reviewResult.toLowerCase().includes('correcto');
          
          setStatus(isPositive ? 'approved' : 'needs_improvement');
          onReviewComplete(isPositive, reviewResult);
        }
      }
    } catch (error) {
      console.error('Error reviewing content:', error);
      setStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'reviewing':
        return {
          badge: { variant: 'secondary', text: 'Revisando...' },
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'needs_improvement':
        return {
          badge: { variant: 'secondary', text: 'Necesita mejoras' },
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          borderColor: 'border-amber-200 dark:border-amber-800'
        };
      case 'approved':
        return {
          badge: { variant: 'secondary', text: 'Aprobado' },
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
          borderColor: 'border-emerald-200 dark:border-emerald-800'
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig || disabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`rounded-lg border p-3 ${statusConfig.bgColor} ${statusConfig.borderColor}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Revisión AI</span>
          <Badge variant={statusConfig.badge.variant as any} className="text-xs">
            {statusConfig.badge.text}
          </Badge>
        </div>
        
        {feedback && (
          <div className="mt-2">
            <AIMessageFormatter 
              content={feedback} 
              className="text-sm"
            />
          </div>
        )}
        
        {status === 'needs_improvement' && (
          <div className="mt-3 pt-2 border-t border-current/10">
            <Button
              variant="outline"
              size="sm"
              onClick={performReview}
              disabled={isLoading}
              className="text-xs h-7"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Revisar nuevamente
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};