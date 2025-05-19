
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import { ProductMaturityCalculator } from '@/components/ProductMaturityCalculator';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';

type ProfileType = 'idea' | 'solo' | 'team';

type CategoryScore = {
  ideaValidation: number;
  userExperience: number;
  marketFit: number;
  monetization: number;
};

export type RecommendedAgents = {
  admin: boolean;
  accounting: boolean;
  legal: boolean;
  operations: boolean;
};

interface OnboardingWizardProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ profileType, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMaturityCalculator, setShowMaturityCalculator] = useState(true);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      welcome: "Welcome to GET IN MOTION",
      welcomeDesc: "Let's set up your workspace based on your project status.",
      calculatingMaturity: "Calculating Project Maturity",
      calculatingMaturityDesc: "Let's evaluate your project's current state to recommend the best tools.",
      recommendingAgents: "Recommending Agents",
      recommendingAgentsDesc: "Based on your project profile and maturity level, we're selecting the best copilots for you.",
      finalizing: "Finalizing Your Workspace",
      finalizingDesc: "We're setting up your personalized dashboard with the recommended tools.",
      next: "Next",
      skip: "Skip",
      complete: "Go to Dashboard",
      completed: "Setup Completed!",
      maturityTitle: "Project Maturity Assessment",
      maturityDesc: "Answer a few questions to help us understand your project's current state."
    },
    es: {
      welcome: "Bienvenido a GET IN MOTION",
      welcomeDesc: "Configuremos tu espacio de trabajo según el estado de tu proyecto.",
      calculatingMaturity: "Calculando Madurez del Proyecto",
      calculatingMaturityDesc: "Evaluemos el estado actual de tu proyecto para recomendar las mejores herramientas.",
      recommendingAgents: "Recomendando Agentes",
      recommendingAgentsDesc: "Basado en tu perfil de proyecto y nivel de madurez, estamos seleccionando los mejores copilotos para ti.",
      finalizing: "Finalizando Tu Espacio de Trabajo",
      finalizingDesc: "Estamos configurando tu panel personalizado con las herramientas recomendadas.",
      next: "Siguiente",
      skip: "Omitir",
      complete: "Ir al Panel",
      completed: "¡Configuración Completada!",
      maturityTitle: "Evaluación de Madurez del Proyecto",
      maturityDesc: "Responde algunas preguntas para ayudarnos a entender el estado actual de tu proyecto."
    }
  };
  
  const t = translations[language];
  
  const steps = [
    {
      title: t.welcome,
      description: t.welcomeDesc
    },
    {
      title: t.calculatingMaturity,
      description: t.calculatingMaturityDesc
    },
    {
      title: t.recommendingAgents,
      description: t.recommendingAgentsDesc
    },
    {
      title: t.finalizing,
      description: t.finalizingDesc
    }
  ];
  
  const handleMaturityComplete = (scores: CategoryScore) => {
    setMaturityScores(scores);
    setShowMaturityCalculator(false);
    setCurrentStep(2); // Move to agent recommendation step
  };
  
  const handleComplete = () => {
    // Determinar los agentes recomendados según el perfil y las puntuaciones de madurez
    const recommendedAgents: RecommendedAgents = {
      admin: false, // Todos necesitan asistente administrativo
      accounting: false,
      legal: false,
      operations: false
    };
    
    // Por defecto, siempre se recomienda el asistente administrativo
    recommendedAgents.admin = true;
    
    if (maturityScores) {
      // Recomendaciones basadas en la puntuación de madurez
      if (profileType === 'idea') {
        // Para personas con ideas iniciales, enfocarse en validación
        recommendedAgents.legal = maturityScores.ideaValidation > 30;
      } else if (profileType === 'solo') {
        // Para emprendedores solitarios, enfocarse en eficiencia
        recommendedAgents.accounting = maturityScores.monetization > 20;
        recommendedAgents.legal = maturityScores.marketFit > 40;
      } else if (profileType === 'team') {
        // Para equipos, enfocarse en coordinación
        recommendedAgents.accounting = true;
        recommendedAgents.legal = maturityScores.marketFit > 30;
        recommendedAgents.operations = maturityScores.marketFit > 50;
      }
    } else {
      // Recomendaciones por defecto si no hay puntuaciones
      if (profileType === 'idea') {
        recommendedAgents.legal = true;
      } else if (profileType === 'solo') {
        recommendedAgents.accounting = true;
      } else if (profileType === 'team') {
        recommendedAgents.accounting = true;
        recommendedAgents.legal = true;
      }
    }
    
    // Guardar las recomendaciones en localStorage
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    if (maturityScores) {
      localStorage.setItem('maturityScores', JSON.stringify(maturityScores));
    }
    
    // Notificar al componente padre
    onComplete(maturityScores || {
      ideaValidation: 20,
      userExperience: 15,
      marketFit: 10,
      monetization: 5
    }, recommendedAgents);
    
    // Mostrar un mensaje de completado
    toast({
      title: t.completed,
      description: language === 'en' 
        ? "Your workspace is ready with recommended tools based on your project status." 
        : "Tu espacio de trabajo está listo con las herramientas recomendadas según el estado de tu proyecto."
    });
    
    // Redirigir al dashboard
    navigate('/dashboard');
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Steps currentStep={currentStep} steps={steps} />
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {currentStep === 0 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">{profileType === 'idea' 
              ? language === 'en' ? "Great! Let's define your vision" : "¡Genial! Definamos tu visión"
              : profileType === 'solo'
              ? language === 'en' ? "Let's help you get more efficient" : "Ayudémoste a ser más eficiente"
              : language === 'en' ? "Let's organize your team workflow" : "Organicemos el flujo de trabajo de tu equipo"
            }</h2>
            
            <p className="text-gray-600 mb-8">
              {profileType === 'idea' 
                ? language === 'en' 
                  ? "We'll help you validate your idea and create a roadmap to bring it to life."
                  : "Te ayudaremos a validar tu idea y crear una hoja de ruta para hacerla realidad."
                : profileType === 'solo'
                ? language === 'en'
                  ? "We'll help you automate tasks and free up your time to focus on what matters."
                  : "Te ayudaremos a automatizar tareas y liberar tu tiempo para enfocarte en lo importante."
                : language === 'en'
                  ? "We'll help you coordinate your team and delegate tasks effectively."
                  : "Te ayudaremos a coordinar tu equipo y delegar tareas de manera efectiva."
              }
            </p>
            
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              {profileType === 'idea' 
                ? <Lightbulb className="w-12 h-12 text-white" />
                : profileType === 'solo'
                ? <User className="w-12 h-12 text-white" />
                : <Users className="w-12 h-12 text-white" />
              }
            </div>
          </div>
        )}
        
        {currentStep === 1 && (
          <div>
            {showMaturityCalculator ? (
              <ProductMaturityCalculator 
                onComplete={handleMaturityComplete}
                open={showMaturityCalculator}
                onOpenChange={setShowMaturityCalculator}
              />
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>{language === 'en' ? "Processing your answers..." : "Procesando tus respuestas..."}</p>
              </div>
            )}
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="py-8">
            <h3 className="text-xl font-bold mb-4">
              {language === 'en' ? "Recommended Agents for Your Project" : "Agentes Recomendados para Tu Proyecto"}
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-4">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">
                    {language === 'en' ? "Administrative Assistant" : "Asistente Administrativo"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? "Helps organize your files, manage appointments, and handle correspondence."
                      : "Ayuda a organizar tus archivos, gestionar citas y manejar correspondencia."}
                  </p>
                </div>
              </div>
              
              {(profileType === 'solo' || profileType === 'team' || 
                (maturityScores && maturityScores.monetization > 20)) && (
                <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-lg flex items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {language === 'en' ? "Accounting Agent" : "Agente Contable"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? "Helps track expenses, prepare for tax filings, and manage financial records."
                        : "Ayuda a seguir gastos, preparar declaraciones de impuestos y gestionar registros financieros."}
                    </p>
                  </div>
                </div>
              )}
              
              {(profileType !== 'solo' || 
                (maturityScores && maturityScores.marketFit > 30)) && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {language === 'en' ? "Legal Advisor" : "Asesor Legal"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? "Helps understand legal requirements, review contracts, and manage compliance issues."
                        : "Ayuda a entender requisitos legales, revisar contratos y gestionar temas de cumplimiento."}
                    </p>
                  </div>
                </div>
              )}
              
              {profileType === 'team' && maturityScores && maturityScores.marketFit > 50 && (
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg flex items-start opacity-50">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center">
                      {language === 'en' ? "Operations Manager" : "Gerente de Operaciones"}
                      <Badge className="ml-2" variant="outline">
                        {language === 'en' ? "Coming Soon" : "Próximamente"}
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? "Will help manage team workflows, track project progress, and optimize processes."
                        : "Ayudará a gestionar flujos de trabajo del equipo, seguir el progreso del proyecto y optimizar procesos."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCheck className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">
              {language === 'en' ? "Your workspace is ready!" : "¡Tu espacio de trabajo está listo!"}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? "We've set up your dashboard with the recommended tools based on your project status."
                : "Hemos configurado tu panel con las herramientas recomendadas según el estado de tu proyecto."}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        {currentStep > 0 && currentStep !== 1 && (
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            {language === 'en' ? "Back" : "Atrás"}
          </Button>
        )}
        
        <div className="flex-1" />
        
        {currentStep !== 1 && (
          <>
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="mr-2"
            >
              {t.skip}
            </Button>
            
            <Button 
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? t.next : t.complete}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Lightbulb(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
