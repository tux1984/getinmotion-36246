import React from 'react';

interface SoloProfileQuestionsProps {
  language: 'en' | 'es';
  answers: any;
  onAnswerChange: (questionKey: string, value: any) => void;
  isMobile: boolean;
}

export const SoloProfileQuestions: React.FC<SoloProfileQuestionsProps> = ({
  language,
  answers,
  onAnswerChange,
  isMobile
}) => {
  const t = {
    en: {
      role: 'Your primary role',
      roleOptions: ['Designer', 'Developer', 'Marketer', 'Founder', 'Other'],
      experience: 'Years of experience',
      experienceOptions: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'],
      skills: 'Your key skills',
      skillsOptions: [
        { label: 'UI Design', value: 'ui-design' },
        { label: 'Web Development', value: 'web-dev' },
        { label: 'Content Marketing', value: 'content-marketing' },
        { label: 'Project Management', value: 'project-management' },
      ],
      challenges: 'Biggest challenges you face',
      challengesOptions: [
        { label: 'Finding clients', value: 'finding-clients' },
        { label: 'Managing time', value: 'time-management' },
        { label: 'Staying motivated', value: 'staying-motivated' },
        { label: 'Learning new skills', value: 'learning-skills' },
      ],
    },
    es: {
      role: 'Tu rol principal',
      roleOptions: ['Diseñador', 'Desarrollador', 'Marketer', 'Fundador', 'Otro'],
      experience: 'Años de experiencia',
      experienceOptions: ['Menos de 1 año', '1-3 años', '3-5 años', '5+ años'],
      skills: 'Tus habilidades clave',
      skillsOptions: [
        { label: 'Diseño UI', value: 'ui-design' },
        { label: 'Desarrollo Web', value: 'web-dev' },
        { label: 'Marketing de Contenidos', value: 'content-marketing' },
        { label: 'Gestión de Proyectos', value: 'project-management' },
      ],
      challenges: 'Mayores desafíos que enfrentas',
      challengesOptions: [
        { label: 'Encontrar clientes', value: 'finding-clients' },
        { label: 'Gestionar el tiempo', value: 'time-management' },
        { label: 'Mantenerse motivado', value: 'staying-motivated' },
        { label: 'Aprender nuevas habilidades', value: 'learning-skills' },
      ],
    },
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
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t[language].role}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t[language].roleOptions.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={answers.role === option}
                onChange={(e) => handleSingleChange('role', e.target.value)}
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
          {t[language].experience}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t[language].experienceOptions.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={answers.experience === option}
                onChange={(e) => handleSingleChange('experience', e.target.value)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Multiple select questions */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t[language].skills}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t[language].skillsOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(answers.skills) && answers.skills.includes(option.value)}
                  onChange={(e) => {
                    const value = option.value;
                    const currentValues = Array.isArray(answers.skills) ? answers.skills : [];
                    const newValues = e.target.checked
                      ? [...currentValues, value]
                      : currentValues.filter(v => v !== value);
                    handleMultipleChange('skills', newValues);
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {option.label}
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
                  checked={Array.isArray(answers.challenges) && answers.challenges.includes(option.value)}
                  onChange={(e) => {
                    const value = option.value;
                    const currentValues = Array.isArray(answers.challenges) ? answers.challenges : [];
                    const newValues = e.target.checked
                      ? [...currentValues, value]
                      : currentValues.filter(v => v !== value);
                    handleMultipleChange('challenges', newValues);
                  }}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
