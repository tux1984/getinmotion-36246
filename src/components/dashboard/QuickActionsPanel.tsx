import React from 'react';
import { MessageSquare, CheckSquare, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanDetection } from '@/hooks/useArtisanDetection';

interface QuickActionsPanelProps {
  language: 'en' | 'es';
  onMasterAgentChat: () => void;
  activeTasks?: number;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  language,
  onMasterAgentChat,
  activeTasks = 0
}) => {
  const navigate = useNavigate();

  const createShopText = language === 'es' 
    ? { title: 'Crear Tienda Digital', description: 'Construye tu tienda online con IA', action: 'Crear Ahora' }
    : { title: 'Create Digital Shop', description: 'Build your online store with AI', action: 'Create Now' };

  const chatExpertText = language === 'es'
    ? { title: 'Chat IA Experta', description: 'Obtén orientación personalizada al instante', action: 'Chatear Ahora' }
    : { title: 'AI Expert Chat', description: 'Get personalized guidance instantly', action: 'Chat Now' };

  const exploreTasksText = language === 'es'
    ? { title: 'Explorar Tareas', description: 'Gestiona y rastrea tu progreso', action: 'Ver Todas' }
    : { title: 'Explore Tasks', description: 'Manage and track your progress', action: 'View All' };

  const handleCreateShop = () => navigate('/dashboard/create-shop');
  const handleExploreTasks = () => navigate('/dashboard/tasks');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Create Digital Shop */}
      <div 
        className="border rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer group"
        onClick={handleCreateShop}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{createShopText.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{createShopText.description}</p>
          </div>
        </div>
      </div>

      {/* AI Expert Chat */}
      <div 
        className="border rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer group"
        onClick={onMasterAgentChat}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{chatExpertText.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{chatExpertText.description}</p>
          </div>
        </div>
      </div>

      {/* Explore Tasks */}
      <div 
        className="border rounded-lg p-6 hover:bg-accent/50 transition-colors cursor-pointer group"
        onClick={handleExploreTasks}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{exploreTasksText.title}</h3>
              {activeTasks && activeTasks > 0 && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {activeTasks}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{exploreTasksText.description}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QuickActionsPanel;