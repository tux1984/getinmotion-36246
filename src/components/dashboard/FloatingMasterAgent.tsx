import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Brain, TrendingUp, AlertCircle, Crown, MessageSquare } from 'lucide-react';
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
  const [currentTip, setCurrentTip] = useState(0);

  // Enhanced coaching tips
  const coachingTips = [
    "✨ Soy tu guía personal hacia el éxito",
    "🎯 Cada paso cuenta en tu journey",
    "💡 Tienes todo lo necesario para triunfar",
    "🚀 Juntos construiremos algo increíble"
  ];

  // Rotate tips every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % coachingTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      return "💭 Te he extrañado. ¿Retomamos tu camino al éxito?";
    }
    if (completedTasksCount > 0 && completedTasksCount % 5 === 0) {
      return `🎉 ¡Increíble! ${completedTasksCount} tareas completadas. Sigamos el momentum.`;
    }
    if (activeTasksCount >= 12) {
      return "⚡ Tienes mucha energía! Te ayudo a priorizar para maximizar resultados.";
    }
    return coachingTips[currentTip];
  };

  const getStatusColor = () => {
    return "bg-purple-600 hover:bg-purple-700";
  };

  const getIconForStatus = () => {
    if (userActivityDays >= 3) return <AlertCircle className="h-4 w-4" />;
    if (completedTasksCount > 0) return <TrendingUp className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Button */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className={`relative rounded-full h-16 w-16 ${getStatusColor()} hover:scale-105 transition-all duration-200 shadow-xl ring-4 ring-white/20`}
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white" />
          {shouldShowProactive && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
          )}
          {/* Always visible indicator */}
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full ring-2 ring-white" />
        </Button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="w-80 shadow-2xl border border-border/20 bg-card/98 backdrop-blur-md">
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
            {/* Enhanced Contextual Message */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-800 text-sm">Tu Coordinador Maestro</span>
              </div>
              <p className="text-sm text-purple-700 font-medium">
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

            {/* Enhanced Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onStartChat} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" 
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Consulta Estratégica
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onViewProgress} variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Progreso
                </Button>
                <Button onClick={onHelp} variant="outline" size="sm" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  <Brain className="w-4 h-4 mr-1" />
                  Ayuda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};