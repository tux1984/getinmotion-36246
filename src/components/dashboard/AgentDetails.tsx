
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Download, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { CopilotChat } from './CopilotChat';

interface AgentDetailsProps {
  agentId: string;
  language: 'en' | 'es';
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agentId, language }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const isMobile = useIsMobile();
  
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">{getAgentName()}</h1>

      <Tabs defaultValue="chat" className="mb-4 sm:mb-6" onValueChange={handleTabChange}>
        <TabsList className="w-full mb-2 h-auto p-1">
          <TabsTrigger className="text-xs sm:text-sm py-1.5" value="chat">💬 {t[language].chatWithAgent}</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm py-1.5" value="tasks">📋 {t[language].generatedTasks}</TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm py-1.5" value="deliverables">📄 {t[language].deliverables}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-3 sm:mt-4">
          {/* Use CopilotChat for OpenAI integration */}
          {activeTab === 'chat' && (
            <div className="h-[400px]">
              <CopilotChat 
                agentId={agentId} 
                onBack={() => {}} 
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-3 sm:mt-4 space-y-3">
          <Card>
            <CardContent className="pt-3 sm:pt-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 py-1">
                  <span className="text-green-600">☑️</span>
                  <span className="text-sm">{t[language].contractReady}</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span className="text-green-600">📅</span>
                  <span className="text-sm">{t[language].paymentTerms}</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span className="text-green-600">👁</span>
                  <span className="text-sm">{t[language].rightsClause}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deliverables" className="mt-3 sm:mt-4 space-y-3">
          <Card>
            <CardContent className="pt-3 sm:pt-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl sm:text-2xl">🗂</span>
                    <span className="font-medium text-sm">{t[language].contractFile}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">📬 {t[language].sentEmail}</p>
                <div className="pt-1 sm:pt-2">
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs sm:text-sm">
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
          <h3 className="text-base sm:text-lg font-medium">🕑 {t[language].completeHistory}</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="text-xs sm:text-sm">{t[language].viewMore}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <Separator className="my-3 sm:my-4" />
        <CollapsibleContent>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="flex justify-between">
              <p className="text-xs sm:text-sm font-medium">2023-05-18</p>
              <p className="text-xs sm:text-sm text-gray-600">Contrato generado</p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs sm:text-sm font-medium">2023-05-17</p>
              <p className="text-xs sm:text-sm text-gray-600">Consulta inicial</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
