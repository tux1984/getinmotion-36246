
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionLogo } from '@/components/MotionLogo';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Dashboard = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      help: "Help",
      account: "Account",
      welcome: "Welcome to Motion MVP!",
      welcomeText: "This is an early version of the dashboard. Soon you'll be able to interact with your copilots.",
      projectStatus: "Project Status",
      projectStatusText: "This is a preliminary version of the Motion MVP. In the coming weeks we'll implement functional copilots with specialized assistants for different verticals.",
      note: "Note",
      noteText: "We're testing the dashboard with a select group of users. Thanks for being part of this stage!",
      nextSteps: "Next Steps",
      landingCreation: "Creation of landing page with waitlist",
      chatImplementation: "Implementation of chat with AI copilots",
      connectivityPlatforms: "Connectivity with WhatsApp and other platforms",
      dashboardMetrics: "Dashboard with metrics and analytics",
      selectCopilot: "Select a copilot to get started",
      selectCopilotText: "Soon you'll be able to choose between different specialized copilots according to your needs.",
      salesAssistant: "Sales Assistant",
      eventOrganizer: "Event Organizer",
      communityManager: "Community Manager",
      contentAdvisor: "Content Advisor",
      betaVersion: "Beta version",
      comingSoon: "Coming soon"
    },
    es: {
      help: "Ayuda",
      account: "Cuenta",
      welcome: "¡Bienvenido al MVP de Motion!",
      welcomeText: "Esta es una versión temprana del dashboard. Próximamente podrás interactuar con tus copilots.",
      projectStatus: "Estado del Proyecto",
      projectStatusText: "Esta es una versión preliminar del MVP de Motion. En las próximas semanas implementaremos los copilots funcionales con asistentes especializados para diferentes verticales.",
      note: "Nota",
      noteText: "Estamos probando el dashboard con un grupo selecto de usuarios. ¡Gracias por ser parte de esta etapa!",
      nextSteps: "Próximos Pasos",
      landingCreation: "Creación de la landing con lista de espera",
      chatImplementation: "Implementación de chat con AI copilots",
      connectivityPlatforms: "Conectividad con WhatsApp y otras plataformas",
      dashboardMetrics: "Dashboard con métricas y analíticas",
      selectCopilot: "Selecciona un copilot para comenzar",
      selectCopilotText: "Pronto podrás elegir entre diferentes copilots especializados según tus necesidades.",
      salesAssistant: "Asistente de Ventas",
      eventOrganizer: "Organizador de Eventos",
      communityManager: "Gestor de Comunidad",
      contentAdvisor: "Asesor de Contenido",
      betaVersion: "Versión beta",
      comingSoon: "Próximamente"
    }
  };

  const t = translations[language];
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <MotionLogo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm">
              {t.help}
            </Button>
            <Button variant="ghost" size="sm">
              {t.account}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{t.welcome}</h1>
          <p className="text-gray-600">
            {t.welcomeText}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.projectStatus}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t.projectStatusText}
              </p>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-700 text-sm">
                <strong>{t.note}:</strong> {t.noteText}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.nextSteps}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span>{t.landingCreation}</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span>{t.chatImplementation}</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span>{t.connectivityPlatforms}</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span>{t.dashboardMetrics}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t.selectCopilot}</h2>
          <p className="text-gray-600 mb-6">
            {t.selectCopilotText}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: t.salesAssistant, color: "bg-violet-100 text-violet-700", soon: false },
              { name: t.eventOrganizer, color: "bg-indigo-100 text-indigo-700", soon: false },
              { name: t.communityManager, color: "bg-blue-100 text-blue-700", soon: true },
              { name: t.contentAdvisor, color: "bg-emerald-100 text-emerald-700", soon: true }
            ].map((copilot, index) => (
              <div 
                key={index}
                className={`p-5 rounded-lg border ${copilot.soon ? 'border-gray-200 opacity-70' : 'border-violet-200 cursor-pointer hover:border-violet-300 hover:shadow-sm transition-all'}`}
              >
                <div className={`w-10 h-10 rounded-full ${copilot.color} flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                  </svg>
                </div>
                <h3 className="font-medium mb-1">{copilot.name}</h3>
                {copilot.soon ? (
                  <span className="text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full">{t.comingSoon}</span>
                ) : (
                  <span className="text-sm text-gray-500">{t.betaVersion}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
