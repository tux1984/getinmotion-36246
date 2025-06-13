import React from 'react';

interface TeamProfileQuestionsProps {
  language: 'en' | 'es';
  answers: any;
  onAnswerChange: (questionKey: string, value: any) => void;
  isMobile: boolean;
}

export const TeamProfileQuestions: React.FC<TeamProfileQuestionsProps> = ({
  language,
  answers,
  onAnswerChange,
  isMobile
}) => {
  const t = {
    en: {
      teamSize: 'Team Size',
      teamSizeOptions: [
        '2-5',
        '6-10',
        '11-20',
        '21+'
      ],
      industry: 'Industry',
      industryOptions: [
        'Tech',
        'Marketing',
        'Design',
        'Education',
        'Other'
      ],
      teamSkills: 'What are your team\'s skills?',
      teamSkillsOptions: [
        { label: 'Web Development', value: 'webDev' },
        { label: 'Mobile Development', value: 'mobileDev' },
        { label: 'UI/UX Design', value: 'uiUx' },
        { label: 'Digital Marketing', value: 'digitalMarketing' },
        { label: 'Content Creation', value: 'contentCreation' },
        { label: 'Data Analysis', value: 'dataAnalysis' },
        { label: 'Project Management', value: 'projectManagement' },
        { label: 'Sales', value: 'sales' },
        { label: 'Customer Support', value: 'customerSupport' }
      ],
      challenges: 'What are your biggest challenges?',
      challengesOptions: [
        { label: 'Finding new clients', value: 'newClients' },
        { label: 'Managing projects', value: 'projectManagement' },
        { label: 'Scaling the team', value: 'scalingTeam' },
        { label: 'Improving efficiency', value: 'improvingEfficiency' },
        { label: 'Staying innovative', value: 'stayingInnovative' }
      ]
    },
    es: {
      teamSize: 'Tamaño del Equipo',
      teamSizeOptions: [
        '2-5',
        '6-10',
        '11-20',
        '21+'
      ],
      industry: 'Industria',
      industryOptions: [
        'Tecnología',
        'Marketing',
        'Diseño',
        'Educación',
        'Otro'
      ],
      teamSkills: '¿Cuáles son las habilidades de tu equipo?',
      teamSkillsOptions: [
        { label: 'Desarrollo Web', value: 'webDev' },
        { label: 'Desarrollo Móvil', value: 'mobileDev' },
        { label: 'Diseño UI/UX', value: 'uiUx' },
        { label: 'Marketing Digital', value: 'digitalMarketing' },
        { label: 'Creación de Contenido', value: 'contentCreation' },
        { label: 'Análisis de Datos', value: 'dataAnalysis' },
        { label: 'Gestión de Proyectos', value: 'projectManagement' },
        { label: 'Ventas', value: 'sales' },
        { label: 'Atención al Cliente', value: 'customerSupport' }
      ],
      challenges: '¿Cuáles son sus mayores desafíos?',
      challengesOptions: [
        { label: 'Encontrar nuevos clientes', value: 'newClients' },
        { label: 'Gestionar proyectos', value: 'projectManagement' },
        { label: 'Escalar el equipo', value: 'scalingTeam' },
        { label: 'Mejorar la eficiencia', value: 'improvingEfficiency' },
        { label: 'Mantenerse innovador', value: 'stayingInnovative' }
      ]
    }
  };

  const handleSingleChange = (questionKey: string, value: string) => {
    onAnswerChange(questionKey, value);
  };

  const handleMultipleChange = (questionKey: string, selectedOptions: string[]) => {
    onAnswerChange(questionKey, selectedOptions);
  };

  return (
    <div className="space-y-8">
      {/* Single select questions */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t[language].teamSize}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t[language].teamSizeOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  checked={answers.teamSize === option}
                  onChange={() => handleSingleChange('teamSize', option)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t[language].industry}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t[language].industryOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  checked={answers.industry === option}
                  onChange={() => handleSingleChange('industry', option)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Multiple select questions */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t[language].teamSkills}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t[language].teamSkillsOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(answers.teamSkills) && answers.teamSkills.includes(typeof option === 'string' ? option : option.value)}
                  onChange={(e) => {
                    const value = typeof option === 'string' ? option : option.value;
                    const currentValues = Array.isArray(answers.teamSkills) ? answers.teamSkills : [];
                    const newValues = e.target.checked
                      ? [...currentValues, value]
                      : currentValues.filter(v => v !== value);
                    handleMultipleChange('teamSkills', newValues);
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {typeof option === 'string' ? option : option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t[language].challenges}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t[language].challengesOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(answers.challenges) && answers.challenges.includes(typeof option === 'string' ? option : option.value)}
                  onChange={(e) => {
                    const value = typeof option === 'string' ? option : option.value;
                    const currentValues = Array.isArray(answers.challenges) ? answers.challenges : [];
                    const newValues = e.target.checked
                      ? [...currentValues, value]
                      : currentValues.filter(v => v !== value);
                    handleMultipleChange('challenges', newValues);
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {typeof option === 'string' ? option : option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
