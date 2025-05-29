
import { Question } from '../types';
import { Music, Palette, Scissors, Users, Heart, Calendar, Lightbulb, Target, Clock, Search, DollarSign, Eye, CreditCard, Instagram, FileText, Building, Briefcase, CheckCircle } from 'lucide-react';

export const getIdeaQuestions = (language: 'en' | 'es'): Question[] => {
  const translations = {
    en: {
      industry: {
        question: "What is your main creative industry or field?",
        type: 'radio',
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
        question: "What activities do you imagine developing? (Select all that apply)",
        type: 'checkbox',
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
        type: 'radio',
        options: [
          { text: 'Less than 6 months', value: 1 },
          { text: '6 months - 2 years', value: 2 },
          { text: 'More than 2 years', value: 3 }
        ]
      },
      phase: {
        question: "What phase is your idea in?",
        type: 'radio',
        options: [
          { text: 'Just an idea', value: 1 },
          { text: 'Research phase', value: 2 },
          { text: 'Prototype', value: 3 },
          { text: 'Seeking support', value: 4 }
        ]
      },
      plan: {
        question: "Do you have a written plan or strategy?",
        type: 'radio',
        options: [
          { text: 'Yes', value: 3 },
          { text: 'More or less', value: 2 },
          { text: 'No', value: 1 }
        ]
      },
      resources: {
        question: "Do you have initial resources?",
        type: 'radio',
        options: [
          { text: 'Savings', value: 3 },
          { text: 'Seeking support', value: 2 },
          { text: 'No resources', value: 1 }
        ]
      },
      team: {
        question: "Do you work alone or with others?",
        type: 'radio',
        options: [
          { text: 'Alone', value: 1 },
          { text: 'Family/friends', value: 2 },
          { text: 'Seeking team', value: 3 }
        ]
      },
      organization: {
        question: "How do you organize your ideas and tasks?",
        type: 'radio',
        options: [
          { text: 'Paper', value: 1 },
          { text: 'Phone notes', value: 2 },
          { text: 'Digital tools', value: 3 },
          { text: 'No method', value: 0 }
        ]
      },
      goals: {
        question: "Do you set goals or deadlines?",
        type: 'radio',
        options: [
          { text: 'Yes', value: 3 },
          { text: 'Sometimes', value: 2 },
          { text: 'No', value: 1 }
        ]
      }
    },
    es: {
      industry: {
        question: "¿Cuál es tu industria o campo creativo principal?",
        type: 'radio',
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
        question: "¿Qué actividades imaginás desarrollar? (Seleccioná todas las que correspondan)",
        type: 'checkbox',
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
        type: 'radio',
        options: [
          { text: 'Menos de 6 meses', value: 1 },
          { text: '6 meses - 2 años', value: 2 },
          { text: 'Más de 2 años', value: 3 }
        ]
      },
      phase: {
        question: "¿En qué fase está tu idea?",
        type: 'radio',
        options: [
          { text: 'Solo una idea', value: 1 },
          { text: 'Investigación', value: 2 },
          { text: 'Prototipo', value: 3 },
          { text: 'Buscando apoyo', value: 4 }
        ]
      },
      plan: {
        question: "¿Tenés algún plan o estrategia escrita?",
        type: 'radio',
        options: [
          { text: 'Sí', value: 3 },
          { text: 'Más o menos', value: 2 },
          { text: 'No', value: 1 }
        ]
      },
      resources: {
        question: "¿Contás con recursos iniciales?",
        type: 'radio',
        options: [
          { text: 'Ahorros', value: 3 },
          { text: 'Buscando apoyo', value: 2 },
          { text: 'No tengo', value: 1 }
        ]
      },
      team: {
        question: "¿Trabajás solo/a o con alguien más?",
        type: 'radio',
        options: [
          { text: 'Solo/a', value: 1 },
          { text: 'Familiares/amigos', value: 2 },
          { text: 'Buscando equipo', value: 3 }
        ]
      },
      organization: {
        question: "¿Cómo organizás tus ideas y tareas?",
        type: 'radio',
        options: [
          { text: 'Papel', value: 1 },
          { text: 'Notas en el celular', value: 2 },
          { text: 'Herramientas digitales', value: 3 },
          { text: 'No tengo método', value: 0 }
        ]
      },
      goals: {
        question: "¿Establecés metas o plazos?",
        type: 'radio',
        options: [
          { text: 'Sí', value: 3 },
          { text: 'A veces', value: 2 },
          { text: 'No', value: 1 }
        ]
      }
    }
  };

  const t = translations[language];
  const questionKeys = ['industry', 'activities', 'ideaAge', 'phase', 'plan', 'resources', 'team', 'organization', 'goals'];

  return questionKeys.map((key, index) => {
    const questionData = t[key as keyof typeof t];
    return {
      id: `idea_${key}`,
      question: questionData.question,
      type: questionData.type as 'radio' | 'checkbox',
      options: questionData.options.map((opt: any, optIndex: number) => ({
        id: `${key}_${optIndex}`,
        text: opt.text,
        value: opt.value
      }))
    };
  });
};
