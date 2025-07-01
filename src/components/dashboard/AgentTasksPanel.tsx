
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

  // Enhanced chat handler that creates task-specific conversations
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
            title: `Tarea: ${taskTitle}`,
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

        // Add initial context message about the task
        await supabase
          .from('agent_messages')
          .insert({
            conversation_id: conversationId,
            message_type: 'system',
            content: `Conversación iniciada para la tarea: "${taskTitle}". ¿En qué puedo ayudarte con esta tarea específica?`
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
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
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
