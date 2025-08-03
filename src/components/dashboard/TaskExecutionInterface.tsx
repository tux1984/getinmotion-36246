import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, MessageSquare, CheckCircle, Clock, HelpCircle, Target } from 'lucide-react';
import { getAgentById } from '@/data/agentsDatabase';
import { DashboardBackground } from './DashboardBackground';

interface TaskExecutionInterfaceProps {
  agentId: string;
  language: 'en' | 'es';
  onComplete: () => void;
  onReturnToCoordinator: () => void;
}

export const TaskExecutionInterface: React.FC<TaskExecutionInterfaceProps> = ({
  agentId,
  language,
  onComplete,
  onReturnToCoordinator
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  
  const agent = getAgentById(agentId);
  
  if (!agent) {
    return (
      <DashboardBackground>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <p>Agente no encontrado</p>
            <Button onClick={onReturnToCoordinator} className="mt-4">
              Volver al Coordinador Maestro
            </Button>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  const getStepsForAgent = (agentId: string) => {
    const stepsByAgent = {
      'cost-calculator': [
        'Identificar todos los materiales necesarios',
        'Calcular costos de mano de obra',
        'Determinar gastos generales',
        'Establecer margen de ganancia',
        'Definir precio final de venta'
      ],
      'cultural-consultant': [
        'Definir tu propuesta creativa única',
        'Identificar tu audiencia objetivo',
        'Analizar la competencia',
        'Validar demanda del mercado',
        'Crear plan de lanzamiento'
      ],
      'collaboration-agreement': [
        'Definir términos de colaboración',
        'Establecer derechos de propiedad',
        'Determinar responsabilidades',
        'Acordar compensación',
        'Firmar y ejecutar acuerdo'
      ],
      'marketing-advisor': [
        'Analizar tu mercado objetivo',
        'Definir mensaje de marca',
        'Seleccionar canales de marketing',
        'Crear calendario de contenido',
        'Medir y optimizar resultados'
      ],
      'project-manager': [
        'Planificar estructura del proyecto',
        'Definir entregables y timeline',
        'Asignar recursos necesarios',
        'Establecer sistema de seguimiento',
        'Implementar flujo de trabajo'
      ]
    };

    return stepsByAgent[agentId] || [
      'Analizar situación actual',
      'Definir objetivos específicos',
      'Crear plan de acción',
      'Implementar soluciones',
      'Evaluar resultados'
    ];
  };

  const getHelpContent = (agentId: string, step: number) => {
    const helpByAgent = {
      'cost-calculator': [
        'Incluye materiales directos, herramientas, y cualquier insumo específico para tu obra.',
        'Calcula las horas invertidas y multiplica por tu tarifa horaria deseada.',
        'Considera electricidad, alquiler del espacio, seguros, y otros costos indirectos.',
        'Un margen del 20-40% es común en productos creativos, dependiendo del mercado.',
        'Redondea a números amigables y considera la percepción de valor del cliente.'
      ]
    };

    return helpByAgent[agentId]?.[step - 1] || 'Estoy aquí para ayudarte con cualquier duda sobre este paso.';
  };

  const steps = getStepsForAgent(agentId);
  const progressPercentage = (currentStep / steps.length) * 100;

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <DashboardBackground showGlobalComponents={false}>
      <div className="min-h-screen">
        {/* Header with Agent Info */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={onReturnToCoordinator}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Coordinador
                </Button>
                <div className="h-6 w-px bg-gray-600" />
                <div className="flex items-center gap-3">
                  <Avatar className={`h-10 w-10 ${agent.color}`}>
                    <AvatarFallback className="text-white">
                      <agent.icon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                    <Badge variant="secondary" className="text-xs">
                      {agent.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{currentStep}/{steps.length}</div>
                <div className="text-gray-300 text-sm">Pasos completados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Progress Bar */}
          <Card className="mb-8 border-purple-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Progreso de la Tarea
                </h2>
                <span className="text-sm text-gray-600">
                  {Math.round(progressPercentage)}% Completado
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </Card>

          {/* Current Step */}
          <Card className="mb-8 border-blue-200 shadow-lg">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentStep}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {steps[currentStep - 1]}
                  </h3>
                  <p className="text-gray-600">
                    Paso {currentStep} de {steps.length} - {agent.name}
                  </p>
                </div>
              </div>

              {/* Step Content Area */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 min-h-[200px]">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-800">Objetivo de este paso:</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {getHelpContent(agentId, currentStep)}
                </p>

                {/* Placeholder for step-specific content */}
                <div className="mt-6 p-4 bg-white rounded border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-center">
                    Espacio para contenido específico del paso
                    <br />
                    <small>(Formularios, calculadoras, inputs, etc.)</small>
                  </p>
                </div>
              </div>

              {/* Help Section */}
              {showHelp && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Ayuda para este paso
                  </h4>
                  <p className="text-amber-700">
                    {getHelpContent(agentId, currentStep)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowHelp(!showHelp)}
                    variant="outline"
                    className="border-amber-400 text-amber-600 hover:bg-amber-50"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {showHelp ? 'Ocultar Ayuda' : 'Necesito Ayuda'}
                  </Button>
                  <Button
                    onClick={() => {}} // TODO: Implement chat with agent
                    variant="outline"
                    className="border-blue-400 text-blue-600 hover:bg-blue-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Consultar con {agent.name}
                  </Button>
                </div>

                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <Button
                      onClick={handlePreviousStep}
                      variant="outline"
                    >
                      Paso Anterior
                    </Button>
                  )}
                  <Button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {currentStep === steps.length ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finalizar Tarea
                      </>
                    ) : (
                      <>
                        Siguiente Paso
                        <Clock className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Steps Overview */}
          <Card className="border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Todos los Pasos de esta Tarea
              </h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index + 1 === currentStep
                        ? 'bg-blue-50 border border-blue-200'
                        : index + 1 < currentStep
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index + 1 === currentStep
                          ? 'bg-blue-600 text-white'
                          : index + 1 < currentStep
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`${
                        index + 1 === currentStep
                          ? 'text-blue-800 font-medium'
                          : index + 1 < currentStep
                          ? 'text-green-800'
                          : 'text-gray-600'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardBackground>
  );
};