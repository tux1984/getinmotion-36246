
import React from 'react';
import { motion } from 'framer-motion';

interface TeamProfileQuestionsProps {
  currentQuestionIndex: number;
  showExtendedQuestions: boolean;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
  language: 'en' | 'es';
}

export const TeamProfileQuestions: React.FC<TeamProfileQuestionsProps> = ({
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
      question: language === 'en' ? 'What cultural activities does your team do?' : '¿Qué actividades culturales realiza tu equipo?',
      options: language === 'en' ? [
        'Performing arts', 'Visual arts', 'Music production', 'Cultural events', 'Workshops', 'Digital content', 'Festivals'
      ] : [
        'Artes escénicas', 'Artes visuales', 'Producción musical', 'Eventos culturales', 'Talleres', 'Contenido digital', 'Festivales'
      ]
    },
    {
      id: 'teamSize',
      type: 'radio',
      question: language === 'en' ? 'How many people are on your team?' : '¿Cuántas personas integran tu equipo?',
      options: language === 'en' ? [
        { label: '2-3 people', value: '2-3' },
        { label: '4-6 people', value: '4-6' },
        { label: '7-10 people', value: '7-10' },
        { label: 'More than 10', value: '10+' }
      ] : [
        { label: '2-3 personas', value: '2-3' },
        { label: '4-6 personas', value: '4-6' },
        { label: '7-10 personas', value: '7-10' },
        { label: 'Más de 10', value: '10+' }
      ]
    },
    {
      id: 'teamRoles',
      type: 'checkbox',
      question: language === 'en' ? 'What roles are defined in your team?' : '¿Qué roles están definidos en tu equipo?',
      options: language === 'en' ? [
        'Creative director', 'Producer', 'Marketing', 'Finance', 'Operations', 'Technical', 'Administration'
      ] : [
        'Director creativo', 'Productor', 'Marketing', 'Finanzas', 'Operaciones', 'Técnico', 'Administración'
      ]
    },
    {
      id: 'legalStructure',
      type: 'radio',
      question: language === 'en' ? 'What is your legal structure?' : '¿Cuál es tu estructura legal?',
      options: language === 'en' ? [
        { label: 'Formal company', value: 'formal' },
        { label: 'In process of formalization', value: 'process' },
        { label: 'Informal group', value: 'informal' },
        { label: 'Non-profit organization', value: 'nonprofit' }
      ] : [
        { label: 'Empresa formal', value: 'formal' },
        { label: 'En proceso de formalización', value: 'process' },
        { label: 'Grupo informal', value: 'informal' },
        { label: 'Organización sin fines de lucro', value: 'nonprofit' }
      ]
    },
    {
      id: 'operatingTime',
      type: 'radio',
      question: language === 'en' ? 'How long has your team been working together?' : '¿Cuánto tiempo lleva trabajando tu equipo?',
      options: language === 'en' ? [
        { label: 'Less than 6 months', value: 'under6months' },
        { label: '6 months to 1 year', value: '6months1year' },
        { label: '1-3 years', value: '1to3years' },
        { label: 'Over 3 years', value: 'over3years' }
      ] : [
        { label: 'Menos de 6 meses', value: 'under6months' },
        { label: '6 meses a 1 año', value: '6months1year' },
        { label: '1-3 años', value: '1to3years' },
        { label: 'Más de 3 años', value: 'over3years' }
      ]
    },
    {
      id: 'regularIncome',
      type: 'radio',
      question: language === 'en' ? 'Do you have regular income?' : '¿Tienen ingresos regulares?',
      options: language === 'en' ? [
        { label: 'Yes, consistent', value: 'yes' },
        { label: 'Partial, seasonal', value: 'partial' },
        { label: 'Sporadic', value: 'sporadic' },
        { label: 'No, seeking funding', value: 'no' }
      ] : [
        { label: 'Sí, consistentes', value: 'yes' },
        { label: 'Parciales, estacionales', value: 'partial' },
        { label: 'Esporádicos', value: 'sporadic' },
        { label: 'No, buscando financiamiento', value: 'no' }
      ]
    },
    {
      id: 'projectTypes',
      type: 'checkbox',
      question: language === 'en' ? 'What types of projects do you work on?' : '¿Qué tipos de proyectos trabajan?',
      options: language === 'en' ? [
        'Original productions', 'Commissioned work', 'Educational programs', 'Community projects', 'Commercial events', 'Government projects'
      ] : [
        'Producciones originales', 'Trabajos por encargo', 'Programas educativos', 'Proyectos comunitarios', 'Eventos comerciales', 'Proyectos gubernamentales'
      ]
    },
    {
      id: 'communicationMethods',
      type: 'checkbox',
      question: language === 'en' ? 'How does your team communicate?' : '¿Cómo se comunica tu equipo?',
      options: language === 'en' ? [
        'WhatsApp/Messaging', 'Email', 'Video calls', 'Project management tools', 'Regular meetings', 'Social media'
      ] : [
        'WhatsApp/Mensajería', 'Email', 'Videollamadas', 'Herramientas de gestión', 'Reuniones regulares', 'Redes sociales'
      ]
    },
    {
      id: 'mainChallenges',
      type: 'checkbox',
      question: language === 'en' ? 'What are your main challenges as a team?' : '¿Cuáles son sus principales desafíos como equipo?',
      options: language === 'en' ? [
        'Task coordination', 'Decision making', 'Financial management', 'Time management', 'Communication', 'Role definition'
      ] : [
        'Coordinación de tareas', 'Toma de decisiones', 'Gestión financiera', 'Gestión del tiempo', 'Comunicación', 'Definición de roles'
      ]
    }
  ];

  const extendedQuestions = [
    {
      id: 'financialManagement',
      type: 'radio',
      question: language === 'en' ? 'How do you manage team finances?' : '¿Cómo manejan las finanzas del equipo?',
      options: language === 'en' ? [
        { label: 'Professional accountant', value: 'professional' },
        { label: 'Team member handles it', value: 'internal' },
        { label: 'Basic tracking', value: 'basic' },
        { label: 'Informal management', value: 'informal' }
      ] : [
        { label: 'Contador profesional', value: 'professional' },
        { label: 'Miembro del equipo lo maneja', value: 'internal' },
        { label: 'Seguimiento básico', value: 'basic' },
        { label: 'Gestión informal', value: 'informal' }
      ]
    },
    {
      id: 'growthPlans',
      type: 'checkbox',
      question: language === 'en' ? 'What are your growth plans?' : '¿Cuáles son sus planes de crecimiento?',
      options: language === 'en' ? [
        'Expand team', 'New markets', 'New services', 'International reach', 'Technology adoption', 'Strategic alliances'
      ] : [
        'Expandir equipo', 'Nuevos mercados', 'Nuevos servicios', 'Alcance internacional', 'Adopción tecnológica', 'Alianzas estratégicas'
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
