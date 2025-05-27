
import { Question } from './types';
import { Music, Palette, Scissors, Users, Heart, Calendar, Lightbulb, Target, Clock, Search, DollarSign, Eye, CreditCard, Instagram, FileText, Building, Briefcase, CheckCircle } from 'lucide-react';

export const getProfileSpecificQuestions = (language: 'en' | 'es', profileType: 'idea' | 'solo' | 'team'): Question[] => {
  const t = {
    en: {
      // IDEA Profile Questions
      idea: {
        industry: {
          question: "What is your main creative industry or field?",
          options: [
            { text: 'Music', value: 1 },
            { text: 'Visual arts', value: 2 },
            { text: 'Crafts', value: 3 },
            { text: 'Theater', value: 4 },
            { text: 'Dance', value: 5 },
            { text: 'Home or body products', value: 6 },
            { text: 'Other', value: 7 }
          ]
        },
        activities: {
          question: "What activities do you imagine developing?",
          options: [
            { text: 'Create physical objects', value: 1 },
            { text: 'Give workshops', value: 2 },
            { text: 'Artistic services', value: 3 },
            { text: 'Publish works on social media', value: 4 },
            { text: 'Other', value: 5 }
          ]
        },
        ideaAge: {
          question: "How long ago did this idea emerge?",
          options: [
            { text: 'Less than 6 months', value: 1 },
            { text: '6 months - 2 years', value: 2 },
            { text: 'More than 2 years', value: 3 }
          ]
        },
        phase: {
          question: "What phase is your idea in?",
          options: [
            { text: 'Just an idea', value: 1 },
            { text: 'Research phase', value: 2 },
            { text: 'Prototype', value: 3 },
            { text: 'Seeking support', value: 4 }
          ]
        },
        plan: {
          question: "Do you have a written plan or strategy?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'More or less', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        resources: {
          question: "Do you have initial resources?",
          options: [
            { text: 'Savings', value: 3 },
            { text: 'Seeking support', value: 2 },
            { text: 'No resources', value: 1 }
          ]
        },
        team: {
          question: "Do you work alone or with others?",
          options: [
            { text: 'Alone', value: 1 },
            { text: 'Family/friends', value: 2 },
            { text: 'Seeking team', value: 3 }
          ]
        },
        organization: {
          question: "How do you organize your ideas and tasks?",
          options: [
            { text: 'Paper', value: 1 },
            { text: 'Phone notes', value: 2 },
            { text: 'Digital tools', value: 3 },
            { text: 'No method', value: 0 }
          ]
        },
        goals: {
          question: "Do you set goals or deadlines?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'Sometimes', value: 2 },
            { text: 'No', value: 1 }
          ]
        }
      },
      // SOLO Profile Questions
      solo: {
        industry: {
          question: "What is your creative industry?",
          options: [
            { text: 'Music', value: 1 },
            { text: 'Visual arts', value: 2 },
            { text: 'Crafts', value: 3 },
            { text: 'Theater', value: 4 },
            { text: 'Dance', value: 5 },
            { text: 'Home or body products', value: 6 },
            { text: 'Other', value: 7 }
          ]
        },
        activities: {
          question: "What activities do you currently do?",
          options: [
            { text: 'Sell products', value: 1 },
            { text: 'Artistic services', value: 2 },
            { text: 'Classes or workshops', value: 3 },
            { text: 'Experiences', value: 4 },
            { text: 'Digital content', value: 5 }
          ]
        },
        timeActive: {
          question: "How long have you been active with this project?",
          options: [
            { text: 'Less than 6 months', value: 1 },
            { text: '6 months - 2 years', value: 2 },
            { text: 'More than 2 years', value: 3 }
          ]
        },
        payment: {
          question: "What method do you use to charge?",
          options: [
            { text: 'Cash', value: 1 },
            { text: 'Bank transfers', value: 2 },
            { text: 'Payment platform', value: 3 },
            { text: 'Combined', value: 4 }
          ]
        },
        finances: {
          question: "Do you keep track of income and expenses?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'No', value: 1 }
          ]
        },
        brand: {
          question: "Do you have a defined brand or visual identity?",
          options: [
            { text: 'Yes, clear', value: 3 },
            { text: 'Partial', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        content: {
          question: "Do you plan content or promotions?",
          options: [
            { text: 'Yes, with calendar', value: 3 },
            { text: 'Spontaneous', value: 2 },
            { text: 'Not yet', value: 1 }
          ]
        },
        tasks: {
          question: "How do you manage your daily tasks?",
          options: [
            { text: 'Task app', value: 3 },
            { text: 'Paper', value: 2 },
            { text: 'WhatsApp', value: 1 },
            { text: 'No organization', value: 0 }
          ]
        },
        delegate: {
          question: "What would you like to delegate first?",
          options: [
            { text: 'Finances', value: 1 },
            { text: 'Marketing', value: 2 },
            { text: 'Communication', value: 3 },
            { text: 'Payments', value: 4 },
            { text: 'Legal', value: 5 },
            { text: 'Other', value: 6 }
          ]
        }
      },
      // TEAM Profile Questions
      team: {
        industry: {
          question: "What is your creative industry?",
          options: [
            { text: 'Music', value: 1 },
            { text: 'Visual arts', value: 2 },
            { text: 'Crafts', value: 3 },
            { text: 'Theater', value: 4 },
            { text: 'Dance', value: 5 },
            { text: 'Home or body products', value: 6 },
            { text: 'Other', value: 7 }
          ]
        },
        activities: {
          question: "What activities does your venture do?",
          options: [
            { text: 'Sales', value: 1 },
            { text: 'Classes', value: 2 },
            { text: 'Events', value: 3 },
            { text: 'Services', value: 4 },
            { text: 'Digital content', value: 5 },
            { text: 'Other', value: 6 }
          ]
        },
        timeActive: {
          question: "How long has your project been running?",
          options: [
            { text: 'Less than 6 months', value: 1 },
            { text: '6 months - 2 years', value: 2 },
            { text: 'More than 2 years', value: 3 }
          ]
        },
        income: {
          question: "Do you have regular income?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'Irregular', value: 2 },
            { text: 'Not yet', value: 1 }
          ]
        },
        legal: {
          question: "Are you legally formalized?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'In process', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        funding: {
          question: "Have you received support or funding?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'Partial', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        teamSize: {
          question: "How many people are on the team?",
          options: [
            { text: '1 person', value: 1 },
            { text: '2-3 people', value: 2 },
            { text: '4+ people', value: 3 }
          ]
        },
        organization: {
          question: "How do you organize internally?",
          options: [
            { text: 'Digital tools', value: 3 },
            { text: 'Chats', value: 2 },
            { text: 'Meetings + spreadsheets', value: 2 },
            { text: 'Each on their own', value: 1 }
          ]
        },
        roles: {
          question: "Do you have defined roles?",
          options: [
            { text: 'Yes', value: 3 },
            { text: 'More or less', value: 2 },
            { text: 'No', value: 1 }
          ]
        }
      }
    },
    es: {
      // IDEA Profile Questions
      idea: {
        industry: {
          question: "¿Cuál es tu industria o campo creativo principal?",
          options: [
            { text: 'Música', value: 1 },
            { text: 'Artes visuales', value: 2 },
            { text: 'Artesanía', value: 3 },
            { text: 'Teatro', value: 4 },
            { text: 'Danza', value: 5 },
            { text: 'Productos para el hogar o cuerpo', value: 6 },
            { text: 'Otro', value: 7 }
          ]
        },
        activities: {
          question: "¿Qué actividades imaginás desarrollar?",
          options: [
            { text: 'Crear objetos físicos', value: 1 },
            { text: 'Dar talleres', value: 2 },
            { text: 'Servicios artísticos', value: 3 },
            { text: 'Publicar obras en redes', value: 4 },
            { text: 'Otro', value: 5 }
          ]
        },
        ideaAge: {
          question: "¿Hace cuánto surgió esta idea?",
          options: [
            { text: 'Menos de 6 meses', value: 1 },
            { text: '6 meses - 2 años', value: 2 },
            { text: 'Más de 2 años', value: 3 }
          ]
        },
        phase: {
          question: "¿En qué fase está tu idea?",
          options: [
            { text: 'Solo una idea', value: 1 },
            { text: 'Investigación', value: 2 },
            { text: 'Prototipo', value: 3 },
            { text: 'Buscando apoyo', value: 4 }
          ]
        },
        plan: {
          question: "¿Tenés algún plan o estrategia escrita?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'Más o menos', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        resources: {
          question: "¿Contás con recursos iniciales?",
          options: [
            { text: 'Ahorros', value: 3 },
            { text: 'Buscando apoyo', value: 2 },
            { text: 'No tengo', value: 1 }
          ]
        },
        team: {
          question: "¿Trabajás solo/a o con alguien más?",
          options: [
            { text: 'Solo/a', value: 1 },
            { text: 'Familiares/amigos', value: 2 },
            { text: 'Buscando equipo', value: 3 }
          ]
        },
        organization: {
          question: "¿Cómo organizás tus ideas y tareas?",
          options: [
            { text: 'Papel', value: 1 },
            { text: 'Notas en el celular', value: 2 },
            { text: 'Herramientas digitales', value: 3 },
            { text: 'No tengo método', value: 0 }
          ]
        },
        goals: {
          question: "¿Establecés metas o plazos?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'A veces', value: 2 },
            { text: 'No', value: 1 }
          ]
        }
      },
      // SOLO Profile Questions
      solo: {
        industry: {
          question: "¿Cuál es tu industria creativa?",
          options: [
            { text: 'Música', value: 1 },
            { text: 'Artes visuales', value: 2 },
            { text: 'Artesanía', value: 3 },
            { text: 'Teatro', value: 4 },
            { text: 'Danza', value: 5 },
            { text: 'Productos para el hogar o cuerpo', value: 6 },
            { text: 'Otro', value: 7 }
          ]
        },
        activities: {
          question: "¿Qué tipo de actividades realizás actualmente?",
          options: [
            { text: 'Venta de productos', value: 1 },
            { text: 'Servicios artísticos', value: 2 },
            { text: 'Clases o talleres', value: 3 },
            { text: 'Experiencias', value: 4 },
            { text: 'Contenido digital', value: 5 }
          ]
        },
        timeActive: {
          question: "¿Hace cuánto tiempo estás activo con este proyecto?",
          options: [
            { text: 'Menos de 6 meses', value: 1 },
            { text: '6 meses - 2 años', value: 2 },
            { text: 'Más de 2 años', value: 3 }
          ]
        },
        payment: {
          question: "¿Qué método usás para cobrar?",
          options: [
            { text: 'Efectivo', value: 1 },
            { text: 'Transferencias', value: 2 },
            { text: 'Plataforma de pagos', value: 3 },
            { text: 'Combinado', value: 4 }
          ]
        },
        finances: {
          question: "¿Llevás registro de ingresos y gastos?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'No', value: 1 }
          ]
        },
        brand: {
          question: "¿Tenés una marca o identidad visual definida?",
          options: [
            { text: 'Sí, clara', value: 3 },
            { text: 'Parcial', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        content: {
          question: "¿Planificás contenidos o promociones?",
          options: [
            { text: 'Sí, con calendario', value: 3 },
            { text: 'Espontáneo', value: 2 },
            { text: 'No lo hago aún', value: 1 }
          ]
        },
        tasks: {
          question: "¿Cómo gestionás tus tareas diarias?",
          options: [
            { text: 'App de tareas', value: 3 },
            { text: 'Papel', value: 2 },
            { text: 'WhatsApp', value: 1 },
            { text: 'No organizo tareas', value: 0 }
          ]
        },
        delegate: {
          question: "¿Qué te gustaría delegar primero?",
          options: [
            { text: 'Finanzas', value: 1 },
            { text: 'Marketing', value: 2 },
            { text: 'Comunicación', value: 3 },
            { text: 'Cobros', value: 4 },
            { text: 'Legal', value: 5 },
            { text: 'Otra', value: 6 }
          ]
        }
      },
      // TEAM Profile Questions
      team: {
        industry: {
          question: "¿Cuál es tu industria creativa?",
          options: [
            { text: 'Música', value: 1 },
            { text: 'Artes visuales', value: 2 },
            { text: 'Artesanía', value: 3 },
            { text: 'Teatro', value: 4 },
            { text: 'Danza', value: 5 },
            { text: 'Productos para el hogar o cuerpo', value: 6 },
            { text: 'Otro', value: 7 }
          ]
        },
        activities: {
          question: "¿Qué actividades realiza tu emprendimiento?",
          options: [
            { text: 'Venta', value: 1 },
            { text: 'Clases', value: 2 },
            { text: 'Eventos', value: 3 },
            { text: 'Servicios', value: 4 },
            { text: 'Contenido digital', value: 5 },
            { text: 'Otro', value: 6 }
          ]
        },
        timeActive: {
          question: "¿Hace cuánto está en marcha tu proyecto?",
          options: [
            { text: 'Menos de 6 meses', value: 1 },
            { text: '6 meses - 2 años', value: 2 },
            { text: 'Más de 2 años', value: 3 }
          ]
        },
        income: {
          question: "¿Tienen ingresos regulares?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'Irregulares', value: 2 },
            { text: 'No aún', value: 1 }
          ]
        },
        legal: {
          question: "¿Están formalizados legalmente?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'En proceso', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        funding: {
          question: "¿Recibieron apoyos o financiamiento?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'Parcial', value: 2 },
            { text: 'No', value: 1 }
          ]
        },
        teamSize: {
          question: "¿Cuántas personas son en el equipo?",
          options: [
            { text: '1 persona', value: 1 },
            { text: '2-3 personas', value: 2 },
            { text: '4+ personas', value: 3 }
          ]
        },
        organization: {
          question: "¿Cómo se organizan internamente?",
          options: [
            { text: 'Herramientas digitales', value: 3 },
            { text: 'Chats', value: 2 },
            { text: 'Reuniones + planillas', value: 2 },
            { text: 'Cada uno por su lado', value: 1 }
          ]
        },
        roles: {
          question: "¿Tienen roles definidos?",
          options: [
            { text: 'Sí', value: 3 },
            { text: 'Más o menos', value: 2 },
            { text: 'No', value: 1 }
          ]
        }
      }
    }
  };

  // Get the questions for the specific profile and language
  const profileQuestions = t[language][profileType];
  
  const questionKeys = ['industry', 'activities'];
  
  // Add profile-specific question keys
  if (profileType === 'idea') {
    questionKeys.push('ideaAge', 'phase', 'plan', 'resources', 'team', 'organization', 'goals');
  } else if (profileType === 'solo') {
    questionKeys.push('timeActive', 'payment', 'finances', 'brand', 'content', 'tasks', 'delegate');
  } else if (profileType === 'team') {
    questionKeys.push('timeActive', 'income', 'legal', 'funding', 'teamSize', 'organization', 'roles');
  }

  // Build the questions array
  const questions: Question[] = questionKeys.map((key, index) => {
    const questionData = profileQuestions[key as keyof typeof profileQuestions];
    return {
      id: `${profileType}_${key}`,
      question: questionData.question,
      options: questionData.options.map((opt: any, optIndex: number) => ({
        id: `${key}_${optIndex}`,
        text: opt.text,
        value: opt.value
      }))
    };
  });

  return questions;
};
