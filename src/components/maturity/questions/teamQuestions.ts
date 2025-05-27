
import { Question } from '../types';

export const getTeamQuestions = (language: 'en' | 'es'): Question[] => {
  const translations = {
    en: {
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
    },
    es: {
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
  };

  const t = translations[language];
  const questionKeys = ['industry', 'activities', 'timeActive', 'income', 'legal', 'funding', 'teamSize', 'organization', 'roles'];

  return questionKeys.map((key, index) => {
    const questionData = t[key as keyof typeof t];
    return {
      id: `team_${key}`,
      question: questionData.question,
      options: questionData.options.map((opt: any, optIndex: number) => ({
        id: `${key}_${optIndex}`,
        text: opt.text,
        value: opt.value
      }))
    };
  });
};
