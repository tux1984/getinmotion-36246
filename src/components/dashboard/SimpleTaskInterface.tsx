import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  MessageSquare,
  Target,
  ChevronRight,
  Heart,
  AlertCircle
} from 'lucide-react';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { CreateTaskModal } from './CreateTaskModal';

interface SimpleTaskInterfaceProps {
  agentId: string;
  language: 'en' | 'es';
  onChatWithAgent?: (taskId: string, taskTitle: string) => void;
}

export const SimpleTaskInterface: React.FC<SimpleTaskInterfaceProps> = ({
  agentId,
  language,
  onChatWithAgent
}) => {
  const { tasks, loading, createTask, updateTask } = useAgentTasks(agentId);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const taskLimits = useTaskLimits(tasks);

  const t = {
    en: {
      yourNextStep: "Your Next Step",
      noTasksYet: "Ready to Create Something Amazing?",
      noTasksDesc: "Let's start with your first creative task!",
      createFirstTask: "Create My First Task",
      howIsGoing: "How is",
      going: "going?",
      whyImportant: "Why this matters:",
      whatYoullAchieve: "What you'll achieve:",
      estimatedTime: "Time needed:",
      minutes: "minutes",
      letsKeepWorking: "Let's Keep Working!",
      letsStart: "Let's Start!",
      chatWithMe: "Chat with me",
      almostThere: "Almost there!",
      keepGoing: "Keep going!",
      youGotThis: "You got this!",
      greatProgress: "Great progress!",
      nextUp: "Coming up next:",
      completed: "Completed! 🎉",
      activeTasks: "Active Tasks",
      taskLimit: "Task Limit"
    },
    es: {
      yourNextStep: "Tu Próximo Paso",
      noTasksYet: "¿Listo para Crear Algo Increíble?",
      noTasksDesc: "¡Empecemos con tu primera tarea creativa!",
      createFirstTask: "Crear Mi Primera Tarea",
      howIsGoing: "¿Cómo va",
      going: "?",
      whyImportant: "Por qué es importante:",
      whatYoullAchieve: "Lo que vas a lograr:",
      estimatedTime: "Tiempo necesario:",
      minutes: "minutos",
      letsKeepWorking: "¡Sigamos Trabajando!",
      letsStart: "¡Empecemos!",
      chatWithMe: "Charlemos",
      almostThere: "¡Ya casi!",
      keepGoing: "¡Sigue así!",
      youGotThis: "¡Tú puedes!",
      greatProgress: "¡Excelente progreso!",
      nextUp: "Lo que sigue:",
      completed: "¡Completada! 🎉",
      activeTasks: "Tareas Activas",
      taskLimit: "Límite de Tareas"
    }
  };

  const getMotivationalMessage = (progress: number) => {
    if (progress === 0) return "";
    if (progress < 30) return t[language].letsStart;
    if (progress < 70) return t[language].keepGoing;
    if (progress < 100) return t[language].almostThere;
    return t[language].completed;
  };

  const getProgressEmoji = (progress: number) => {
    if (progress === 0) return "🎯";
    if (progress < 30) return "🚀";
    if (progress < 70) return "💪";
    if (progress < 100) return "⭐";
    return "🎉";
  };

  const getTaskExplanation = (task: any) => {
    // Generar explicaciones contextuales basadas en el título de la tarea
    const title = task.title.toLowerCase();
    
    if (title.includes('validar') || title.includes('validate')) {
      return {
        why: language === 'es' 
          ? "Validar tu idea te asegura que realmente resuelves un problema que la gente tiene"
          : "Validating your idea ensures you're solving a real problem people actually have",
        what: language === 'es'
          ? "Una idea validada con feedback real de potenciales usuarios"
          : "A validated idea with real feedback from potential users"
      };
    }
    
    if (title.includes('propuesta') || title.includes('value')) {
      return {
        why: language === 'es'
          ? "Tu propuesta de valor única es lo que te diferencia de la competencia"
          : "Your unique value proposition is what sets you apart from competitors",
        what: language === 'es'
          ? "Una propuesta clara que explique por qué la gente debería elegirte"
          : "A clear proposition explaining why people should choose you"
      };
    }

    // Default explanation
    return {
      why: language === 'es'
        ? "Esta tarea te acerca a tus objetivos creativos"
        : "This task brings you closer to your creative goals",
      what: language === 'es'
        ? "Un paso importante completado en tu proyecto"
        : "An important step completed in your project"
    };
  };

  const handleStartTask = async (task: any) => {
    await updateTask(task.id, { 
      status: 'in_progress',
      progress_percentage: Math.max(task.progress_percentage, 10)
    });
  };

  const handleCompleteTask = async (task: any) => {
    await updateTask(task.id, { 
      status: 'completed',
      progress_percentage: 100
    });
  };

  const handleChatWithTask = (task: any) => {
    if (onChatWithAgent) {
      // Pasar el ID de la tarea para crear una conversación específica
      onChatWithAgent(task.id, task.title);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    // Verificar límite antes de crear
    if (taskLimits.isAtLimit) {
      return null;
    }
    
    const newTask = await createTask({
      ...taskData,
      agent_id: agentId
    });
    if (newTask) {
      setShowCreateModal(false);
    }
    return newTask;
  };

  // Get the most important task (pending or in_progress)
  const currentTask = tasks.find(t => t.status === 'in_progress') || 
                     tasks.find(t => t.status === 'pending') ||
                     tasks[0];

  const nextTask = tasks.find(t => t.status === 'pending' && t.id !== currentTask?.id);
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white/70">Cargando tus tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Task Limits */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          {t[language].yourNextStep}
        </h2>
        
        {/* Task Limits Display */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-white/70">
            {completedCount > 0 && (
              <span>{completedCount} {completedCount === 1 ? 'tarea completada' : 'tareas completadas'} ✨</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
            <span className="text-sm text-white/80">{t[language].activeTasks}:</span>
            <span className={`text-sm font-bold ${
              taskLimits.isAtLimit ? 'text-red-400' : 
              taskLimits.isNearLimit ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {taskLimits.activeTasksCount}/{taskLimits.limit}
            </span>
            {taskLimits.isAtLimit && <AlertCircle className="w-4 h-4 text-red-400" />}
          </div>
        </div>

        {/* Limit Warning */}
        {taskLimits.getLimitMessage(language) && (
          <div className={`text-sm p-2 rounded-lg mb-4 ${
            taskLimits.isAtLimit ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
          }`}>
            {taskLimits.getLimitMessage(language)}
          </div>
        )}
      </div>

      {!currentTask ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t[language].noTasksYet}
              </h3>
              <p className="text-white/70 mb-6">
                {t[language].noTasksDesc}
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                disabled={taskLimits.isAtLimit}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart className="w-4 h-4 mr-2" />
                {t[language].createFirstTask}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Current Task */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
            <CardContent className="p-8">
              {/* Task Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  <span className="text-white/70">{t[language].howIsGoing} </span>
                  <span className="text-purple-300">"{currentTask.title}"</span>
                  <span className="text-white/70"> {t[language].going}</span>
                </h3>
              </div>

              {/* Progress Circle */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-4 border-purple-400/30 mb-4">
                    <span className="text-3xl">{getProgressEmoji(currentTask.progress_percentage)}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {currentTask.progress_percentage}%
                  </div>
                  <p className="text-purple-300 font-medium">
                    {getMotivationalMessage(currentTask.progress_percentage)}
                  </p>
                </div>
                
                <Progress 
                  value={currentTask.progress_percentage} 
                  className="w-full mt-4 h-2 bg-white/20"
                />
              </div>

              {/* Task Context */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6 space-y-4">
                <div>
                  <h4 className="font-medium text-purple-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t[language].whyImportant}
                  </h4>
                  <p className="text-white/80 text-sm">
                    {getTaskExplanation(currentTask).why}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-purple-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {t[language].whatYoullAchieve}
                  </h4>
                  <p className="text-white/80 text-sm">
                    {getTaskExplanation(currentTask).what}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-purple-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t[language].estimatedTime}
                  </h4>
                  <p className="text-white/80 text-sm">
                    15-20 {t[language].minutes}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => currentTask.status === 'completed' ? null : currentTask.status === 'pending' ? handleStartTask(currentTask) : handleCompleteTask(currentTask)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-medium"
                  disabled={currentTask.status === 'completed'}
                >
                  {currentTask.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {t[language].completed}
                    </>
                  ) : currentTask.status === 'pending' ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {t[language].letsStart}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {t[language].letsKeepWorking}
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => handleChatWithTask(currentTask)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 py-3 px-6 rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t[language].chatWithMe}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Next Task Preview */}
      {nextTask && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white/90 mb-1 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                    {t[language].nextUp}
                  </h4>
                  <p className="text-white/70 text-sm">{nextTask.title}</p>
                </div>
                <div className="text-white/50">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        agentId={agentId}
        language={language}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};
