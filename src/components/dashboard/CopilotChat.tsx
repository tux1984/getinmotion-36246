
import React, { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use our AI agent hook with the specific agent type
  const { messages, isProcessing, sendMessage, clearMessages } = useAIAgent(agentId);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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

  useEffect(() => {
    // Set initial chat configurations based on agent type
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
    
    // Send an initial greeting if there are no messages
    if (messages.length === 0) {
      let greeting = '';
      
      if (agentId === 'contract-generator') {
        greeting = language === 'en' 
          ? "Hello! I'm your Contract Generator for cultural projects. I can help you create contracts for exhibitions, performances, commissions, and other cultural activities. What type of contract do you need assistance with today?"
          : "¡Hola! Soy tu Generador de Contratos para proyectos culturales. Puedo ayudarte a crear contratos para exposiciones, performances, comisiones y otras actividades culturales. ¿Con qué tipo de contrato necesitas ayuda hoy?";
      }
      
      if (greeting) {
        // We're using the hook's sendMessage for the system message
        // but we don't want it to appear as user input
        setTimeout(() => {
          const systemMessage: Message = { type: 'agent', content: greeting };
          clearMessages(); // Clear any existing messages
          // @ts-ignore - we're directly manipulating messages here
          useAIAgent(agentId).setMessages([systemMessage]);
        }, 100);
      }
    }
  }, [agentId, language, messages.length]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isProcessing) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

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
              onClick={clearMessages}
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
              className="hidden" // Hide back button in AgentDetails context
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
