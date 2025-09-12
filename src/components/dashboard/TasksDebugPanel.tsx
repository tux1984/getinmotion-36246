import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TasksDebugPanel = () => {
  const { user, session, isAuthorized } = useRobustAuth();
  const { tasks, loading, totalCount } = useAgentTasks();
  const { coordinatorTasks, loading: coordinatorLoading } = useMasterCoordinator();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mt-4 border-dashed border-yellow-500">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Debug: Task Loading Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Auth Status:</strong>
          <div className="ml-2">
            User ID: {user?.id || 'None'}<br/>
            Session: {session ? 'Valid' : 'None'}<br/>
            Authorized: {isAuthorized ? 'Yes' : 'No'}
          </div>
        </div>
        
        <div>
          <strong>Agent Tasks:</strong>
          <div className="ml-2">
            Loading: {loading ? 'Yes' : 'No'}<br/>
            Count: {tasks?.length || 0}<br/>
            Total: {totalCount}
          </div>
        </div>

        <div>
          <strong>Coordinator Tasks:</strong>
          <div className="ml-2">
            Loading: {coordinatorLoading ? 'Yes' : 'No'}<br/>
            Count: {coordinatorTasks?.length || 0}
          </div>
        </div>

        {tasks && tasks.length > 0 && (
          <div>
            <strong>Sample Tasks:</strong>
            <div className="ml-2">
              {tasks.slice(0, 3).map(task => (
                <div key={task.id}>
                  • {task.title} ({task.status})
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};