import React from 'react';
import { Button } from '@/components/ui/button';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { CheckCircle, Sparkles, ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

interface OnboardingCompletionScreenProps {
  maturityScores: CategoryScore;
  recommendedAgents: RecommendedAgents;
  profileData: any;
  language: 'en' | 'es';
  onStartPersonalizedPlan: () => void;
}

export const OnboardingCompletionScreen: React.FC<OnboardingCompletionScreenProps> = ({
  maturityScores,
  recommendedAgents,
  profileData,
  language,
  onStartPersonalizedPlan
}) => {
  const translations = {
    en: {
      title: 'Analysis Complete!',
      subtitle: 'Here\'s what we learned about your creative business',
      insights: 'Key Insights',
      tasksWillStart: 'Tasks We\'ll Activate',
      agentsAssigned: 'Agents That Will Accompany You',
      reasonWhy: 'Why These Recommendations?',
      startPlan: 'Start My Personalized Plan',
      maturityLevel: 'Your Current Maturity Level'
    },
    es: {
      title: '¡Análisis Completo!',
      subtitle: 'Ya analizamos tu situación. Estas son las tareas que vamos a iniciar, y estos son los agentes que te van a acompañar.',
      insights: 'Principales Aprendizajes',
      tasksWillStart: 'Tareas que Vamos a Activar',
      agentsAssigned: 'Agentes que te Acompañarán',
      reasonWhy: '¿Por qué Estas Recomendaciones?',
      startPlan: 'Comenzar Mi Plan Personalizado',
      maturityLevel: 'Tu Nivel Actual de Madurez'
    }
  };

  const t = translations[language];

  const getMaturityLevel = () => {
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    if (average >= 70) return { level: language === 'en' ? 'Advanced' : 'Avanzado', percentage: average, color: 'from-green-500 to-emerald-500' };
    if (average >= 40) return { level: language === 'en' ? 'Intermediate' : 'Intermedio', percentage: average, color: 'from-blue-500 to-cyan-500' };
    return { level: language === 'en' ? 'Beginner' : 'Principiante', percentage: average, color: 'from-purple-500 to-pink-500' };
  };

  const maturityLevel = getMaturityLevel();

  const getPersonalizedInsights = () => {
    const insights = [];
    
    if (profileData.workingAlone) {
      insights.push(language === 'es' 
        ? 'Trabajas solo, por lo que te asignaremos agentes de gestión y organización'
        : 'You work alone, so we\'ll assign management and organization agents'
      );
    }

    if (maturityScores.monetization < 30) {
      insights.push(language === 'es'
        ? 'Tu monetización necesita refuerzo - activaremos agentes financieros'
        : 'Your monetization needs reinforcement - we\'ll activate financial agents'
      );
    }

    if (maturityScores.marketFit < 30) {
      insights.push(language === 'es'
        ? 'Te ayudaremos a validar mejor tu encaje de mercado'
        : 'We\'ll help you better validate your market fit'
      );
    }

    return insights;
  };

  const getTasksToActivate = () => {
    const tasks = [];
    
    if (maturityScores.monetization < 40) {
      tasks.push(language === 'es' ? 'Configurar sistema de precios y costos' : 'Set up pricing and cost system');
    }
    
    if (maturityScores.userExperience < 40) {
      tasks.push(language === 'es' ? 'Mejorar propuesta de valor al cliente' : 'Improve customer value proposition');
    }
    
    if (maturityScores.marketFit < 40) {
      tasks.push(language === 'es' ? 'Validar encaje de mercado' : 'Validate market fit');
    }

    return tasks;
  };

  const getAssignedAgents = () => {
    const agents = [];
    
    if (recommendedAgents.admin) {
      agents.push({ name: language === 'es' ? 'Agente Administrativo' : 'Administrative Agent', reason: language === 'es' ? 'Para organizar tu negocio' : 'To organize your business' });
    }
    
    if (recommendedAgents.cultural) {
      agents.push({ name: language === 'es' ? 'Especialista Creativo' : 'Creative Specialist', reason: language === 'es' ? 'Para validar tus ideas' : 'To validate your ideas' });
    }
    
    if (recommendedAgents.accounting) {
      agents.push({ name: language === 'es' ? 'Agente Financiero' : 'Financial Agent', reason: language === 'es' ? 'Para manejar finanzas' : 'To handle finances' });
    }

    return agents;
  };

  const insights = getPersonalizedInsights();
  const tasks = getTasksToActivate();
  const agents = getAssignedAgents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Maturity Level Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
            {t.maturityLevel}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">{maturityLevel.level}</span>
                <span className="text-gray-600">{Math.round(maturityLevel.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${maturityLevel.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${maturityLevel.percentage}%` }}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-700">{Math.round(maturityLevel.percentage)}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Key Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              {t.insights}
            </h3>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tasks to Activate */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              {t.tasksWillStart}
            </h3>
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Assigned Agents */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-pink-500" />
              {t.agentsAssigned}
            </h3>
            <ul className="space-y-3">
              {agents.map((agent, index) => (
                <li key={index} className="border-l-2 border-pink-200 pl-3">
                  <div className="font-medium text-sm text-gray-900">{agent.name}</div>
                  <div className="text-xs text-gray-600">{agent.reason}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reason Why */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">{t.reasonWhy}</h3>
          <p className="text-purple-800">
            {language === 'es' 
              ? `Como dijiste que ${profileData.workingAlone ? 'trabajas solo' : 'trabajas en equipo'} ${maturityScores.monetization < 30 ? 'y te cuesta llevar los pagos al día' : ''}, vamos a activar estos agentes específicos para ayudarte en esas áreas.`
              : `Since you mentioned that you ${profileData.workingAlone ? 'work alone' : 'work in a team'} ${maturityScores.monetization < 30 ? 'and struggle with payments' : ''}, we'll activate these specific agents to help you in those areas.`
            }
          </p>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={onStartPersonalizedPlan}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t.startPlan}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};