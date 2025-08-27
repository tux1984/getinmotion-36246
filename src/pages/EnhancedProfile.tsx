import { LanguageProfileSection } from '@/components/profile/LanguageProfileSection';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useUserInsights } from '@/hooks/useUserInsights';
import { useProfileSync } from '@/hooks/useProfileSync';
import { useLanguage } from '@/context/LanguageContext';
import { ActivityTimeline } from '@/components/profile/ActivityTimeline';
import { AgentProgressMap } from '@/components/profile/AgentProgressMap';
import { DeliverablesCenter } from '@/components/profile/DeliverablesCenter';
import { IntelligentInsights } from '@/components/profile/IntelligentInsights';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Building2, 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Users,
  Lightbulb,
  ChevronLeft,
  Edit3,
  BarChart3,
  PieChart,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Brain
} from 'lucide-react';

const EnhancedProfile: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { businessProfile, loading } = useUserBusinessProfile();
  const { currentScores } = useOptimizedMaturityScores();
  const { coordinatorMessage, deliverables } = useMasterCoordinator();
  const { insights, loading: insightsLoading } = useUserInsights();
  
  // Sync profile data independently to avoid circular dependencies
  useProfileSync();

  const [selectedTab, setSelectedTab] = useState('activity');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto"
          >
            <Brain className="w-16 h-16 text-primary" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Loading your profile...
            </h2>
            <p className="text-muted-foreground">
              Preparing personalized information
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              Profile not found
            </h2>
            <p className="text-muted-foreground mb-4">
              Complete the maturity calculator to create your profile.
            </p>
            <Button onClick={() => navigate('/maturity-calculator')}>
              Create profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const translations = {
    en: {
      title: 'Business Profile',
      subtitle: 'Your comprehensive business overview',
      backToDashboard: 'Back to Dashboard',
      editProfile: 'Edit Profile',
      activity: 'Activity',
      insights: 'Insights', 
      agents: 'Agent Progress',
      deliverables: 'Deliverables',
      settings: 'Settings',
      businessInfo: 'Business Information',
      personalInfo: 'Personal Information',
      currentChannels: 'Current Channels',
      desiredChannels: 'Desired Channels',
      maturityLevel: 'Maturity Level',
      businessStage: 'Business Stage',
      teamSize: 'Team Size',
      timeAvailability: 'Time Availability',
      financialResources: 'Financial Resources',
      monthlyGoal: 'Monthly Revenue Goal',
      primaryGoals: 'Primary Goals',
      urgentNeeds: 'Urgent Needs',
      skillsExpertise: 'Skills & Expertise',
      currentChallenges: 'Current Challenges',
      lastAssessment: 'Last Assessment',
      profileStrength: 'Profile Strength',
      dataCompleteness: 'Data Completeness',
      nextSteps: 'Recommended Next Steps',
      retakeAssessment: 'Retake Assessment'
    },
    es: {
      title: 'Perfil Empresarial',
      subtitle: 'Tu visión integral del negocio',
      backToDashboard: 'Volver al Dashboard',
      editProfile: 'Editar Perfil',
      activity: 'Actividad',
      insights: 'Insights',
      agents: 'Progreso de Agentes',
      deliverables: 'Entregables',
      settings: 'Configuración',
      businessInfo: 'Información del Negocio',
      personalInfo: 'Información Personal',
      currentChannels: 'Canales Actuales',
      desiredChannels: 'Canales Deseados',
      maturityLevel: 'Nivel de Madurez',
      businessStage: 'Etapa del Negocio',
      teamSize: 'Tamaño del Equipo',
      timeAvailability: 'Disponibilidad de Tiempo',
      financialResources: 'Recursos Financieros',
      monthlyGoal: 'Meta de Ingresos Mensuales',
      primaryGoals: 'Objetivos Principales',
      urgentNeeds: 'Necesidades Urgentes',
      skillsExpertise: 'Habilidades y Experiencia',
      currentChallenges: 'Desafíos Actuales',
      lastAssessment: 'Última Evaluación',
      profileStrength: 'Fortaleza del Perfil',
      dataCompleteness: 'Completitud de Datos',
      nextSteps: 'Próximos Pasos Recomendados',
      retakeAssessment: 'Repetir Evaluación'
    }
  };

  const t = translations[mapToLegacyLanguage(language)];

  const getBusinessStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'mvp': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'early': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'growth': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'established': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMaturityColor = (level: number) => {
    if (level >= 4) return 'text-green-600 dark:text-green-400';
    if (level >= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (level >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const profileCompleteness = Math.min(
    100,
    (businessProfile.currentChannels.length * 10) +
    (businessProfile.primaryGoals.length * 15) +
    (businessProfile.skillsAndExpertise.length * 5) +
    (businessProfile.monthlyRevenueGoal ? 20 : 0) +
    (businessProfile.urgentNeeds.length * 10) + 30
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t.backToDashboard}
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
              {t.title}
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <Button onClick={() => navigate('/maturity-calculator')}>
            <Edit3 className="w-4 h-4 mr-2" />
            {t.retakeAssessment}
          </Button>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 bg-gradient-primary/5 border-primary/20 shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-float">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{businessProfile.fullName}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getBusinessStageColor(businessProfile.businessStage)}>
                        {businessProfile.businessStage}
                      </Badge>
                      <Badge variant="outline">
                        {businessProfile.businessModel}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{t.maturityLevel}</div>
                  <div className={`text-3xl font-bold ${getMaturityColor(currentScores ? Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : businessProfile.maturityLevel)}`}>
                    {currentScores ? Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : businessProfile.maturityLevel}/5
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary-subtle rounded-lg border border-primary/20 hover:shadow-card transition-all duration-300">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary animate-float" />
                  <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{profileCompleteness}%</div>
                  <div className="text-sm text-muted-foreground">{t.dataCompleteness}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20 hover:shadow-card transition-all duration-300">
                  <Users className="w-6 h-6 mx-auto mb-2 text-secondary animate-float" style={{ animationDelay: '0.5s' }} />
                  <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">{businessProfile.teamSize}</div>
                  <div className="text-sm text-muted-foreground">{t.teamSize}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20 hover:shadow-card transition-all duration-300">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-accent animate-float" style={{ animationDelay: '1s' }} />
                  <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">{businessProfile.timeAvailability}</div>
                  <div className="text-sm text-muted-foreground">{t.timeAvailability}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="activity">{t.activity}</TabsTrigger>
            <TabsTrigger value="insights">{t.insights}</TabsTrigger>
            <TabsTrigger value="agents">{t.agents}</TabsTrigger>
            <TabsTrigger value="deliverables">{t.deliverables}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {insights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityTimeline activities={insights.recent_activity} language={mapToLegacyLanguage(language)} />
                <IntelligentInsights insights={insights} language={mapToLegacyLanguage(language)} />
              </div>
            ) : (
              <div>Loading activity...</div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {insights ? (
              <IntelligentInsights insights={insights} language={mapToLegacyLanguage(language)} />
            ) : (
              <div>Loading insights...</div>
            )}
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            {insights ? (
              <AgentProgressMap agents={insights.agent_insights} language={mapToLegacyLanguage(language)} />
            ) : (
              <div>Loading agent progress...</div>
            )}
          </TabsContent>

          {/* Deliverables Tab */}
          <TabsContent value="deliverables" className="space-y-6">
            <DeliverablesCenter />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <LanguageProfileSection />
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
};

export default EnhancedProfile;