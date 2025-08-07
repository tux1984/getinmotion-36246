import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ModernStepCardProps {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  isCurrentStep: boolean;
  isCompleted: boolean;
  isInProgress: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export const ModernStepCard: React.FC<ModernStepCardProps> = ({
  stepIndex,
  totalSteps,
  title,
  description,
  isCurrentStep,
  isCompleted,
  isInProgress,
  onClick,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepIndex * 0.1 }}
      className="w-full"
    >
      <div
        className={cn(
          "relative rounded-xl border transition-all duration-300 overflow-hidden",
          "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
          isCurrentStep && [
            "ring-2 ring-primary/50 shadow-lg shadow-primary/10",
            "border-primary/30"
          ],
          isCompleted && [
            "border-emerald-200 dark:border-emerald-800",
            "bg-gradient-to-br from-emerald-50/80 to-emerald-50/20 dark:from-emerald-950/80 dark:to-emerald-950/20"
          ],
          !isCurrentStep && !isCompleted && "hover:shadow-md hover:border-border/60"
        )}
      >
        {/* Glowing effect for current step */}
        {isCurrentStep && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 pointer-events-none" />
        )}
        
        {/* Header */}
        <div 
          className="p-4 cursor-pointer"
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            {/* Step Icon */}
            <div className="relative">
              {isCompleted ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors",
                  isCurrentStep 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-muted-foreground/30 text-muted-foreground"
                )}>
                  {isCurrentStep && <Sparkles className="h-4 w-4" />}
                  {!isCurrentStep && !isCompleted && (
                    <span className="text-sm font-semibold">{stepIndex + 1}</span>
                  )}
                </div>
              )}
              
              {/* Progress indicator */}
              {isCurrentStep && (
                <motion.div
                  className="absolute -inset-1 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            
            {/* Step Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant={isCurrentStep ? "default" : isCompleted ? "secondary" : "outline"}
                  className={cn(
                    "text-xs font-medium",
                    isCompleted && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  )}
                >
                  Paso {stepIndex + 1} de {totalSteps}
                </Badge>
                {isCurrentStep && (
                  <Badge variant="secondary" className="text-xs">
                    En curso
                  </Badge>
                )}
              </div>
              
              <h3 className={cn(
                "font-semibold transition-colors",
                isCurrentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {title}
              </h3>
              
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            </div>
            
            {/* Action Indicator */}
            {!isCurrentStep && !isCompleted && (
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
        
        {/* Expandable Content */}
        {(isCurrentStep || isInProgress || isCompleted) && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-4 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};