
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionLogo } from '@/components/MotionLogo';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MessageSquare, Calendar, Users, Star, Send, Plus, X, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Dashboard = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activeCopilot, setActiveCopilot] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'copilot', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState<Array<{id: number, title: string, completed: boolean}>>([
    { id: 1, title: language === 'en' ? 'Upload new content to social media' : 'Subir nuevo contenido a redes sociales', completed: false },
    { id: 2, title: language === 'en' ? 'Respond to email inquiries' : 'Responder consultas por email', completed: true },
  ]);

  const translations = {
    en: {
      help: "Help",
      account: "Account",
      welcome: "Welcome to Motion MVP!",
      welcomeText: "This is an early version of the dashboard. You can now interact with your copilots.",
      projectStatus: "Project Status",
      projectStatusText: "This is a preliminary version of the Motion MVP. In the coming weeks we'll implement more advanced AI copilots with specialized assistants for different verticals.",
      note: "Note",
      noteText: "We're testing the dashboard with a select group of users. Thanks for being part of this stage!",
      nextSteps: "Next Steps",
      landingCreation: "Creation of landing page with waitlist",
      chatImplementation: "Implementation of chat with AI copilots",
      connectivityPlatforms: "Connectivity with WhatsApp and other platforms",
      dashboardMetrics: "Dashboard with metrics and analytics",
      selectCopilot: "Select a copilot to get started",
      selectCopilotText: "Choose between different specialized copilots according to your needs.",
      salesAssistant: "Sales Assistant",
      eventOrganizer: "Event Organizer",
      communityManager: "Community Manager",
      contentAdvisor: "Content Advisor",
      betaVersion: "Beta version",
      comingSoon: "Coming soon",
      yourTasks: "Your Tasks",
      addTask: "Add Task",
      viewAllTasks: "View All Tasks",
      taskComplete: "Task Complete",
      cancel: "Cancel",
      save: "Save",
      enterTaskTitle: "Enter task title",
      taskDescription: "Task description (optional)",
      enterMessage: "Type your message...",
      send: "Send"
    },
    es: {
      help: "Ayuda",
      account: "Cuenta",
      welcome: "¡Bienvenido al MVP de Motion!",
      welcomeText: "Esta es una versión temprana del dashboard. Ahora puedes interactuar con tus copilots.",
      projectStatus: "Estado del Proyecto",
      projectStatusText: "Esta es una versión preliminar del MVP de Motion. En las próximas semanas implementaremos copilots de IA más avanzados con asistentes especializados para diferentes verticales.",
      note: "Nota",
      noteText: "Estamos probando el dashboard con un grupo selecto de usuarios. ¡Gracias por ser parte de esta etapa!",
      nextSteps: "Próximos Pasos",
      landingCreation: "Creación de la landing con lista de espera",
      chatImplementation: "Implementación de chat con AI copilots",
      connectivityPlatforms: "Conectividad con WhatsApp y otras plataformas",
      dashboardMetrics: "Dashboard con métricas y analíticas",
      selectCopilot: "Selecciona un copilot para comenzar",
      selectCopilotText: "Elige entre diferentes copilots especializados según tus necesidades.",
      salesAssistant: "Asistente de Ventas",
      eventOrganizer: "Organizador de Eventos",
      communityManager: "Gestor de Comunidad",
      contentAdvisor: "Asesor de Contenido",
      betaVersion: "Versión beta",
      comingSoon: "Próximamente",
      yourTasks: "Tus Tareas",
      addTask: "Añadir Tarea",
      viewAllTasks: "Ver Todas las Tareas",
      taskComplete: "Tarea Completada",
      cancel: "Cancelar",
      save: "Guardar",
      enterTaskTitle: "Ingresa el título de la tarea",
      taskDescription: "Descripción de la tarea (opcional)",
      enterMessage: "Escribe tu mensaje...",
      send: "Enviar"
    }
  };

  const t = translations[language];
  
  const copilots = [
    { 
      id: "sales", 
      name: t.salesAssistant, 
      icon: <MessageSquare className="w-5 h-5" />, 
      color: "bg-violet-100 text-violet-700", 
      soon: false,
      greeting: language === 'en' 
        ? "Hi there! I'm your Sales Assistant. I can help you manage inquiries, create quotes, and track potential clients. How can I assist you today?"
        : "¡Hola! Soy tu Asistente de Ventas. Puedo ayudarte a gestionar consultas, crear presupuestos y hacer seguimiento a clientes potenciales. ¿Cómo puedo ayudarte hoy?"
    },
    { 
      id: "events", 
      name: t.eventOrganizer, 
      icon: <Calendar className="w-5 h-5" />, 
      color: "bg-indigo-100 text-indigo-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hello! I'm your Event Organizer. I can help you schedule events, manage attendees, send reminders, and track responses. What event are you planning?"
        : "¡Hola! Soy tu Organizador de Eventos. Puedo ayudarte a programar eventos, gestionar asistentes, enviar recordatorios y hacer seguimiento de respuestas. ¿Qué evento estás planeando?"
    },
    { 
      id: "community", 
      name: t.communityManager, 
      icon: <Users className="w-5 h-5" />, 
      color: "bg-blue-100 text-blue-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hi! I'm your Community Manager. I can help you engage with your audience, analyze feedback, and maintain consistent communication. How would you like to connect with your community today?"
        : "¡Hola! Soy tu Gestor de Comunidad. Puedo ayudarte a interactuar con tu audiencia, analizar feedback y mantener una comunicación constante. ¿Cómo te gustaría conectar con tu comunidad hoy?"
    },
    { 
      id: "content", 
      name: t.contentAdvisor, 
      icon: <Star className="w-5 h-5" />, 
      color: "bg-emerald-100 text-emerald-700", 
      soon: true,
      greeting: language === 'en'
        ? "This copilot is coming soon! Check back for updates."
        : "¡Este copilot estará disponible pronto! Vuelve para ver actualizaciones."
    }
  ];

  const handleSelectCopilot = (id: string) => {
    if (copilots.find(c => c.id === id)?.soon) {
      toast({
        title: language === 'en' ? 'Coming Soon' : 'Próximamente',
        description: language === 'en' 
          ? 'This copilot is still in development and will be available soon!'
          : '¡Este copilot está aún en desarrollo y estará disponible pronto!',
      });
      return;
    }
    
    setActiveCopilot(id);
    const selectedCopilot = copilots.find(c => c.id === id);
    if (selectedCopilot) {
      setMessages([
        { type: 'copilot', content: selectedCopilot.greeting }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate copilot response
    setTimeout(() => {
      let response = '';
      
      if (activeCopilot === 'sales') {
        response = language === 'en'
          ? "I understand you need help with sales. I've analyzed your recent inquiries and can help you create a response. Would you like me to generate a quote based on your standard rates?"
          : "Entiendo que necesitas ayuda con ventas. He analizado tus consultas recientes y puedo ayudarte a crear una respuesta. ¿Quieres que genere un presupuesto basado en tus tarifas estándar?";
      } else if (activeCopilot === 'events') {
        response = language === 'en'
          ? "I can help you organize your upcoming event. Would you like me to create a schedule template, send out invitations, or perhaps set up automated reminders for attendees?"
          : "Puedo ayudarte a organizar tu próximo evento. ¿Quieres que cree una plantilla de horario, envíe invitaciones o quizás configure recordatorios automatizados para los asistentes?";
      } else if (activeCopilot === 'community') {
        response = language === 'en'
          ? "I've analyzed your community engagement metrics from last week. Your latest post received 43% more interaction than average. Would you like me to suggest topics for your next content series?"
          : "He analizado las métricas de participación de tu comunidad de la semana pasada. Tu última publicación recibió un 43% más de interacción que el promedio. ¿Quieres que te sugiera temas para tu próxima serie de contenidos?";
      }
      
      setMessages(prev => [...prev, { type: 'copilot', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setTaskTitle('');
    setTaskDescription('');
    setShowTaskForm(false);
    
    toast({
      title: language === 'en' ? 'Task Added' : 'Tarea Añadida',
      description: language === 'en' ? 'Your new task has been created' : 'Tu nueva tarea ha sido creada',
    });
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast({
        title: t.taskComplete,
        description: task.title,
      });
    }
  };
  
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
        {!activeCopilot ? (
          <>
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
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span>{t.landingCreation}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span>{t.chatImplementation}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">{t.selectCopilot}</h2>
              <p className="text-gray-600 mb-6">
                {t.selectCopilotText}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {copilots.map((copilot) => (
                  <div 
                    key={copilot.id}
                    className={`p-5 rounded-lg border ${copilot.soon ? 'border-gray-200 opacity-70' : 'border-violet-200 cursor-pointer hover:border-violet-300 hover:shadow-sm transition-all'}`}
                    onClick={() => handleSelectCopilot(copilot.id)}
                  >
                    <div className={`w-10 h-10 rounded-full ${copilot.color} flex items-center justify-center mb-3`}>
                      {copilot.icon}
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
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${copilots.find(c => c.id === activeCopilot)?.color} flex items-center justify-center mr-3`}>
                      {copilots.find(c => c.id === activeCopilot)?.icon}
                    </div>
                    <h2 className="font-medium">{copilots.find(c => c.id === activeCopilot)?.name}</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveCopilot(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
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
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-800">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></div>
                          <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={t.enterMessage}
                      className="flex-grow"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4 mr-2" />
                      {t.send}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{t.yourTasks}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowTaskForm(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    {t.addTask}
                  </Button>
                </CardHeader>
                <CardContent>
                  {showTaskForm ? (
                    <div className="space-y-4">
                      <Input
                        placeholder={t.enterTaskTitle}
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder={t.taskDescription}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowTaskForm(false)}
                        >
                          {t.cancel}
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleAddTask}
                        >
                          {t.save}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {tasks.slice(0, 4).map(task => (
                          <div 
                            key={task.id} 
                            className="flex items-center p-2 hover:bg-slate-50 rounded cursor-pointer group"
                            onClick={() => handleToggleTask(task.id)}
                          >
                            <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${task.completed ? 'bg-green-100 border-green-300' : 'border-slate-300'}`}>
                              {task.completed && <Check className="w-3 h-3 text-green-500" />}
                            </div>
                            <span className={task.completed ? 'text-slate-400 line-through' : ''}>{task.title}</span>
                          </div>
                        ))}
                      </div>
                      
                      {tasks.length > 4 && (
                        <div className="mt-4">
                          <Button variant="ghost" size="sm" className="w-full">
                            {t.viewAllTasks}
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{language === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Schedule New Event' : 'Programar Nuevo Evento'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Create Message Template' : 'Crear Plantilla de Mensaje'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Audience Analysis' : 'Análisis de Audiencia'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
