
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, FileText, Calculator, FileSpreadsheet, Briefcase, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Message } from '@/types/chat';
import { useAIAgent } from '@/hooks/use-ai-agent';

interface CopilotChatProps {
  agentId: string;
  onBack: () => void;
}

export const CopilotChat = ({ agentId, onBack }: CopilotChatProps) => {
  const { language } = useLanguage();
  const [inputMessage, setInputMessage] = useState('');
  const [copilotName, setCopilotName] = useState('');
  const [copilotColor, setCopilotColor] = useState('');
  const [copilotIcon, setCopilotIcon] = useState<React.ReactNode>(null);
  const [greetingInitialized, setGreetingInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use our AI agent hook with the specific agent type
  const { messages, isProcessing, sendMessage, clearMessages } = useAIAgent(agentId);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const translations = {
    en: {
      enterMessage: "Type your message...",
      send: "Send",
      reset: "Reset Chat",
      thinking: "Thinking..."
    },
    es: {
      enterMessage: "Escribe tu mensaje...",
      send: "Enviar",
      reset: "Reiniciar Chat",
      thinking: "Pensando..."
    }
  };
  
  const t = translations[language];

  // Set initial chat configurations based on agent type
  useEffect(() => {
    switch(agentId) {
      case 'contract-generator':
        setCopilotName(language === 'en' ? 'Contract Generator' : 'Generador de Contratos');
        setCopilotColor('bg-blue-100 text-blue-700');
        setCopilotIcon(<FileSpreadsheet className="w-5 h-5" />);
        break;
      case 'cost-calculator':
        setCopilotName(language === 'en' ? 'Cost Calculator' : 'Calculador de Costos');
        setCopilotColor('bg-emerald-100 text-emerald-700');
        setCopilotIcon(<Calculator className="w-5 h-5" />);
        break;
      case 'maturity-evaluator':
        setCopilotName(language === 'en' ? 'Maturity Evaluator' : 'Evaluador de Madurez');
        setCopilotColor('bg-violet-100 text-violet-700');
        setCopilotIcon(<FileText className="w-5 h-5" />);
        break;
      case 'admin':
        setCopilotName(language === 'en' ? 'Administrative Assistant' : 'Asistente Administrativo');
        setCopilotColor('bg-violet-100 text-violet-700');
        setCopilotIcon(<FileText className="w-5 h-5" />);
        break;
      case 'accounting':
        setCopilotName(language === 'en' ? 'Accounting Agent' : 'Agente Contable');
        setCopilotColor('bg-indigo-100 text-indigo-700');
        setCopilotIcon(<Calculator className="w-5 h-5" />);
        break;
      case 'legal':
        setCopilotName(language === 'en' ? 'Legal Advisor' : 'Asesor Legal');
        setCopilotColor('bg-blue-100 text-blue-700');
        setCopilotIcon(<FileSpreadsheet className="w-5 h-5" />);
        break;
      case 'operations':
        setCopilotName(language === 'en' ? 'Operations Manager' : 'Gerente de Operaciones');
        setCopilotColor('bg-emerald-100 text-emerald-700');
        setCopilotIcon(<Briefcase className="w-5 h-5" />);
        break;
      case 'cultural':
        setCopilotName(language === 'en' ? 'Cultural Creator Agent' : 'Agente para Creadores Culturales');
        setCopilotColor('bg-pink-100 text-pink-700');
        setCopilotIcon(<Palette className="w-5 h-5" />);
        break;
      default:
        setCopilotName(language === 'en' ? 'Assistant' : 'Asistente');
        setCopilotColor('bg-slate-100 text-slate-700');
        setCopilotIcon(<FileText className="w-5 h-5" />);
    }
  }, [agentId, language]);

  // Send initial greeting - fixed to prevent infinite loops
  useEffect(() => {
    if (messages.length === 0 && !greetingInitialized && !isProcessing) {
      let greeting = '';
      
      if (agentId === 'contract-generator') {
        greeting = language === 'en' 
          ? "Hello! I'm your Contract Generator for cultural projects. I can help you create contracts for exhibitions, performances, commissions, and other cultural activities. What type of contract do you need assistance with today?"
          : "¡Hola! Soy tu Generador de Contratos para proyectos culturales. Puedo ayudarte a crear contratos para exposiciones, performances, comisiones y otras actividades culturales. ¿Con qué tipo de contrato necesitas ayuda hoy?";
      } else if (agentId === 'cost-calculator') {
        greeting = language === 'en'
          ? "Hello! I'm your Cost Calculator for cultural projects. I can help you calculate project costs, set pricing for your work, and develop financial plans. What project would you like to calculate costs for?"
          : "¡Hola! Soy tu Calculador de Costos para proyectos culturales. Puedo ayudarte a calcular costos de proyectos, establecer precios para tu trabajo y desarrollar planes financieros. ¿Para qué proyecto te gustaría calcular los costos?";
      }
      
      if (greeting) {
        setGreetingInitialized(true);
        // Add initial message directly to avoid infinite loop
        const initialMessage = { type: 'agent' as const, content: greeting };
        // We'll use a timeout to avoid immediate state updates causing loops
        setTimeout(() => {
          sendMessage(greeting);
        }, 100);
      }
    }
  }, [messages.length, greetingInitialized, isProcessing, agentId, language, sendMessage]);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || isProcessing) return;
    sendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, isProcessing, sendMessage]);

  const handleClearMessages = useCallback(() => {
    clearMessages();
    setGreetingInitialized(false);
  }, [clearMessages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${copilotColor} flex items-center justify-center mr-3`}>
            {copilotIcon}
          </div>
          <h2 className="font-medium">{copilotName}</h2>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearMessages}
              className="text-slate-500 hover:text-slate-700"
            >
              <span className="text-xs">{t.reset}</span>
            </Button>
          )}
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-800">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-300"></div>
                <span className="text-xs text-slate-400 ml-2">{t.thinking}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.enterMessage}
            className="flex-grow"
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isProcessing}
          >
            <Send className="w-4 h-4 mr-2" />
            {t.send}
          </Button>
        </div>
      </div>
    </div>
  );
};
