import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Star,
  ArrowRight,
  BarChart3,
  Calendar,
  Users,
  Award,
  Sparkles,
  Plus,
  Lightbulb
} from 'lucide-react';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { useUnifiedTaskRecommendations } from '@/hooks/useUnifiedTaskRecommendations';
import { AgentTask } from '@/hooks/types/agentTaskTypes';
import { OptimizedRecommendedTask } from '@/hooks/types/recommendedTasksTypes';
import { toast } from 'sonner';

interface MyMissionsDashboardProps {
  onTaskSelect: (task: AgentTask) => void;
}

export const MyMissionsDashboard: React.FC<MyMissionsDashboardProps> = ({ onTaskSelect }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { tasks, loading, startTaskDevelopment, completeTaskQuickly, createTask } = useAgentTasks();
  const { activeTasksCount, completedTasksCount, isAtLimit, remainingSlots, getProgressColor } = useTaskLimits(tasks);
  const { maturityScores } = useOptimizedAgentManagement();
  const recommendedTasks = useUnifiedTaskRecommendations({ maturityScores, language });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [showRecommendations, setShowRecommendations] = useState(true);

  const t = {
    en: {
      title: 'My Missions 🎯',
      subtitle: 'Central hub for all your creative tasks and goals',
      searchPlaceholder: 'Search missions...',
      allMissions: 'All Missions',
      activeMissions: 'Active',
      completedMissions: 'Completed',
      filterByStatus: 'Filter by Status',
      filterByPriority: 'Filter by Priority',
      filterByAgent: 'Filter by Agent',
      all: 'All',
      pending: 'Not Started',
      inProgress: 'In Progress',
      completed: 'Completed',
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
      continueTask: 'Continue',
      startTask: 'Start',
      reviewTask: 'Review',
      completeTask: 'Mark Complete',
      taskStats: 'Mission Statistics',
      activeCount: 'Active Missions',
      completedCount: 'Completed',
      remainingSlots: 'Free Slots',
      progressTitle: 'Your Progress',
      noMissions: 'No missions found',
      noMissionsDesc: 'Try adjusting your filters or create new tasks',
      createFirst: 'Create My First Mission',
      estimatedTime: 'Est. time',
      minutes: 'min',
      priority: 'Priority',
      agent: 'Agent',
      status: 'Status',
      lastUpdated: 'Updated',
      daysAgo: 'days ago',
      today: 'today',
      yesterday: 'yesterday',
      recommendedTasks: 'Recommended Tasks',
      recommendedSubtitle: 'Smart suggestions based on your business maturity',
      convertToTask: 'Add to Missions',
      recommendationsPriority: 'Recommended Priority',
      estimatedTimeLabel: 'Estimated Time',
      hideRecommendations: 'Hide Recommendations',
      showRecommendations: 'Show Recommendations'
    },
    es: {
      title: 'Mis Misiones 🎯',
      subtitle: 'Centro de control para todas tus tareas y objetivos creativos',
      searchPlaceholder: 'Buscar misiones...',
      allMissions: 'Todas las Misiones',
      activeMissions: 'Activas',
      completedMissions: 'Completadas',
      filterByStatus: 'Filtrar por Estado',
      filterByPriority: 'Filtrar por Prioridad',
      filterByAgent: 'Filtrar por Agente',
      all: 'Todas',
      pending: 'Sin Iniciar',
      inProgress: 'En Progreso',
      completed: 'Completadas',
      high: 'Prioridad Alta',
      medium: 'Prioridad Media',
      low: 'Prioridad Baja',
      continueTask: 'Continuar',
      startTask: 'Iniciar',
      reviewTask: 'Revisar',
      completeTask: 'Marcar Completa',
      taskStats: 'Estadísticas de Misiones',
      activeCount: 'Misiones Activas',
      completedCount: 'Completadas',
      remainingSlots: 'Espacios Libres',
      progressTitle: 'Tu Progreso',
      noMissions: 'No se encontraron misiones',
      noMissionsDesc: 'Intenta ajustar los filtros o crea nuevas tareas',
      createFirst: 'Crear Mi Primera Misión',
      estimatedTime: 'Tiempo est.',
      minutes: 'min',
      priority: 'Prioridad',
      agent: 'Agente',
      status: 'Estado',
      lastUpdated: 'Actualizada',
      daysAgo: 'días atrás',
      today: 'hoy',
      yesterday: 'ayer',
      recommendedTasks: 'Tareas Recomendadas',
      recommendedSubtitle: 'Sugerencias inteligentes basadas en tu madurez empresarial',
      convertToTask: 'Agregar a Misiones',
      recommendationsPriority: 'Prioridad Recomendada',
      estimatedTimeLabel: 'Tiempo Estimado',
      hideRecommendations: 'Ocultar Recomendaciones',
      showRecommendations: 'Mostrar Recomendaciones'
    }
  };

  const translations = t[language];

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority.toString() === priorityFilter;
      const matchesAgent = agentFilter === 'all' || task.agent_id === agentFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAgent;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, agentFilter]);

  // Get unique agents for filter
  const availableAgents = useMemo(() => {
    const agents = Array.from(new Set(tasks.map(task => task.agent_id)));
    return agents.map(agentId => ({
      id: agentId,
      name: agentId.charAt(0).toUpperCase() + agentId.slice(1)
    }));
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-50 border-red-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return translations.today;
    if (diffDays === 2) return translations.yesterday;
    return `${diffDays - 1} ${translations.daysAgo}`;
  };

  const handleTaskAction = async (task: AgentTask) => {
    if (task.status === 'pending') {
      await startTaskDevelopment(task.id);
    }
    onTaskSelect(task);
  };

  const convertRecommendationToTask = async (recommendation: OptimizedRecommendedTask) => {
    try {
      if (isAtLimit) {
        toast.error(language === 'es' ? 'Has alcanzado el límite de 15 tareas activas' : 'You have reached the limit of 15 active tasks');
        return;
      }

      await createTask({
        title: recommendation.title,
        description: recommendation.description,
        agent_id: recommendation.agentId,
        priority: recommendation.priority === 'high' ? 1 : recommendation.priority === 'medium' ? 2 : 3,
        relevance: recommendation.priority === 'high' ? 'high' : recommendation.priority === 'medium' ? 'medium' : 'low'
      });

      toast.success(language === 'es' ? '¡Tarea agregada a tus misiones!' : 'Task added to your missions!');
    } catch (error) {
      console.error('Error converting recommendation to task:', error);
      toast.error(language === 'es' ? 'Error al agregar la tarea' : 'Error adding task');
    }
  };

  const getPriorityColorForRecommendation = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const activeTasks = filteredTasks.filter(task => task.status === 'pending' || task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando misiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {translations.title}
        </h1>
        <p className="text-muted-foreground">{translations.subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{translations.activeCount}</p>
                <p className="text-2xl font-bold text-blue-600">{activeTasksCount}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{translations.completedCount}</p>
                <p className="text-2xl font-bold text-green-600">{completedTasksCount}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{translations.remainingSlots}</p>
                <p className="text-2xl font-bold text-orange-600">{remainingSlots}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{translations.progressTitle}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor()}`}
                    style={{ width: `${(completedTasksCount / (activeTasksCount + completedTasksCount)) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Tasks Section */}
      {recommendedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-gradient-to-r from-purple-200 to-pink-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {translations.recommendedTasks}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{translations.recommendedSubtitle}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {showRecommendations ? translations.hideRecommendations : translations.showRecommendations}
                </Button>
              </div>
            </CardHeader>
            
            <AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {recommendedTasks.map((recommendation, index) => (
                        <motion.div
                          key={recommendation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-purple-50 via-white to-pink-50 rounded-lg p-4 border border-purple-100 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <Lightbulb className="w-5 h-5 text-purple-500" />
                                <h4 className="font-semibold text-lg text-gray-800">
                                  {recommendation.title}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={getPriorityColorForRecommendation(recommendation.priority)}
                                >
                                  {translations.recommendationsPriority}: {
                                    recommendation.priority === 'high' ? translations.high :
                                    recommendation.priority === 'medium' ? translations.medium :
                                    translations.low
                                  }
                                </Badge>
                              </div>
                              
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {recommendation.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{recommendation.agentName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{translations.estimatedTimeLabel}: {recommendation.estimatedTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>{recommendation.category}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <Button
                                onClick={() => convertRecommendationToTask(recommendation)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                size="sm"
                                disabled={isAtLimit}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                {translations.convertToTask}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={translations.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={translations.filterByStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.all}</SelectItem>
                <SelectItem value="pending">{translations.pending}</SelectItem>
                <SelectItem value="in_progress">{translations.inProgress}</SelectItem>
                <SelectItem value="completed">{translations.completed}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={translations.filterByPriority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.all}</SelectItem>
                <SelectItem value="1">{translations.high}</SelectItem>
                <SelectItem value="2">{translations.medium}</SelectItem>
                <SelectItem value="3">{translations.low}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={translations.filterByAgent} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.all}</SelectItem>
                {availableAgents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{translations.allMissions}</TabsTrigger>
          <TabsTrigger value="active">{translations.activeMissions}</TabsTrigger>
          <TabsTrigger value="completed">{translations.completedMissions}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{translations.noMissions}</h3>
                <p className="text-muted-foreground mb-4">{translations.noMissionsDesc}</p>
                <Button onClick={() => navigate('/maturity-calculator')}>
                  {translations.createFirst}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {translations.priority} {task.priority}
                            </Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-muted-foreground line-clamp-2">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{task.agent_id}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{getTimeAgo(task.updated_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-4 w-4" />
                              <span>{task.progress_percentage}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskAction(task)}
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            {task.status === 'pending' && (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                {translations.startTask}
                              </>
                            )}
                            {task.status === 'in_progress' && (
                              <>
                                <ArrowRight className="h-4 w-4 mr-1" />
                                {translations.continueTask}
                              </>
                            )}
                            {task.status === 'completed' && (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {translations.reviewTask}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                        {task.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{task.agent_id}</span>
                          <span>{task.progress_percentage}% completado</span>
                        </div>
                      </div>
                      <Button onClick={() => handleTaskAction(task)}>
                        {task.status === 'pending' ? translations.startTask : translations.continueTask}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-green-500 opacity-75 hover:opacity-100 transition-opacity">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                        </div>
                        {task.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{task.agent_id}</span>
                          <span>Completada {getTimeAgo(task.completed_at || task.updated_at)}</span>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => onTaskSelect(task)}>
                        {translations.reviewTask}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};