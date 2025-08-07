import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Target, 
  Play, 
  CheckCircle, 
  Clock, 
  Search, 
  ArrowRight,
  BarChart3,
  Users,
  Trash2,
  TrendingUp,
  Timer,
  AlertCircle
} from 'lucide-react';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/hooks/useTranslations';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { AgentTask } from '@/hooks/types/agentTaskTypes';
import { ClearAllTasksDialog } from './ClearAllTasksDialog';
import { toast } from 'sonner';

interface MyMissionsDashboardProps {
  onTaskSelect: (task: AgentTask) => void;
}

export const MyMissionsDashboard: React.FC<MyMissionsDashboardProps> = ({ onTaskSelect }) => {
  const { user } = useAuth();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { tasks, loading, startTaskDevelopment, deleteAllTasks } = useAgentTasks();
  const { activeTasksCount, completedTasksCount, remainingSlots, getProgressColor } = useTaskLimits(tasks);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);


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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': 
        return { variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'in_progress': 
        return { variant: 'default' as const, className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock };
      case 'pending': 
        return { variant: 'outline' as const, className: 'text-muted-foreground', icon: Target };
      default: 
        return { variant: 'outline' as const, className: 'text-muted-foreground', icon: Target };
    }
  };

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1: return { text: "High", className: 'bg-red-50 text-red-700 border-red-200' };
      case 2: return { text: "Medium", className: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 3: return { text: "Low", className: 'bg-green-50 text-green-700 border-green-200' };
      default: return { text: "Medium", className: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return `${diffDays - 1} days ago`;
  };

  const handleTaskAction = async (task: AgentTask) => {
    if (task.status === 'pending') {
      await startTaskDevelopment(task.id);
    }
    onTaskSelect(task);
  };


  const activeTasks = filteredTasks.filter(task => task.status === 'pending' || task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.ui.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold text-foreground">{activeTasksCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold text-foreground">{completedTasksCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Free Slots</p>
                <p className="text-2xl font-bold text-foreground">{remainingSlots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${(completedTasksCount / (activeTasksCount + completedTasksCount)) * 100 || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round((completedTasksCount / (activeTasksCount + completedTasksCount)) * 100 || 0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Modern Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1">High</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {availableAgents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Delete All Tasks Button */}
              {tasks.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowClearAllDialog(true)}
                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Tasks
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Task Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-background">
            Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-background">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-16 px-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">No tasks available</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Start by creating your first task to organize your business growth</p>
                <Button onClick={() => navigate('/maturity-calculator')} size="lg">
                  Create First Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => {
                const statusBadge = getStatusBadge(task.status);
                const priorityBadge = getPriorityBadge(task.priority);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <StatusIcon className="w-5 h-5 text-muted-foreground" />
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {task.title}
                              </h3>
                              <Badge variant="outline" className={priorityBadge.className}>
                                {priorityBadge.text}
                              </Badge>
                              <Badge variant={statusBadge.variant} className={statusBadge.className}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            {task.description && (
                              <p className="text-muted-foreground line-clamp-2 text-sm">{task.description}</p>
                            )}
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">{task.agent_id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4" />
                                <span>{getTimeAgo(task.updated_at)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                <span>{task.progress_percentage}% Progress</span>
                              </div>
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 ml-6">
                            <Button
                              variant="outline"
                              onClick={() => handleTaskAction(task)}
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
                            >
                              {task.status === 'pending' && (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Task
                                </>
                              )}
                              {task.status === 'in_progress' && (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Continue Task
                                </>
                              )}
                              {task.status === 'completed' && (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Review Task
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-3 mt-6">
          {activeTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 px-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active tasks</h3>
                <p className="text-muted-foreground">All caught up! No active tasks to work on.</p>
              </CardContent>
            </Card>
          ) : (
            activeTasks.map((task, index) => {
              const priorityBadge = getPriorityBadge(task.priority);
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge variant="outline" className={priorityBadge.className}>
                              {priorityBadge.text}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{task.agent_id}</span>
                            <span>{task.progress_percentage}% complete</span>
                          </div>
                        </div>
                        <Button onClick={() => handleTaskAction(task)} className="bg-blue-600 hover:bg-blue-700">
                          {task.status === 'pending' ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Task
                            </>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Continue Task
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-6">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 px-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No completed tasks</h3>
                <p className="text-muted-foreground">Start working on tasks to see your progress here.</p>
              </CardContent>
            </Card>
          ) : (
            completedTasks.map((task, index) => {
              const priorityBadge = getPriorityBadge(task.priority);
              
               return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <Badge variant="outline" className={priorityBadge.className}>
                              {priorityBadge.text}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{task.agent_id}</span>
                            <span>Completed {getTimeAgo(task.completed_at || task.updated_at)}</span>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => handleTaskAction(task)} className="text-green-600 border-green-200 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review Task
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Clear All Tasks Dialog */}
      <ClearAllTasksDialog
        isOpen={showClearAllDialog}
        onClose={() => setShowClearAllDialog(false)}
        onConfirm={async () => {
          await deleteAllTasks();
        }}
        taskCount={tasks.length}
        language="en"
      />
    </div>
  );
};