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
      greeting: getDynamicGreeting('en'),
      currentStatus: 'Current Status',
      tasksActive: 'active tasks',
      tasksCompleted: 'completed',
      chatWithMe: 'Start Guided Session',
      viewProgress: 'View Progress',
      nextSteps: 'Your Next Steps',
      suggestions: getDynamicSuggestions('en'),
      progressToNext: 'Progress to Next Level',
      currentLevel: 'Current Level',
      tasksSlots: 'task slots used',
      motivationalMessage: getMotivationalMessage('en'),
      coachingTip: getCoachingTip('en')
    },
    es: {
      masterAgent: 'Coordinador Maestro',
      subtitle: 'Tu Coach Personal de Negocios',
      greeting: getDynamicGreeting('es'),
      currentStatus: 'Estado Actual',
      tasksActive: 'tareas activas',
      tasksCompleted: 'completadas',
      chatWithMe: 'Iniciar Sesión Guiada',
      viewProgress: 'Ver Progreso',
      nextSteps: 'Tus Próximos Pasos',
      suggestions: getDynamicSuggestions('es'),
      progressToNext: 'Progreso al Siguiente Nivel',
      currentLevel: 'Nivel Actual',
      tasksSlots: 'espacios de tareas usados',
      motivationalMessage: getMotivationalMessage('es'),
      coachingTip: getCoachingTip('es')
    }
  };

  function getDynamicGreeting(lang: 'en' | 'es') {
    const completionPercentage = maturityScores ? 
      Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4 : 25;
    
    if (lang === 'es') {
      if (completionPercentage < 40) {
        return '¡Excelente! Estás comenzando tu transformación empresarial. Te voy a guiar paso a paso.';
      } else if (completionPercentage < 70) {
        return '¡Vas muy bien! Ya tienes una base sólida. Ahora enfoquémonos en llevar tu negocio al siguiente nivel.';
      } else {
        return '¡Impresionante progreso! Estás en camino a convertirte en un experto. Sigamos refinando tu estrategia.';
      }
    } else {
      if (completionPercentage < 40) {
        return 'Excellent! You\'re starting your business transformation. I\'ll guide you step by step.';
      } else if (completionPercentage < 70) {
        return 'Great progress! You have a solid foundation. Now let\'s focus on taking your business to the next level.';
      } else {
        return 'Impressive progress! You\'re on your way to becoming an expert. Let\'s keep refining your strategy.';
      }
    }
  }

  function getDynamicSuggestions(lang: 'en' | 'es') {
    const completionPercentage = maturityScores ? 
      Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4 : 25;
    
    if (lang === 'es') {
      if (completionPercentage < 40) {
        return [
          'Define tu estructura legal básica',
          'Configura tu primer sistema de pagos',
          'Crea tu identidad de marca inicial'
        ];
      } else if (completionPercentage < 70) {
        return [
          'Optimiza tu estrategia de marketing',
          'Implementa sistemas de automatización',
          'Desarrolla partnerships estratégicos'
        ];
      } else {
        return [
          'Expande a nuevos mercados',
          'Crea productos premium',
          'Desarrolla un equipo de alto rendimiento'
        ];
      }
    } else {
      if (completionPercentage < 40) {
        return [
          'Set up your basic legal structure',
          'Configure your first payment system',
          'Create your initial brand identity'
        ];
      } else if (completionPercentage < 70) {
        return [
          'Optimize your marketing strategy',
          'Implement automation systems',
          'Develop strategic partnerships'
        ];
      } else {
        return [
          'Expand to new markets',
          'Create premium products',
          'Build a high-performance team'
        ];
      }
    }
  }

  function getMotivationalMessage(lang: 'en' | 'es') {
    if (completedTasksCount === 0) {
      return lang === 'es' ? 
        '🚀 ¡Tu aventura empresarial está comenzando!' :
        '🚀 Your business adventure is just beginning!';
    } else if (completedTasksCount < 5) {
      return lang === 'es' ? 
        '💪 ¡Excelente momentum! Cada tarea completada te acerca más a tu objetivo.' :
        '💪 Excellent momentum! Every completed task brings you closer to your goal.';
    } else {
      return lang === 'es' ? 
        '🏆 ¡Eres imparable! Tu dedicación está transformando tu negocio.' :
        '🏆 You\'re unstoppable! Your dedication is transforming your business.';
    }
  }

  function getCoachingTip(lang: 'en' | 'es') {
    const tips = lang === 'es' ? [
      'Tip: Enfócate en completar 1-2 tareas por semana para mantener el momentum',
      'Tip: Las tareas de alto impacto te darán los mejores resultados',
      'Tip: No tengas miedo de pausar tareas si cambias de prioridades'
    ] : [
      'Tip: Focus on completing 1-2 tasks per week to maintain momentum',
      'Tip: High-impact tasks will give you the best results',
      'Tip: Don\'t be afraid to pause tasks if your priorities change'
    ];
    
    return tips[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % tips.length];
  }

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

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-3 mb-4">
          <p className="text-white text-sm font-medium">{t.motivationalMessage}</p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xl font-bold text-white">{activeTasksCount}/15</div>
            <div className="text-purple-200 text-xs">{t.tasksSlots}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xl font-bold text-green-300">{completedTasksCount}</div>
            <div className="text-purple-200 text-xs">{t.tasksCompleted}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xl font-bold text-yellow-300">{Math.round(maturityLevel.percentage)}%</div>
            <div className="text-purple-200 text-xs">madurez</div>
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
              <ul className="space-y-3">
                {t.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-purple-100 font-medium">{suggestion}</p>
                      <p className="text-purple-300 text-xs mt-1">
                        {language === 'es' ? 'Impacto: Alto' : 'Impact: High'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Coaching Tip */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-purple-100 text-xs italic">{t.coachingTip}</p>
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