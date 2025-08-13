import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BusinessProfileCapture } from '@/components/business-profile/BusinessProfileCapture';
import { BusinessProfileDialog } from '@/components/master-coordinator/BusinessProfileDialog';
import { LoadingIndicator } from './LoadingIndicator';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';

import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Target,
  PlayCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Zap,
  Brain,
  TrendingUp,
  Calculator,
  BarChart3,
  Star,
  Play,
  Lightbulb
} from 'lucide-react';

interface MasterCoordinatorPanelProps {
  onTaskStart?: (taskId: string) => void;
  language: 'en' | 'es';
}

export const MasterCoordinatorPanel: React.FC<MasterCoordinatorPanelProps> = ({ onTaskStart, language }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showProfileCapture, setShowProfileCapture] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [conversationData, setConversationData] = useState<any>(null);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  
  const { businessProfile, loading: profileLoading } = useUserBusinessProfile();
  const { currentScores, loading: scoresLoading } = useOptimizedMaturityScores();
  
  const { 
    coordinatorMessage, 
    nextUnlockedTask, 
    coordinatorTasks,
    startTaskJourney,
    analyzeProfileAndGenerateTasks,
    generateIntelligentQuestions,
    loading: coordinatorLoading
  } = useMasterCoordinator();

  // Verificar si necesita capturar perfil de negocio
  useEffect(() => {
    if (!user || profileLoading) return;
    
    // Si no tiene información del negocio, mostrar captura
    if (!businessProfile?.businessDescription && !businessProfile?.brandName) {
      setShowProfileCapture(true);
    } else {
      // Si tiene perfil, iniciar conversación inteligente
      startIntelligentConversation();
    }
  }, [user, businessProfile, profileLoading]);

  // Métricas calculadas
  const completedTasks = coordinatorTasks.filter(task => task.steps.every(step => step.isCompleted));
  const activeTasks = coordinatorTasks.filter(task => !task.steps.every(step => step.isCompleted));
  const progressPercentage = coordinatorTasks.length > 0 
    ? Math.round((completedTasks.length / coordinatorTasks.length) * 100) 
    : 0;
  
  const maturityLevel = currentScores ? 
    Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : 1;

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'es') {
      if (hour < 12) return '¡Buenos días!';
      if (hour < 18) return '¡Buenas tardes!';
      return '¡Buenas noches!';
    } else {
      if (hour < 12) return 'Good morning!';
      if (hour < 18) return 'Good afternoon!';
      return 'Good evening!';
    }
  };

  const getBusinessModelLabel = () => {
    if (!businessProfile?.businessModel) return '';
    const models: { [key: string]: string } = {
      'b2b': 'B2B',
      'b2c': 'B2C',
      'marketplace': 'Marketplace',
      'saas': 'SaaS',
      'ecommerce': 'E-commerce',
      'consulting': 'Consulting',
      'freelance': 'Freelance',
      'other': 'Other'
    };
    return models[businessProfile.businessModel] || businessProfile.businessModel;
  };

  const getGoalLabel = (code: string) => {
    const map = language === 'es'
      ? {
          increase_revenue: 'Aumentar ingresos',
          automate_processes: 'Automatizar procesos',
          scale_operations: 'Escalar operaciones',
          build_brand: 'Construir marca',
          expand_market: 'Expandir mercado',
          reduce_costs: 'Reducir costos',
          improve_efficiency: 'Mejorar eficiencia',
          improve_ux: 'Mejorar experiencia',
          launch_mvp: 'Lanzar MVP'
        }
      : {
          increase_revenue: 'Increase revenue',
          automate_processes: 'Automate processes',
          scale_operations: 'Scale operations',
          build_brand: 'Build brand',
          expand_market: 'Expand market',
          reduce_costs: 'Reduce costs',
          improve_efficiency: 'Improve efficiency',
          improve_ux: 'Improve UX',
          launch_mvp: 'Launch MVP'
        };
    return (map as Record<string, string>)[code] || code;
  };

  const handleStartTask = async (taskId: string) => {
    const success = await startTaskJourney(taskId);
    if (success) {
      onTaskStart?.(taskId);
      navigate(`/dashboard/tasks/${taskId}`);
    }
  };

  const startIntelligentConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'start_conversation',
          userId: user.id,
          userProfile: businessProfile,
          conversationContext: 'dashboard_initialization'
        }
      });

      if (error) throw error;
      setConversationData(data);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleStartNow = async () => {
    if (isGeneratingTasks) return; // Prevenir múltiples llamadas
    
    console.log('🚀 Starting Master Coordinator flow');
    setIsGeneratingTasks(true);
    try {
      await analyzeProfileAndGenerateTasks();
      toast({
        title: language === 'es' ? "¡Coordinador Activado!" : "Coordinator Activated!",
        description: language === 'es' 
          ? "He analizado tu perfil y generado tareas específicas para tu negocio."
          : "I've analyzed your profile and generated specific tasks for your business.",
      });
    } catch (error) {
      console.error('❌ Error starting coordinator:', error);
      toast({
        title: language === 'es' ? "Error" : "Error",
        description: language === 'es' 
          ? "Hubo un problema generando las tareas. Por favor, inténtalo de nuevo."
          : "There was a problem generating tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleRecalculateMaturity = async () => {
    navigate('/maturity-calculator');
  };

  const handleTalkAboutBusiness = async () => {
    console.log('💬 Opening business profile dialog');
    setShowBusinessDialog(true);
  };

  const handleActionButton = async (action: string) => {
    switch (action) {
      case 'start_tasks':
        await handleStartNow();
        break;
      case 'business_details':
        setShowProfileCapture(true);
        break;
      case 'explain_more':
        await startIntelligentConversation();
        break;
      default:
        break;
    }
  };

  const handleChatWithCoordinator = () => {
    navigate('/dashboard/agent/master-coordinator');
  };

  const labels = language === 'es' ? {
    masterCoordinator: 'Coordinador Maestro',
    personalGuide: 'Tu Guía Personal de Negocio',
    currentMission: 'Misión Actual',
    startMission: 'Iniciar Misión',
    chatWithMe: 'Chatea conmigo',
    progress: 'Progreso',
    completedTasks: 'tareas completadas',
    activeTasks: 'tareas activas',
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
    nextSteps: 'Próximos Pasos',
    getStarted: 'Comenzar',
    maturityLevel: 'Nivel de Madurez',
    businessModel: 'Modelo de Negocio',
    startNow: 'Comenzar Ahora',
    activateCoordinator: 'Activar coordinador y generar tareas personalizadas',
    talkAboutBusiness: 'Háblame de tu negocio',
    deepenProfile: 'Profundiza tu perfil con preguntas inteligentes',
    recalculateMaturity: 'Recalcular Madurez',
    updateMaturityScores: 'Actualiza tus puntuaciones de madurez y regenera tareas'
  } : {
    masterCoordinator: 'Master Coordinator',
    personalGuide: 'Your Personal Business Guide',
    currentMission: 'Current Mission',
    startMission: 'Start Mission',
    chatWithMe: 'Chat with me',
    progress: 'Progress',
    completedTasks: 'completed tasks',
    activeTasks: 'active tasks',
    showMore: 'Show more',
    showLess: 'Show less',
    nextSteps: 'Next Steps',
    getStarted: 'Get Started',
    maturityLevel: 'Maturity Level',
    businessModel: 'Business Model',
    startNow: 'Start Now',
    activateCoordinator: 'Activate coordinator and generate personalized tasks',
    talkAboutBusiness: 'Tell me about your business',
    deepenProfile: 'Deepen your profile with intelligent questions',
    recalculateMaturity: 'Recalculate Maturity',
    updateMaturityScores: 'Update your maturity scores and regenerate tasks'
  };

  const getMessagePreview = (message: string, limit: number = 120) => {
    return message.length > limit ? message.substring(0, limit) + '...' : message;
  };

  return (
    <>
      {/* Loading Indicator */}
      <LoadingIndicator 
        isVisible={isGeneratingTasks} 
        message={language === 'es' 
          ? "Analizando tu perfil y generando tareas inteligentes..."
          : "Analyzing your profile and generating intelligent tasks..."}
      />

      {/* Master Coordinator Panel - Collapsible */}
      <motion.div
        initial={{ opacity: 0, height: 'auto' }}
        animate={{ 
          opacity: 1,
          height: isExpanded ? 'auto' : '80px'
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full bg-background/95 backdrop-blur-lg border-b border-primary/20 shadow-lg overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-none bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-blue-600/90 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                
                {/* Master Coordinator Identity */}
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                      <Crown className="w-6 h-6 text-yellow-300" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </motion.div>
                  </motion.div>
                  
                  <div>
                    <h2 className="text-lg font-bold">{labels.masterCoordinator}</h2>
                    <p className="text-white/80 text-sm">{labels.personalGuide}</p>
                  </div>
                </div>

                {/* Progress Badge */}
                <div className="hidden md:flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Target className="w-3 h-3 mr-1" />
                    {progressPercentage}% {labels.progress}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {completedTasks.length} {labels.completedTasks}
                  </Badge>
                </div>

                {/* Expand/Collapse Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white hover:bg-white/20"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      
                      {/* Welcome Message with Business Profile Integration */}
                      <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                          <Brain className="w-5 h-5 text-yellow-300 mt-1" />
                          <div className="flex-1">
                            <div className="space-y-3">
                              <p className="text-white leading-relaxed">
                                {getTimeOfDayGreeting()} {(() => { const raw = (businessProfile as any)?.brandName ?? (businessProfile as any)?.businessDescription; return (typeof raw === 'string' && raw.trim().length > 0 && !raw.trim().startsWith('[')) ? `¡${raw}!` : '' })()}
                                 {businessProfile?.businessDescription 
                                   ? ` ${typeof coordinatorMessage === 'object' && coordinatorMessage?.message 
                                      ? coordinatorMessage.message 
                                      : typeof coordinatorMessage === 'string' 
                                      ? coordinatorMessage 
                                      : 'I\'ve analyzed your profile and have specific tasks to grow your business.'}`
                                     : (language === 'es' 
                                       ? "Para ayudarte de la mejor manera, necesito saber más sobre tu negocio. ¿Puedes contarme a qué te dedicas?"
                                       : "To help you in the best way, I need to know more about your business. Can you tell me what you do?")
                                 }
                              </p>
                              
                              {/* Business Profile Quick View */}
                              {businessProfile?.businessDescription && (
                                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {businessProfile.brandName && (
                                      <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-400/30">
                                        <Star className="w-3 h-3 mr-1" />
                                        {businessProfile.brandName}
                                      </Badge>
                                    )}
                                    {businessProfile.businessModel && (
                                      <Badge className="bg-blue-400/20 text-blue-100 border-blue-400/30">
                                        <BarChart3 className="w-3 h-3 mr-1" />
                                        {getBusinessModelLabel()}
                                      </Badge>
                                    )}
                                    <Badge className="bg-green-400/20 text-green-100 border-green-400/30">
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                      {labels.maturityLevel}: {maturityLevel}/10
                                    </Badge>
                                  </div>
                                  {Array.isArray(businessProfile?.primaryGoals) && businessProfile.primaryGoals.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                      {businessProfile.primaryGoals.map((goal: string, idx: number) => (
                                        <Badge key={idx} className="bg-purple-400/20 text-purple-100 border-purple-400/30">
                                          <Target className="w-3 h-3 mr-1" />
                                          {getGoalLabel(goal)}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  {typeof businessProfile.businessDescription === 'string' && businessProfile.businessDescription.trim().length > 0 && (
                                    <p className="text-white/80 text-sm">
                                      📍 {businessProfile.businessDescription}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                         <p className="text-sm font-medium text-white/90 mb-3">
                           {language === 'es' ? 'Elige tu próxima acción:' : 'Choose your next action:'}
                         </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Button
                            variant="default"
                            className="h-auto p-4 bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-bold"
                            onClick={handleStartNow}
                            disabled={isGeneratingTasks || coordinatorLoading}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                {isGeneratingTasks ? (
                                  <Zap className="w-4 h-4 text-purple-900 animate-pulse" />
                                ) : (
                                  <Play className="w-4 h-4 text-purple-900" />
                                )}
                              </div>
                              <div className="flex-1 text-left min-w-0 overflow-hidden">
                                 <div className="font-medium truncate">
                                   {isGeneratingTasks 
                                     ? (language === 'es' ? 'Generando...' : 'Generating...')
                                     : labels.startNow}
                                 </div>
                                 <div className="text-xs text-purple-700 truncate">
                                   {labels.activateCoordinator}
                                 </div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="h-auto p-4 bg-white text-purple-600 hover:bg-white/90"
                            onClick={handleTalkAboutBusiness}
                            disabled={coordinatorLoading}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="flex-1 text-left min-w-0 overflow-hidden">
                                 <div className="font-medium truncate">
                                   {labels.talkAboutBusiness}
                                 </div>
                                 <div className="text-xs text-purple-500 truncate">
                                   {labels.deepenProfile}
                                 </div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="h-auto p-4 bg-white text-purple-600 hover:bg-white/90"
                            onClick={handleRecalculateMaturity}
                            disabled={coordinatorLoading}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center">
                                <Calculator className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="flex-1 text-left min-w-0 overflow-hidden">
                                 <div className="font-medium truncate">
                                   {labels.recalculateMaturity}
                                 </div>
                                 <div className="text-xs text-purple-500 truncate">
                                   {labels.updateMaturityScores}
                                 </div>
                              </div>
                            </div>
                          </Button>
                        </div>

                        {/* Chat Button */}
                        <Button
                          variant="ghost"
                          onClick={handleChatWithCoordinator}
                          className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/30 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {labels.chatWithMe}
                        </Button>

                        {/* Quick Stats on Mobile */}
                        <div className="md:hidden flex space-x-2">
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {progressPercentage}%
                          </Badge>
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {completedTasks.length} ✓
                          </Badge>
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            {activeTasks.length} {labels.activeTasks}
                          </Badge>
                        </div>
                      </div>

                      {/* Next Tasks Preview */}
                      {coordinatorTasks.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {labels.nextSteps}
                          </h4>
                          <div className="space-y-1">
                            {coordinatorTasks.slice(0, 3).map((task, index) => (
                              <div key={task.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    task.isUnlocked ? 'bg-green-400' : 'bg-white/30'
                                  }`} />
                                  <span className="text-white/80 truncate">
                                    {task.title}
                                  </span>
                                </div>
                                {task.isUnlocked && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleStartTask(task.id)}
                                    className="text-white/60 hover:text-white hover:bg-white/10 h-6 px-2"
                                  >
                                    <PlayCircle className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Business Profile Capture Modal */}
      <Dialog open={showProfileCapture} onOpenChange={setShowProfileCapture}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Tell me about your business
            </DialogTitle>
          </DialogHeader>
          <BusinessProfileCapture
            onComplete={() => {
              setShowProfileCapture(false);
              startIntelligentConversation();
            }}
            onSkip={() => setShowProfileCapture(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Business Profile Dialog */}
        <BusinessProfileDialog 
        open={showBusinessDialog}
        onOpenChange={setShowBusinessDialog}
        language={language}
      />
    </>
  );
};