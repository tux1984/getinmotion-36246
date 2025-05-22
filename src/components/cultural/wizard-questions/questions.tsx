
import React from 'react';
import { QuestionConfig } from '../wizard-components/QuestionStep';
import { Music, Palette, Scissors, Theater, Calendar, User, Clock, DollarSign, CreditCard, BadgeCheck, Calculator, Users, MessageSquare, Smartphone, ListTodo, Check, X, Lightbulb, Brain } from 'lucide-react';

export const getQuestions = (language: 'en' | 'es'): Record<string, QuestionConfig> => {
  const t = {
    en: {
      // Profile questions
      industry: {
        title: "What's your creative field?",
        subtitle: "Tell us about your primary area of creative work"
      },
      activities: {
        title: "What activities do you do?",
        subtitle: "Select all that apply to your creative practice"
      },
      experience: {
        title: "How long have you been working in this field?",
        subtitle: "Tell us about your experience in your creative industry"
      },
      
      // Business questions
      paymentMethods: {
        title: "How do you get paid for your work?",
        subtitle: "Tell us about your payment methods"
      },
      brandIdentity: {
        title: "Do you have a defined brand or visual identity?",
        subtitle: "Tell us about your branding status"
      },
      financialControl: {
        title: "Do you have control over your income and expenses?",
        subtitle: "Tell us about your financial tracking"
      },
      
      // Management questions
      teamStructure: {
        title: "Do you work alone or with someone else?",
        subtitle: "Tell us about your team structure"
      },
      taskOrganization: {
        title: "Where do you organize your tasks or projects?",
        subtitle: "Tell us about your project management approach"
      },
      decisionMaking: {
        title: "Do you find it easy to make business decisions?",
        subtitle: "Tell us about your decision-making process"
      },
      
      // Analysis choice
      analysisChoice: {
        title: "Choose Your Path",
        subtitle: "How would you like to proceed with your assessment?"
      },
      
      // Detailed analysis questions
      pricingMethod: {
        title: "Who sets the prices for your creative work?",
        subtitle: "Tell us about your pricing strategy"
      },
      internationalSales: {
        title: "Do you sell your work internationally?",
        subtitle: "Tell us about your market reach"
      },
      formalizedBusiness: {
        title: "Is your creative practice a formal business entity?",
        subtitle: "Tell us about your legal structure"
      },
      collaboration: {
        title: "Do you collaborate with other creatives?",
        subtitle: "Tell us about your collaborative approach"
      },
      economicSustainability: {
        title: "Is your creative practice economically sustainable?",
        subtitle: "Tell us about your financial stability"
      }
    },
    es: {
      // Preguntas de perfil
      industry: {
        title: "¿Cuál es tu campo creativo?",
        subtitle: "Cuéntanos sobre tu área principal de trabajo creativo"
      },
      activities: {
        title: "¿Qué actividades realizas?",
        subtitle: "Selecciona todas las que apliquen a tu práctica creativa"
      },
      experience: {
        title: "¿Cuánto tiempo llevas trabajando en este campo?",
        subtitle: "Cuéntanos sobre tu experiencia en tu industria creativa"
      },
      
      // Preguntas de negocio
      paymentMethods: {
        title: "¿Cómo cobras por tu trabajo?",
        subtitle: "Cuéntanos sobre tus métodos de pago"
      },
      brandIdentity: {
        title: "¿Tienes una marca o identidad visual definida?",
        subtitle: "Cuéntanos sobre el estado de tu marca"
      },
      financialControl: {
        title: "¿Tienes control sobre tus ingresos y gastos?",
        subtitle: "Cuéntanos sobre tu seguimiento financiero"
      },
      
      // Preguntas de gestión
      teamStructure: {
        title: "¿Trabajas solo/a o con alguien más?",
        subtitle: "Cuéntanos sobre la estructura de tu equipo"
      },
      taskOrganization: {
        title: "¿Dónde organizas tus tareas o proyectos?",
        subtitle: "Cuéntanos sobre tu enfoque de gestión de proyectos"
      },
      decisionMaking: {
        title: "¿Te resulta fácil tomar decisiones de negocio?",
        subtitle: "Cuéntanos sobre tu proceso de toma de decisiones"
      },
      
      // Elección de análisis
      analysisChoice: {
        title: "Elige tu Camino",
        subtitle: "¿Cómo te gustaría continuar con tu evaluación?"
      },
      
      // Preguntas de análisis detallado
      pricingMethod: {
        title: "¿Quién establece los precios de tu trabajo creativo?",
        subtitle: "Cuéntanos sobre tu estrategia de precios"
      },
      internationalSales: {
        title: "¿Vendes tu trabajo internacionalmente?",
        subtitle: "Cuéntanos sobre tu alcance de mercado"
      },
      formalizedBusiness: {
        title: "¿Tu práctica creativa es una entidad de negocio formal?",
        subtitle: "Cuéntanos sobre tu estructura legal"
      },
      collaboration: {
        title: "¿Colaboras con otros creativos?",
        subtitle: "Cuéntanos sobre tu enfoque colaborativo"
      },
      economicSustainability: {
        title: "¿Es económicamente sostenible tu práctica creativa?",
        subtitle: "Cuéntanos sobre tu estabilidad financiera"
      }
    }
  };
  
  return {
    industry: {
      id: 'industry',
      type: 'icon-select',
      title: t[language].industry.title,
      subtitle: t[language].industry.subtitle,
      fieldName: 'industry',
      options: [
        { id: 'music', label: language === 'en' ? 'Music' : 'Música', icon: <Music className="w-8 h-8 text-purple-500" /> },
        { id: 'visual_arts', label: language === 'en' ? 'Visual Arts' : 'Artes Visuales', icon: <Palette className="w-8 h-8 text-indigo-500" /> },
        { id: 'crafts', label: language === 'en' ? 'Crafts' : 'Artesanía', icon: <Scissors className="w-8 h-8 text-blue-500" /> },
        { id: 'theater', label: language === 'en' ? 'Theater & Dance' : 'Teatro y Danza', icon: <Theater className="w-8 h-8 text-pink-500" /> },
        { id: 'events', label: language === 'en' ? 'Events & Festivals' : 'Eventos y Festivales', icon: <Calendar className="w-8 h-8 text-amber-500" /> },
        { id: 'other', label: language === 'en' ? 'Other Creative Field' : 'Otro Campo Creativo', icon: <User className="w-8 h-8 text-green-500" /> }
      ]
    },
    
    activities: {
      id: 'activities',
      type: 'checkbox',
      title: t[language].activities.title,
      subtitle: t[language].activities.subtitle,
      fieldName: 'activities',
      options: [
        { id: 'create', label: language === 'en' ? 'Creating art/products' : 'Crear arte/productos' },
        { id: 'selling-in-person', label: language === 'en' ? 'Selling in person (fairs, markets)' : 'Vender en persona (ferias, mercados)' },
        { id: 'selling-online', label: language === 'en' ? 'Selling online' : 'Vender online' },
        { id: 'classes', label: language === 'en' ? 'Teaching classes or workshops' : 'Dar clases o talleres' },
        { id: 'services', label: language === 'en' ? 'Offering creative services' : 'Ofrecer servicios creativos' },
        { id: 'export', label: language === 'en' ? 'Exporting or selling abroad' : 'Exportar o vender en el extranjero' }
      ]
    },
    
    experience: {
      id: 'experience',
      type: 'radio',
      title: t[language].experience.title,
      subtitle: t[language].experience.subtitle,
      fieldName: 'experience',
      options: [
        { id: 'less-than-6-months', label: language === 'en' ? 'Less than 6 months' : 'Menos de 6 meses', icon: <Clock className="w-6 h-6 text-red-500" /> },
        { id: '6-months-to-2-years', label: language === 'en' ? '6 months to 2 years' : 'De 6 meses a 2 años', icon: <Clock className="w-6 h-6 text-amber-500" /> },
        { id: 'more-than-2-years', label: language === 'en' ? 'More than 2 years' : 'Más de 2 años', icon: <Clock className="w-6 h-6 text-green-500" /> }
      ]
    },
    
    paymentMethods: {
      id: 'paymentMethods',
      type: 'radio',
      title: t[language].paymentMethods.title,
      subtitle: t[language].paymentMethods.subtitle,
      fieldName: 'paymentMethods',
      options: [
        { id: 'cash-or-transfer', label: language === 'en' ? 'Cash or bank transfers only' : 'Solo efectivo o transferencias', icon: <DollarSign className="w-6 h-6 text-blue-500" /> },
        { id: 'digital-platforms', label: language === 'en' ? 'Digital platforms' : 'Plataformas digitales', icon: <CreditCard className="w-6 h-6 text-indigo-500" /> },
        { id: 'billing-system', label: language === 'en' ? 'I have a billing system' : 'Tengo sistema de facturación', icon: <CreditCard className="w-6 h-6 text-purple-500" /> },
        { id: 'managed-by-others', label: language === 'en' ? 'Others manage payments for me' : 'Cobran otros por mí', icon: <CreditCard className="w-6 h-6 text-violet-500" /> }
      ]
    },
    
    brandIdentity: {
      id: 'brandIdentity',
      type: 'radio',
      title: t[language].brandIdentity.title,
      subtitle: t[language].brandIdentity.subtitle,
      fieldName: 'brandIdentity',
      options: [
        { id: 'yes', label: language === 'en' ? 'Yes, completely' : 'Sí, totalmente', icon: <BadgeCheck className="w-6 h-6 text-emerald-500" /> },
        { id: 'somewhat', label: language === 'en' ? 'I have something' : 'Algo tengo', icon: <BadgeCheck className="w-6 h-6 text-amber-500" /> },
        { id: 'no', label: language === 'en' ? 'No, I use whatever works' : 'No, uso lo que sale', icon: <BadgeCheck className="w-6 h-6 text-gray-400" /> }
      ]
    },
    
    financialControl: {
      id: 'financialControl',
      type: 'radio',
      title: t[language].financialControl.title,
      subtitle: t[language].financialControl.subtitle,
      fieldName: 'financialControl',
      options: [
        { id: 'detailed', label: language === 'en' ? 'Yes, detailed' : 'Sí, detallado', icon: <Calculator className="w-6 h-6 text-emerald-500" /> },
        { id: 'somewhat', label: language === 'en' ? 'More or less' : 'Más o menos', icon: <Calculator className="w-6 h-6 text-amber-500" /> },
        { id: 'intuition', label: language === 'en' ? 'I go by intuition' : 'Me guío por intuición', icon: <Calculator className="w-6 h-6 text-gray-400" /> }
      ]
    },
    
    teamStructure: {
      id: 'teamStructure',
      type: 'radio',
      title: t[language].teamStructure.title,
      subtitle: t[language].teamStructure.subtitle,
      fieldName: 'teamStructure',
      options: [
        { id: 'alone', label: language === 'en' ? 'Completely alone' : 'Completamente solo/a', icon: <Users className="w-6 h-6 text-blue-500" /> },
        { id: 'occasional', label: language === 'en' ? 'Someone helps me occasionally' : 'Me ayuda alguien a veces', icon: <Users className="w-6 h-6 text-indigo-500" /> },
        { id: 'team', label: language === 'en' ? 'I have someone permanent or a team' : 'Tengo alguien fijo o un equipo', icon: <Users className="w-6 h-6 text-purple-500" /> }
      ]
    },
    
    taskOrganization: {
      id: 'taskOrganization',
      type: 'radio',
      title: t[language].taskOrganization.title,
      subtitle: t[language].taskOrganization.subtitle,
      fieldName: 'taskOrganization',
      options: [
        { id: 'paper', label: language === 'en' ? 'Paper or memory' : 'Papel o memoria', icon: <ListTodo className="w-6 h-6 text-amber-500" /> },
        { id: 'messaging', label: language === 'en' ? 'WhatsApp' : 'WhatsApp', icon: <MessageSquare className="w-6 h-6 text-green-500" /> },
        { id: 'digital-tools', label: language === 'en' ? 'Digital tools (Notion, Trello, Excel)' : 'Herramientas digitales', icon: <Smartphone className="w-6 h-6 text-indigo-500" /> }
      ]
    },
    
    decisionMaking: {
      id: 'decisionMaking',
      type: 'radio',
      title: t[language].decisionMaking.title,
      subtitle: t[language].decisionMaking.subtitle,
      fieldName: 'decisionMaking',
      options: [
        { id: 'yes', label: language === 'en' ? 'Yes' : 'Sí', icon: <Check className="w-6 h-6 text-emerald-500" /> },
        { id: 'sometimes', label: language === 'en' ? 'Sometimes' : 'A veces', icon: <Check className="w-6 h-6 text-amber-500" /> },
        { id: 'no', label: language === 'en' ? 'No' : 'No', icon: <X className="w-6 h-6 text-red-500" /> }
      ]
    },
    
    analysisChoice: {
      id: 'analysisChoice',
      type: 'radio',
      title: t[language].analysisChoice.title,
      subtitle: t[language].analysisChoice.subtitle,
      fieldName: 'analysisPreference',
      options: [
        { 
          id: 'quick', 
          label: language === 'en' ? 'Quick Recommendation' : 'Recomendación Rápida', 
          icon: <Lightbulb className="w-6 h-6 text-indigo-600" /> 
        },
        { 
          id: 'detailed', 
          label: language === 'en' ? 'Detailed Analysis' : 'Análisis Detallado', 
          icon: <Brain className="w-6 h-6 text-purple-600" /> 
        }
      ]
    },
    
    // Detailed analysis questions
    pricingMethod: {
      id: 'pricingMethod',
      type: 'radio',
      title: t[language].pricingMethod.title,
      subtitle: t[language].pricingMethod.subtitle,
      fieldName: 'pricingMethod',
      options: [
        { id: 'myself', label: language === 'en' ? 'I set my own prices' : 'Yo fijo mis precios' },
        { id: 'client', label: language === 'en' ? 'The client dictates the price' : 'El cliente dicta el precio' },
        { id: 'market', label: language === 'en' ? 'I follow market rates' : 'Sigo las tarifas del mercado' }
      ]
    },
    
    internationalSales: {
      id: 'internationalSales',
      type: 'radio',
      title: t[language].internationalSales.title,
      subtitle: t[language].internationalSales.subtitle,
      fieldName: 'internationalSales',
      options: [
        { id: 'yes', label: language === 'en' ? 'Yes' : 'Sí' },
        { id: 'no', label: language === 'en' ? 'No' : 'No' },
        { id: 'planning', label: language === 'en' ? 'Planning to' : 'Planeo hacerlo' }
      ]
    },
    
    formalizedBusiness: {
      id: 'formalizedBusiness',
      type: 'radio',
      title: t[language].formalizedBusiness.title,
      subtitle: t[language].formalizedBusiness.subtitle,
      fieldName: 'formalizedBusiness',
      options: [
        { id: 'yes', label: language === 'en' ? 'Yes' : 'Sí' },
        { id: 'no', label: language === 'en' ? 'No' : 'No' },
        { id: 'in-process', label: language === 'en' ? 'In the process' : 'En proceso' }
      ]
    },
    
    collaboration: {
      id: 'collaboration',
      type: 'radio',
      title: t[language].collaboration.title,
      subtitle: t[language].collaboration.subtitle,
      fieldName: 'collaboration',
      options: [
        { id: 'yes', label: language === 'en' ? 'Yes, regularly' : 'Sí, regularmente' },
        { id: 'sometimes', label: language === 'en' ? 'Sometimes' : 'A veces' },
        { id: 'no', label: language === 'en' ? 'No' : 'No' }
      ]
    },
    
    economicSustainability: {
      id: 'economicSustainability',
      type: 'radio',
      title: t[language].economicSustainability.title,
      subtitle: t[language].economicSustainability.subtitle,
      fieldName: 'economicSustainability',
      options: [
        { id: 'yes', label: language === 'en' ? 'Yes' : 'Sí' },
        { id: 'partially', label: language === 'en' ? 'Partially' : 'Parcialmente' },
        { id: 'no', label: language === 'en' ? 'No' : 'No' }
      ]
    }
  };
};
