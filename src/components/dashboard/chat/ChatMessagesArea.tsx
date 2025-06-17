
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { ChatThinkingIndicator } from './ChatThinkingIndicator';
import { AgentMessage } from '@/hooks/useAgentConversations';

interface ChatMessagesAreaProps {
  messages: AgentMessage[];
  isProcessing: boolean;
  language: 'en' | 'es';
  agentId?: string;
}

export const ChatMessagesArea: React.FC<ChatMessagesAreaProps> = ({
  messages,
  isProcessing,
  language,
  agentId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            language={language}
            agentId={agentId}
          />
        ))}
        
        {isProcessing && (
          <ChatThinkingIndicator 
            language={language} 
            agentId={agentId}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
