import React, { useState, useEffect, useMemo } from 'react';
import { generateDefaultTasks } from '@/utils/generateDefaultTasks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AgentTask } from '@/hooks/types/agentTaskTypes';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { MasterCoordinatorPanel } from './MasterCoordinatorPanel';
import { DeliverablesSection } from '@/components/master-coordinator/DeliverablesSection';
import RecommendedTasksSection from './RecommendedTasksSection';
import QuickActionsPanel from './QuickActionsPanel';
import { TopPriorityTasksSection } from './TopPriorityTasksSection';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  MessageCircle, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Users,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Play,
  Bot,
  Calculator,
  User,
  Crown,
  FileText,
  Star,
  Heart
} from 'lucide-react';

interface MasterCoordinatorDashboardProps {
  language: 'en' | 'es';
}

export const MasterCoordinatorDashboard: React.FC<MasterCoordinatorDashboardProps> = ({ language }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentScores, loading: scoresLoading } = useOptimizedMaturityScores();
  const { businessProfile, loading: profileLoading } = useUserBusinessProfile();
  
  // Task management
  const { 
    tasks, 
    loading: tasksLoading,
    startTaskDevelopment,
    completeTaskQuickly,
    deleteTask
  } = useAgentTasks();

  // Master Coordinator orchestration
  const {
    coordinatorTasks,
    deliverables,
    coordinatorMessage,
    nextUnlockedTask,
    regenerateTasksFromProfile,
    analyzeProfileAndGenerateTasks,
    generateIntelligentQuestions,
    startTaskJourney,
    loading: coordinatorLoading
  } = useMasterCoordinator();

  // State management
  const [selectedSubAgent, setSelectedSubAgent] = useState<string | null>(null);
  const [isTaskAssignmentOpen, setIsTaskAssignmentOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['recommendations', 'deliverables']));
  const [currentTip, setCurrentTip] = useState(0);
  const [showDeliverables, setShowDeliverables] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [startingTask, setStartingTask] = useState<string | null>(null);

  // Dynamic coaching tips
  const coachingTips = [
    'Every great business started with a bold idea',
    'Consistency is the key to sustainable growth',
    'Know your customer better than anyone',
    'Innovation comes from listening to the market',
    'Your network is your greatest asset'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % coachingTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Metrics
  const activeTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const activeTasksCount = activeTasks.length;
  const completedTasksCount = completedTasks.length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const maturityLevel = currentScores ? 
    Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : 1;

  // Show celebration when tasks are completed
  useEffect(() => {
    if (completedTasksCount > 0 && completedTasksCount % 3 === 0) {
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 3000);
    }
  }, [completedTasksCount]);

  // Enhanced personalized recommendations using coordinator tasks
  const personalizedRecommendations = useMemo(() => {
    if (coordinatorTasks.length > 0) {
      return coordinatorTasks
        .filter(task => task.isUnlocked)
        .slice(0, 6)
        .map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority === 1 ? 'critical' : task.priority === 2 ? 'high' : 'medium',
          estimatedTime: task.estimatedTime || '30 min',
          category: task.category || 'General',
          agentId: task.agentId,
          impact: 5 - (task.priority || 3)
        }));
    }
    return [];
  }, [coordinatorTasks]);

  // Loading state with animation
  if (scoresLoading || tasksLoading || profileLoading || coordinatorLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto"
          >
            <Brain className="w-16 h-16 text-primary" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Coordinating your experience...
            </h2>
            <p className="text-muted-foreground">
              Preparing your personalized dashboard
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // FASE 3: Manejo del botón "Empezar ahora" funcional
  const handleStartNow = async () => {
    try {
      // Activar análisis completo y generar tareas
      await analyzeProfileAndGenerateTasks();
      
      // Mostrar mensaje de éxito
      toast({
        title: "¡Coordinador Activado!",
        description: "He analizado tu perfil y generado tareas específicas para tu negocio.",
      });
    } catch (error) {
      console.error('❌ Error starting coordinator:', error);
    }
  };

  const handleRecalculateMaturity = async () => {
    // Navigate to maturity calculator and regenerate tasks
    navigate('/maturity-calculator');
    await regenerateTasksFromProfile();
  };

  const handleTalkAboutBusiness = async () => {
    try {
      const questions = await generateIntelligentQuestions();
      if (questions && questions.length > 0) {
        // Navigate to intelligent conversation with context
        navigate('/dashboard/agent/master-coordinator', { 
          state: { 
            context: 'business_deep_dive',
            questions 
          }
        });
      }
    } catch (error) {
      console.error('❌ Error generating questions:', error);
    }
  };

  const handleEditProfile = () => {
    // Navigate to profile editing
    navigate('/profile');
  };


  const handleTaskStart = async (task: AgentTask) => {
    try {
      setStartingTask(task.id);
      
      // Use the same flow as TaskManager: startTaskDevelopment + navigation
      await startTaskDevelopment(task.id);
      
      toast({
        title: language === 'es' ? "¡Tarea Iniciada!" : "Task Started!",
        description: language === 'es' 
          ? "Te redirigimos al agente para continuar."
          : "Redirecting you to the agent to continue.",
      });
      
      // Navigate to agent chat with taskId
      navigate(`/dashboard/agent/${task.agent_id}?taskId=${task.id}`);
      
    } catch (error) {
      console.error('❌ Error starting task:', error);
      toast({
        title: language === 'es' ? "Error al Iniciar Tarea" : "Error Starting Task",
        description: language === 'es' 
          ? "No se pudo iniciar la tarea. Inténtalo de nuevo."
          : "Could not start the task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setStartingTask(null);
    }
  };

  const handleDownloadDeliverable = (deliverableId: string) => {
    const deliverable = deliverables.find(d => d.id === deliverableId);
    if (deliverable?.downloadUrl) {
      window.open(deliverable.downloadUrl, '_blank');
    }
  };

  const handlePreviewDeliverable = (deliverableId: string) => {
    navigate(`/dashboard/deliverables/${deliverableId}`);
  };

  // Simplified recommended tasks logic with proper type conversion
  const getRecommendedTasks = () => {
    const mapToCompactFormat = (task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: typeof task.priority === 'number' ? task.priority : 
                task.priority === 'critical' ? 1 : 
                task.priority === 'high' ? 2 : 3,
      relevance: (task.relevance === 'high' || task.relevance === 'medium' || task.relevance === 'low') 
        ? task.relevance as 'high' | 'medium' | 'low'
        : task.priority === 1 ? 'high' as const :
          task.priority === 2 ? 'medium' as const : 'low' as const,
      estimatedTime: task.estimatedTime || '30 min',
      category: task.category || 'General',
      isUnlocked: task.isUnlocked ?? true
    });

    // Priority 1: Use Master Coordinator's intelligent tasks
    if (coordinatorTasks.length > 0) {
      const availableTasks = coordinatorTasks
        .filter(task => task.isUnlocked && !task.steps?.every(step => step.isCompleted))
        .slice(0, 4)
        .map(mapToCompactFormat);
      
      return availableTasks;
    }

    // Priority 2: Use personalized recommendations
    if (personalizedRecommendations.length > 0) {
      const formattedRecs = personalizedRecommendations.slice(0, 4).map(mapToCompactFormat);
      return formattedRecs;
    }

    // Priority 3: Use existing pending tasks
    if (tasks.length > 0) {
      const pendingTasks = tasks
        .filter(task => task.status === 'pending')
        .sort((a, b) => {
          const relevanceOrder = { high: 3, medium: 2, low: 1 };
          const aRelevance = relevanceOrder[a.relevance as keyof typeof relevanceOrder] || 2;
          const bRelevance = relevanceOrder[b.relevance as keyof typeof relevanceOrder] || 2;
          
          if (aRelevance !== bRelevance) {
            return bRelevance - aRelevance;
          }
          return a.priority - b.priority;
        })
        .slice(0, 4)
        .map(mapToCompactFormat);
      
      return pendingTasks;
    }

    // Fallback: Generate default tasks if nothing is available
    const defaultTasks = generateDefaultTasks(language, businessProfile);
    return defaultTasks.map(mapToCompactFormat);
  };


  const getMaturityLevel = () => maturityLevel;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleStartTaskWithAgent = async (taskId: string, agentId: string) => {
    try {
      await startTaskDevelopment(taskId);
      // Navigate to agent chat after starting task
      navigate(`/dashboard/agent/${agentId}?taskId=${taskId}`);
    } catch (error) {
      console.error('❌ Error starting task:', error);
    }
  };

  const handleCompleteTask = async (task: AgentTask) => {
    try {
      await completeTaskQuickly(task.id);
      toast({
        title: language === 'es' ? "¡Tarea Completada!" : "Task Completed!",
        description: language === 'es' 
          ? "La tarea se ha marcado como completada exitosamente."
          : "Task has been marked as completed successfully.",
      });
    } catch (error) {
      console.error('❌ Error completing task:', error);
      toast({
        title: language === 'es' ? "Error al Completar Tarea" : "Error Completing Task",
        description: language === 'es' 
          ? "No se pudo completar la tarea. Inténtalo de nuevo."
          : "Could not complete the task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('❌ Error deleting task:', error);
    }
  };

  const handleMasterAgentChat = () => {
    navigate('/dashboard/agent/master-coordinator');
  };

  const handleTaskStartFromPanel = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await handleTaskStart(task);
    }
  };

  const recommendedTasks = getRecommendedTasks();

  const translations = {
    en: {
      title: 'Business Development Hub',
      subtitle: 'Your AI-powered growth companion',
      activeSlots: 'Active Tasks',
      completedTasks: 'Completed',
      maturityLevel: 'Maturity Level',
      successRate: 'Success Rate',
      nextRecommendations: 'Priority Recommendations',
      getGuidance: 'Get Personalized Guidance',
      viewAllTasks: 'View All Tasks',
      startWithAgent: 'Start with',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority',
      estimatedTime: 'Est. time',
      potentialImpact: 'Potential impact',
      chatWithMaster: 'Chat with Master Agent',
      masterAgentHelper: 'Need help? I\'m here to guide you through every step of your business journey.',
      myProgress: 'My Progress',
      deliverables: 'Deliverables',
      showProgress: 'Show My Progress',
      orchestratedExperience: 'Orchestrated Experience',
      intelligentTasks: 'Intelligent Tasks Generated'
    },
    es: {
      title: 'Centro de Desarrollo Empresarial',
      subtitle: 'Tu compañero de crecimiento potenciado por IA',
      activeSlots: 'Tareas Activas',
      completedTasks: 'Completadas',
      maturityLevel: 'Nivel de Madurez',
      successRate: 'Tasa de Éxito',
      nextRecommendations: 'Recomendaciones Prioritarias',
      getGuidance: 'Obtener Orientación Personalizada',
      viewAllTasks: 'Ver Todas las Tareas',
      startWithAgent: 'Iniciar con',
      highPriority: 'Alta Prioridad',
      mediumPriority: 'Prioridad Media',
      lowPriority: 'Baja Prioridad',
      estimatedTime: 'Tiempo est.',
      potentialImpact: 'Impacto potencial',
      chatWithMaster: 'Chat con Agente Maestro',
      masterAgentHelper: '¿Necesitas ayuda? Estoy aquí para guiarte en cada paso de tu viaje empresarial.',
      myProgress: 'Mis Avances',
      deliverables: 'Entregables',
      showProgress: 'Ver Mis Avances',
      orchestratedExperience: 'Experiencia Orquestada',
      intelligentTasks: 'Tareas Inteligentes Generadas'
    }
  };

  const t = translations[language];

  return (
    <>
      {/* Master Coordinator Panel - Único y central */}
      <MasterCoordinatorPanel onTaskStart={handleTaskStartFromPanel} language={language} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

          {/* Key Performance Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 dark:from-blue-950/20 dark:to-cyan-950/20 dark:border-blue-800/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {activeTasksCount}/15
                  </div>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {t.activeSlots}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {completedTasksCount}
                  </div>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {t.completedTasks}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-800/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {getMaturityLevel()}/5
                  </div>
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  {t.maturityLevel}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-800/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {progressPercentage}%
                  </div>
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  {t.successRate}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Top Priority Tasks Section */}
              {/* Debug logs */}
              {(() => {
                console.log('🔍 MasterCoordinatorDashboard - Tasks:', tasks);
                console.log('🔍 MasterCoordinatorDashboard - Tasks length:', tasks.length);
                console.log('🔍 MasterCoordinatorDashboard - Loading:', tasksLoading);
                return null;
              })()}
              <TopPriorityTasksSection
                tasks={tasks}
                language={language}
                onStartDevelopment={async (task) => {
                  console.log('🚀 Starting task through master coordinator:', task.id);
                  await handleTaskStart(task);
                }}
                onChatWithAgent={(task) => {
                  console.log('💬 Opening chat with agent through coordinator:', task.agent_id);
                  navigate(`/dashboard/agent/${task.agent_id}?taskId=${task.id}`);
                }}
                onCompleteTask={async (task) => {
                  console.log('✅ Completing task through master coordinator:', task.id);
                  await handleCompleteTask(task);
                }}
                startingTask={startingTask}
              />

              {/* Compact Priority Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RecommendedTasksSection
                  language={language}
                  maturityScores={currentScores || {}}
                />
              </motion.div>
            </div>

            {/* Right Column: Quick Actions Panel */}
            <div className="space-y-6">
              
              {/* Unified Quick Actions Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <QuickActionsPanel
                  language={language}
                  onMasterAgentChat={handleMasterAgentChat}
                  activeTasks={activeTasksCount}
                />
              </motion.div>

            </div>
          </div>

          {/* Deliverables Section - Conditionally Rendered */}
          <AnimatePresence>
            {showDeliverables && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <DeliverablesSection
                  deliverables={deliverables}
                  onDownload={handleDownloadDeliverable}
                  onPreview={handlePreviewDeliverable}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};