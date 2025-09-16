import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { useTranslations } from '@/hooks/useTranslations';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { MyMissionsDashboard } from '@/components/dashboard/MyMissionsDashboard';
import { IntelligentTaskInterface } from '@/components/tasks/IntelligentTaskInterface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, Target } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';

const TasksDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslations();
  const language = 'en'; // Fixed to English only
  const { tasks } = useAgentTasks();
  const { activeTasksCount, completedTasksCount, remainingSlots } = useTaskLimits(tasks);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);

  // Handle navigation state for pre-selected task
  useEffect(() => {
    if (location.state?.selectedTaskId && tasks.length > 0) {
      const taskFromState = tasks.find(t => t.id === location.state.selectedTaskId);
      if (taskFromState) {
        setSelectedTask(taskFromState);
      }
    }
  }, [location.state, tasks]);

  const seoData = SEO_CONFIG.pages.dashboard[language];

  // If a task is selected for execution, show the guided execution interface
  if (selectedTask) {
    return (
      <>
        <SEOHead
          title={`${seoData.title} - ${selectedTask.title}`}
          description={t.taskManagement.stepByStepExecution}
          keywords={seoData.keywords}
          url={`${SEO_CONFIG.siteUrl}/dashboard/tasks/${selectedTask.id}`}
          type="website"
          noIndex={true}
        />
        
        <DashboardBackground>
          <div className="min-h-screen bg-background">
            {/* Compact Header */}
            <div className="border-b bg-card">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setSelectedTask(null)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.taskManagement.backToTasks}
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold">{selectedTask.title}</h1>
                      <p className="text-sm text-muted-foreground">{t.taskManagement.stepByStepExecution}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Execution Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
              <IntelligentTaskInterface 
                task={selectedTask} 
                onTaskComplete={() => {
                  setSelectedTask(null);
                }}
                onBack={() => setSelectedTask(null)}
              />
            </div>
          </div>
        </DashboardBackground>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${seoData.title} - ${t.taskManagement.title}`}
        description={t.taskManagement.subtitle}
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/dashboard/tasks`}
        type="website"
        noIndex={true}
      />
      
      <DashboardBackground>
        <div className="min-h-screen bg-background">
          {/* Compact Modern Header */}
          <div className="border-b bg-card">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.taskManagement.backToCoordinator}
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">{t.taskManagement.title}</h1>
                      <p className="text-sm text-muted-foreground">{t.taskManagement.subtitle}</p>
                    </div>
                  </div>
                </div>
                
                {/* Compact Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{activeTasksCount}</div>
                      <div className="text-xs text-muted-foreground">{t.taskManagement.activeTasks}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{completedTasksCount}</div>
                      <div className="text-xs text-muted-foreground">{t.taskManagement.completedTasks}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{remainingSlots}</div>
                      <div className="text-xs text-muted-foreground">{t.taskManagement.freeSlots}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <MyMissionsDashboard onTaskSelect={setSelectedTask} />
          </div>
        </div>
      </DashboardBackground>
    </>
  );
};

export default TasksDashboard;