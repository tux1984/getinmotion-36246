
import React from 'react';
import { Bot, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AgentMessage } from '@/hooks/useAgentConversations';
import { RichTextRenderer } from './RichTextRenderer';

interface MessageBubbleProps {
  message: AgentMessage;
  language: 'en' | 'es';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  language
}) => {
  const isUser = message.message_type === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start gap-3 w-full max-w-[85%] md:max-w-[75%]`}>
        {!isUser && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex-shrink-0 flex items-center justify-center mt-1 shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
        )}
        
        <div 
          className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm relative flex-1 ${
            isUser 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-lg' 
              : 'bg-white/10 text-white border border-white/20 rounded-bl-lg'
          }`}
        >
          <RichTextRenderer content={message.content} />
          <div className="text-xs opacity-70 mt-2 text-right">
            {formatDistanceToNow(new Date(message.created_at), { 
              addSuffix: true,
              locale: language === 'es' ? es : undefined
            })}
          </div>
        </div>
        
        {isUser && (
          <div className="w-9 h-9 rounded-full bg-white/20 text-white flex-shrink-0 flex items-center justify-center mt-1 backdrop-blur shadow-lg">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
