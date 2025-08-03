
import React, { useState, useEffect } from 'react';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { Button } from '@/components/ui/button';
import { UnifiedAgentHeader } from './chat/UnifiedAgentHeader';
import { SimpleTaskInterface } from './SimpleTaskInterface';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings,
  LayoutGrid
} from 'lucide-react';

interface AgentTasksPanelProps {
  agentId: string;
  language: 'en' | 'es';
  onChatWithAgent?: (taskId: string, taskTitle: string) => void;
  showHeader?: boolean;
  onBack?: () => void;
}

export const AgentTasksPanel: React.FC<AgentTasksPanelProps> = ({ 
  agentId, 
  language, 
  onChatWithAgent,
  showHeader = false,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const { user } = useAuth();

  const t = {
    en: {
      simpleView: "Simple View",
      detailedView: "Detailed View", 
      settings: "Settings"
    },
    es: {
      simpleView: "Vista Simple",
      detailedView: "Vista Detallada", 
      settings: "Configuración"
    }
  };

  // Enhanced chat handler that creates task-specific conversations and opens chat immediately
  const handleChatWithAgent = async (taskId: string, taskTitle: string) => {
    if (!user || !onChatWithAgent) return;

    try {
      // Check if a conversation already exists for this task
      const { data: existingConversation } = await supabase
        .from('agent_conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('agent_id', agentId)
        .eq('task_id', taskId)
        .maybeSingle();

      let conversationId = existingConversation?.id;

      // If no conversation exists, create one
      if (!conversationId) {
        const { data: newConversation, error } = await supabase
          .from('agent_conversations')
          .insert({
            user_id: user.id,
            agent_id: agentId,
            task_id: taskId,
            title: `Desarrollo: ${taskTitle}`,
            is_archived: false
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error creating conversation:', error);
          // Fallback to basic chat without task context
          onChatWithAgent(taskId, taskTitle);
          return;
        }
        
        conversationId = newConversation.id;

        // Add initial context message about the task development
        const initialMessage = language === 'es' 
          ? `¡Perfecto! Vamos a desarrollar juntos la tarea "${taskTitle}". 

Como tu agente especializado, te voy a guiar paso a paso para completar esta tarea de manera exitosa. 

🎯 **Mi enfoque será:**
- Dividir la tarea en pasos claros y manejables
- Proporcionarte recursos y herramientas específicas
- Resolver cualquier duda que tengas en el proceso
- Ayudarte a superar obstáculos que puedan surgir

¿Estás listo para empezar? Cuéntame, ¿hay algún aspecto específico de esta tarea con el que te gustaría comenzar o alguna pregunta inicial que tengas?`
          : `Perfect! Let's develop the task "${taskTitle}" together.

As your specialized agent, I'll guide you step by step to complete this task successfully.

🎯 **My approach will be:**
- Break down the task into clear, manageable steps
- Provide you with specific resources and tools
- Resolve any questions you have in the process
- Help you overcome obstacles that may arise

Are you ready to start? Tell me, is there any specific aspect of this task you'd like to begin with, or do you have any initial questions?`;

        await supabase
          .from('agent_messages')
          .insert({
            conversation_id: conversationId,
            message_type: 'agent',
            content: initialMessage
          });
      }

      // Call the original handler with conversation context
      onChatWithAgent(conversationId, taskTitle);
    } catch (error) {
      console.error('Error setting up task conversation:', error);
      // Fallback to basic chat
      onChatWithAgent(taskId, taskTitle);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header unificado opcional */}
      {showHeader && (
        <div className="mb-4">
          <UnifiedAgentHeader
            agentId={agentId}
            language={language}
            onBack={onBack}
            variant="embedded"
            showHeader={true}
          />
        </div>
      )}

      {/* View Toggle (positioned in top right) */}
      <div className="flex justify-end mb-4 flex-shrink-0">
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 border border-white/20">
          <Button
            size="sm"
            variant={viewMode === 'simple' ? "secondary" : "ghost"}
            onClick={() => setViewMode('simple')}
            className={`text-xs px-3 py-1 h-auto transition-colors ${
              viewMode === 'simple' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3 mr-1" />
            {t[language].simpleView}
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'detailed' ? "secondary" : "ghost"}
            onClick={() => setViewMode('detailed')}
            className={`text-xs px-3 py-1 h-auto transition-colors ${
              viewMode === 'detailed' 
                ? 'bg-gray-600 text-white' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="w-3 h-3 mr-1" />
            {t[language].detailedView}
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-h-0">
        {viewMode === 'simple' ? (
          <SimpleTaskInterface
            agentId={agentId}
            language={language}
            onChatWithAgent={handleChatWithAgent}
          />
        ) : (
          <div className="text-center py-8 text-white/60">
            <p className="text-sm">Vista detallada próximamente...</p>
            <p className="text-xs opacity-75 mt-2">Por ahora, usa la vista simple ✨</p>
          </div>
        )}
      </div>
    </div>
  );
};
