
import React from 'react';
import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';

interface ModernMessageBubbleProps {
  message: Message;
  agentColor?: string;
  agentIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const ModernMessageBubble = ({
  message,
  agentColor = 'bg-violet-100 text-violet-700',
  agentIcon,
  isLoading = false
}: ModernMessageBubbleProps) => {
  const isUser = message.type === 'user';
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-blue-100 text-blue-700' 
          : agentColor
      }`}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          agentIcon || <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-violet-600 text-white rounded-br-md' 
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
        } ${isLoading ? 'animate-pulse' : ''}`}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-slate-500">Escribiendo...</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>
        
        {!isLoading && (
          <div className={`text-xs text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};
