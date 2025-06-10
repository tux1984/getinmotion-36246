
import React from 'react';
import { Agent, CategoryScore } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  Users, 
  Target,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskBasedDashboardProps {
  agents: Agent[];
  maturityScores: CategoryScore | null;
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  estimatedTime: string;
  category: string;
}

export const TaskBasedDashboard: React.FC<TaskBasedDashboardProps> = ({
  agents,
  maturityScores,
  onSelectAgent,
  onMaturityCalculatorClick
}) => {
  const { language } = useLanguage();

  const t = {
    en: {
      welcomeTitle: "Welcome to Your Creative Workspace",
      welcomeSubtitle: "Ready to bring your creative project to life?",
      priorityTasks: "Priority Tasks",
      activeAgents: "Active AI Assistants",
      quickActions: "Quick Actions",
      projectProgress: "Project Progress",
      startTask: "Start Task",
      viewAgent: "View Agent",
      retakeAssessment: "Retake Assessment",
      noTasks: "No tasks yet",
      noTasksDesc: "Complete your maturity assessment to get personalized tasks",
      high: "High",
      medium: "Medium", 
      low: "Low",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed"
    },
    es: {
      welcomeTitle: "Bienvenido a tu Espacio Creativo",
      welcomeSubtitle: "¿Listo para dar vida a tu proyecto creativo?",
      priorityTasks: "Tareas Prioritarias",
      activeAgents: "Asistentes IA Activos",
      quickActions: "Acciones Rápidas",
      projectProgress: "Progreso del Proyecto",
      startTask: "Iniciar Tarea",
      viewAgent: "Ver Agente",
      retakeAssessment: "Repetir Evaluación",
      noTasks: "Sin tareas aún",
      noTasksDesc: "Completa tu evaluación de madurez para obtener tareas personalizadas",
      high: "Alta",
      medium: "Media",
      low: "Baja",
      pending: "Pendiente",
      inProgress: "En Progreso",
      completed: "Completada"
    }
  };

  // Generate sample tasks based on maturity scores
  const generateTasks = (): Task[] => {
    if (!maturityScores) return [];

    const tasks: Task[] = [];

    // Add tasks based on low scores (areas that need improvement)
    if (maturityScores.ideaValidation < 60) {
      tasks.push({
        id: '1',
        title: language === 'en' ? 'Validate Your Creative Concept' : 'Valida tu Concepto Creativo',
        description: language === 'en' ? 'Research your target audience and validate market demand' : 'Investiga tu público objetivo y valida la demanda del mercado',
        agentId: 'cultural',
        agentName: language === 'en' ? 'Creative Specialist' : 'Especialista Creativo',
        priority: 'high',
        status: 'pending',
        estimatedTime: '2 hours',
        category: 'Research'
      });
    }

    if (maturityScores.userExperience < 60) {
      tasks.push({
        id: '2',
        title: language === 'en' ? 'Design User Journey Map' : 'Diseña el Mapa de Experiencia del Usuario',
        description: language === 'en' ? 'Create a detailed user experience flow for your creative service' : 'Crea un flujo detallado de experiencia de usuario para tu servicio creativo',
        agentId: 'admin',
        agentName: language === 'en' ? 'Administrative Assistant' : 'Asistente Administrativo',
        priority: 'medium',
        status: 'pending',
        estimatedTime: '1.5 hours',
        category: 'Design'
      });
    }

    if (maturityScores.monetization < 60) {
      tasks.push({
        id: '3',
        title: language === 'en' ? 'Create Pricing Strategy' : 'Crea Estrategia de Precios',
        description: language === 'en' ? 'Develop a competitive pricing model for your creative services' : 'Desarrolla un modelo de precios competitivo para tus servicios creativos',
        agentId: 'accounting',
        agentName: language === 'en' ? 'Financial Advisor' : 'Asesor Financiero',
        priority: 'high',
        status: 'pending',
        estimatedTime: '1 hour',
        category: 'Finance'
      });
    }

    return tasks;
  };

  const tasks = generateTasks();
  const activeAgents = agents.filter(agent => agent.status === 'active');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const overallProgress = maturityScores 
    ? Math.round((maturityScores.ideaValidation + maturityScores.userExperience + maturityScores.marketFit + maturityScores.monetization) / 4)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          {t[language].welcomeTitle}
        </h1>
        <p className="text-xl text-white/80">
          {t[language].welcomeSubtitle}
        </p>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Tasks - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Target className="w-6 h-6 text-purple-400" />
                {t[language].priorityTasks}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">{t[language].noTasks}</h3>
                  <p className="text-white/60 mb-6">{t[language].noTasksDesc}</p>
                  <Button onClick={onMaturityCalculatorClick} className="bg-purple-600 hover:bg-purple-700">
                    {t[language].retakeAssessment}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-white">{task.title}</h4>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {t[language][task.priority as keyof typeof t[typeof language]]}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-white/50">
                            <span>👤 {task.agentName}</span>
                            <span>⏱️ {task.estimatedTime}</span>
                            <span>📁 {task.category}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onSelectAgent(task.agentId)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {t[language].startTask}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Project Progress */}
          {maturityScores && (
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  {t[language].projectProgress}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-white mb-2">{overallProgress}%</div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Validación de Idea</span>
                    <span>{maturityScores.ideaValidation}%</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Experiencia Usuario</span>
                    <span>{maturityScores.userExperience}%</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Ajuste al Mercado</span>
                    <span>{maturityScores.marketFit}%</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Monetización</span>
                    <span>{maturityScores.monetization}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Agents */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Users className="w-6 h-6 text-blue-400" />
                {t[language].activeAgents}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeAgents.length === 0 ? (
                <p className="text-white/60 text-center py-4">No active agents yet</p>
              ) : (
                <div className="space-y-3">
                  {activeAgents.slice(0, 3).map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center text-white text-sm`}>
                          {agent.icon}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{agent.name}</div>
                          <div className="text-white/50 text-xs">{agent.activeTasks} tareas activas</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectAgent(agent.id)}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        {t[language].viewAgent}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Zap className="w-6 h-6 text-yellow-400" />
                {t[language].quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={onMaturityCalculatorClick}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  {t[language].retakeAssessment}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Programar Sesión
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-white/10"
                >
                  <CheckCircle2 className="w-4 h-4 mr-3" />
                  Ver Progreso
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
