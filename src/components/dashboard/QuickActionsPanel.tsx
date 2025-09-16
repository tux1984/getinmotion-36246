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
    <div className="space-y-4">
      
      {/* Create Digital Shop - Featured */}
      <div 
        className="relative overflow-hidden rounded-xl p-8 cursor-pointer group transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl"
        onClick={handleCreateShop}
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl mb-2">{createShopText.title}</h3>
              <p className="text-white/90 text-base">{createShopText.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* AI Expert Chat - Compact */}
      <div 
        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
        onClick={onMasterAgentChat}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{chatExpertText.title}</h3>
            <p className="text-sm text-muted-foreground">{chatExpertText.description}</p>
          </div>
        </div>
      </div>

      {/* Explore Tasks - Compact */}
      <div 
        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
        onClick={handleExploreTasks}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-base">{exploreTasksText.title}</h3>
              {activeTasks && activeTasks > 0 && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {activeTasks}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{exploreTasksText.description}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QuickActionsPanel;