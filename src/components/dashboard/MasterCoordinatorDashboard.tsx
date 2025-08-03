import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Crown, MessageSquare, Users, Target, Star, ArrowRight, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { TaskExecutionInterface } from './TaskExecutionInterface';
import { DashboardBackground } from './DashboardBackground';

export const MasterCoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { maturityScores, isLoading } = useOptimizedAgentManagement();
  const { tasks, createTask } = useAgentTasks();
  const { activeTasksCount, completedTasksCount, remainingSlots, getProgressPercentage } = useTaskLimits(tasks);
  
  const [selectedSubAgent, setSelectedSubAgent] = useState<string | null>(null);
  const [isTaskAssignmentOpen, setIsTaskAssignmentOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['suggestions']));

  const translations = {
    en: {
      title: "Master Business Coordinator",
      subtitle: "Your Complete Business Growth Guide",
      welcome: "Welcome to your Business Command Center",
      currentStatus: "Current Progress Status",
      activeSlots: "Active Task Slots",
      completed: "Completed Tasks",
      maturityLevel: "Business Maturity",
      nextRecommendations: "Priority Recommendations for You",
      viewAllTasks: "Manage All Tasks",
      startWithAgent: "Start with",
      choosePath: "Choose Your Growth Path",
      getPersonalizedGuidance: "Get Personalized Guidance",
      exploreSubAgents: "Available Specialists",
      progressToNext: "Progress to Next Level"
    },
    es: {
      title: "Coordinador Maestro de Negocios",
      subtitle: "Tu Guía Completa de Crecimiento Empresarial",
      welcome: "Bienvenido a tu Centro de Comando Empresarial",
      currentStatus: "Estado Actual de Progreso",
      activeSlots: "Espacios de Tareas Activas",
      completed: "Tareas Completadas",
      maturityLevel: "Madurez del Negocio",
      nextRecommendations: "Recomendaciones Prioritarias para Ti",
      viewAllTasks: "Gestionar Todas las Tareas",
      startWithAgent: "Iniciar con",
      choosePath: "Elige tu Ruta de Crecimiento",
      getPersonalizedGuidance: "Obtener Orientación Personalizada",
      exploreSubAgents: "Especialistas Disponibles",
      progressToNext: "Progreso al Siguiente Nivel"
    }
  };

  const t = translations[language];

  const getMaturityLevel = () => {
    if (!maturityScores) return { level: 'Principiante', percentage: 25, color: 'from-purple-500 to-pink-500' };
    
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    if (average >= 70) return { 
      level: 'Avanzado', 
      percentage: average, 
      color: 'from-green-500 to-emerald-500' 
    };
    if (average >= 40) return { 
      level: 'Intermedio', 
      percentage: average, 
      color: 'from-blue-500 to-cyan-500' 
    };
    return { 
      level: 'Principiante', 
      percentage: average, 
      color: 'from-purple-500 to-pink-500' 
    };
  };

  const getRecommendedTasks = () => {
    const maturityLevel = getMaturityLevel();
    
    const tasksByLevel = {
      'Principiante': [
        { title: 'Validar tu idea de negocio', agent: 'cultural-consultant', priority: 'Alta', impact: 4 },
        { title: 'Calcular costos y precios', agent: 'cost-calculator', priority: 'Alta', impact: 4 },
        { title: 'Definir estructura legal básica', agent: 'collaboration-agreement', priority: 'Media', impact: 3 }
      ],
      'Intermedio': [
        { title: 'Desarrollar estrategia de marketing', agent: 'marketing-advisor', priority: 'Alta', impact: 4 },
        { title: 'Optimizar gestión de proyectos', agent: 'project-manager', priority: 'Media', impact: 3 },
        { title: 'Crear sistema de precios por canal', agent: 'pricing-assistant', priority: 'Media', impact: 3 }
      ],
      'Avanzado': [
        { title: 'Explorar mercados internacionales', agent: 'export-advisor', priority: 'Alta', impact: 4 },
        { title: 'Desarrollar red de stakeholders', agent: 'stakeholder-matching', priority: 'Alta', impact: 4 },
        { title: 'Optimizar marca personal', agent: 'branding-strategy', priority: 'Media', impact: 3 }
      ]
    };

    return tasksByLevel[maturityLevel.level] || tasksByLevel['Principiante'];
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    let timeGreeting = '';
    
    if (currentHour < 12) {
      timeGreeting = '¡Buenos días!';
    } else if (currentHour < 18) {
      timeGreeting = '¡Buenas tardes!';
    } else {
      timeGreeting = '¡Buenas noches!';
    }

    if (completedTasksCount === 0) {
      return `${timeGreeting} ¡Perfecto momento para comenzar tu viaje empresarial!`;
    } else if (activeTasksCount >= 12) {
      return `${timeGreeting} Tienes muchas tareas activas. Te ayudo a priorizar.`;
    } else {
      return `${timeGreeting} Sigamos construyendo el éxito de tu negocio.`;
    }
  };

  const handleStartTaskWithAgent = (agentId: string, taskTitle: string) => {
    setSelectedSubAgent(agentId);
    setIsTaskAssignmentOpen(true);
    
    // Create the task immediately
    createTask({
      title: taskTitle,
      description: `Tarea iniciada con ${agentId}`,
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
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300 mx-auto mb-4"></div>
              <p className="text-white text-lg">Preparando tu coordinador maestro...</p>
            </div>
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
        {/* Master Coordinator Header - Prominent and Central */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 border-b border-purple-700">
          <div className="max-w-6xl mx-auto px-6 py-12">
            
            {/* Master Agent Avatar and Title */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
              <p className="text-purple-200 text-lg">{t.subtitle}</p>
            </div>

            {/* Greeting */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <p className="text-white text-lg text-center font-medium">{getGreeting()}</p>
            </div>

            {/* Progress Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{activeTasksCount}/15</div>
                  <div className="text-purple-200 text-sm">{t.activeSlots}</div>
                  <div className="mt-3">
                    <Progress value={getProgressPercentage()} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2 text-green-300">{completedTasksCount}</div>
                  <div className="text-purple-200 text-sm">{t.completed}</div>
                  <Star className="w-5 h-5 mx-auto mt-3 text-yellow-400" />
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2 text-blue-300">{Math.round(maturityLevel.percentage)}%</div>
                  <div className="text-purple-200 text-sm">{t.maturityLevel}</div>
                  <div className="mt-3">
                    <Progress value={maturityLevel.percentage} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2 text-yellow-300">{remainingSlots}</div>
                  <div className="text-purple-200 text-sm">Espacios Libres</div>
                  <Target className="w-5 h-5 mx-auto mt-3 text-blue-400" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* Priority Recommendations Section */}
          <Card className="mb-8 border-purple-200 shadow-lg">
            <div className="p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('suggestions')}
              >
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-purple-600" />
                  {t.nextRecommendations}
                </h2>
                {expandedSections.has('suggestions') ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {expandedSections.has('suggestions') && (
                <div className="mt-6 space-y-4">
                  {recommendedTasks.map((task, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                          <div className="flex items-center gap-3">
                            <Badge variant={task.priority === 'Alta' ? 'destructive' : 'secondary'}>
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-gray-600">Impacto: {task.impact}/4</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleStartTaskWithAgent(task.agent, task.title)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={activeTasksCount >= 15}
                        >
                          {t.startWithAgent} {task.agent === 'cultural-consultant' ? 'Especialista' : 'Agente'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Action Center */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  {t.getPersonalizedGuidance}
                </h3>
                <p className="text-gray-600 mb-4">
                  Habla directamente conmigo para obtener orientación personalizada sobre tu negocio.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/agent/master-coordinator')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Iniciar Conversación
                  <MessageSquare className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            <Card className="border-green-200 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  {t.viewAllTasks}
                </h3>
                <p className="text-gray-600 mb-4">
                  Gestiona todas tus tareas activas, pausadas y completadas en un solo lugar.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/tasks')}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  Ver Dashboard de Tareas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardBackground>
  );
};