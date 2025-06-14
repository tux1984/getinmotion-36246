
import React from 'react';

interface IdeaProfileQuestionsProps {
  language: 'en' | 'es';
  answers: any;
  onAnswerChange: (questionKey: string, value: any) => void;
  isMobile: boolean;
}

export const IdeaProfileQuestions: React.FC<IdeaProfileQuestionsProps> = ({
  language,
  answers,
  onAnswerChange,
  isMobile
}) => {
  const t = {
    en: {
      ideaStage: 'What stage is your idea in?',
      ideaStageOptions: ['Just a concept', 'I have a prototype', 'I have an MVP', 'Already have users/customers'],
      targetAudience: 'How well have you defined your target audience?',
      targetAudienceOptions: ['Not defined yet', 'I have a general idea', 'I have a detailed profile', 'I have spoken with them'],
      problemValidation: 'Have you validated the problem you are solving?',
      problemValidationOptions: ['Not yet', 'I have some assumptions', 'I have conducted interviews/surveys', 'I have data that proves it'],
      uniqueness: 'What makes your idea unique or different?',
      uniquenessPlaceholder: 'e.g., my technology, my business model, my approach to the market...',
    },
    es: {
      ideaStage: '¿En qué etapa se encuentra tu idea?',
      ideaStageOptions: ['Solo un concepto', 'Tengo un prototipo', 'Tengo un MVP', 'Ya tengo usuarios/clientes'],
      targetAudience: '¿Qué tan bien has definido tu público objetivo?',
      targetAudienceOptions: ['Aún no está definido', 'Tengo una idea general', 'Tengo un perfil detallado', 'He hablado con ellos'],
      problemValidation: '¿Has validado el problema que estás resolviendo?',
      problemValidationOptions: ['Todavía no', 'Tengo algunas suposiciones', 'He realizado entrevistas/encuestas', 'Tengo datos que lo demuestran'],
      uniqueness: '¿Qué hace que tu idea sea única o diferente?',
      uniquenessPlaceholder: 'Ej: mi tecnología, mi modelo de negocio, mi enfoque del mercado...',
    },
  };

  const handleSingleChange = (questionKey: string, value: string) => {
    onAnswerChange(questionKey, value);
  };
  
  const handleTextChange = (questionKey: string, value: string) => {
    onAnswerChange(questionKey, value);
  };

  return (
    <div className="space-y-8">
      {/* Single select questions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t[language].ideaStage}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t[language].ideaStageOptions.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={answers.ideaStage === option}
                onChange={(e) => handleSingleChange('ideaStage', e.target.value)}
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
          {t[language].targetAudience}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t[language].targetAudienceOptions.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={answers.targetAudience === option}
                onChange={(e) => handleSingleChange('targetAudience', e.target.value)}
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
          {t[language].problemValidation}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t[language].problemValidationOptions.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={answers.problemValidation === option}
                onChange={(e) => handleSingleChange('problemValidation', e.target.value)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Text area question */}
       <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t[language].uniqueness}
        </h3>
        <textarea
          value={answers.uniqueness || ''}
          onChange={(e) => handleTextChange('uniqueness', e.target.value)}
          placeholder={t[language].uniquenessPlaceholder}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          rows={4}
        />
      </div>
    </div>
  );
};
