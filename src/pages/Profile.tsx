import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { ProfileEditModal } from '@/components/profile/ProfileEditModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Building, Target, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { UserBusinessProfile } from '@/types/profile';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { businessProfile, loading } = useUserBusinessProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const t = {
    en: {
      profile: 'Profile',
      back: 'Back to Dashboard',
      edit: 'Edit Profile',
      businessInfo: 'Business Information',
      personalInfo: 'Personal Information',
      goals: 'Goals & Objectives',
      fullName: 'Full Name',
      businessModel: 'Business Model',
      businessStage: 'Current Stage',
      maturityLevel: 'Maturity Level',
      currentChannels: 'Sales Channels',
      primaryGoals: 'Primary Goals',
      urgentNeeds: 'Urgent Needs',
      monthlyGoal: 'Monthly Revenue Goal',
      lastAssessment: 'Last Assessment',
      businessModels: {
        artisan: 'Artisan Creator',
        services: 'Service Provider',
        ecommerce: 'E-commerce',
        saas: 'SaaS',
        consulting: 'Consulting',
        retail: 'Retail',
        content: 'Content Creator',
        other: 'Other'
      },
      stages: {
        idea: 'Idea Stage',
        mvp: 'MVP Stage',
        early: 'Early Stage',
        growth: 'Growth Stage',
        established: 'Established'
      }
    },
    es: {
      profile: 'Perfil',
      back: 'Volver al Dashboard',
      edit: 'Editar Perfil',
      businessInfo: 'Información del Negocio',
      personalInfo: 'Información Personal',
      goals: 'Objetivos y Metas',
      fullName: 'Nombre Completo',
      businessModel: 'Modelo de Negocio',
      businessStage: 'Etapa Actual',
      maturityLevel: 'Nivel de Madurez',
      currentChannels: 'Canales de Venta',
      primaryGoals: 'Objetivos Principales',
      urgentNeeds: 'Necesidades Urgentes',
      monthlyGoal: 'Meta de Ingresos Mensuales',
      lastAssessment: 'Última Evaluación',
      businessModels: {
        artisan: 'Creador Artesanal',
        services: 'Proveedor de Servicios',
        ecommerce: 'E-commerce',
        saas: 'SaaS',
        consulting: 'Consultoría',
        retail: 'Comercio',
        content: 'Creador de Contenido',
        other: 'Otro'
      },
      stages: {
        idea: 'Etapa de Idea',
        mvp: 'Etapa MVP',
        early: 'Etapa Temprana',
        growth: 'Etapa de Crecimiento',
        established: 'Establecido'
      }
    }
  };

  const handleSaveProfile = (updatedProfile: Partial<UserBusinessProfile>) => {
    // Save profile updates to localStorage and/or database
    console.log('Saving profile updates:', updatedProfile);
    
    // Update localStorage
    const currentOnboarding = localStorage.getItem('onboarding-answers');
    if (currentOnboarding) {
      try {
        const data = JSON.parse(currentOnboarding);
        const updatedData = { ...data, ...updatedProfile };
        localStorage.setItem('onboarding-answers', JSON.stringify(updatedData));
      } catch (e) {
        console.error('Error updating onboarding data:', e);
      }
    }
    
    // Refresh the page to reload data
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Perfil no encontrado</h2>
            <p className="text-muted-foreground mb-4">
              Por favor, completa el onboarding primero.
            </p>
            <Button onClick={() => navigate('/onboarding')}>
              Ir al Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t[language].back}
            </Button>
            <h1 className="text-3xl font-bold">{t[language].profile}</h1>
          </div>
          
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Edit className="w-4 h-4 mr-2" />
            {t[language].edit}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {t[language].personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t[language].fullName}
                </label>
                <p className="text-lg">{businessProfile.fullName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t[language].lastAssessment}
                </label>
                <p>{new Date(businessProfile.lastAssessmentDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                {t[language].businessInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t[language].businessModel}
                </label>
                <p className="text-lg">
                  {t[language].businessModels[businessProfile.businessModel]}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t[language].businessStage}
                </label>
                <Badge variant="outline" className="ml-2">
                  {t[language].stages[businessProfile.businessStage]}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t[language].maturityLevel}
                </label>
                <p className="text-lg">{businessProfile.maturityLevel}/5</p>
              </div>
            </CardContent>
          </Card>

          {/* Sales Channels */}
          <Card>
            <CardHeader>
              <CardTitle>{t[language].currentChannels}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {businessProfile.currentChannels.map(channel => (
                  <Badge key={channel} variant="secondary">
                    {channel}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals & Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                {t[language].goals}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t[language].primaryGoals}
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {businessProfile.primaryGoals.map(goal => (
                    <Badge key={goal} variant="outline">
                      {goal.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {businessProfile.monthlyRevenueGoal && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t[language].monthlyGoal}
                  </label>
                  <p className="text-lg">
                    ${businessProfile.monthlyRevenueGoal.toLocaleString()}
                  </p>
                </div>
              )}

              {businessProfile.urgentNeeds.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t[language].urgentNeeds}
                  </label>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {businessProfile.urgentNeeds.map((need, index) => (
                      <li key={index} className="text-sm">{need}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Modal */}
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          businessProfile={businessProfile}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
};

export default Profile;