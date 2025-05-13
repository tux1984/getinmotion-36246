
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CategoryScore = {
  ideaValidation: number;
  userExperience: number;
  marketFit: number;
  monetization: number;
};

interface MaturityCalculatorProps {
  onComplete: (scores: CategoryScore) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

// Questions for each step in English and Spanish
const questions = {
  ideaValidation: {
    en: [
      {
        question: "How clear is your product/service concept?",
        options: [
          { value: "1", label: "Just a vague idea" },
          { value: "2", label: "Basic concept with some details" },
          { value: "3", label: "Well-defined concept with clear features" },
          { value: "4", label: "Comprehensive, detailed product specification" }
        ]
      },
      {
        question: "Have you validated your idea with potential customers?",
        options: [
          { value: "1", label: "No validation yet" },
          { value: "2", label: "Informal feedback from friends/family" },
          { value: "3", label: "Structured feedback from target audience" },
          { value: "4", label: "Extensive customer interviews and testing" }
        ]
      },
      {
        question: "How unique is your offering compared to existing options?",
        options: [
          { value: "1", label: "Similar to many existing products" },
          { value: "2", label: "Some unique elements" },
          { value: "3", label: "Distinct approach or features" },
          { value: "4", label: "Highly innovative and unique" }
        ]
      }
    ],
    es: [
      {
        question: "¿Qué tan claro es el concepto de tu producto/servicio?",
        options: [
          { value: "1", label: "Solo una idea vaga" },
          { value: "2", label: "Concepto básico con algunos detalles" },
          { value: "3", label: "Concepto bien definido con características claras" },
          { value: "4", label: "Especificación completa y detallada del producto" }
        ]
      },
      {
        question: "¿Has validado tu idea con clientes potenciales?",
        options: [
          { value: "1", label: "Sin validación aún" },
          { value: "2", label: "Comentarios informales de amigos/familia" },
          { value: "3", label: "Comentarios estructurados del público objetivo" },
          { value: "4", label: "Entrevistas y pruebas extensas con clientes" }
        ]
      },
      {
        question: "¿Qué tan única es tu oferta en comparación con las opciones existentes?",
        options: [
          { value: "1", label: "Similar a muchos productos existentes" },
          { value: "2", label: "Algunos elementos únicos" },
          { value: "3", label: "Enfoque o características distintivas" },
          { value: "4", label: "Altamente innovador y único" }
        ]
      }
    ]
  },
  userExperience: {
    en: [
      {
        question: "How developed is your product's user experience?",
        options: [
          { value: "1", label: "Not considered yet" },
          { value: "2", label: "Basic consideration of user needs" },
          { value: "3", label: "Designed with user feedback" },
          { value: "4", label: "Extensively tested and refined" }
        ]
      },
      {
        question: "Do you have a consistent brand identity?",
        options: [
          { value: "1", label: "No brand elements yet" },
          { value: "2", label: "Basic logo and colors" },
          { value: "3", label: "Consistent visual identity" },
          { value: "4", label: "Comprehensive brand guidelines" }
        ]
      },
      {
        question: "How do customers interact with your product/service?",
        options: [
          { value: "1", label: "Interaction pathway not defined" },
          { value: "2", label: "Basic interaction flow" },
          { value: "3", label: "Well-designed customer journey" },
          { value: "4", label: "Optimized, multi-channel experience" }
        ]
      }
    ],
    es: [
      {
        question: "¿Qué tan desarrollada está la experiencia de usuario de tu producto?",
        options: [
          { value: "1", label: "Aún no considerada" },
          { value: "2", label: "Consideración básica de las necesidades del usuario" },
          { value: "3", label: "Diseñada con retroalimentación de usuarios" },
          { value: "4", label: "Ampliamente probada y refinada" }
        ]
      },
      {
        question: "¿Tienes una identidad de marca consistente?",
        options: [
          { value: "1", label: "Aún sin elementos de marca" },
          { value: "2", label: "Logo y colores básicos" },
          { value: "3", label: "Identidad visual consistente" },
          { value: "4", label: "Guías de marca comprensivas" }
        ]
      },
      {
        question: "¿Cómo interactúan los clientes con tu producto/servicio?",
        options: [
          { value: "1", label: "Camino de interacción no definido" },
          { value: "2", label: "Flujo de interacción básico" },
          { value: "3", label: "Recorrido del cliente bien diseñado" },
          { value: "4", label: "Experiencia optimizada y multicanal" }
        ]
      }
    ]
  },
  marketFit: {
    en: [
      {
        question: "How well do you understand your target market?",
        options: [
          { value: "1", label: "General idea of potential customers" },
          { value: "2", label: "Basic customer segments identified" },
          { value: "3", label: "Detailed customer personas" },
          { value: "4", label: "Deep insights into customer needs and behaviors" }
        ]
      },
      {
        question: "Have you identified your competitive advantage?",
        options: [
          { value: "1", label: "No clear differentiation" },
          { value: "2", label: "Some unique selling points" },
          { value: "3", label: "Clear value proposition" },
          { value: "4", label: "Strongly defensible competitive advantage" }
        ]
      },
      {
        question: "How developed is your marketing strategy?",
        options: [
          { value: "1", label: "No marketing plan yet" },
          { value: "2", label: "Basic marketing ideas" },
          { value: "3", label: "Defined marketing channels" },
          { value: "4", label: "Comprehensive marketing strategy with metrics" }
        ]
      }
    ],
    es: [
      {
        question: "¿Qué tan bien entiendes tu mercado objetivo?",
        options: [
          { value: "1", label: "Idea general de clientes potenciales" },
          { value: "2", label: "Segmentos básicos de clientes identificados" },
          { value: "3", label: "Perfiles detallados de clientes" },
          { value: "4", label: "Conocimiento profundo de necesidades y comportamientos" }
        ]
      },
      {
        question: "¿Has identificado tu ventaja competitiva?",
        options: [
          { value: "1", label: "Sin diferenciación clara" },
          { value: "2", label: "Algunos puntos de venta únicos" },
          { value: "3", label: "Propuesta de valor clara" },
          { value: "4", label: "Ventaja competitiva fuertemente defendible" }
        ]
      },
      {
        question: "¿Qué tan desarrollada está tu estrategia de marketing?",
        options: [
          { value: "1", label: "Aún sin plan de marketing" },
          { value: "2", label: "Ideas básicas de marketing" },
          { value: "3", label: "Canales de marketing definidos" },
          { value: "4", label: "Estrategia integral de marketing con métricas" }
        ]
      }
    ]
  },
  monetization: {
    en: [
      {
        question: "How developed is your business model?",
        options: [
          { value: "1", label: "No clear revenue strategy" },
          { value: "2", label: "Basic pricing model" },
          { value: "3", label: "Defined revenue streams" },
          { value: "4", label: "Optimized business model with multiple revenue sources" }
        ]
      },
      {
        question: "What is the current state of your financial planning?",
        options: [
          { value: "1", label: "No financial projections" },
          { value: "2", label: "Basic cost estimates" },
          { value: "3", label: "Detailed financial model" },
          { value: "4", label: "Comprehensive financial planning with scenarios" }
        ]
      },
      {
        question: "How sustainable is your business financially?",
        options: [
          { value: "1", label: "Not generating revenue yet" },
          { value: "2", label: "Some revenue but not profitable" },
          { value: "3", label: "Breaking even or small profit" },
          { value: "4", label: "Consistently profitable" }
        ]
      }
    ],
    es: [
      {
        question: "¿Qué tan desarrollado está tu modelo de negocio?",
        options: [
          { value: "1", label: "Sin estrategia clara de ingresos" },
          { value: "2", label: "Modelo básico de precios" },
          { value: "3", label: "Fuentes de ingresos definidas" },
          { value: "4", label: "Modelo de negocio optimizado con múltiples fuentes de ingresos" }
        ]
      },
      {
        question: "¿Cuál es el estado actual de tu planificación financiera?",
        options: [
          { value: "1", label: "Sin proyecciones financieras" },
          { value: "2", label: "Estimaciones básicas de costos" },
          { value: "3", label: "Modelo financiero detallado" },
          { value: "4", label: "Planificación financiera integral con escenarios" }
        ]
      },
      {
        question: "¿Qué tan sostenible es tu negocio financieramente?",
        options: [
          { value: "1", label: "Aún no genera ingresos" },
          { value: "2", label: "Algunos ingresos pero no rentable" },
          { value: "3", label: "Punto de equilibrio o pequeña ganancia" },
          { value: "4", label: "Consistentemente rentable" }
        ]
      }
    ]
  },
  initialization: {
    en: [
      {
        question: "What type of artisan are you?",
        field: "artisanType",
        type: "select"
      },
      {
        question: "Describe your project or business idea in a few sentences:",
        field: "projectDescription",
        type: "textarea"
      },
      {
        question: "What is your name or business name?",
        field: "businessName",
        type: "input"
      }
    ],
    es: [
      {
        question: "¿Qué tipo de artesano eres?",
        field: "artisanType",
        type: "select"
      },
      {
        question: "Describe tu proyecto o idea de negocio en unas pocas frases:",
        field: "projectDescription",
        type: "textarea"
      },
      {
        question: "¿Cuál es tu nombre o el nombre de tu negocio?",
        field: "businessName",
        type: "input"
      }
    ]
  }
};

// Define schema for form validation
const formSchema = z.object({
  // For initialization step
  artisanType: z.string().optional(),
  projectDescription: z.string().optional(),
  businessName: z.string().optional(),
  
  // For evaluation questions
  answers: z.array(z.string()).optional(),
  
  // Current state tracking
  currentStep: z.string(),
  hasProject: z.boolean().optional()
});

export const ProductMaturityCalculator: React.FC<MaturityCalculatorProps> = ({ 
  onComplete, 
  open, 
  onOpenChange 
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<string>("start"); // start, initialization, ideaValidation, userExperience, marketFit, monetization, results
  const [progress, setProgress] = useState(0);
  const [scores, setScores] = useState<CategoryScore>({
    ideaValidation: 0,
    userExperience: 0,
    marketFit: 0,
    monetization: 0
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasProject, setHasProject] = useState<boolean | null>(null);

  const t = {
    en: {
      startTitle: "Project Maturity Calculator",
      startDesc: "Let's evaluate your project's maturity level or help you define your business idea.",
      startQuestion: "Do you already have a project or business?",
      yes: "Yes, I want to evaluate my existing project",
      no: "No, I need help defining my business idea",
      next: "Next",
      back: "Back",
      skip: "Skip this step",
      submit: "Submit",
      generating: "Generating results...",
      projectPromptTitle: "Let's Define Your Project",
      projectPromptDesc: "Answer a few questions to help structure your business idea",
      evaluationTitle: "Project Evaluation",
      evaluationDesc: "Let's assess your project's current maturity level",
      finalStep: "Final Step",
      complete: "Complete",
      resultsTitle: "Your Project Maturity Analysis",
      resultsDesc: "Here's an assessment of your project's maturity in key areas",
      ideaValidation: "Idea Validation",
      userExperience: "User Experience",
      marketFit: "Market Fit",
      monetization: "Monetization",
      overallMaturity: "Overall Maturity",
      thankYou: "Thank you for completing the assessment!",
      generatePrompt: "Generate Business Development Guide",
      promptGenerated: "Business Development Guide Generated!",
      invalidAnswers: "Please answer all questions before continuing"
    },
    es: {
      startTitle: "Calculadora de Madurez del Proyecto",
      startDesc: "Vamos a evaluar el nivel de madurez de tu proyecto o ayudarte a definir tu idea de negocio.",
      startQuestion: "¿Ya tienes un proyecto o negocio?",
      yes: "Sí, quiero evaluar mi proyecto existente",
      no: "No, necesito ayuda para definir mi idea de negocio",
      next: "Siguiente",
      back: "Atrás",
      skip: "Omitir este paso",
      submit: "Enviar",
      generating: "Generando resultados...",
      projectPromptTitle: "Definamos Tu Proyecto",
      projectPromptDesc: "Responde algunas preguntas para ayudar a estructurar tu idea de negocio",
      evaluationTitle: "Evaluación del Proyecto",
      evaluationDesc: "Vamos a evaluar el nivel actual de madurez de tu proyecto",
      finalStep: "Último Paso",
      complete: "Completar",
      resultsTitle: "Análisis de Madurez de Tu Proyecto",
      resultsDesc: "Aquí está una evaluación de la madurez de tu proyecto en áreas clave",
      ideaValidation: "Validación de Idea",
      userExperience: "Experiencia de Usuario",
      marketFit: "Ajuste al Mercado",
      monetization: "Monetización",
      overallMaturity: "Madurez General",
      thankYou: "¡Gracias por completar la evaluación!",
      generatePrompt: "Generar Guía de Desarrollo de Negocio",
      promptGenerated: "¡Guía de Desarrollo de Negocio Generada!",
      invalidAnswers: "Por favor responde todas las preguntas antes de continuar"
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentStep: "start",
      answers: [],
    },
  });

  const currentAnswers = form.watch("answers") || [];
  
  const updateProgress = () => {
    const totalSteps = hasProject ? 5 : 2; // Different paths based on whether user has existing project
    let currentStepNumber = 0;
    
    switch (step) {
      case "start":
        currentStepNumber = 1;
        break;
      case "initialization":
        currentStepNumber = 2;
        break;
      case "ideaValidation":
        currentStepNumber = hasProject ? 2 : 3;
        break;
      case "userExperience":
        currentStepNumber = 3;
        break;
      case "marketFit":
        currentStepNumber = 4;
        break;
      case "monetization":
        currentStepNumber = 5;
        break;
      case "results":
        currentStepNumber = totalSteps;
        break;
    }
    
    setProgress(Math.round((currentStepNumber / totalSteps) * 100));
  };
  
  React.useEffect(() => {
    updateProgress();
  }, [step, hasProject]);

  const calculateCategoryScore = (answers: string[], category: keyof CategoryScore) => {
    if (!answers || answers.length === 0) return 0;
    
    const categoryStartIndex = getCategoryStartIndex(category);
    if (categoryStartIndex === -1) return 0;
    
    // Get the 3 answers for this category (each category has 3 questions)
    const categoryAnswers = answers.slice(categoryStartIndex, categoryStartIndex + 3);
    const totalPoints = categoryAnswers.reduce((sum, answer) => sum + parseInt(answer || "0"), 0);
    
    // Calculate score as percentage (max is 12 points - 4 points per question × 3 questions)
    return Math.round((totalPoints / 12) * 100);
  };
  
  const getCategoryStartIndex = (category: string): number => {
    switch (category) {
      case "ideaValidation": return 0;
      case "userExperience": return 3;
      case "marketFit": return 6;
      case "monetization": return 9;
      default: return -1;
    }
  };
  
  const handleNext = () => {
    if (step === "start") {
      if (hasProject === null) {
        toast({
          title: language === 'en' ? "Please make a selection" : "Por favor haz una selección",
          description: language === 'en' 
            ? "Select whether you have an existing project or need help defining your idea" 
            : "Selecciona si tienes un proyecto existente o necesitas ayuda para definir tu idea",
          variant: "destructive"
        });
        return;
      }
      
      setStep(hasProject ? "ideaValidation" : "initialization");
      return;
    }
    
    if (step === "initialization") {
      const artisanType = form.getValues("artisanType");
      const projectDescription = form.getValues("projectDescription");
      const businessName = form.getValues("businessName");
      
      if (!artisanType || !projectDescription || !businessName) {
        toast({
          title: language === 'en' ? "Missing information" : "Información faltante",
          description: language === 'en' 
            ? "Please fill all fields before continuing" 
            : "Por favor completa todos los campos antes de continuar",
          variant: "destructive"
        });
        return;
      }
      
      setStep("results");
      
      // Generate basic scores for new projects
      const newScores = {
        ideaValidation: 20, // Starting point for a new idea
        userExperience: 10,
        marketFit: 15,
        monetization: 5
      };
      
      setScores(newScores);
      onComplete(newScores);
      return;
    }
    
    // Handle category question steps
    if (["ideaValidation", "userExperience", "marketFit", "monetization"].includes(step)) {
      // Check if all questions in this step are answered
      const currentCategoryQuestions = questions[step as keyof typeof questions][language];
      const startIndex = getCategoryStartIndex(step);
      const categoryAnswers = currentAnswers.slice(startIndex, startIndex + currentCategoryQuestions.length);
      
      if (categoryAnswers.length < currentCategoryQuestions.length || 
          categoryAnswers.some(answer => !answer)) {
        toast({
          title: t[language].invalidAnswers,
          variant: "destructive"
        });
        return;
      }
      
      // Move to the next category or results
      if (step === "ideaValidation") {
        setStep("userExperience");
      } else if (step === "userExperience") {
        setStep("marketFit");
      } else if (step === "marketFit") {
        setStep("monetization");
      } else if (step === "monetization") {
        // Calculate final scores
        const finalScores = {
          ideaValidation: calculateCategoryScore(currentAnswers, "ideaValidation"),
          userExperience: calculateCategoryScore(currentAnswers, "userExperience"),
          marketFit: calculateCategoryScore(currentAnswers, "marketFit"),
          monetization: calculateCategoryScore(currentAnswers, "monetization")
        };
        
        setScores(finalScores);
        onComplete(finalScores);
        setStep("results");
      }
    }
  };
  
  const handleBack = () => {
    if (step === "initialization" || (step === "ideaValidation" && !hasProject)) {
      setStep("start");
    } else if (step === "ideaValidation") {
      setStep("start");
    } else if (step === "userExperience") {
      setStep("ideaValidation");
    } else if (step === "marketFit") {
      setStep("userExperience");
    } else if (step === "monetization") {
      setStep("marketFit");
    } else if (step === "results") {
      if (hasProject) {
        setStep("monetization");
      } else {
        setStep("initialization");
      }
    }
  };
  
  const handleGeneratePrompt = () => {
    // In a real application, this would generate personalized development guidance
    toast({
      title: t[language].promptGenerated,
      description: language === 'en'
        ? "Check your email for a detailed business development guide tailored to your project."
        : "Revisa tu correo para obtener una guía detallada de desarrollo de negocios adaptada a tu proyecto."
    });
  };
  
  // Function to render the current step
  const renderCurrentStep = () => {
    switch (step) {
      case "start":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t[language].startQuestion}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant={hasProject === true ? "default" : "outline"}
                className={`h-auto py-6 px-4 ${hasProject === true ? "ring-2 ring-primary" : ""}`}
                onClick={() => setHasProject(true)}
              >
                <div className="text-left">
                  <div className="font-medium">{t[language].yes}</div>
                </div>
              </Button>
              
              <Button
                type="button"
                variant={hasProject === false ? "default" : "outline"}
                className={`h-auto py-6 px-4 ${hasProject === false ? "ring-2 ring-primary" : ""}`}
                onClick={() => setHasProject(false)}
              >
                <div className="text-left">
                  <div className="font-medium">{t[language].no}</div>
                </div>
              </Button>
            </div>
          </div>
        );
        
      case "initialization":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t[language].projectPromptTitle}</h3>
            <p className="text-sm text-muted-foreground">{t[language].projectPromptDesc}</p>
            
            <div className="space-y-4">
              {questions.initialization[language].map((q, index) => (
                <div key={index} className="space-y-2">
                  <FormLabel>{q.question}</FormLabel>
                  
                  {q.type === 'select' && (
                    <Select
                      value={form.watch("artisanType")}
                      onValueChange={(value) => form.setValue("artisanType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? "Select type" : "Seleccionar tipo"} />
                      </SelectTrigger>
                      <SelectContent>
                        {artisanTypes[language].map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {q.type === 'textarea' && (
                    <Textarea 
                      value={form.watch("projectDescription") || ""}
                      onChange={(e) => form.setValue("projectDescription", e.target.value)}
                      placeholder={language === 'en' 
                        ? "Describe your project or idea..."
                        : "Describe tu proyecto o idea..."
                      }
                      className="min-h-[100px]"
                    />
                  )}
                  
                  {q.type === 'input' && (
                    <Input 
                      value={form.watch("businessName") || ""}
                      onChange={(e) => form.setValue("businessName", e.target.value)}
                      placeholder={language === 'en' ? "Your name or business name" : "Tu nombre o nombre del negocio"}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case "ideaValidation":
      case "userExperience":
      case "marketFit":
      case "monetization":
        const currentCategory = step as keyof typeof questions;
        const categoryQuestions = questions[currentCategory][language];
        const startIndex = getCategoryStartIndex(currentCategory);
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t[language].evaluationTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {currentCategory === "monetization" 
                ? t[language].finalStep 
                : t[language].evaluationDesc}
            </p>
            
            <div className="space-y-6">
              {categoryQuestions.map((q, qIndex) => {
                const formIndex = startIndex + qIndex;
                return (
                  <div key={qIndex} className="space-y-3">
                    <FormLabel className="text-base">{q.question}</FormLabel>
                    <RadioGroup 
                      value={currentAnswers[formIndex] || ""}
                      onValueChange={(value) => {
                        const newAnswers = [...currentAnswers];
                        newAnswers[formIndex] = value;
                        form.setValue("answers", newAnswers);
                      }}
                      className="space-y-1"
                    >
                      {q.options!.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`q${formIndex}-${option.value}`} />
                          <label 
                            htmlFor={`q${formIndex}-${option.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case "results":
        const overallScore = Math.round(
          Object.values(scores).reduce((acc, score) => acc + score, 0) / Object.keys(scores).length
        );
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t[language].resultsTitle}</h3>
            <p className="text-sm text-muted-foreground">{t[language].resultsDesc}</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t[language].overallMaturity}</span>
                  <span className="text-lg font-bold">{overallScore}%</span>
                </div>
                <Progress value={overallScore} className="h-3" />
              </div>
              
              <div className="space-y-4 pt-4">
                {Object.entries(scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>{t[language][category as keyof typeof t.en]}</span>
                      <span className="font-medium">{score}%</span>
                    </div>
                    <Progress 
                      value={score} 
                      className={`h-2 ${
                        category === 'ideaValidation' ? 'bg-emerald-500' :
                        category === 'userExperience' ? 'bg-violet-500' :
                        category === 'marketFit' ? 'bg-blue-500' : 'bg-amber-500'
                      }`} 
                    />
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Button 
                  type="button" 
                  onClick={handleGeneratePrompt}
                  className="w-full"
                >
                  {t[language].generatePrompt}
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Determine dialog title based on current step
  const getDialogTitle = () => {
    if (step === "start") return t[language].startTitle;
    if (step === "initialization") return t[language].projectPromptTitle;
    if (step === "results") return t[language].resultsTitle;
    return t[language].evaluationTitle;
  };
  
  // Determine dialog description based on current step
  const getDialogDescription = () => {
    if (step === "start") return t[language].startDesc;
    if (step === "initialization") return t[language].projectPromptDesc;
    if (step === "results") return t[language].thankYou;
    return t[language].evaluationDesc;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{progress}%</span>
            <span>{language === 'en' ? 'Complete' : 'Completado'}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form className="space-y-6">
            {renderCurrentStep()}
          </form>
        </Form>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          {step !== "start" && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              {t[language].back}
            </Button>
          )}
          
          {step !== "results" && (
            <Button
              type="button"
              onClick={handleNext}
            >
              {t[language].next}
            </Button>
          )}
          
          {step === "results" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t[language].complete}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
