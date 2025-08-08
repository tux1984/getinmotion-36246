import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useLanguage } from '@/context/LanguageContext';
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
  const [selectedTab, setSelectedTab] = useState('overview');

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
      overview: 'Overview',
      insights: 'Insights',
      goals: 'Goals & Progress',
      recommendations: 'Recommendations',
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
      overview: 'Resumen',
      insights: 'Insights',
      goals: 'Objetivos y Progreso',
      recommendations: 'Recomendaciones',
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

  const t = translations[language];

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
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
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{profileCompleteness}%</div>
                  <div className="text-sm text-muted-foreground">{t.dataCompleteness}</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl font-bold">{businessProfile.teamSize}</div>
                  <div className="text-sm text-muted-foreground">{t.teamSize}</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{businessProfile.timeAvailability}</div>
                  <div className="text-sm text-muted-foreground">{t.timeAvailability}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Master Coordinator Integration */}
        {(coordinatorMessage || (deliverables && deliverables.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coordinatorMessage && (
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {language === ('es' as string) ? 'Análisis del Coordinador Maestro' : 'Master Coordinator Analysis'}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {typeof coordinatorMessage === 'string' ? coordinatorMessage : 'Analyzing your business profile...'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {deliverables && deliverables.length > 0 && (
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 mb-2">
                          {language === ('es' as string) ? 'Entregables Activos' : 'Active Deliverables'}
                        </h3>
                        <p className="text-sm text-green-600">
                          {language === ('es' as string)
                            ? `${deliverables.length} entregables en progreso para tu negocio`
                            : `${deliverables.length} deliverables in progress for your business`
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* Tabs Navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="insights">{t.insights}</TabsTrigger>
            <TabsTrigger value="goals">{t.goals}</TabsTrigger>
            <TabsTrigger value="recommendations">{t.recommendations}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Business Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span>{t.businessInfo}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.currentChannels}</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {businessProfile.currentChannels.map((channel) => (
                          <Badge key={channel} variant="secondary">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.desiredChannels}</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {businessProfile.desiredChannels.map((channel) => (
                          <Badge key={channel} variant="outline">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.financialResources}</label>
                      <div className="mt-1 text-lg font-semibold">{businessProfile.financialResources}</div>
                    </div>
                    {businessProfile.monthlyRevenueGoal && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">{t.monthlyGoal}</label>
                        <div className="mt-1 text-lg font-semibold flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {businessProfile.monthlyRevenueGoal.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Goals & Challenges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>{t.primaryGoals}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.primaryGoals}</label>
                      <div className="mt-2 space-y-2">
                        {businessProfile.primaryGoals.map((goal, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.urgentNeeds}</label>
                      <div className="mt-2 space-y-2">
                        {businessProfile.urgentNeeds.map((need, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">{need}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>{t.skillsExpertise}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {businessProfile.skillsAndExpertise.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                          <span className="text-sm">{skill}</span>
                          <Badge variant="outline">Expert</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5" />
                      <span>{t.currentChallenges}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {businessProfile.currentChallenges.map((challenge, index) => (
                        <div key={index} className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/10 rounded-r">
                          <p className="text-sm">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>{t.profileStrength}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t.dataCompleteness}</span>
                      <span className="text-sm text-muted-foreground">{profileCompleteness}%</span>
                    </div>
                    <Progress value={profileCompleteness} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t.maturityLevel}</span>
                      <span className="text-sm text-muted-foreground">
                        {currentScores ? Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : businessProfile.maturityLevel}/5
                      </span>
                    </div>
                    <Progress value={((currentScores ? Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : businessProfile.maturityLevel) / 5) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>{t.nextSteps}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                      <div className="flex items-center space-x-3">
                        <ArrowRight className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">Complete maturity assessment</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Get more precise recommendations by completing all assessment steps.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                      <div className="flex items-center space-x-3">
                        <ArrowRight className="w-5 h-5 text-secondary" />
                        <div>
                          <h4 className="font-semibold">Expand sales channels</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Consider adding new digital channels to increase your reach.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
};

export default EnhancedProfile;