
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { ChatThinkingIndicator } from './ChatThinkingIndicator';
import { AgentMessage } from '@/hooks/useAgentConversations';

interface ChatMessagesAreaProps {
  messages: AgentMessage[];
  isProcessing: boolean;
  language: 'en' | 'es';
}

export const ChatMessagesArea: React.FC<ChatMessagesAreaProps> = ({
  messages,
  isProcessing,
  language
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full p-2">
        <div className="space-y-3 max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id}
              message={message}
              language={language}
            />
          ))}
          
          {isProcessing && (
            <ChatThinkingIndicator language={language} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
