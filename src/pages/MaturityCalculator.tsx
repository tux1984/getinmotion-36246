import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, Gauge } from 'lucide-react';
import { ProgressBar } from '@/components/maturity/ProgressBar';
import { getQuestions } from '@/components/maturity/getQuestions';
import { QuestionCard } from '@/components/maturity/QuestionCard';
import { CompletionScreen } from '@/components/maturity/CompletionScreen';
import { MaturityResults } from '@/components/maturity/MaturityResults';
import { Link } from 'react-router-dom';
import { CalculatorStep, Language, ProfileType, CategoryScore } from '@/components/maturity/types';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Sample agent data (this would come from your backend in a real application)
const sampleAgents = [
  {
    id: "agent1",
    name: "Vision Copilot",
    description: "Helps you define and refine your project vision",
    icon: "🧠",
    category: "planning",
    recommended: true
  },
  {
    id: "agent2",
    name: "Audience Analyzer",
    description: "Identifies and understands your target audience",
    icon: "👥",
    category: "research",
    recommended: true
  },
  {
    id: "agent3",
    name: "Schedule Manager",
    description: "Organizes your calendar and manages deadlines",
    icon: "📅",
    category: "productivity",
    recommended: true
  },
  {
    id: "agent4",
    name: "Content Creator",
    description: "Helps generate and optimize content",
    icon: "✍️",
    category: "content",
    recommended: false
  },
  {
    id: "agent5",
    name: "Financial Advisor",
    description: "Manages budget and financial planning",
    icon: "💰",
    category: "finance",
    recommended: false
  },
  {
    id: "agent6",
    name: "Marketing Assistant",
    description: "Develops and executes marketing strategies",
    icon: "📢",
    category: "marketing",
    recommended: false
  }
];

// Artisan types for the initialization step
const artisanTypes = {
  en: [
    { value: 'visual', label: 'Visual Artist (painting, photography, etc.)' },
    { value: 'craft', label: 'Craftsperson (ceramics, jewelry, etc.)' },
    { value: 'textile', label: 'Textile Artist (weaving, embroidery, etc.)' },
    { value: 'culinary', label: 'Culinary Artist (chef, baker, etc.)' },
    { value: 'digital', label: 'Digital Creator (design, illustration, etc.)' },
    { value: 'performing', label: 'Performing Artist (music, dance, etc.)' },
    { value: 'other', label: 'Other' }
  ],
  es: [
    { value: 'visual', label: 'Artista Visual (pintura, fotografía, etc.)' },
    { value: 'craft', label: 'Artesano (cerámica, joyería, etc.)' },
    { value: 'textile', label: 'Artista Textil (tejeduría, bordado, etc.)' },
    { value: 'culinary', label: 'Artista Culinario (chef, panadero, etc.)' },
    { value: 'digital', label: 'Creador Digital (diseño, ilustración, etc.)' },
    { value: 'performing', label: 'Artista Escénico (música, danza, etc.)' },
    { value: 'other', label: 'Otro' }
  ]
};

// Questions for enhanced maturity assessment
const enhancedQuestions = {
  ideaValidation: {
    en: [
      {
        id: 'concept',
        question: "How clear is your product/service concept?",
        options: [
          { id: 'concept-1', value: 1, text: "Just a vague idea" },
          { id: 'concept-2', value: 2, text: "Basic concept with some details" },
          { id: 'concept-3', value: 3, text: "Well-defined concept with clear features" }
        ]
      },
      {
        id: 'validation',
        question: "Have you validated your idea with potential customers?",
        options: [
          { id: 'validation-1', value: 1, text: "No validation yet" },
          { id: 'validation-2', value: 2, text: "Informal feedback from friends/family" },
          { id: 'validation-3', value: 3, text: "Structured feedback from target audience" }
        ]
      }
    ],
    es: [
      {
        id: 'concept',
        question: "¿Qué tan claro es el concepto de tu producto/servicio?",
        options: [
          { id: 'concept-1', value: 1, text: "Solo una idea vaga" },
          { id: 'concept-2', value: 2, text: "Concepto básico con algunos detalles" },
          { id: 'concept-3', value: 3, text: "Concepto bien definido con características claras" }
        ]
      },
      {
        id: 'validation',
        question: "¿Has validado tu idea con clientes potenciales?",
        options: [
          { id: 'validation-1', value: 1, text: "Sin validación aún" },
          { id: 'validation-2', value: 2, text: "Comentarios informales de amigos/familia" },
          { id: 'validation-3', value: 3, text: "Comentarios estructurados del público objetivo" }
        ]
      }
    ]
  },
  userExperience: {
    en: [
      {
        id: 'ux',
        question: "How developed is your product's user experience?",
        options: [
          { id: 'ux-1', value: 1, text: "Not considered yet" },
          { id: 'ux-2', value: 2, text: "Basic consideration of user needs" },
          { id: 'ux-3', value: 3, text: "Designed with user feedback" }
        ]
      },
      {
        id: 'brand',
        question: "Do you have a consistent brand identity?",
        options: [
          { id: 'brand-1', value: 1, text: "No brand elements yet" },
          { id: 'brand-2', value: 2, text: "Basic logo and colors" },
          { id: 'brand-3', value: 3, text: "Comprehensive brand guidelines" }
        ]
      }
    ],
    es: [
      {
        id: 'ux',
        question: "¿Qué tan desarrollada está la experiencia de usuario de tu producto?",
        options: [
          { id: 'ux-1', value: 1, text: "Aún no considerada" },
          { id: 'ux-2', value: 2, text: "Consideración básica de las necesidades del usuario" },
          { id: 'ux-3', value: 3, text: "Diseñada con retroalimentación de usuarios" }
        ]
      },
      {
        id: 'brand',
        question: "¿Tienes una identidad de marca consistente?",
        options: [
          { id: 'brand-1', value: 1, text: "Aún sin elementos de marca" },
          { id: 'brand-2', value: 2, text: "Logo y colores básicos" },
          { id: 'brand-3', value: 3, text: "Guías de marca comprensivas" }
        ]
      }
    ]
  },
  marketFit: {
    en: [
      {
        id: 'target',
        question: "How well do you understand your target market?",
        options: [
          { id: 'target-1', value: 1, text: "General idea of potential customers" },
          { id: 'target-2', value: 2, text: "Basic customer segments identified" },
          { id: 'target-3', value: 3, text: "Detailed customer personas" }
        ]
      },
      {
        id: 'competition',
        question: "Have you identified your competitive advantage?",
        options: [
          { id: 'competition-1', value: 1, text: "No clear differentiation" },
          { id: 'competition-2', value: 2, text: "Some unique selling points" },
          { id: 'competition-3', value: 3, text: "Strong competitive advantage" }
        ]
      }
    ],
    es: [
      {
        id: 'target',
        question: "¿Qué tan bien entiendes tu mercado objetivo?",
        options: [
          { id: 'target-1', value: 1, text: "Idea general de clientes potenciales" },
          { id: 'target-2', value: 2, text: "Segmentos básicos de clientes identificados" },
          { id: 'target-3', value: 3, text: "Perfiles detallados de clientes" }
        ]
      },
      {
        id: 'competition',
        question: "¿Has identificado tu ventaja competitiva?",
        options: [
          { id: 'competition-1', value: 1, text: "Sin diferenciación clara" },
          { id: 'competition-2', value: 2, text: "Algunos puntos de venta únicos" },
          { id: 'competition-3', value: 3, text: "Ventaja competitiva fuerte" }
        ]
      }
    ]
  },
  monetization: {
    en: [
      {
        id: 'business',
        question: "How developed is your business model?",
        options: [
          { id: 'business-1', value: 1, text: "No clear revenue strategy" },
          { id: 'business-2', value: 2, text: "Basic pricing model" },
          { id: 'business-3', value: 3, text: "Multiple revenue streams" }
        ]
      },
      {
        id: 'finance',
        question: "What is the current state of your financial planning?",
        options: [
          { id: 'finance-1', value: 1, text: "No financial projections" },
          { id: 'finance-2', value: 2, text: "Basic cost estimates" },
          { id: 'finance-3', value: 3, text: "Detailed financial model" }
        ]
      }
    ],
    es: [
      {
        id: 'business',
        question: "¿Qué tan desarrollado está tu modelo de negocio?",
        options: [
          { id: 'business-1', value: 1, text: "Sin estrategia clara de ingresos" },
          { id: 'business-2', value: 2, text: "Modelo básico de precios" },
          { id: 'business-3', value: 3, text: "Múltiples fuentes de ingresos" }
        ]
      },
      {
        id: 'finance',
        question: "¿Cuál es el estado actual de tu planificación financiera?",
        options: [
          { id: 'finance-1', value: 1, text: "Sin proyecciones financieras" },
          { id: 'finance-2', value: 2, text: "Estimaciones básicas de costos" },
          { id: 'finance-3', value: 3, text: "Modelo financiero detallado" }
        ]
      }
    ]
  }
};

const getEnhancedCategoryQuestions = (category: keyof typeof enhancedQuestions, language: Language) => {
  return enhancedQuestions[category][language];
};

const MaturityCalculator = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CalculatorStep>('start');
  const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
  const [basicQuestions, setBasicQuestions] = useState(getQuestions(language));
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showMaturityResults, setShowMaturityResults] = useState(false);
  const [maturityScores, setMaturityScores] = useState<CategoryScore>({
    ideaValidation: 0,
    userExperience: 0,
    marketFit: 0,
    monetization: 0
  });
  const [progress, setProgress] = useState(0);
  const [currentCategoryQuestions, setCurrentCategoryQuestions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState({
    artisanType: '',
    projectDescription: '',
    businessName: ''
  });

  const t = {
    en: {
      title: "Project Maturity Calculator",
      subtitle: "Evaluate your project's maturity level and get personalized recommendations",
      startQuestion: "Do you already have a project or business?",
      yes: "Yes, I want to evaluate my existing project",
      no: "No, I need help defining my business idea",
      next: "Next",
      back: "Back",
      complete: "Complete",
      skip: "Skip this step",
      pleaseSelect: "Please select an option",
      pleaseSelectMessage: "Select whether you have an existing project or need help defining your idea",
      initialization: "Let's Define Your Project",
      artisanType: "What type of artisan are you?",
      projectDescription: "Describe your project or business idea in a few sentences:",
      businessName: "What is your name or business name?",
      selectType: "Select type",
      describePlaceholder: "Describe your project or idea...",
      namePlaceholder: "Your name or business name",
      missingInfo: "Missing information",
      missingInfoMsg: "Please fill all fields before continuing",
      ideaValidation: "Idea Validation",
      userExperience: "User Experience",
      marketFit: "Market Fit",
      monetization: "Monetization",
      evaluationTitle: "Project Evaluation",
      evaluationDesc: "Let's assess your project's current maturity level",
      finalStep: "Final Step",
      invalidAnswers: "Please answer all questions before continuing",
      backToHome: "Back to Home",
      toDashboard: "Go to Dashboard",
      progressText: "Step %current% of %total%"
    },
    es: {
      title: "Calculadora de Madurez del Proyecto",
      subtitle: "Evalúa el nivel de madurez de tu proyecto y obtén recomendaciones personalizadas",
      startQuestion: "¿Ya tienes un proyecto o negocio?",
      yes: "Sí, quiero evaluar mi proyecto existente",
      no: "No, necesito ayuda para definir mi idea de negocio",
      next: "Siguiente",
      back: "Atrás",
      complete: "Completar",
      skip: "Omitir este paso",
      pleaseSelect: "Por favor haz una selección",
      pleaseSelectMessage: "Selecciona si tienes un proyecto existente o necesitas ayuda para definir tu idea",
      initialization: "Definamos Tu Proyecto",
      artisanType: "¿Qué tipo de artesano eres?",
      projectDescription: "Describe tu proyecto o idea de negocio en unas pocas frases:",
      businessName: "¿Cuál es tu nombre o el nombre de tu negocio?",
      selectType: "Seleccionar tipo",
      describePlaceholder: "Describe tu proyecto o idea...",
      namePlaceholder: "Tu nombre o nombre del negocio",
      missingInfo: "Información faltante",
      missingInfoMsg: "Por favor completa todos los campos antes de continuar",
      ideaValidation: "Validación de Idea",
      userExperience: "Experiencia de Usuario",
      marketFit: "Ajuste al Mercado",
      monetización: "Monetización",
      evaluationTitle: "Evaluación del Proyecto",
      evaluationDesc: "Vamos a evaluar el nivel actual de madurez de tu proyecto",
      finalStep: "Último Paso",
      invalidAnswers: "Por favor responde todas las preguntas antes de continuar",
      backToHome: "Volver al Inicio",
      toDashboard: "Ir al Dashboard",
      progressText: "Paso %current% de %total%"
    }
  };

  // Update progress based on current step
  React.useEffect(() => {
    let totalSteps = 0;
    let currentStepNumber = 0;

    if (userProfile === null) {
      totalSteps = 1;
      currentStepNumber = 1;
    } else if (userProfile) {
      // For existing project path
      totalSteps = 5; // start + 4 categories
      
      switch (currentStep) {
        case 'start': currentStepNumber = 1; break;
        case 'ideaValidation': currentStepNumber = 2; break;
        case 'userExperience': currentStepNumber = 3; break;
        case 'marketFit': currentStepNumber = 4; break;
        case 'monetization': currentStepNumber = 5; break;
        case 'results': currentStepNumber = 5; break;
        default: currentStepNumber = 1;
      }
    } else {
      // For new idea path
      totalSteps = 2; // start + initialization
      
      switch (currentStep) {
        case 'start': currentStepNumber = 1; break;
        case 'initialization': currentStepNumber = 2; break;
        case 'results': currentStepNumber = 2; break;
        default: currentStepNumber = 1;
      }
    }

    setProgress(Math.round((currentStepNumber / totalSteps) * 100));

    // Update current category questions when step changes
    if (['ideaValidation', 'userExperience', 'marketFit', 'monetization'].includes(currentStep)) {
      setCurrentCategoryQuestions(getEnhancedCategoryQuestions(currentStep as keyof typeof enhancedQuestions, language));
    }
  }, [currentStep, userProfile, language]);

  const handleSelectProfile = (profile: ProfileType | null) => {
    setUserProfile(profile);
  };

  const handleSelectOption = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 'start') {
      if (userProfile === null) {
        toast({
          title: t[language].pleaseSelect,
          description: t[language].pleaseSelectMessage,
          variant: "destructive"
        });
        return;
      }
      
      if (userProfile) {
        setCurrentStep('ideaValidation');
      } else {
        setCurrentStep('initialization');
      }
      return;
    }

    if (currentStep === 'initialization') {
      if (!userDetails.artisanType || !userDetails.projectDescription || !userDetails.businessName) {
        toast({
          title: t[language].missingInfo,
          description: t[language].missingInfoMsg,
          variant: "destructive"
        });
        return;
      }
      
      // Generate basic scores for new projects
      const newScores = {
        ideaValidation: 20, // Starting point for a new idea
        userExperience: 10,
        marketFit: 15,
        monetization: 5
      };
      
      setMaturityScores(newScores);
      setShowMaturityResults(true);
      setCurrentStep('results');
      return;
    }

    // Handle category questions
    if (['ideaValidation', 'userExperience', 'marketFit', 'monetization'].includes(currentStep)) {
      // Check if all questions in this step are answered
      const currentQuestions = getEnhancedCategoryQuestions(currentStep as keyof typeof enhancedQuestions, language);
      const allAnswered = currentQuestions.every(q => answers[q.id] !== undefined);
      
      if (!allAnswered) {
        toast({
          title: t[language].invalidAnswers,
          variant: "destructive"
        });
        return;
      }
      
      // Calculate score for current category
      const calculateCategoryScore = () => {
        const questions = getEnhancedCategoryQuestions(currentStep as keyof typeof enhancedQuestions, language);
        const maxPossibleScore = questions.length * 3; // 3 is max value
        const totalScore = questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
        return Math.round((totalScore / maxPossibleScore) * 100);
      };
      
      // Move to next category or results
      if (currentStep === 'ideaValidation') {
        setMaturityScores(prev => ({ ...prev, ideaValidation: calculateCategoryScore() }));
        setCurrentStep('userExperience');
      } else if (currentStep === 'userExperience') {
        setMaturityScores(prev => ({ ...prev, userExperience: calculateCategoryScore() }));
        setCurrentStep('marketFit');
      } else if (currentStep === 'marketFit') {
        setMaturityScores(prev => ({ ...prev, marketFit: calculateCategoryScore() }));
        setCurrentStep('monetization');
      } else if (currentStep === 'monetization') {
        setMaturityScores(prev => ({ ...prev, monetization: calculateCategoryScore() }));
        setShowMaturityResults(true);
        setCurrentStep('results');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'initialization' || currentStep === 'ideaValidation') {
      setCurrentStep('start');
    } else if (currentStep === 'userExperience') {
      setCurrentStep('ideaValidation');
    } else if (currentStep === 'marketFit') {
      setCurrentStep('userExperience');
    } else if (currentStep === 'monetization') {
      setCurrentStep('marketFit');
    } else if (currentStep === 'results') {
      setShowMaturityResults(false);
      if (userProfile === 'idea' || userProfile === 'solo' || userProfile === 'team') {
        setCurrentStep('monetization');
      } else {
        setCurrentStep('initialization');
      }
    }
  };

  const renderStartStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">{t[language].startQuestion}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            type="button"
            variant={userProfile === 'idea' ? "default" : "outline"}
            className={`h-auto py-6 px-4 ${userProfile === 'idea' ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleSelectProfile('idea')}
          >
            <div className="text-left">
              <div className="font-medium">{t[language].yes}</div>
            </div>
          </Button>
          
          <Button
            type="button"
            variant={userProfile === 'solo' ? "default" : "outline"}
            className={`h-auto py-6 px-4 ${userProfile === 'solo' ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleSelectProfile('solo')}
          >
            <div className="text-left">
              <div className="font-medium">{t[language].no}</div>
            </div>
          </Button>
        </div>
      </div>
    );
  };

  const renderInitializationStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">{t[language].initialization}</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t[language].artisanType}</label>
            <select 
              value={userDetails.artisanType}
              onChange={(e) => setUserDetails(prev => ({ ...prev, artisanType: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">{t[language].selectType}</option>
              {artisanTypes[language].map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t[language].projectDescription}</label>
            <textarea 
              value={userDetails.projectDescription}
              onChange={(e) => setUserDetails(prev => ({ ...prev, projectDescription: e.target.value }))}
              placeholder={t[language].describePlaceholder}
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t[language].businessName}</label>
            <input 
              type="text"
              value={userDetails.businessName}
              onChange={(e) => setUserDetails(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder={t[language].namePlaceholder}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">
          {currentStep === 'monetization' 
            ? t[language].finalStep 
            : t[language].evaluationTitle}
        </h3>

        <div className="space-y-6">
          {currentCategoryQuestions.map((q, index) => (
            <div key={index} className="space-y-3">
              <label className="text-base font-medium">{q.question}</label>
              <div className="space-y-2">
                {q.options.map((option: any) => (
                  <div 
                    key={option.id}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${answers[q.id] === option.value 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-200'}`}
                    onClick={() => handleSelectOption(q.id, option.value)}
                  >
                    <input 
                      type="radio"
                      id={option.id}
                      checked={answers[q.id] === option.value}
                      onChange={() => handleSelectOption(q.id, option.value)}
                      className="mr-3"
                    />
                    <label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </label>
                    {answers[q.id] === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'start':
        return renderStartStep();
      case 'initialization':
        return renderInitializationStep();
      case 'ideaValidation':
      case 'userExperience':
      case 'marketFit':
      case 'monetization':
        return renderCategoryStep();
      case 'results':
        return (
          <MaturityResults 
            language={language}
            score={Object.values(maturityScores).reduce((acc, val) => acc + val, 0) / 4}
            profileType={userProfile ? 'idea' : 'team'}
            agents={sampleAgents}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    if (currentStep === 'start') return t[language].title;
    if (currentStep === 'initialization') return t[language].initialization;
    if (currentStep === 'ideaValidation') return t[language].ideaValidation;
    if (currentStep === 'userExperience') return t[language].userExperience;
    if (currentStep === 'marketFit') return t[language].marketFit;
    if (currentStep === 'monetization') return t[language].monetización;
    if (currentStep === 'results') return t[language].title;
    return '';
  };

  const getTotalSteps = () => {
    if (userProfile === null) return 1;
    if (userProfile) return 5; // start + 4 categories
    return 2; // start + initialization
  };

  const getCurrentStepNumber = () => {
    if (userProfile === null) return 1;
    
    if (userProfile) {
      switch (currentStep) {
        case 'start': return 1;
        case 'ideaValidation': return 2;
        case 'userExperience': return 3;
        case 'marketFit': return 4;
        case 'monetization': return 5;
        case 'results': return 5;
        default: return 1;
      }
    } else {
      switch (currentStep) {
        case 'start': return 1;
        case 'initialization': return 2;
        case 'results': return 2;
        default: return 1;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>{t[language].backToHome}</span>
          </Link>
          <div>
            <div className="bg-indigo-100/80 p-2 rounded-lg">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <Gauge className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600">{t[language].subtitle}</p>
          </div>

          <Card className="border-2 border-indigo-100 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    {t[language].progressText
                      .replace('%current%', getCurrentStepNumber().toString())
                      .replace('%total%', getTotalSteps().toString())}
                  </h3>
                </div>
                <ProgressBar current={getCurrentStepNumber()} total={getTotalSteps()} />
              </div>

              {renderCurrentStep()}

              <div className="flex justify-between pt-8">
                {currentStep !== 'start' && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t[language].back}
                  </Button>
                )}

                {currentStep !== 'results' ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 ml-auto"
                  >
                    {t[language].next}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Link to="/dashboard" className="ml-auto">
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      {t[language].toDashboard}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MaturityCalculator;
