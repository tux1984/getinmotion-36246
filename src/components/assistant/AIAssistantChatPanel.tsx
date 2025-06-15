
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/hooks/useAIAssistant';

interface AIAssistantChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  language: 'en' | 'es';
}

const t = {
  en: {
    title: "AI Assistant",
    placeholder: "Tell me more about your project...",
    initialMessage: "Need help? Describe any additional details about your project here, and I'll use them to provide better recommendations.",
  },
  es: {
    title: "Asistente IA",
    placeholder: "Cuéntame más sobre tu proyecto...",
    initialMessage: "¿Necesitas ayuda? Describe aquí cualquier detalle adicional sobre tu proyecto y lo usaré para darte mejores recomendaciones.",
  },
};

export const AIAssistantChatPanel: React.FC<AIAssistantChatPanelProps> = ({
  isOpen,
  onClose,
  messages,
  sendMessage,
  isLoading,
  language,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const locale = t[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-4 md:right-8 w-[calc(100%-2rem)] max-w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-lg text-slate-800">{locale.title}</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-slate-500" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
                <div className="text-sm text-slate-500 p-3 bg-slate-100 rounded-lg">{locale.initialMessage}</div>
            ) : (
                messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-slate-200 text-slate-800 p-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>...</span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={locale.placeholder}
                className="pr-12 rounded-lg resize-none"
                rows={1}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-600 hover:bg-purple-700"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
