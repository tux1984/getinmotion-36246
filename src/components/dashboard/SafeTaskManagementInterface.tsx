import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Target,
  MoreHorizontal,
  Calendar,
  User,
  Play,
  Edit,
  Eye,
  MessageSquare,
  Sparkles,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { CreateTaskModal } from './CreateTaskModal';
import { UnifiedTaskWorkflowModal } from './UnifiedTaskWorkflowModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface SafeTaskManagementInterfaceProps {
  language: 'en' | 'es';
  onTaskCreate?: () => void;
  onTaskUpdate?: () => void;
  maturityScores?: any;
  profileData?: any;
  enabledAgents?: string[];
  onSelectAgent?: (id: string) => void;
}

export const SafeTaskManagementInterface: React.FC<SafeTaskManagementInterfaceProps> = ({
  language,
  onTaskCreate,
  onTaskUpdate,
  maturityScores,
  profileData,
  enabledAgents,
  onSelectAgent
}) => {
  const { tasks, createTask, updateTask, loading } = useAgentTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { t } = useTranslations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPersonalizedRecommendation = () => {
    if (!maturityScores) return '';
    
    const { ideaValidation, userExperience, marketFit, monetization } = maturityScores;
    
    if (language === 'es') {
      if (ideaValidation < 50) {
        return "Validar tu idea con potenciales usuarios - es súper importante antes de seguir";
      } else if (userExperience < 50) {
        return "Mejorar la experiencia que le das a tus usuarios - acá está la clave del éxito";
      } else if (marketFit < 50) {
        return "Investigar mejor tu mercado y competencia - conoce a quién le vendes";
      } else if (monetization < 50) {
        return "Definir cómo vas a generar ingresos - es hora de monetizar tu proyecto";
      } else {
        return "¡Estás muy bien! Ahora enfócate en escalar y optimizar lo que ya tienes";
      }
    } else {
      if (ideaValidation < 50) {
        return "Validate your idea with potential users - super important before moving forward";
      } else if (userExperience < 50) {
        return "Improve the experience you give your users - this is key to success";
      } else if (marketFit < 50) {
        return "Better research your market and competition - know who you're selling to";
      } else if (monetization < 50) {
        return "Define how you're going to generate income - time to monetize your project";
      } else {
        return "You're doing great! Now focus on scaling and optimizing what you already have";
      }
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const newTask = await createTask({
        ...taskData,
        agent_id: 'general'
      });
      
      if (newTask && onTaskCreate) {
        onTaskCreate();
      }
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const handleExecuteTask = async (task: any) => {
    await updateTask(task.id, { 
      status: 'in_progress',
      progress_percentage: Math.max(task.progress_percentage, 10)
    });
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleCompleteTask = async (task: any) => {
    await updateTask(task.id, { 
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    });
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleWorkWithAgent = (task: any) => {
    if (onSelectAgent) {
      onSelectAgent(task.agent_id);
    }
  };

  // Get the most important task
  const currentTask = tasks.find(t => t.status === 'in_progress') || 
                     tasks.find(t => t.status === 'pending') ||
                     tasks[0];

  const nextTask = tasks.find(t => t.status === 'pending' && t.id !== currentTask?.id);
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const getTaskExplanation = (task: any) => {
    const title = task.title.toLowerCase();
    
    if (title.includes('validar') || title.includes('validate')) {
      return language === 'es' 
        ? "Validar tu idea te asegura que realmente resuelves un problema que la gente tiene"
        : "Validating your idea ensures you're solving a real problem people actually have";
    }
    
    if (title.includes('propuesta') || title.includes('value')) {
      return language === 'es'
        ? "Tu propuesta de valor única es lo que te diferencia de la competencia"
        : "Your unique value proposition is what sets you apart from competitors";
    }

    return language === 'es'
      ? "Esta tarea te acerca a tus objetivos creativos"
      : "This task brings you closer to your creative goals";
  };

  const getProgressEmoji = (progress: number) => {
    if (progress === 0) return "🎯";
    if (progress < 30) return "🚀";
    if (progress < 70) return "💪";
    if (progress < 100) return "⭐";
    return "🎉";
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/20 rounded"></div>
            <div className="h-3 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {t.dashboard.yourCreativeJourney}
            </CardTitle>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.dashboard.newTask}
            </Button>
          </div>
          {completedCount > 0 && (
            <p className="text-white/70 text-sm">
              {completedCount} {completedCount === 1 ? (language === 'es' ? 'tarea completada' : 'completed task') : (language === 'es' ? 'tareas completadas' : 'completed tasks')} ✨
            </p>
          )}
        </CardHeader>

        <CardContent>
          {!currentTask ? (
            /* Empty State */
            <div className="text-center py-8 text-white/60">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{t.dashboard.noTasks}</h3>
              <p className="text-sm opacity-75 mb-4">{t.dashboard.createFirst}</p>
              
              {/* Personalized recommendation */}
              {maturityScores && (
                <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg p-4 mt-4 border border-white/10">
                  <p className="text-sm font-medium text-purple-200 mb-2">
                    {t.dashboard.getStarted}
                  </p>
                  <p className="text-white text-sm">
                    {getPersonalizedRecommendation()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Current Task - Simplified */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Main Task Card */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10">
                {/* Progress Circle */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border-2 border-purple-400/40 mb-3">
                      <span className="text-2xl">{getProgressEmoji(currentTask.progress_percentage)}</span>
                    </div>
                    <div className="text-lg font-bold text-white mb-1">
                      {currentTask.progress_percentage}%
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {currentTask.title}
                  </h3>
                  
                  <Progress 
                    value={currentTask.progress_percentage} 
                    className="w-full h-2 bg-white/20 mb-4"
                  />
                </div>

                {/* Task Context */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-purple-300">{t.dashboard.whyImportant}</span>
                      <p className="text-white/80 mt-1">{getTaskExplanation(currentTask)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => currentTask.status === 'completed' ? null : currentTask.status === 'pending' ? handleExecuteTask(currentTask) : handleCompleteTask(currentTask)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-xl font-medium"
                    disabled={currentTask.status === 'completed'}
                  >
                    {currentTask.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {t.tasks.completed}
                      </>
                    ) : currentTask.status === 'pending' ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {t.dashboard.letsStart}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {t.dashboard.keepWorking}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => handleWorkWithAgent(currentTask)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 py-2 px-4 rounded-xl"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t.dashboard.chatWithMe}
                  </Button>
                </div>
              </div>

              {/* Next Task Preview */}
              {nextTask && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white/90 mb-1 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                        {t.dashboard.nextUp}
                      </h4>
                      <p className="text-white/70 text-sm">{nextTask.title}</p>
                    </div>
                    <div className="text-white/50">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Modal */}
      <CreateTaskModal
        agentId="general"
        language={language}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Task Details Modal */}
      {selectedTask && (
        <UnifiedTaskWorkflowModal
          task={selectedTask}
          language={language}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onWorkWithAgent={() => handleWorkWithAgent(selectedTask)}
          onUpdateTask={async (updates) => {
            await updateTask(selectedTask.id, updates);
            if (onTaskUpdate) onTaskUpdate();
          }}
        />
      )}
    </>
  );
};
