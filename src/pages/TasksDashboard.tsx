import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { MyMissionsDashboard } from '@/components/dashboard/MyMissionsDashboard';
import { GuidedTaskExecution } from '@/components/tasks/GuidedTaskExecution';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListTodo } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { AgentTask } from '@/hooks/useAgentTasks';
import { useState } from 'react';

const TasksDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const language = 'en'; // Fixed to English only
  const { tasks } = useAgentTasks();
  const { activeTasksCount, completedTasksCount } = useTaskLimits(tasks);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);

  const seoData = SEO_CONFIG.pages.dashboard[language];

  // If a task is selected for execution, show the guided execution interface
  if (selectedTask) {
    return (
      <>
        <SEOHead
          title={`${seoData.title} - ${selectedTask.title}`}
          description="Ejecuta tu tarea paso a paso con IA"
          keywords={seoData.keywords}
          url={`${SEO_CONFIG.siteUrl}/dashboard/tasks/${selectedTask.id}`}
          type="website"
          noIndex={true}
        />
        
        <DashboardBackground showGlobalComponents={false}>
          <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
              <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setSelectedTask(null)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Mis Misiones
                  </Button>
                  <div className="h-6 w-px bg-blue-600" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <ListTodo className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">{selectedTask.title}</h1>
                      <p className="text-blue-200">Ejecución guiada paso a paso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Execution Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
              <GuidedTaskExecution task={selectedTask} />
            </div>
          </div>
        </DashboardBackground>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${seoData.title} - Gestión de Tareas`}
        description="Gestiona todas tus tareas empresariales en un solo lugar"
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/dashboard/tasks`}
        type="website"
        noIndex={true}
      />
      
      <DashboardBackground showGlobalComponents={false}>
        <div className="min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al Coordinador Maestro
                  </Button>
                  <div className="h-6 w-px bg-blue-600" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <ListTodo className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Gestión de Tareas</h1>
                      <p className="text-blue-200">Organiza y ejecuta tu plan empresarial</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{activeTasksCount + completedTasksCount}</div>
                  <div className="text-blue-200 text-sm">Total de tareas</div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1">{activeTasksCount}</div>
                    <div className="text-blue-200 text-sm">Tareas Activas</div>
                  </div>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1 text-green-300">{completedTasksCount}</div>
                    <div className="text-blue-200 text-sm">Completadas</div>
                  </div>
                </Card>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1 text-yellow-300">{15 - activeTasksCount}</div>
                    <div className="text-blue-200 text-sm">Espacios Libres</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            <MyMissionsDashboard onTaskSelect={setSelectedTask} />
          </div>
        </div>
      </DashboardBackground>
    </>
  );
};

export default TasksDashboard;