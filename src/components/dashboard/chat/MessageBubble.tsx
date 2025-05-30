
import React from 'react';
import { Bot, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AgentMessage } from '@/hooks/useAgentConversations';

interface MessageBubbleProps {
  message: AgentMessage;
  language: 'en' | 'es';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  language
}) => {
  return (
    <div 
      className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex items-start gap-4 max-w-[80%]">
        {message.message_type !== 'user' && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mt-1 shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
        )}
        
        <div 
          className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
            message.message_type === 'user' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div className="text-xs opacity-70 mt-2">
            {formatDistanceToNow(new Date(message.created_at), { 
              addSuffix: true,
              locale: language === 'es' ? es : undefined
            })}
          </div>
        </div>
        
        {message.message_type === 'user' && (
          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mt-1 backdrop-blur shadow-lg">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
