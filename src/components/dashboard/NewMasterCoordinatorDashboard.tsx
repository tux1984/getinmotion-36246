import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { MasterCoordinatorPanel } from './MasterCoordinatorPanel';
import { DeliverablesSection } from '@/components/master-coordinator/DeliverablesSection';
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

export const MasterCoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
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

  // Dynamic coaching tips
  const coachingTips = [
    language === 'es' ? 'Cada gran negocio comenzó con una idea audaz' : 'Every great business started with a bold idea',
    language === 'es' ? 'La consistencia es la clave del crecimiento sostenible' : 'Consistency is the key to sustainable growth',
    language === 'es' ? 'Conoce a tu cliente mejor que nadie' : 'Know your customer better than anyone',
    language === 'es' ? 'La innovación nace de escuchar al mercado' : 'Innovation comes from listening to the market',
    language === 'es' ? 'Tu red de contactos es tu mayor activo' : 'Your network is your greatest asset'
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
              {language === 'es' ? 'Coordinando tu experiencia...' : 'Coordinating your experience...'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'es' ? 'Preparando tu panel personalizado' : 'Preparing your personalized dashboard'}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // FASE 3: Manejo del botón "Empezar ahora" funcional
  const handleStartNow = async () => {
    console.log('🚀 Starting Master Coordinator flow');
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
    console.log('💬 Generating intelligent questions about business');
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

  const handleTaskStart = async (taskId: string) => {
    const success = await startTaskJourney(taskId);
    if (success) {
      navigate(`/dashboard/tasks/${taskId}`);
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

  // Get recommended tasks intelligently - now uses Coordinator tasks
  const getRecommendedTasks = () => {
    if (coordinatorTasks.length > 0) {
      // Use Master Coordinator's intelligent tasks
      return coordinatorTasks
        .filter(task => task.isUnlocked && !task.steps.every(step => step.isCompleted))
        .slice(0, 4);
    }

    if (personalizedRecommendations.length > 0) {
      // Fallback to personalized recommendations if available
      return personalizedRecommendations.slice(0, 4).map(rec => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        priority: rec.priority === 'critical' ? 1 : rec.priority === 'high' ? 2 : 3,
        relevance: rec.priority === 'critical' ? 'high' : rec.priority === 'high' ? 'medium' : 'low',
        estimatedTime: rec.estimatedTime,
        category: rec.category,
        agentId: rec.agentId,
        impact: rec.impact,
        isUnlocked: true
      }));
    }

    if (tasks.length === 0) {
      return [];
    }

    // Final fallback to existing tasks
    const pendingTasks = tasks
      .filter(task => task.status === 'pending')
      .sort((a, b) => {
        if (a.relevance !== b.relevance) {
          const relevanceOrder = { high: 3, medium: 2, low: 1 };
          return relevanceOrder[b.relevance as keyof typeof relevanceOrder] - 
                 relevanceOrder[a.relevance as keyof typeof relevanceOrder];
        }
        return a.priority - b.priority;
      })
      .slice(0, 4);

    return pendingTasks.map(task => ({ ...task, isUnlocked: true }));
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
      console.log('🚀 Starting task development:', { taskId, agentId });
      await startTaskDevelopment(taskId);
      // Navigate to agent chat after starting task
      navigate(`/dashboard/agent/${agentId}?taskId=${taskId}`);
    } catch (error) {
      console.error('❌ Error starting task:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      console.log('✅ Completing task:', taskId);
      await completeTaskQuickly(taskId);
    } catch (error) {
      console.error('❌ Error completing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log('🗑️ Deleting task:', taskId);
      await deleteTask(taskId);
    } catch (error) {
      console.error('❌ Error deleting task:', error);
    }
  };

  const handleMasterAgentChat = () => {
    navigate('/dashboard/agent/master-coordinator');
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
      <MasterCoordinatorPanel onTaskStart={handleTaskStart} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32">
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
              
              {/* Next Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <span>{t.nextRecommendations}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection('recommendations')}
                      >
                        {expandedSections.has('recommendations') ? 
                          <ChevronRight className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        }
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {expandedSections.has('recommendations') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 space-y-4">
                          {recommendedTasks.length > 0 ? (
                            recommendedTasks.map((task, index) => (
                              <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-200"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="space-y-1">
                                    <h4 className="font-semibold text-foreground">{task.title}</h4>
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                  </div>
                                  <Badge 
                                    variant={task.relevance === 'high' ? 'default' : 'secondary'}
                                    className="ml-2"
                                  >
                                    {task.relevance === 'high' ? t.highPriority : 
                                     task.relevance === 'medium' ? t.mediumPriority : t.lowPriority}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{t.estimatedTime}: {task.estimatedTime}</span>
                                    </div>
                                    {(task as any).impact && (
                                      <div className="flex items-center space-x-1">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>{t.potentialImpact}: {(task as any).impact}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                   <div className="flex space-x-2">
                                     <Button 
                                       size="sm"
                                       onClick={() => handleTaskStart(task.id)}
                                       disabled={!(task as any).isUnlocked}
                                       className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                                     >
                                       <Play className="w-3 h-3 mr-1" />
                                       {t.startWithAgent} {(task as any).agentName || 'Especialista'}
                                     </Button>
                                     {(task as any).isUnlocked && (
                                       <Button 
                                         size="sm"
                                         variant="outline"
                                         onClick={() => handleCompleteTask(task.id)}
                                         className="border-green-200 text-green-700 hover:bg-green-50"
                                       >
                                         <CheckCircle2 className="w-3 h-3 mr-1" />
                                         Quick Complete
                                       </Button>
                                     )}
                                   </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                              <p>{language === 'es' ? 'Generando recomendaciones personalizadas...' : 'Generating personalized recommendations...'}</p>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Quick Actions */}
            <div className="space-y-6">
              
              {/* Master Agent Chat */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="w-5 h-5 text-secondary" />
                      <span>{t.getGuidance}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t.masterAgentHelper}
                    </p>
                    <Button 
                      onClick={handleMasterAgentChat}
                      className="w-full bg-secondary hover:bg-secondary/90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t.chatWithMaster}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>{t.viewAllTasks}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => navigate('/dashboard/tasks')}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {t.viewAllTasks}
                    </Button>
                  </CardContent>
                </Card>
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