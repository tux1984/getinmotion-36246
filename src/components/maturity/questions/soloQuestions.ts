
import { Question } from '../types';

export const getSoloQuestions = (language: 'en' | 'es'): Question[] => {
  const translations = {
    en: {
      industry: {
        question: "What is your creative industry?",
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
        question: "What activities do you currently do? (Select all that apply)",
        type: 'checkbox',
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
        type: 'radio',
        options: [
          { text: 'Less than 6 months', value: 1 },
          { text: '6 months - 2 years', value: 2 },
          { text: 'More than 2 years', value: 3 }
        ]
      },
      payment: {
        question: "What methods do you use to charge? (Select all that apply)",
        type: 'checkbox',
        options: [
          { text: 'Cash', value: 1 },
          { text: 'Bank transfers', value: 2 },
          { text: 'Payment platform', value: 3 },
          { text: 'Combined', value: 4 }
        ]
      },
      finances: {
        question: "Do you keep track of income and expenses?",
        type: 'radio',
        options: [
          { text: 'Yes', value: 3 },
          { text: 'No', value: 1 }
        ]
      },
      brand: {
        question: "Do you have a defined brand or visual identity?",
        type: 'radio',
        options: [
          { text: 'Yes, clear', value: 3 },
          { text: 'Partial', value: 2 },
          { text: 'No', value: 1 }
        ]
      },
      content: {
        question: "Do you plan content or promotions?",
        type: 'radio',
        options: [
          { text: 'Yes, with calendar', value: 3 },
          { text: 'Spontaneous', value: 2 },
          { text: 'Not yet', value: 1 }
        ]
      },
      tasks: {
        question: "How do you manage your daily tasks? (Select all that apply)",
        type: 'checkbox',
        options: [
          { text: 'Task app', value: 3 },
          { text: 'Paper', value: 2 },
          { text: 'WhatsApp', value: 1 },
          { text: 'No organization', value: 0 }
        ]
      },
      delegate: {
        question: "What would you like to delegate first?",
        type: 'radio',
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
    es: {
      industry: {
        question: "¿Cuál es tu industria creativa?",
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
        question: "¿Qué tipo de actividades realizás actualmente? (Seleccioná todas las que correspondan)",
        type: 'checkbox',
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
        type: 'radio',
        options: [
          { text: 'Menos de 6 meses', value: 1 },
          { text: '6 meses - 2 años', value: 2 },
          { text: 'Más de 2 años', value: 3 }
        ]
      },
      payment: {
        question: "¿Qué métodos usás para cobrar? (Seleccioná todas las que correspondan)",
        type: 'checkbox',
        options: [
          { text: 'Efectivo', value: 1 },
          { text: 'Transferencias', value: 2 },
          { text: 'Plataforma de pagos', value: 3 },
          { text: 'Combinado', value: 4 }
        ]
      },
      finances: {
        question: "¿Llevás registro de ingresos y gastos?",
        type: 'radio',
        options: [
          { text: 'Sí', value: 3 },
          { text: 'No', value: 1 }
        ]
      },
      brand: {
        question: "¿Tenés una marca o identidad visual definida?",
        type: 'radio',
        options: [
          { text: 'Sí, clara', value: 3 },
          { text: 'Parcial', value: 2 },
          { text: 'No', value: 1 }
        ]
      },
      content: {
        question: "¿Planificás contenidos o promociones?",
        type: 'radio',
        options: [
          { text: 'Sí, con calendario', value: 3 },
          { text: 'Espontáneo', value: 2 },
          { text: 'No lo hago aún', value: 1 }
        ]
      },
      tasks: {
        question: "¿Cómo gestionás tus tareas diarias? (Seleccioná todas las que correspondan)",
        type: 'checkbox',
        options: [
          { text: 'App de tareas', value: 3 },
          { text: 'Papel', value: 2 },
          { text: 'WhatsApp', value: 1 },
          { text: 'No organizo tareas', value: 0 }
        ]
      },
      delegate: {
        question: "¿Qué te gustaría delegar primero?",
        type: 'radio',
        options: [
          { text: 'Finanzas', value: 1 },
          { text: 'Marketing', value: 2 },
          { text: 'Comunicación', value: 3 },
          { text: 'Cobros', value: 4 },
          { text: 'Legal', value: 5 },
          { text: 'Otra', value: 6 }
        ]
      }
    }
  };

  const t = translations[language];
  const questionKeys = ['industry', 'activities', 'timeActive', 'payment', 'finances', 'brand', 'content', 'tasks', 'delegate'];

  return questionKeys.map((key, index) => {
    const questionData = t[key as keyof typeof t];
    return {
      id: `solo_${key}`,
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
