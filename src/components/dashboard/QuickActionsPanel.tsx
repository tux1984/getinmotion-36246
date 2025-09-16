import React from 'react';
import { Crown, Target, MessageCircle, ArrowRight, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanDetection } from '@/hooks/useArtisanDetection';

interface QuickActionsPanelProps {
  language: 'en' | 'es';
  onMasterAgentChat: () => void;
  activeTasks?: number;
}

// Simplified quick actions - no Card wrapper, clean grid
const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  language,
  onMasterAgentChat,
  activeTasks = 0
}) => {
  const navigate = useNavigate();
  const { isArtisan, craftType, loading: detectionLoading } = useArtisanDetection();

  const translations = {
    en: {
      getGuidance: 'AI Expert Chat',
      guidanceDesc: 'Get personalized guidance instantly',
      chatNow: 'Chat Now',
      viewTasks: 'Explore Tasks',
      tasksDesc: 'Manage and track your progress',
      viewAll: 'View All',
      createShop: 'Create Digital Shop',
      shopDesc: 'Build your online store with AI'
    },
    es: {
      getGuidance: 'Chat IA Experta',
      guidanceDesc: 'Obtén orientación personalizada',
      chatNow: 'Chatear Ahora',
      viewTasks: 'Explorar Tareas',
      tasksDesc: 'Gestiona y rastrea tu progreso',
      viewAll: 'Ver Todas',
      createShop: 'Crear Tienda Digital',
      shopDesc: 'Construye tu tienda online con IA'
    }
  };

  const t = translations[language];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Create Digital Shop Action - FIRST POSITION - Universal Access */}
      <div
        className="border-2 border-success bg-success/5 rounded-lg p-6 hover:bg-success/10 cursor-pointer transition-all transform hover:scale-105 shadow-lg"
        onClick={() => navigate('/dashboard/create-shop')}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Store className="w-6 h-6 text-success animate-pulse" />
          <div>
            <h3 className="font-bold text-base text-success">{t.createShop}</h3>
            <p className="text-sm text-success/80">{t.shopDesc}</p>
            {craftType && (
              <p className="text-sm text-success font-bold bg-success/20 px-2 py-1 rounded mt-1">
                {language === 'es' ? 'Especialidad: ' : 'Specialty: '}{craftType}
              </p>
            )}
            {/* DEBUG INDICATOR */}
            <div className="text-xs bg-red-500 text-white px-2 py-1 rounded mt-1">
              DEBUG: CREAR TIENDA VISIBLE ✓
            </div>
          </div>
        </div>
        <button 
          className="w-full bg-success text-success-foreground px-4 py-3 rounded-md text-base font-bold hover:bg-success/90 transition-colors inline-flex items-center justify-center gap-2 shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard/create-shop');
          }}
        >
          <Store className="w-4 h-4" />
          {language === 'es' ? '🚀 CREAR AHORA' : '🚀 CREATE NOW'}
        </button>
      </div>

      {/* AI Expert Chat Action */}
      <div
        className="border-2 border-primary bg-primary/5 rounded-lg p-4 hover:bg-primary/10 cursor-pointer transition-all"
        onClick={onMasterAgentChat}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Crown className="w-5 h-5 text-primary animate-bounce" />
          <div>
            <h3 className="font-semibold text-sm">{t.getGuidance}</h3>
            <p className="text-xs text-muted-foreground">{t.guidanceDesc}</p>
            {/* DEBUG INDICATOR */}
            <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1">
              DEBUG: CHAT IA VISIBLE ✓
            </div>
          </div>
        </div>
        <button 
          className="w-full bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onMasterAgentChat();
          }}
        >
          <MessageCircle className="w-3 h-3" />
          {t.chatNow}
        </button>
      </div>

      {/* View All Tasks Action */}
      <div
        className="border border-secondary bg-secondary/5 rounded-lg p-4 hover:bg-secondary/10 cursor-pointer transition-all"
        onClick={() => navigate('/dashboard/tasks')}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Target className="w-5 h-5 text-secondary" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{t.viewTasks}</h3>
              {activeTasks > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-secondary rounded-full animate-pulse">
                  {activeTasks}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t.tasksDesc}</p>
            {/* DEBUG INDICATOR */}
            <div className="text-xs bg-yellow-500 text-white px-2 py-1 rounded mt-1">
              DEBUG: TAREAS VISIBLE ✓
            </div>
          </div>
        </div>
        <button 
          className="w-full border border-secondary text-secondary px-3 py-2 rounded-md text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors inline-flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard/tasks');
          }}
        >
          <ArrowRight className="w-3 h-3" />
          {t.viewAll}
        </button>
      </div>

    </div>
  );
};

export default QuickActionsPanel;