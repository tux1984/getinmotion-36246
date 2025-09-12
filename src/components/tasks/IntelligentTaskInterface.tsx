import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuestionCollector } from './QuestionCollector';
import { AIDeliverableGenerator } from './AIDeliverableGenerator';
import { AgentTask } from '@/hooks/types/agentTaskTypes';
import { Brain, Target, CheckCircle } from 'lucide-react';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

interface IntelligentTaskInterfaceProps {
  task: AgentTask;
  onTaskComplete: (taskId: string) => void;
  onBack: () => void;
}

type TaskPhase = 'intro' | 'collecting' | 'generating' | 'completed';

export const IntelligentTaskInterface: React.FC<IntelligentTaskInterfaceProps> = ({
  task,
  onTaskComplete,
  onBack
}) => {
  const { user } = useRobustAuth();
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<TaskPhase>('intro');
  const [collectedAnswers, setCollectedAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [deliverable, setDeliverable] = useState<any>(null);

  const translations = {
    en: {
      startCollection: 'Start Information Collection',
      taskIntro: 'AI Task Assistant',
      intelligentCollection: 'I will ask you intelligent questions to gather all the information needed to create a professional deliverable for your business.',
      expectedDeliverable: 'What you will receive:',
      letsStart: "Let's start!",
      back: 'Back',
      generating: 'Generating your deliverable...',
      completed: 'Task completed successfully!'
    },
    es: {
      startCollection: 'Iniciar Recolección de Información',
      taskIntro: 'Asistente de Tareas IA',
      intelligentCollection: 'Te haré preguntas inteligentes para recopilar toda la información necesaria y crear un entregable profesional para tu negocio.',
      expectedDeliverable: 'Lo que recibirás:',
      letsStart: '¡Empezemos!',
      back: 'Volver',
      generating: 'Generando tu entregable...',
      completed: '¡Tarea completada exitosamente!'
    }
  };

  const t = translations[compatibleLanguage];

  const getDeliverableDescription = (agentId: string): string => {
    const descriptions = {
      en: {
        'financial-management': 'Professional business plan with cost analysis, pricing strategy, and financial projections',
        'marketing-specialist': 'Complete marketing strategy with target audience analysis, content calendar, and campaign recommendations',
        'legal-advisor': 'Legal compliance checklist and recommended business structure documentation',
        'operations-specialist': 'Operations manual with process flows, efficiency recommendations, and workflow optimization',
        'cultural-consultant': 'Brand identity guide with cultural positioning, visual guidelines, and market positioning strategy'
      },
      es: {
        'financial-management': 'Plan de negocios profesional con análisis de costos, estrategia de precios y proyecciones financieras',
        'marketing-specialist': 'Estrategia de marketing completa con análisis de audiencia objetivo, calendario de contenido y recomendaciones de campañas',
        'legal-advisor': 'Lista de verificación de cumplimiento legal y documentación de estructura empresarial recomendada',
        'operations-specialist': 'Manual de operaciones con flujos de proceso, recomendaciones de eficiencia y optimización de flujo de trabajo',
        'cultural-consultant': 'Guía de identidad de marca con posicionamiento cultural, directrices visuales y estrategia de posicionamiento en el mercado'
      }
    };

    return descriptions[compatibleLanguage][agentId as keyof typeof descriptions[typeof compatibleLanguage]] || 
           descriptions[compatibleLanguage]['financial-management'];
  };

  const handleCollectionComplete = async (answers: Array<{question: string, answer: string}>) => {
    setCollectedAnswers(answers);
    setPhase('generating');
    
    try {
      // Call the master-agent-coordinator to generate the deliverable
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'generate_deliverable',
          taskId: task.id,
          userId: user?.id,
          collectedAnswers: answers
        }
      });

      if (error) throw error;

      setDeliverable(data.deliverable);
      setPhase('completed');
      
      // Mark task as completed
      onTaskComplete(task.id);
      
      toast({
        title: compatibleLanguage === 'en' ? 'Deliverable Generated' : 'Entregable Generado',
        description: compatibleLanguage === 'en' ? 'Your professional deliverable has been created successfully' : 'Tu entregable profesional ha sido creado exitosamente',
      });
    } catch (error) {
      console.error('Error generating deliverable:', error);
      toast({
        title: 'Error',
        description: compatibleLanguage === 'en' ? 'Error generating deliverable' : 'Error al generar el entregable',
        variant: 'destructive',
      });
      setPhase('collecting');
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t.taskIntro}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t.intelligentCollection}
              </p>
            </div>
            
            <Card className="p-6 border-border bg-card">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t.expectedDeliverable}</h3>
                  <p className="text-muted-foreground">{getDeliverableDescription(task.agent_id)}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onBack}>
                {t.back}
              </Button>
              <Button onClick={() => setPhase('collecting')} className="bg-primary hover:bg-primary/90">
                {t.letsStart}
              </Button>
            </div>
          </div>
        );

      case 'collecting':
        return (
          <QuestionCollector
            task={task}
            onComplete={handleCollectionComplete}
            onBack={() => setPhase('intro')}
          />
        );

      case 'generating':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{t.generating}</h2>
            <div className="w-64 mx-auto bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        );

      case 'completed':
        return (
          <AIDeliverableGenerator
            deliverable={deliverable}
            task={task}
            collectedAnswers={collectedAnswers}
            onBack={onBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">{task.title}</h1>
        <p className="text-muted-foreground">{task.description}</p>
      </div>
      
      {renderPhase()}
    </div>
  );
};