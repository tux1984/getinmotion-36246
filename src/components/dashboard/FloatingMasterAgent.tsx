import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CategoryScore } from '@/types/dashboard';

interface FloatingMasterAgentProps {
  language: 'en' | 'es';
  maturityScores: CategoryScore | null;
  activeTasksCount: number;
  completedTasksCount: number;
  userActivityDays?: number;
  onStartChat: () => void;
  onViewProgress: () => void;
  onHelp?: () => void;
}

export const FloatingMasterAgent: React.FC<FloatingMasterAgentProps> = ({
  language,
  maturityScores,
  activeTasksCount,
  completedTasksCount,
  userActivityDays = 0,
  onStartChat,
  onViewProgress,
  onHelp
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowProactive, setShouldShowProactive] = useState(false);

  const translations = {
    en: {
      masterAgent: "Master Coach",
      todayMessage: "Today you could advance with 3 priority tasks",
      helpMessage: "Need help with something? I'm here.",
      inactiveMessage: "I notice you haven't been active lately. Want to reorganize your tasks?",
      congratsMessage: "Great progress! You've completed {count} tasks this week.",
      taskSlots: "{active}/15 task slots",
      viewProgress: "View Progress",
      getHelp: "Get Help",
      startSession: "Start Session",
      close: "Close"
    },
    es: {
      masterAgent: "Coach Maestro",
      todayMessage: "Hoy podrías avanzar con 3 tareas prioritarias",
      helpMessage: "¿Necesitas ayuda con algo? Estoy aquí.",
      inactiveMessage: "Noto que no has estado activo últimamente. ¿Quieres reorganizar tus tareas?",
      congratsMessage: "¡Excelente progreso! Has completado {count} tareas esta semana.",
      taskSlots: "{active}/15 espacios de tareas",
      viewProgress: "Ver Progreso",
      getHelp: "Pedir Ayuda",
      startSession: "Iniciar Sesión",
      close: "Cerrar"
    }
  };

  const t = translations[language];

  // Proactive message logic
  useEffect(() => {
    if (userActivityDays >= 3) {
      setShouldShowProactive(true);
    } else if (completedTasksCount > 0 && completedTasksCount % 5 === 0) {
      setShouldShowProactive(true);
    }
  }, [userActivityDays, completedTasksCount]);

  const getContextualMessage = () => {
    if (userActivityDays >= 3) {
      return t.inactiveMessage;
    }
    if (completedTasksCount > 0 && completedTasksCount % 5 === 0) {
      return t.congratsMessage.replace('{count}', completedTasksCount.toString());
    }
    if (activeTasksCount >= 12) {
      return "¡Casi llegas al límite! Considera completar algunas tareas antes de agregar más.";
    }
    return t.todayMessage;
  };

  const getStatusColor = () => {
    if (userActivityDays >= 3) return "bg-amber-500";
    if (activeTasksCount >= 12) return "bg-red-500";
    if (completedTasksCount > 0) return "bg-green-500";
    return "bg-blue-500";
  };

  const getIconForStatus = () => {
    if (userActivityDays >= 3) return <AlertCircle className="h-4 w-4" />;
    if (completedTasksCount > 0) return <TrendingUp className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className={`relative rounded-full h-14 w-14 ${getStatusColor()} hover:scale-110 transition-all duration-300 shadow-lg`}
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {shouldShowProactive && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="w-80 shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className={`h-10 w-10 ${getStatusColor()}`}>
                  <AvatarFallback className="text-white">
                    {getIconForStatus()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{t.masterAgent}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {t.taskSlots.replace('{active}', activeTasksCount.toString())}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Contextual Message */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                {getContextualMessage()}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-lg font-bold text-green-600">{completedTasksCount}</div>
                <div className="text-xs text-muted-foreground">Completadas</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="text-lg font-bold text-blue-600">{activeTasksCount}</div>
                <div className="text-xs text-muted-foreground">Activas</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button onClick={onStartChat} className="w-full" size="sm">
                {t.startSession}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onViewProgress} variant="outline" size="sm">
                  {t.viewProgress}
                </Button>
                <Button onClick={onHelp} variant="outline" size="sm">
                  {t.getHelp}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};