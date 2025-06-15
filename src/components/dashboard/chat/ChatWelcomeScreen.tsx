
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, Target } from 'lucide-react';

interface ChatWelcomeScreenProps {
  agentId: string;
  agentName: string;
  onSendMessage: (message: string) => void;
  language: 'en' | 'es';
}

export const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({
  agentId,
  agentName,
  onSendMessage,
  language
}) => {
  const [taskContext, setTaskContext] = useState<any>(null);
  const [hasPrompt, setHasPrompt] = useState(false);

  useEffect(() => {
    // Check if there's a pending task prompt for this agent
    const storedPrompt = localStorage.getItem(`agent-${agentId}-prompt`);
    const storedTask = localStorage.getItem(`agent-${agentId}-task`);
    
    if (storedPrompt && storedTask) {
      setHasPrompt(true);
      setTaskContext(JSON.parse(storedTask));
    }
  }, [agentId]);

  const handleStartTask = () => {
    const storedPrompt = localStorage.getItem(`agent-${agentId}-prompt`);
    if (storedPrompt) {
      onSendMessage(storedPrompt);
      // Clear the stored prompt after using it
      localStorage.removeItem(`agent-${agentId}-prompt`);
      localStorage.removeItem(`agent-${agentId}-task`);
    }
  };

  const t = {
    en: {
      welcome: `Hello! I'm ${agentName}`,
      description: "I'm here to help you with your creative project.",
      startTask: "Start Recommended Task",
      askAnything: "Ask me anything",
      pendingTask: "You have a recommended task ready to start",
      askAnythingPrompt: `Hi ${agentName}, how can you help me today?`
    },
    es: {
      welcome: `¡Hola! Soy ${agentName}`,
      description: "Estoy aquí para ayudarte con tu proyecto creativo.",
      startTask: "Iniciar Tarea Recomendada",
      askAnything: "Pregúntame lo que necesites",
      pendingTask: "Tienes una tarea recomendada lista para empezar",
      askAnythingPrompt: `Hola ${agentName}, ¿cómo puedes ayudarme hoy?`
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          {t[language].welcome}
        </h2>
        
        <p className="text-white/70 text-lg mb-8">
          {t[language].description}
        </p>

        {/* Task Context Card */}
        {hasPrompt && taskContext && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">{t[language].pendingTask}</span>
            </div>
            <h4 className="text-white font-semibold mb-2">{taskContext.title}</h4>
            <p className="text-white/70 text-sm mb-4">{taskContext.description}</p>
            <Button
              onClick={handleStartTask}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-full"
            >
              <Target className="w-4 h-4 mr-2" />
              {t[language].startTask}
            </Button>
          </div>
        )}

        {/* General Action */}
        <Button
          variant="ghost"
          onClick={() => onSendMessage(t[language].askAnythingPrompt)}
          className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {t[language].askAnything}
        </Button>
      </div>
    </div>
  );
};
