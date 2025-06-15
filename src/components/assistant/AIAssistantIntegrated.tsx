
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface AIAssistantIntegratedProps {
  stepContext: string;
}

const stepTitles = {
  en: {
    'profile': 'Want to add more details about your project or artistic vision?',
    'business-info': 'Tell us more about your business model or how you operate.',
    'management-style': 'Any other thoughts on your management style or team dynamics?',
    'analysis-choice': 'Provide any extra context for a more personalized analysis.',
    'extended-questions': 'Any other details you want to share for the deep analysis?',
    'results': 'Any questions about your results? Ask away!',
    'default': 'Need help or want to add more details?',
  },
  es: {
    'profile': '¿Quieres añadir más detalles sobre tu proyecto o visión artística?',
    'business-info': 'Cuéntanos más sobre tu modelo de negocio o cómo operas.',
    'management-style': '¿Alguna otra reflexión sobre tu estilo de gestión o la dinámica del equipo?',
    'analysis-choice': 'Proporciona cualquier contexto adicional para un análisis más personalizado.',
    'extended-questions': '¿Algún otro detalle que quieras compartir para el análisis profundo?',
    'results': '¿Preguntas sobre tus resultados? ¡Consulta aquí!',
    'default': '¿Necesitas ayuda o quieres añadir más detalles?',
  },
};

export const AIAssistantIntegrated: React.FC<AIAssistantIntegratedProps> = ({ stepContext }) => {
  const { language } = useLanguage();
  const { messages, isLoading, sendMessage } = useAIAssistant(stepContext);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };
  
  const title = (stepTitles[language] as Record<string, string>)[stepContext] || stepTitles[language].default;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="space-y-4 h-64 overflow-y-auto mb-4 pr-2">
          <AnimatePresence>
            {messages.length === 0 && !isLoading && (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Bot size={32} className="mb-2" />
                    <p className="text-sm text-center">{language === 'es' ? 'Soy tu asistente. Pregúntame cualquier cosa o añade más detalles.' : 'I am your assistant. Ask me anything or add more details.'}</p>
                 </div>
            )}
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-white text-slate-800 shadow-sm border border-slate-100'}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="px-4 py-2 rounded-lg bg-white text-slate-800 shadow-sm border border-slate-100 flex items-center space-x-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'es' ? 'Escribe aquí para chatear con el asistente...' : 'Type here to chat with the assistant...'}
            className="pr-28 bg-white"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bottom-2"
            size="sm"
          >
            {language === 'es' ? 'Enviar' : 'Send'}
            <Send size={16} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};
