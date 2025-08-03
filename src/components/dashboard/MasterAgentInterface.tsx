import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategoryScore } from '@/types/dashboard';
import { Crown, MessageSquare, CheckCircle, ArrowRight, Sparkles, Target } from 'lucide-react';

interface MasterAgentInterfaceProps {
  language: 'en' | 'es';
  maturityScores: CategoryScore | null;
  activeTasksCount: number;
  completedTasksCount: number;
  onStartChat: () => void;
  onViewProgress: () => void;
}

export const MasterAgentInterface: React.FC<MasterAgentInterfaceProps> = ({
  language,
  maturityScores,
  activeTasksCount,
  completedTasksCount,
  onStartChat,
  onViewProgress
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const translations = {
    en: {
      masterAgent: 'Master Coordinator',
      subtitle: 'Your Personal Business Coach',
      greeting: 'Hello! I\'m here to guide your creative business journey.',
      currentStatus: 'Current Status',
      tasksActive: 'active tasks',
      tasksCompleted: 'completed',
      chatWithMe: 'Chat with me',
      viewProgress: 'View Progress',
      nextSteps: 'Next Recommended Steps',
      suggestions: [
        'Complete your financial setup',
        'Improve your marketing strategy',
        'Validate your market fit'
      ],
      progressToNext: 'Progress to Next Level',
      currentLevel: 'Current Level'
    },
    es: {
      masterAgent: 'Coordinador Maestro',
      subtitle: 'Tu Coach Personal de Negocios',
      greeting: '¡Hola! Estoy aquí para guiar tu viaje empresarial creativo.',
      currentStatus: 'Estado Actual',
      tasksActive: 'tareas activas',
      tasksCompleted: 'completadas',
      chatWithMe: 'Conversar conmigo',
      viewProgress: 'Ver Progreso',
      nextSteps: 'Próximos Pasos Recomendados',
      suggestions: [
        'Completar configuración financiera',
        'Mejorar estrategia de marketing',
        'Validar encaje de mercado'
      ],
      progressToNext: 'Progreso al Siguiente Nivel',
      currentLevel: 'Nivel Actual'
    }
  };

  const t = translations[language];

  const getMaturityLevel = () => {
    if (!maturityScores) return { level: 'Beginner', percentage: 25, color: 'from-purple-500 to-pink-500' };
    
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    if (average >= 70) return { 
      level: language === 'en' ? 'Advanced' : 'Avanzado', 
      percentage: average, 
      color: 'from-green-500 to-emerald-500',
      nextLevel: language === 'en' ? 'Expert' : 'Experto'
    };
    if (average >= 40) return { 
      level: language === 'en' ? 'Intermediate' : 'Intermedio', 
      percentage: average, 
      color: 'from-blue-500 to-cyan-500',
      nextLevel: language === 'en' ? 'Advanced' : 'Avanzado'
    };
    return { 
      level: language === 'en' ? 'Beginner' : 'Principiante', 
      percentage: average, 
      color: 'from-purple-500 to-pink-500',
      nextLevel: language === 'en' ? 'Intermediate' : 'Intermedio'
    };
  };

  const maturityLevel = getMaturityLevel();
  const totalTasks = activeTasksCount + completedTasksCount;

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 border-none text-white shadow-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.masterAgent}</h3>
              <p className="text-purple-200 text-sm">{t.subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/10"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>

        {/* Greeting */}
        <p className="text-purple-100 mb-4">{t.greeting}</p>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{activeTasksCount}</div>
            <div className="text-purple-200 text-sm">{t.tasksActive}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-300">{completedTasksCount}</div>
            <div className="text-purple-200 text-sm">{t.tasksCompleted}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-200">{t.currentLevel}: {maturityLevel.level}</span>
            <span className="text-purple-200">{Math.round(maturityLevel.percentage)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${maturityLevel.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${maturityLevel.percentage}%` }}
            />
          </div>
          <div className="text-xs text-purple-200 mt-1">
            {t.progressToNext}: {maturityLevel.nextLevel}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                {t.nextSteps}
              </h4>
              <ul className="space-y-2">
                {t.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center text-sm text-purple-100">
                    <ArrowRight className="w-3 h-3 mr-2 text-purple-300" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onStartChat}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t.chatWithMe}
          </Button>
          <Button
            onClick={onViewProgress}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t.viewProgress}
          </Button>
        </div>
      </div>
    </Card>
  );
};