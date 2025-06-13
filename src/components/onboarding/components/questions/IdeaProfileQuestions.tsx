
import React from 'react';
import { motion } from 'framer-motion';

interface IdeaProfileQuestionsProps {
  currentQuestionIndex: number;
  showExtendedQuestions: boolean;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
  language: 'en' | 'es';
}

export const IdeaProfileQuestions: React.FC<IdeaProfileQuestionsProps> = ({
  currentQuestionIndex,
  showExtendedQuestions,
  answers,
  onAnswer,
  language
}) => {
  const basicQuestions = [
    {
      id: 'culturalField',
      type: 'checkbox',
      question: language === 'en' ? 'What cultural fields interest you?' : '¿Qué campos culturales te interesan?',
      options: language === 'en' ? [
        'Visual Arts', 'Music', 'Literature', 'Theater', 'Dance', 'Film', 'Digital Arts', 'Crafts'
      ] : [
        'Artes Visuales', 'Música', 'Literatura', 'Teatro', 'Danza', 'Cine', 'Artes Digitales', 'Artesanías'
      ]
    },
    {
      id: 'projectPhase',
      type: 'radio',
      question: language === 'en' ? 'What phase is your idea in?' : '¿En qué fase está tu idea?',
      options: language === 'en' ? [
        { label: 'Just an idea', value: 'justIdea' },
        { label: 'Research phase', value: 'research' },
        { label: 'Planning', value: 'planning' },
        { label: 'Ready to start', value: 'readyToStart' }
      ] : [
        { label: 'Solo una idea', value: 'justIdea' },
        { label: 'Fase de investigación', value: 'research' },
        { label: 'Planificación', value: 'planning' },
        { label: 'Listo para empezar', value: 'readyToStart' }
      ]
    },
    {
      id: 'targetAudience',
      type: 'checkbox',
      question: language === 'en' ? 'Who is your target audience?' : '¿Quién es tu público objetivo?',
      options: language === 'en' ? [
        'Children', 'Youth', 'Adults', 'Seniors', 'Artists', 'General Public', 'Tourists', 'Educational Institutions'
      ] : [
        'Niños', 'Jóvenes', 'Adultos', 'Adultos Mayores', 'Artistas', 'Público General', 'Turistas', 'Instituciones Educativas'
      ]
    },
    {
      id: 'initialResources',
      type: 'checkbox',
      question: language === 'en' ? 'What resources do you currently have?' : '¿Qué recursos tienes actualmente?',
      options: language === 'en' ? [
        'Personal savings', 'Team', 'Space', 'Equipment', 'Contacts', 'Experience', 'Seeking funding'
      ] : [
        'Ahorros personales', 'Equipo', 'Espacio', 'Equipamiento', 'Contactos', 'Experiencia', 'Buscando financiamiento'
      ]
    },
    {
      id: 'mainChallenges',
      type: 'checkbox',
      question: language === 'en' ? 'What are your main challenges?' : '¿Cuáles son tus principales desafíos?',
      options: language === 'en' ? [
        'Funding', 'Team building', 'Marketing', 'Legal issues', 'Technology', 'Audience reach', 'Competition'
      ] : [
        'Financiamiento', 'Formar equipo', 'Marketing', 'Temas legales', 'Tecnología', 'Alcance de audiencia', 'Competencia'
      ]
    },
    {
      id: 'fundingNeeds',
      type: 'radio',
      question: language === 'en' ? 'Do you need external funding?' : '¿Necesitas financiamiento externo?',
      options: language === 'en' ? [
        { label: 'Yes, immediately', value: 'yes' },
        { label: 'In the future', value: 'future' },
        { label: 'No, self-funded', value: 'no' }
      ] : [
        { label: 'Sí, inmediatamente', value: 'yes' },
        { label: 'En el futuro', value: 'future' },
        { label: 'No, autofinanciado', value: 'no' }
      ]
    }
  ];

  const extendedQuestions = [
    {
      id: 'previousExperience',
      type: 'checkbox',
      question: language === 'en' ? 'Do you have previous experience in?' : '¿Tienes experiencia previa en?',
      options: language === 'en' ? [
        'Cultural projects', 'Business management', 'Marketing', 'Fundraising', 'Event organization'
      ] : [
        'Proyectos culturales', 'Gestión empresarial', 'Marketing', 'Recaudación de fondos', 'Organización de eventos'
      ]
    },
    {
      id: 'collaborationInterest',
      type: 'checkbox',
      question: language === 'en' ? 'What type of collaborations interest you?' : '¿Qué tipo de colaboraciones te interesan?',
      options: language === 'en' ? [
        'Other artists', 'Cultural institutions', 'Government', 'Private sponsors', 'Educational centers'
      ] : [
        'Otros artistas', 'Instituciones culturales', 'Gobierno', 'Patrocinadores privados', 'Centros educativos'
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
