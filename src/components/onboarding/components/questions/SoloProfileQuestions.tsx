
import React from 'react';
import { motion } from 'framer-motion';

interface SoloProfileQuestionsProps {
  currentQuestionIndex: number;
  showExtendedQuestions: boolean;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
  language: 'en' | 'es';
}

export const SoloProfileQuestions: React.FC<SoloProfileQuestionsProps> = ({
  currentQuestionIndex,
  showExtendedQuestions,
  answers,
  onAnswer,
  language
}) => {
  const basicQuestions = [
    {
      id: 'culturalActivities',
      type: 'checkbox',
      question: language === 'en' ? 'What cultural activities do you do?' : '¿Qué actividades culturales realizas?',
      options: language === 'en' ? [
        'Visual arts creation', 'Music performance', 'Writing', 'Teaching', 'Event organization', 'Digital content', 'Crafts'
      ] : [
        'Creación de artes visuales', 'Interpretación musical', 'Escritura', 'Enseñanza', 'Organización de eventos', 'Contenido digital', 'Artesanías'
      ]
    },
    {
      id: 'timeInBusiness',
      type: 'radio',
      question: language === 'en' ? 'How long have you been working independently?' : '¿Cuánto tiempo llevas trabajando independientemente?',
      options: language === 'en' ? [
        { label: 'Less than 6 months', value: 'under6months' },
        { label: '6 months to 1 year', value: '6months1year' },
        { label: '1-2 years', value: '1to2years' },
        { label: 'Over 2 years', value: 'over2years' }
      ] : [
        { label: 'Menos de 6 meses', value: 'under6months' },
        { label: '6 meses a 1 año', value: '6months1year' },
        { label: '1-2 años', value: '1to2years' },
        { label: 'Más de 2 años', value: 'over2years' }
      ]
    },
    {
      id: 'paymentMethods',
      type: 'checkbox',
      question: language === 'en' ? 'How do you receive payments?' : '¿Cómo recibes pagos?',
      options: language === 'en' ? [
        'Cash', 'Bank transfer', 'Digital platforms', 'Credit cards', 'PayPal/Digital wallets', 'Checks'
      ] : [
        'Efectivo', 'Transferencia bancaria', 'Plataformas digitales', 'Tarjetas de crédito', 'PayPal/Billeteras digitales', 'Cheques'
      ]
    },
    {
      id: 'brandIdentity',
      type: 'radio',
      question: language === 'en' ? 'Do you have a defined brand identity?' : '¿Tienes una identidad de marca definida?',
      options: language === 'en' ? [
        { label: 'Complete (logo, colors, style)', value: 'complete' },
        { label: 'Partial (some elements)', value: 'partial' },
        { label: 'Basic (just name)', value: 'basic' },
        { label: 'None', value: 'none' }
      ] : [
        { label: 'Completa (logo, colores, estilo)', value: 'complete' },
        { label: 'Parcial (algunos elementos)', value: 'partial' },
        { label: 'Básica (solo nombre)', value: 'basic' },
        { label: 'Ninguna', value: 'none' }
      ]
    },
    {
      id: 'financialControl',
      type: 'radio',
      question: language === 'en' ? 'How do you manage your finances?' : '¿Cómo manejas tus finanzas?',
      options: language === 'en' ? [
        { label: 'Professional accounting software', value: 'professional' },
        { label: 'Simple spreadsheets', value: 'spreadsheets' },
        { label: 'Manual records', value: 'manual' },
        { label: 'Intuition/Memory', value: 'intuition' }
      ] : [
        { label: 'Software contable profesional', value: 'professional' },
        { label: 'Hojas de cálculo simples', value: 'spreadsheets' },
        { label: 'Registros manuales', value: 'manual' },
        { label: 'Intuición/Memoria', value: 'intuition' }
      ]
    },
    {
      id: 'currentActivities',
      type: 'checkbox',
      question: language === 'en' ? 'What activities do you currently do?' : '¿Qué actividades realizas actualmente?',
      options: language === 'en' ? [
        'Local sales', 'Online sales', 'Workshops', 'Exhibitions', 'Commissions', 'Export', 'Collaborations'
      ] : [
        'Ventas locales', 'Ventas online', 'Talleres', 'Exposiciones', 'Comisiones', 'Exportación', 'Colaboraciones'
      ]
    },
    {
      id: 'mainChallenges',
      type: 'checkbox',
      question: language === 'en' ? 'What are your main challenges?' : '¿Cuáles son tus principales desafíos?',
      options: language === 'en' ? [
        'Finding clients', 'Pricing products/services', 'Financial management', 'Digital marketing', 'Time management', 'Competition'
      ] : [
        'Encontrar clientes', 'Fijar precios de productos/servicios', 'Gestión financiera', 'Marketing digital', 'Gestión del tiempo', 'Competencia'
      ]
    }
  ];

  const extendedQuestions = [
    {
      id: 'exportExperience',
      type: 'radio',
      question: language === 'en' ? 'Do you have export experience?' : '¿Tienes experiencia exportando?',
      options: language === 'en' ? [
        { label: 'Yes, regularly', value: 'yes' },
        { label: 'Occasionally', value: 'occasionally' },
        { label: 'No, but interested', value: 'interested' },
        { label: 'No', value: 'no' }
      ] : [
        { label: 'Sí, regularmente', value: 'yes' },
        { label: 'Ocasionalmente', value: 'occasionally' },
        { label: 'No, pero me interesa', value: 'interested' },
        { label: 'No', value: 'no' }
      ]
    },
    {
      id: 'priceDefinition',
      type: 'radio',
      question: language === 'en' ? 'How do you define your prices?' : '¿Cómo defines tus precios?',
      options: language === 'en' ? [
        { label: 'Market research', value: 'research' },
        { label: 'Cost + margin', value: 'cost' },
        { label: 'Competition based', value: 'competition' },
        { label: 'Struggling with this', value: 'struggling' }
      ] : [
        { label: 'Investigación de mercado', value: 'research' },
        { label: 'Costo + margen', value: 'cost' },
        { label: 'Basado en competencia', value: 'competition' },
        { label: 'Tengo dificultades con esto', value: 'struggling' }
      ]
    }
  ];

  const currentQuestions = showExtendedQuestions ? extendedQuestions : basicQuestions;
  const question = currentQuestions[currentQuestionIndex];

  if (!question) return null;

  const handleAnswer = (value: any) => {
    if (question.type === 'checkbox') {
      const currentValues = answers[question.id] || [];
      const newValues = currentValues.includes(value) 
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      onAnswer(question.id, newValues);
    } else {
      onAnswer(question.id, value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-purple-800 mb-6">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.type === 'checkbox' ? (
          // Multiple selection (checkbox)
          question.options.map((option: string) => (
            <label
              key={option}
              className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                checked={(answers[question.id] || []).includes(option)}
                onChange={() => handleAnswer(option)}
                className="mr-3 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))
        ) : (
          // Single selection (radio)
          question.options.map((option: any) => (
            <label
              key={option.value}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                answers[question.id] === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={answers[question.id] === option.value}
                onChange={() => handleAnswer(option.value)}
                className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))
        )}
      </div>
    </motion.div>
  );
};
