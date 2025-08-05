import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/hooks/useTranslations';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Crown, MessageSquare, Users, Target, Star, ArrowRight, ChevronDown, ChevronRight, Sparkles, Trophy, Zap, Heart, Brain } from 'lucide-react';
import { TaskExecutionInterface } from './TaskExecutionInterface';
import { DashboardBackground } from './DashboardBackground';
import { motion, AnimatePresence } from 'framer-motion';

export const MasterCoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useTranslations();
  const { maturityScores, isLoading } = useOptimizedAgentManagement();
  const { tasks, createTask } = useAgentTasks();
  const { activeTasksCount, completedTasksCount, remainingSlots, getProgressPercentage } = useTaskLimits(tasks);
  
  const [selectedSubAgent, setSelectedSubAgent] = useState<string | null>(null);
  const [isTaskAssignmentOpen, setIsTaskAssignmentOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['suggestions']));
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  // Dynamic tips and coaching messages
  const coachingTips = [
    t.coaching.tip1,
    t.coaching.tip2,
    t.coaching.tip3,
    t.coaching.tip4,
    t.coaching.tip5
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % coachingTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Show celebration when tasks are completed
  useEffect(() => {
    if (completedTasksCount > 0 && completedTasksCount % 3 === 0) {
      setCelebrationVisible(true);
      setTimeout(() => setCelebrationVisible(false), 3000);
    }
  }, [completedTasksCount]);


  const getMaturityLevel = () => {
    if (!maturityScores) return { level: t.maturityLevels.explorer, percentage: 25, color: 'from-purple-500 to-pink-500', emoji: '🌱' };
    
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    if (average >= 80) return { 
      level: t.maturityLevels.visionary, 
      percentage: average, 
      color: 'from-yellow-400 to-orange-500',
      emoji: '👑'
    };
    if (average >= 60) return { 
      level: t.maturityLevels.strategist, 
      percentage: average, 
      color: 'from-green-500 to-emerald-500',
      emoji: '🚀'
    };
    if (average >= 40) return { 
      level: t.maturityLevels.builder, 
      percentage: average, 
      color: 'from-blue-500 to-cyan-500',
      emoji: '🔧'
    };
    return { 
      level: t.maturityLevels.explorer, 
      percentage: average, 
      color: 'from-purple-500 to-pink-500',
      emoji: '🌱'
    };
  };

  const getRecommendedTasks = () => {
    const maturityLevel = getMaturityLevel();
    
    const tasksByLevel = {
      [t.maturityLevels.explorer]: [
        { title: 'Validar tu idea de negocio con expertos', agent: 'cultural-consultant', priority: 'Alta', impact: 5, description: 'Obtén feedback profesional sobre tu concepto', icon: '🎯' },
        { title: 'Calcular costos reales de tu proyecto', agent: 'cost-calculator', priority: 'Alta', impact: 4, description: 'Define presupuestos precisos', icon: '💰' },
        { title: 'Establecer estructura legal básica', agent: 'collaboration-agreement', priority: 'Media', impact: 3, description: 'Protege tu negocio legalmente', icon: '⚖️' }
      ],
      [t.maturityLevels.builder]: [
        { title: 'Desarrollar estrategia de marketing digital', agent: 'marketing-advisor', priority: 'Alta', impact: 5, description: 'Atrae a tus primeros clientes', icon: '📈' },
        { title: 'Optimizar gestión de proyectos', agent: 'project-manager', priority: 'Media', impact: 4, description: 'Organiza tu flujo de trabajo', icon: '📋' },
        { title: 'Crear sistema de precios competitivo', agent: 'pricing-assistant', priority: 'Media', impact: 3, description: 'Maximiza tus ingresos', icon: '💲' }
      ],
      [t.maturityLevels.strategist]: [
        { title: 'Explorar mercados internacionales', agent: 'export-advisor', priority: 'Alta', impact: 5, description: 'Expande globalmente', icon: '🌍' },
        { title: 'Desarrollar red de stakeholders', agent: 'stakeholder-matching', priority: 'Alta', impact: 4, description: 'Conecta con socios clave', icon: '🤝' },
        { title: 'Optimizar marca personal', agent: 'branding-strategy', priority: 'Media', impact: 4, description: 'Fortalece tu posicionamiento', icon: '✨' }
      ],
      [t.maturityLevels.visionary]: [
        { title: 'Desarrollar estrategia de escalabilidad', agent: 'business-scaling', priority: 'Alta', impact: 5, description: 'Multiplica tu impacto', icon: '🚀' },
        { title: 'Implementar innovación disruptiva', agent: 'innovation-consultant', priority: 'Alta', impact: 5, description: 'Lidera el cambio', icon: '💡' },
        { title: 'Crear ecosistema de negocios', agent: 'ecosystem-builder', priority: 'Media', impact: 4, description: 'Construye un imperio', icon: '🏰' }
      ]
    };

    return tasksByLevel[maturityLevel.level] || tasksByLevel[t.maturityLevels.explorer];
  };

  const getPersonalizedGreeting = () => {
    const currentHour = new Date().getHours();
    const maturityLevel = getMaturityLevel();
    let timeGreeting = '';
    
    if (currentHour < 12) {
      timeGreeting = t.greetings.goodMorning;
    } else if (currentHour < 18) {
      timeGreeting = t.greetings.goodAfternoon;
    } else {
      timeGreeting = t.greetings.goodEvening;
    }

    if (completedTasksCount === 0) {
      return `${timeGreeting} ${t.greetings.firstTime} ${maturityLevel.emoji}`;
    } else if (completedTasksCount >= 10) {
      return `${timeGreeting} ${t.greetings.excellentProgress.replace('{level}', maturityLevel.level)} 🏆`;
    } else if (activeTasksCount >= 12) {
      return `${timeGreeting} ${t.greetings.manyActiveTasks} 🎯`;
    } else {
      return `${timeGreeting} ${t.greetings.perfectMoment} ⚡`;
    }
  };

  const handleStartTaskWithAgent = async (agentId: string, taskTitle: string) => {
    // Create assignment ceremony
    setSelectedSubAgent(agentId);
    setIsTaskAssignmentOpen(true);
    
    // Create the task
    await createTask({
      title: taskTitle,
      description: `Misión asignada por el Coordinador Maestro`,
      agent_id: agentId,
      priority: 1,
      relevance: 'high'
    });
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const maturityLevel = getMaturityLevel();
  const recommendedTasks = getRecommendedTasks();

  if (isLoading) {
    return (
      <DashboardBackground>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              <p className="text-white text-xl font-medium">{t.masterCoordinator.preparingCoordinator}</p>
              <p className="text-purple-200 text-sm mt-2">{t.masterCoordinator.configuringExperience}</p>
            </motion.div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  if (selectedSubAgent && isTaskAssignmentOpen) {
    return (
      <TaskExecutionInterface 
        agentId={selectedSubAgent}
        language={language}
        onComplete={() => {
          setSelectedSubAgent(null);
          setIsTaskAssignmentOpen(false);
        }}
        onReturnToCoordinator={() => {
          setSelectedSubAgent(null);
          setIsTaskAssignmentOpen(false);
        }}
      />
    );
  }

  return (
    <DashboardBackground showGlobalComponents={false}>
      <div className="min-h-screen">
        {/* Celebration Animation */}
        <AnimatePresence>
          {celebrationVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            >
              <motion.div
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-8 text-center text-white"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">{t.masterCoordinator.incredible}</h3>
                <p>{t.masterCoordinator.completedTasks.replace('{count}', completedTasksCount.toString())}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Coordinator Header - Enhanced and Animated */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 border-b border-purple-700 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
            
            {/* Master Agent Avatar and Title - Enhanced */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/20"
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  boxShadow: ["0 0 20px rgba(255,215,0,0.3)", "0 0 30px rgba(255,215,0,0.6)", "0 0 20px rgba(255,215,0,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-14 h-14 text-white" />
              </motion.div>
              <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                {t.masterCoordinator.title}
              </h1>
              <p className="text-purple-200 text-xl font-medium">{t.masterCoordinator.subtitle}</p>
              <motion.div 
                className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-4 h-4 text-yellow-300" />
                <span className="text-sm text-white">{coachingTips[currentTip]}</span>
              </motion.div>
            </motion.div>

            {/* Personal Greeting - Enhanced */}
            <motion.div 
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{t.masterCoordinator.personalCoordinator}</h3>
                  <p className="text-purple-200 text-sm">{t.masterCoordinator.alwaysHereToGuide}</p>
                </div>
              </div>
              <p className="text-white text-lg font-medium leading-relaxed">{getPersonalizedGreeting()}</p>
            </motion.div>

            {/* Enhanced Progress Dashboard */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{activeTasksCount}/15</div>
                  <div className="text-purple-200 text-sm mb-3">{t.masterCoordinator.activeSlots}</div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                  <div className="mt-2 text-xs text-purple-300">
                    {remainingSlots} {t.masterCoordinator.freeSlots}
                  </div>
                </div>
              </Card>

              <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-green-300">{completedTasksCount}</div>
                  <div className="text-purple-200 text-sm mb-3">{t.masterCoordinator.completed}</div>
                  <Star className="w-6 h-6 mx-auto text-yellow-400" />
                  <div className="mt-2 text-xs text-purple-300">
                    {t.masterCoordinator.excellentProgress}
                  </div>
                </div>
              </Card>

              <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-blue-300">{Math.round(maturityLevel.percentage)}%</div>
                  <div className="text-purple-200 text-sm mb-3">{maturityLevel.level}</div>
                  <div className="text-2xl mb-2">{maturityLevel.emoji}</div>
                  <Progress value={maturityLevel.percentage} className="h-2" />
                </div>
              </Card>

              <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-yellow-300">{Math.round((completedTasksCount / Math.max(completedTasksCount + activeTasksCount, 1)) * 100)}%</div>
                  <div className="text-purple-200 text-sm mb-3">{t.masterCoordinator.successRate}</div>
                  <Zap className="w-6 h-6 mx-auto text-orange-400" />
                  <div className="mt-2 text-xs text-purple-300">
                    {t.masterCoordinator.efficiency} {Math.round((completedTasksCount / Math.max(completedTasksCount + activeTasksCount, 1)) * 100)}%
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Main Content Area - Enhanced */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* Priority Missions Section - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="mb-8 border-purple-200 shadow-xl bg-gradient-to-br from-white to-purple-50">
              <div className="p-8">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('suggestions')}
                >
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    {t.masterCoordinator.nextRecommendations}
                  </h2>
                  <motion.div
                    animate={{ rotate: expandedSections.has('suggestions') ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-gray-500" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {expandedSections.has('suggestions') && (
                    <motion.div 
                      className="mt-8 space-y-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {recommendedTasks.map((task, index) => (
                        <motion.div 
                          key={index} 
                          className="bg-gradient-to-r from-purple-50 via-white to-pink-50 rounded-xl p-6 border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="text-3xl">{task.icon}</div>
                                <div>
                                  <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
                                  <p className="text-gray-600 text-sm">{task.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge 
                                  variant={task.priority === 'Alta' ? 'destructive' : 'secondary'}
                                  className="font-medium"
                                >
                                  Prioridad: {task.priority}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  {[...Array(task.impact)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">Impacto</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleStartTaskWithAgent(task.agent, task.title)}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-lg"
                              disabled={activeTasksCount >= 15}
                            >
                              {t.masterCoordinator.startWithAgent} Especialista
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Action Center - Enhanced */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{t.masterCoordinator.getPersonalizedGuidance}</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Habla directamente conmigo para obtener orientación estratégica personalizada y resolver cualquier desafío empresarial.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/agent/master-coordinator')}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 text-lg rounded-lg shadow-lg"
                  size="lg"
                >
                  Iniciar Consulta Estratégica
                  <MessageSquare className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>

            <Card className="border-green-200 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300">
                  <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{t.masterCoordinator.viewAllTasks}</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Explora todas tus misiones y recomendaciones inteligentes en un solo lugar. Tu centro de comando empresarial unificado.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/tasks')}
                  variant="outline"
                  className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 text-lg rounded-lg"
                  size="lg"
                >
                  Ver Misiones y Recomendaciones
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardBackground>
  );
};