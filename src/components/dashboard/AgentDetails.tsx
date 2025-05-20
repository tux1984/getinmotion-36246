
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface AgentDetailsProps {
  agentId: string;
  language: 'en' | 'es';
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agentId, language }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{type: 'user' | 'agent', content: string}[]>([
    {type: 'user', content: 'Necesito un contrato para una obra visual'},
    {type: 'agent', content: '¿La obra será vendida, licenciada o expuesta?'}
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Determine agent name based on ID
  const getAgentName = () => {
    switch(agentId) {
      case 'contract-generator':
        return '🧾 A2 - Contrato Cultural';
      case 'cost-calculator':
        return '💰 A1 - Cálculo de costos';
      case 'maturity-evaluator':
        return '📊 A3 - Evaluador de madurez';
      default:
        return 'Agente';
    }
  };
  
  const t = {
    en: {
      chatWithAgent: "Chat with agent",
      generatedTasks: "Generated tasks",
      deliverables: "Deliverables",
      completeHistory: "Complete history",
      viewMore: "View more",
      typeYourMessage: "Type your message...",
      send: "Send",
      contractReady: "Contract ready to review (PDF)",
      paymentTerms: "Suggested payment terms added",
      rightsClause: "Rights clause added",
      contractFile: "Contract_Mural_ExpoBogota.pdf",
      sentEmail: "Sent to your email and saved here",
      viewDeliveryHistory: "View delivery history"
    },
    es: {
      chatWithAgent: "Chat con el agente",
      generatedTasks: "Tareas generadas",
      deliverables: "Entregables",
      completeHistory: "Historial completo",
      viewMore: "Ver más",
      typeYourMessage: "Escribe tu mensaje...",
      send: "Enviar",
      contractReady: "Contrato listo para revisar (PDF)",
      paymentTerms: "Plazo sugerido de pago agregado",
      rightsClause: "Cláusula de derechos añadida",
      contractFile: "Contrato_Mural_ExpoBogotá.pdf",
      sentEmail: "Enviado a tu correo y guardado aquí",
      viewDeliveryHistory: "Ver historial de entregas"
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages([...messages, { type: 'user', content: message }]);
    setMessage('');
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'agent', 
        content: 'Entiendo. Para una obra visual expuesta, necesitaré algunos detalles adicionales. ¿Puedes proporcionarme información sobre la duración de la exposición y el lugar donde se exhibirá?' 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">{getAgentName()}</h1>

      <Tabs defaultValue="chat" className="mb-6">
        <TabsList>
          <TabsTrigger value="chat">💬 {t[language].chatWithAgent}</TabsTrigger>
          <TabsTrigger value="tasks">📋 {t[language].generatedTasks}</TabsTrigger>
          <TabsTrigger value="deliverables">📄 {t[language].deliverables}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t[language].typeYourMessage}
              className="flex-grow"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              {t[language].send}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4 space-y-3">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 py-1">
                  <span className="text-green-600">☑️</span>
                  <span>{t[language].contractReady}</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span className="text-green-600">📅</span>
                  <span>{t[language].paymentTerms}</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span className="text-green-600">👁</span>
                  <span>{t[language].rightsClause}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deliverables" className="mt-4 space-y-3">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-2xl">🗂</span>
                    <span className="font-medium">{t[language].contractFile}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">📬 {t[language].sentEmail}</p>
                <div className="pt-2">
                  <Button variant="link" size="sm" className="p-0 h-auto text-sm">
                    🔁 {t[language].viewDeliveryHistory}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Collapsible className="w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">🕑 {t[language].completeHistory}</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <Clock className="w-4 h-4 mr-1" />
              {t[language].viewMore}
            </Button>
          </CollapsibleTrigger>
        </div>
        <Separator className="my-4" />
        <CollapsibleContent>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <p className="text-sm font-medium">2023-05-18</p>
              <p className="text-sm text-gray-600">Contrato generado</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-medium">2023-05-17</p>
              <p className="text-sm text-gray-600">Consulta inicial</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
