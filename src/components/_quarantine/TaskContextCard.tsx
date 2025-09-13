import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';
import { AgentTask } from '@/hooks/types/agentTaskTypes';

interface TaskContextCardProps {
  task: AgentTask;
  currentStepIndex: number;
  totalSteps: number;
}

const getTaskBenefits = (taskTitle: string) => {
  const title = taskTitle.toLowerCase();
  
  if (title.includes('propuesta de valor') || title.includes('value proposition')) {
    return {
      primary: "Definir qué te hace único en el mercado",
      secondary: "Atraer más clientes con un mensaje claro y convincente",
      outcome: "Una propuesta de valor lista para usar en tu marketing"
    };
  }
  
  if (title.includes('competencia') || title.includes('competition')) {
    return {
      primary: "Conocer a tu competencia para diferenciarte",
      secondary: "Identificar oportunidades de mercado no cubiertas",
      outcome: "Un análisis completo de tu posición competitiva"
    };
  }
  
  if (title.includes('precio') || title.includes('pricing')) {
    return {
      primary: "Establecer precios que maximicen tus ganancias",
      secondary: "Ser competitivo sin sacrificar rentabilidad",
      outcome: "Una estrategia de precios optimizada para tu negocio"
    };
  }
  
  return {
    primary: "Hacer crecer tu negocio de manera estratégica",
    secondary: "Obtener claridad y dirección para tus próximos pasos",
    outcome: "Un plan de acción concreto y personalizado"
  };
};

export const TaskContextCard: React.FC<TaskContextCardProps> = ({
  task,
  currentStepIndex,
  totalSteps
}) => {
  const benefits = getTaskBenefits(task.title);
  const progressPercentage = Math.round((currentStepIndex / totalSteps) * 100);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">¿Qué vas a lograr?</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{benefits.primary}</p>
              <p className="text-xs text-muted-foreground">{benefits.secondary}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Al completar esta tarea:</p>
              <p className="text-xs text-muted-foreground">{benefits.outcome}</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span>Progreso general</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};