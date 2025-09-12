import React from 'react';
import { CraftType } from '@/types/artisan';

interface Question {
  id: string;
  question: string;
  type: 'select' | 'text';
  options?: string[];
}

interface IntelligentQuestionsFallbackProps {
  language: 'en' | 'es';
  craftType?: CraftType | null;
  businessDescription?: string;
}

export const IntelligentQuestionsFallback: React.FC<IntelligentQuestionsFallbackProps> = ({
  language,
  craftType,
  businessDescription
}) => {

  const generateFallbackQuestions = (): Question[] => {
    const translations = {
      en: {
        questions: [
          {
            id: 'target_audience',
            question: 'Who is your main target audience?',
            type: 'select' as const,
            options: ['Young adults (18-25)', 'Professionals (25-45)', 'Families with children', 'Seniors (55+)', 'Small businesses', 'Other']
          },
          {
            id: 'biggest_challenge',
            question: 'What is your biggest business challenge right now?',
            type: 'select' as const,
            options: ['Finding customers', 'Pricing products/services', 'Marketing & promotion', 'Managing finances', 'Time management', 'Competition']
          },
          {
            id: 'goals',
            question: 'What are your main goals for the next 3 months?',
            type: 'text' as const
          }
        ]
      },
      es: {
        questions: [
          {
            id: 'audiencia_objetivo',
            question: '¿Quién es tu audiencia principal?',
            type: 'select' as const,
            options: ['Jóvenes (18-25)', 'Profesionales (25-45)', 'Familias con niños', 'Adultos mayores (55+)', 'Pequeñas empresas', 'Otro']
          },
          {
            id: 'mayor_desafio',
            question: '¿Cuál es tu mayor desafío empresarial ahora?',
            type: 'select' as const,
            options: ['Encontrar clientes', 'Definir precios', 'Marketing y promoción', 'Manejar finanzas', 'Gestión del tiempo', 'Competencia']
          },
          {
            id: 'objetivos',
            question: '¿Cuáles son tus principales objetivos para los próximos 3 meses?',
            type: 'text' as const
          }
        ]
      }
    };

    let questions = translations[language].questions;

    // Add craft-specific questions if available
    if (craftType) {
      const craftQuestions = {
        en: {
          id: 'craft_experience',
          question: `How long have you been working with ${craftType}?`,
          type: 'select' as const,
          options: ['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years']
        },
        es: {
          id: 'experiencia_artesania',
          question: `¿Cuánto tiempo llevas trabajando con ${craftType}?`,
          type: 'select' as const,
          options: ['Menos de 1 año', '1-3 años', '3-5 años', 'Más de 5 años']
        }
      };
      questions = [craftQuestions[language], ...questions];
    }

    return questions;
  };

  const questions = generateFallbackQuestions();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">
        {language === 'es' ? 'Cuéntanos más sobre tu negocio' : 'Tell us more about your business'}
      </h3>
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {question.question}
            </label>
            {question.type === 'select' ? (
              <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                <option value="">
                  {language === 'es' ? 'Selecciona una opción...' : 'Select an option...'}
                </option>
                {question.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                rows={3}
                placeholder={language === 'es' ? 'Escribe tu respuesta aquí...' : 'Write your answer here...'}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};