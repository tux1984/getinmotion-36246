import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Target, MessageSquare, ChevronRight } from 'lucide-react';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { useUnifiedTaskRecommendations } from '@/hooks/useUnifiedTaskRecommendations';
import { LocalIntelligentQuestions } from './LocalIntelligentQuestions';
import QuickActionsPanel from './QuickActionsPanel';

interface MasterCoordinatorDashboardProps {
  language: 'en' | 'es';
  maturityScores?: any;
  onMasterAgentChat: () => void;
  activeTasks?: number;
}

export const MasterCoordinatorDashboard: React.FC<MasterCoordinatorDashboardProps> = ({
  language,
  maturityScores,
  onMasterAgentChat,
  activeTasks = 0
}) => {
  const [showQuestions, setShowQuestions] = useState(false);
  
  const {
    coordinatorTasks,
    coordinatorMessage,
    loading: coordinatorLoading,
    startTaskJourney
  } = useMasterCoordinator();

  const {
    recommendations,
    loading: recommendationsLoading,
    needsMoreInfo
  } = useUnifiedTaskRecommendations({ maturityScores, language });

  const translations = {
    en: {
      title: 'AI Business Coordinator',
      subtitle: 'Your personalized business guidance system',
      recommendations: 'Smart Recommendations',
      tasks: 'Active Tasks',
      noTasks: 'No active tasks yet',
      getStarted: 'Get Started',
      answerQuestions: 'Answer Smart Questions',
      questionsDesc: 'Help us understand your business better',
      viewAll: 'View All',
      startTask: 'Start Task'
    },
    es: {
      title: 'Coordinador IA de Negocios',
      subtitle: 'Tu sistema personalizado de orientación empresarial',
      recommendations: 'Recomendaciones Inteligentes',
      tasks: 'Tareas Activas',
      noTasks: 'No hay tareas activas aún',
      getStarted: 'Comenzar',
      answerQuestions: 'Responder Preguntas Inteligentes',
      questionsDesc: 'Ayúdanos a entender mejor tu negocio',
      viewAll: 'Ver Todas',
      startTask: 'Iniciar Tarea'
    }
  };

  const t = translations[language];
  const nextTask = coordinatorTasks.find(task => task.isUnlocked && task.prerequisiteTasks.length === 0);

  return (
    <div className="space-y-6">
      {/* Quick Actions Panel */}
      <QuickActionsPanel
        language={language}
        onMasterAgentChat={onMasterAgentChat}
        activeTasks={activeTasks}
      />

      {/* Smart Questions Section */}
      {(needsMoreInfo || showQuestions) && (
        <LocalIntelligentQuestions
          language={language}
          onAnswersCompleted={(answers) => {
            console.log('Answers completed:', answers);
            setShowQuestions(false);
            // Here we could use the answers to improve recommendations
          }}
        />
      )}

      {/* Coordinator Message */}
      {coordinatorMessage && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm text-foreground">{coordinatorMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {t.recommendations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendationsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-3">
                      {t.startTask}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">{t.noTasks}</p>
              <Button onClick={() => setShowQuestions(true)} size="sm">
                {t.getStarted}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Task Suggestion */}
      {nextTask && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm mb-1">Siguiente tarea sugerida:</h4>
                <p className="text-xs text-muted-foreground">{nextTask.title}</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => startTaskJourney(nextTask.id)}
                className="shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};