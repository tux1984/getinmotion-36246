
import { QuestionConfig } from '@/components/cultural/wizard-components/QuestionStep';
import { Music, Palette, Scissors, Users, Heart, Calendar, Lightbulb, Target, Clock, Search, DollarSign, Eye, CreditCard, Instagram, FileText, Building, Briefcase, CheckCircle } from 'lucide-react';

export const getProfileSpecificQuestions = (language: 'en' | 'es', profileType: 'idea' | 'solo' | 'team'): QuestionConfig[] => {
  const t = {
    en: {
      // IDEA Profile Questions
      idea: {
        industry: {
          title: "What is your main creative industry or field?",
          options: [
            { id: 'music', label: 'Music' },
            { id: 'visual', label: 'Visual arts' },
            { id: 'crafts', label: 'Crafts' },
            { id: 'theater', label: 'Theater' },
            { id: 'dance', label: 'Dance' },
            { id: 'wellness', label: 'Home or body products' },
            { id: 'other', label: 'Other' }
          ]
        },
        activities: {
          title: "What activities do you imagine developing?",
          options: [
            { id: 'create', label: 'Create physical objects' },
            { id: 'teach', label: 'Give workshops' },
            { id: 'artistic', label: 'Artistic services' },
            { id: 'social', label: 'Publish works on social media' },
            { id: 'other', label: 'Other' }
          ]
        },
        ideaAge: {
          title: "How long ago did this idea emerge?",
          options: [
            { id: 'under6months', label: 'Less than 6 months' },
            { id: '6months2years', label: '6 months - 2 years' },
            { id: 'over2years', label: 'More than 2 years' }
          ]
        },
        phase: {
          title: "What phase is your idea in?",
          options: [
            { id: 'justIdea', label: 'Just an idea' },
            { id: 'research', label: 'Research phase' },
            { id: 'prototype', label: 'Prototype' },
            { id: 'seeking', label: 'Seeking support' }
          ]
        },
        plan: {
          title: "Do you have a written plan or strategy?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'somewhat', label: 'More or less' },
            { id: 'no', label: 'No' }
          ]
        },
        resources: {
          title: "Do you have initial resources?",
          options: [
            { id: 'savings', label: 'Savings' },
            { id: 'seeking', label: 'Seeking support' },
            { id: 'none', label: 'No resources' }
          ]
        },
        team: {
          title: "Do you work alone or with others?",
          options: [
            { id: 'alone', label: 'Alone' },
            { id: 'family', label: 'Family/friends' },
            { id: 'seeking', label: 'Seeking team' }
          ]
        },
        organization: {
          title: "How do you organize your ideas and tasks?",
          options: [
            { id: 'paper', label: 'Paper' },
            { id: 'phone', label: 'Phone notes' },
            { id: 'digital', label: 'Digital tools' },
            { id: 'none', label: 'No method' }
          ]
        },
        goals: {
          title: "Do you set goals or deadlines?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'sometimes', label: 'Sometimes' },
            { id: 'no', label: 'No' }
          ]
        }
      },
      // SOLO Profile Questions
      solo: {
        industry: {
          title: "What is your creative industry?",
          options: [
            { id: 'music', label: 'Music' },
            { id: 'visual', label: 'Visual arts' },
            { id: 'crafts', label: 'Crafts' },
            { id: 'theater', label: 'Theater' },
            { id: 'dance', label: 'Dance' },
            { id: 'wellness', label: 'Home or body products' },
            { id: 'other', label: 'Other' }
          ]
        },
        activities: {
          title: "What activities do you currently do?",
          options: [
            { id: 'products', label: 'Sell products' },
            { id: 'services', label: 'Artistic services' },
            { id: 'classes', label: 'Classes or workshops' },
            { id: 'experiences', label: 'Experiences' },
            { id: 'digital', label: 'Digital content' }
          ]
        },
        timeActive: {
          title: "How long have you been active with this project?",
          options: [
            { id: 'under6months', label: 'Less than 6 months' },
            { id: '6months2years', label: '6 months - 2 years' },
            { id: 'over2years', label: 'More than 2 years' }
          ]
        },
        payment: {
          title: "What method do you use to charge?",
          options: [
            { id: 'cash', label: 'Cash' },
            { id: 'transfer', label: 'Bank transfers' },
            { id: 'platform', label: 'Payment platform' },
            { id: 'combined', label: 'Combined' }
          ]
        },
        finances: {
          title: "Do you keep track of income and expenses?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' }
          ]
        },
        brand: {
          title: "Do you have a defined brand or visual identity?",
          options: [
            { id: 'clear', label: 'Yes, clear' },
            { id: 'partial', label: 'Partial' },
            { id: 'no', label: 'No' }
          ]
        },
        content: {
          title: "Do you plan content or promotions?",
          options: [
            { id: 'calendar', label: 'Yes, with calendar' },
            { id: 'spontaneous', label: 'Spontaneous' },
            { id: 'none', label: 'Not yet' }
          ]
        },
        tasks: {
          title: "How do you manage your daily tasks?",
          options: [
            { id: 'app', label: 'Task app' },
            { id: 'paper', label: 'Paper' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'none', label: 'No organization' }
          ]
        },
        delegate: {
          title: "What would you like to delegate first?",
          options: [
            { id: 'finances', label: 'Finances' },
            { id: 'marketing', label: 'Marketing' },
            { id: 'communication', label: 'Communication' },
            { id: 'payments', label: 'Payments' },
            { id: 'legal', label: 'Legal' },
            { id: 'other', label: 'Other' }
          ]
        }
      },
      // TEAM Profile Questions
      team: {
        industry: {
          title: "What is your creative industry?",
          options: [
            { id: 'music', label: 'Music' },
            { id: 'visual', label: 'Visual arts' },
            { id: 'crafts', label: 'Crafts' },
            { id: 'theater', label: 'Theater' },
            { id: 'dance', label: 'Dance' },
            { id: 'wellness', label: 'Home or body products' },
            { id: 'other', label: 'Other' }
          ]
        },
        activities: {
          title: "What activities does your venture do?",
          options: [
            { id: 'sales', label: 'Sales' },
            { id: 'classes', label: 'Classes' },
            { id: 'events', label: 'Events' },
            { id: 'services', label: 'Services' },
            { id: 'digital', label: 'Digital content' },
            { id: 'other', label: 'Other' }
          ]
        },
        timeActive: {
          title: "How long has your project been running?",
          options: [
            { id: 'under6months', label: 'Less than 6 months' },
            { id: '6months2years', label: '6 months - 2 years' },
            { id: 'over2years', label: 'More than 2 years' }
          ]
        },
        income: {
          title: "Do you have regular income?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'irregular', label: 'Irregular' },
            { id: 'none', label: 'Not yet' }
          ]
        },
        legal: {
          title: "Are you legally formalized?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'process', label: 'In process' },
            { id: 'no', label: 'No' }
          ]
        },
        funding: {
          title: "Have you received support or funding?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'partial', label: 'Partial' },
            { id: 'no', label: 'No' }
          ]
        },
        teamSize: {
          title: "How many people are on the team?",
          options: [
            { id: '1', label: '1 person' },
            { id: '2-3', label: '2-3 people' },
            { id: '4+', label: '4+ people' }
          ]
        },
        organization: {
          title: "How do you organize internally?",
          options: [
            { id: 'digital', label: 'Digital tools' },
            { id: 'chats', label: 'Chats' },
            { id: 'meetings', label: 'Meetings + spreadsheets' },
            { id: 'separate', label: 'Each on their own' }
          ]
        },
        roles: {
          title: "Do you have defined roles?",
          options: [
            { id: 'yes', label: 'Yes' },
            { id: 'somewhat', label: 'More or less' },
            { id: 'no', label: 'No' }
          ]
        }
      }
    },
    es: {
      // IDEA Profile Questions
      idea: {
        industry: {
          title: "¿Cuál es tu industria o campo creativo principal?",
          options: [
            { id: 'music', label: 'Música' },
            { id: 'visual', label: 'Artes visuales' },
            { id: 'crafts', label: 'Artesanía' },
            { id: 'theater', label: 'Teatro' },
            { id: 'dance', label: 'Danza' },
            { id: 'wellness', label: 'Productos para el hogar o cuerpo' },
            { id: 'other', label: 'Otro' }
          ]
        },
        activities: {
          title: "¿Qué actividades imaginás desarrollar?",
          options: [
            { id: 'create', label: 'Crear objetos físicos' },
            { id: 'teach', label: 'Dar talleres' },
            { id: 'artistic', label: 'Servicios artísticos' },
            { id: 'social', label: 'Publicar obras en redes' },
            { id: 'other', label: 'Otro' }
          ]
        },
        ideaAge: {
          title: "¿Hace cuánto surgió esta idea?",
          options: [
            { id: 'under6months', label: 'Menos de 6 meses' },
            { id: '6months2years', label: '6 meses - 2 años' },
            { id: 'over2years', label: 'Más de 2 años' }
          ]
        },
        phase: {
          title: "¿En qué fase está tu idea?",
          options: [
            { id: 'justIdea', label: 'Solo una idea' },
            { id: 'research', label: 'Investigación' },
            { id: 'prototype', label: 'Prototipo' },
            { id: 'seeking', label: 'Buscando apoyo' }
          ]
        },
        plan: {
          title: "¿Tenés algún plan o estrategia escrita?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'somewhat', label: 'Más o menos' },
            { id: 'no', label: 'No' }
          ]
        },
        resources: {
          title: "¿Contás con recursos iniciales?",
          options: [
            { id: 'savings', label: 'Ahorros' },
            { id: 'seeking', label: 'Buscando apoyo' },
            { id: 'none', label: 'No tengo' }
          ]
        },
        team: {
          title: "¿Trabajás solo/a o con alguien más?",
          options: [
            { id: 'alone', label: 'Solo/a' },
            { id: 'family', label: 'Familiares/amigos' },
            { id: 'seeking', label: 'Buscando equipo' }
          ]
        },
        organization: {
          title: "¿Cómo organizás tus ideas y tareas?",
          options: [
            { id: 'paper', label: 'Papel' },
            { id: 'phone', label: 'Notas en el celular' },
            { id: 'digital', label: 'Herramientas digitales' },
            { id: 'none', label: 'No tengo método' }
          ]
        },
        goals: {
          title: "¿Establecés metas o plazos?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'sometimes', label: 'A veces' },
            { id: 'no', label: 'No' }
          ]
        }
      },
      // SOLO Profile Questions
      solo: {
        industry: {
          title: "¿Cuál es tu industria creativa?",
          options: [
            { id: 'music', label: 'Música' },
            { id: 'visual', label: 'Artes visuales' },
            { id: 'crafts', label: 'Artesanía' },
            { id: 'theater', label: 'Teatro' },
            { id: 'dance', label: 'Danza' },
            { id: 'wellness', label: 'Productos para el hogar o cuerpo' },
            { id: 'other', label: 'Otro' }
          ]
        },
        activities: {
          title: "¿Qué tipo de actividades realizás actualmente?",
          options: [
            { id: 'products', label: 'Venta de productos' },
            { id: 'services', label: 'Servicios artísticos' },
            { id: 'classes', label: 'Clases o talleres' },
            { id: 'experiences', label: 'Experiencias' },
            { id: 'digital', label: 'Contenido digital' }
          ]
        },
        timeActive: {
          title: "¿Hace cuánto tiempo estás activo con este proyecto?",
          options: [
            { id: 'under6months', label: 'Menos de 6 meses' },
            { id: '6months2years', label: '6 meses - 2 años' },
            { id: 'over2years', label: 'Más de 2 años' }
          ]
        },
        payment: {
          title: "¿Qué método usás para cobrar?",
          options: [
            { id: 'cash', label: 'Efectivo' },
            { id: 'transfer', label: 'Transferencias' },
            { id: 'platform', label: 'Plataforma de pagos' },
            { id: 'combined', label: 'Combinado' }
          ]
        },
        finances: {
          title: "¿Llevás registro de ingresos y gastos?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'no', label: 'No' }
          ]
        },
        brand: {
          title: "¿Tenés una marca o identidad visual definida?",
          options: [
            { id: 'clear', label: 'Sí, clara' },
            { id: 'partial', label: 'Parcial' },
            { id: 'no', label: 'No' }
          ]
        },
        content: {
          title: "¿Planificás contenidos o promociones?",
          options: [
            { id: 'calendar', label: 'Sí, con calendario' },
            { id: 'spontaneous', label: 'Espontáneo' },
            { id: 'none', label: 'No lo hago aún' }
          ]
        },
        tasks: {
          title: "¿Cómo gestionás tus tareas diarias?",
          options: [
            { id: 'app', label: 'App de tareas' },
            { id: 'paper', label: 'Papel' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'none', label: 'No organizo tareas' }
          ]
        },
        delegate: {
          title: "¿Qué te gustaría delegar primero?",
          options: [
            { id: 'finances', label: 'Finanzas' },
            { id: 'marketing', label: 'Marketing' },
            { id: 'communication', label: 'Comunicación' },
            { id: 'payments', label: 'Cobros' },
            { id: 'legal', label: 'Legal' },
            { id: 'other', label: 'Otra' }
          ]
        }
      },
      // TEAM Profile Questions
      team: {
        industry: {
          title: "¿Cuál es tu industria creativa?",
          options: [
            { id: 'music', label: 'Música' },
            { id: 'visual', label: 'Artes visuales' },
            { id: 'crafts', label: 'Artesanía' },
            { id: 'theater', label: 'Teatro' },
            { id: 'dance', label: 'Danza' },
            { id: 'wellness', label: 'Productos para el hogar o cuerpo' },
            { id: 'other', label: 'Otro' }
          ]
        },
        activities: {
          title: "¿Qué actividades realiza tu emprendimiento?",
          options: [
            { id: 'sales', label: 'Venta' },
            { id: 'classes', label: 'Clases' },
            { id: 'events', label: 'Eventos' },
            { id: 'services', label: 'Servicios' },
            { id: 'digital', label: 'Contenido digital' },
            { id: 'other', label: 'Otro' }
          ]
        },
        timeActive: {
          title: "¿Hace cuánto está en marcha tu proyecto?",
          options: [
            { id: 'under6months', label: 'Menos de 6 meses' },
            { id: '6months2years', label: '6 meses - 2 años' },
            { id: 'over2years', label: 'Más de 2 años' }
          ]
        },
        income: {
          title: "¿Tienen ingresos regulares?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'irregular', label: 'Irregulares' },
            { id: 'none', label: 'No aún' }
          ]
        },
        legal: {
          title: "¿Están formalizados legalmente?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'process', label: 'En proceso' },
            { id: 'no', label: 'No' }
          ]
        },
        funding: {
          title: "¿Recibieron apoyos o financiamiento?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'partial', label: 'Parcial' },
            { id: 'no', label: 'No' }
          ]
        },
        teamSize: {
          title: "¿Cuántas personas son en el equipo?",
          options: [
            { id: '1', label: '1 persona' },
            { id: '2-3', label: '2-3 personas' },
            { id: '4+', label: '4+ personas' }
          ]
        },
        organization: {
          title: "¿Cómo se organizan internamente?",
          options: [
            { id: 'digital', label: 'Herramientas digitales' },
            { id: 'chats', label: 'Chats' },
            { id: 'meetings', label: 'Reuniones + planillas' },
            { id: 'separate', label: 'Cada uno por su lado' }
          ]
        },
        roles: {
          title: "¿Tienen roles definidos?",
          options: [
            { id: 'yes', label: 'Sí' },
            { id: 'somewhat', label: 'Más o menos' },
            { id: 'no', label: 'No' }
          ]
        }
      }
    }
  };

  const iconMap = {
    music: <Music className="h-5 w-5" />,
    visual: <Palette className="h-5 w-5" />,
    crafts: <Scissors className="h-5 w-5" />,
    theater: <Users className="h-5 w-5" />,
    dance: <Users className="h-5 w-5" />,
    wellness: <Heart className="h-5 w-5" />,
    other: <Calendar className="h-5 w-5" />,
    create: <Lightbulb className="h-5 w-5" />,
    teach: <Users className="h-5 w-5" />,
    artistic: <Palette className="h-5 w-5" />,
    social: <Instagram className="h-5 w-5" />,
    under6months: <Clock className="h-5 w-5" />,
    '6months2years': <Clock className="h-5 w-5" />,
    over2years: <Clock className="h-5 w-5" />,
    justIdea: <Lightbulb className="h-5 w-5" />,
    research: <Search className="h-5 w-5" />,
    prototype: <Target className="h-5 w-5" />,
    seeking: <Search className="h-5 w-5" />,
    yes: <CheckCircle className="h-5 w-5" />,
    somewhat: <Eye className="h-5 w-5" />,
    no: <FileText className="h-5 w-5" />,
    savings: <DollarSign className="h-5 w-5" />,
    none: <FileText className="h-5 w-5" />,
    alone: <Users className="h-5 w-5" />,
    family: <Users className="h-5 w-5" />,
    paper: <FileText className="h-5 w-5" />,
    phone: <FileText className="h-5 w-5" />,
    digital: <Building className="h-5 w-5" />,
    sometimes: <Clock className="h-5 w-5" />,
    products: <Briefcase className="h-5 w-5" />,
    services: <Users className="h-5 w-5" />,
    classes: <Users className="h-5 w-5" />,
    experiences: <Heart className="h-5 w-5" />,
    cash: <DollarSign className="h-5 w-5" />,
    transfer: <CreditCard className="h-5 w-5" />,
    platform: <CreditCard className="h-5 w-5" />,
    combined: <CreditCard className="h-5 w-5" />,
    clear: <CheckCircle className="h-5 w-5" />,
    partial: <Eye className="h-5 w-5" />,
    calendar: <Calendar className="h-5 w-5" />,
    spontaneous: <Clock className="h-5 w-5" />,
    app: <Building className="h-5 w-5" />,
    whatsapp: <Instagram className="h-5 w-5" />,
    finances: <DollarSign className="h-5 w-5" />,
    marketing: <Instagram className="h-5 w-5" />,
    communication: <Users className="h-5 w-5" />,
    payments: <CreditCard className="h-5 w-5" />,
    legal: <FileText className="h-5 w-5" />,
    sales: <DollarSign className="h-5 w-5" />,
    events: <Calendar className="h-5 w-5" />,
    irregular: <Clock className="h-5 w-5" />,
    process: <Building className="h-5 w-5" />,
    '1': <Users className="h-5 w-5" />,
    '2-3': <Users className="h-5 w-5" />,
    '4+': <Users className="h-5 w-5" />,
    chats: <Instagram className="h-5 w-5" />,
    meetings: <Calendar className="h-5 w-5" />,
    separate: <Users className="h-5 w-5" />
  };

  // Get the questions for the specific profile
  const profileQuestions = t[language][profileType];
  
  const questions: QuestionConfig[] = [
    {
      id: 'industry',
      type: 'radio',
      title: profileQuestions.industry.title,
      fieldName: 'industry',
      options: profileQuestions.industry.options.map(opt => ({
        ...opt,
        icon: iconMap[opt.id as keyof typeof iconMap]
      }))
    },
    {
      id: 'activities',
      type: 'checkbox',
      title: profileQuestions.activities.title,
      fieldName: 'activities',
      options: profileQuestions.activities.options.map(opt => ({
        ...opt,
        icon: iconMap[opt.id as keyof typeof iconMap]
      }))
    }
  ];

  // Add profile-specific questions
  if (profileType === 'idea') {
    questions.push(
      {
        id: 'ideaAge',
        type: 'radio',
        title: profileQuestions.ideaAge.title,
        fieldName: 'ideaAge',
        options: profileQuestions.ideaAge.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'phase',
        type: 'radio',
        title: profileQuestions.phase.title,
        fieldName: 'phase',
        options: profileQuestions.phase.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'plan',
        type: 'radio',
        title: profileQuestions.plan.title,
        fieldName: 'plan',
        options: profileQuestions.plan.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'resources',
        type: 'radio',
        title: profileQuestions.resources.title,
        fieldName: 'resources',
        options: profileQuestions.resources.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'team',
        type: 'radio',
        title: profileQuestions.team.title,
        fieldName: 'team',
        options: profileQuestions.team.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'organization',
        type: 'radio',
        title: profileQuestions.organization.title,
        fieldName: 'organization',
        options: profileQuestions.organization.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'goals',
        type: 'radio',
        title: profileQuestions.goals.title,
        fieldName: 'goals',
        options: profileQuestions.goals.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      }
    );
  } else if (profileType === 'solo') {
    questions.push(
      {
        id: 'timeActive',
        type: 'radio',
        title: profileQuestions.timeActive.title,
        fieldName: 'timeActive',
        options: profileQuestions.timeActive.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'payment',
        type: 'radio',
        title: profileQuestions.payment.title,
        fieldName: 'payment',
        options: profileQuestions.payment.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'finances',
        type: 'radio',
        title: profileQuestions.finances.title,
        fieldName: 'finances',
        options: profileQuestions.finances.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'brand',
        type: 'radio',
        title: profileQuestions.brand.title,
        fieldName: 'brand',
        options: profileQuestions.brand.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'content',
        type: 'radio',
        title: profileQuestions.content.title,
        fieldName: 'content',
        options: profileQuestions.content.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'tasks',
        type: 'radio',
        title: profileQuestions.tasks.title,
        fieldName: 'tasks',
        options: profileQuestions.tasks.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'delegate',
        type: 'radio',
        title: profileQuestions.delegate.title,
        fieldName: 'delegate',
        options: profileQuestions.delegate.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      }
    );
  } else if (profileType === 'team') {
    questions.push(
      {
        id: 'timeActive',
        type: 'radio',
        title: profileQuestions.timeActive.title,
        fieldName: 'timeActive',
        options: profileQuestions.timeActive.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'income',
        type: 'radio',
        title: profileQuestions.income.title,
        fieldName: 'income',
        options: profileQuestions.income.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'legal',
        type: 'radio',
        title: profileQuestions.legal.title,
        fieldName: 'legal',
        options: profileQuestions.legal.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'funding',
        type: 'radio',
        title: profileQuestions.funding.title,
        fieldName: 'funding',
        options: profileQuestions.funding.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'teamSize',
        type: 'radio',
        title: profileQuestions.teamSize.title,
        fieldName: 'teamSize',
        options: profileQuestions.teamSize.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'organization',
        type: 'radio',
        title: profileQuestions.organization.title,
        fieldName: 'organization',
        options: profileQuestions.organization.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      },
      {
        id: 'roles',
        type: 'radio',
        title: profileQuestions.roles.title,
        fieldName: 'roles',
        options: profileQuestions.roles.options.map(opt => ({
          ...opt,
          icon: iconMap[opt.id as keyof typeof iconMap]
        }))
      }
    );
  }

  return questions;
};
