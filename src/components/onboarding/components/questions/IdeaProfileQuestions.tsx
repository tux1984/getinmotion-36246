
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

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
  // Define basic questions for idea profile
  const basicQuestions = [
    {
      id: 'projectType',
      question: language === 'en' ? 'What type of project do you have in mind?' : '¿Qué tipo de proyecto tienes en mente?',
      component: (
        <div className="space-y-3">
          <Textarea 
            placeholder={language === 'en' ? 'Describe your project idea...' : 'Describe tu idea de proyecto...'}
            value={answers.projectType || ''}
            onChange={(e) => onAnswer('projectType', e.target.value)}
            className="h-32"
          />
        </div>
      )
    },
    {
      id: 'monetization',
      question: language === 'en' ? 'Have you thought about how to monetize your idea?' : '¿Ya pensaste en cómo monetizar tu idea?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.monetization || ''}
            onValueChange={(value) => onAnswer('monetization', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="monetization-yes" />
              <Label htmlFor="monetization-yes" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, I have monetization ideas' : 'Sí, tengo ideas de monetización'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="monetization-somewhat" />
              <Label htmlFor="monetization-somewhat" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'I have some thoughts, but not sure' : 'Tengo algunas ideas, pero no estoy seguro/a'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="monetization-no" />
              <Label htmlFor="monetization-no" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No, I haven\'t thought about it yet' : 'No, aún no he pensado en ello'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'timeCommitment',
      question: language === 'en' ? 'Are you working on this full-time or part-time?' : '¿Estás trabajando en esto a tiempo completo o parcial?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.timeCommitment || ''}
            onValueChange={(value) => onAnswer('timeCommitment', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="fullTime" id="time-full" />
              <Label htmlFor="time-full" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'Full-time' : 'Tiempo completo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="partTime" id="time-part" />
              <Label htmlFor="time-part" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Part-time' : 'Tiempo parcial'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="hobby" id="time-hobby" />
              <Label htmlFor="time-hobby" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Just a hobby/side project' : 'Solo un pasatiempo/proyecto paralelo'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'barriers',
      question: language === 'en' ? 'Is there anything preventing you from starting?' : '¿Hay algo que te impida comenzar?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.barriers || ''}
            onValueChange={(value) => onAnswer('barriers', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="funding" id="barrier-funding" />
              <Label htmlFor="barrier-funding" className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Lack of funding' : 'Falta de financiación'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="knowledge" id="barrier-knowledge" />
              <Label htmlFor="barrier-knowledge" className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Need more information/knowledge' : 'Necesito más información/conocimiento'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="time" id="barrier-time" />
              <Label htmlFor="barrier-time" className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'Time constraints' : 'Limitaciones de tiempo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="none" id="barrier-none" />
              <Label htmlFor="barrier-none" className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'No barriers, ready to start' : 'Sin barreras, listo para comenzar'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'ideaValidation',
      question: language === 'en' ? 'Have you validated your idea with potential customers?' : '¿Has validado tu idea con clientes potenciales?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.ideaValidation || ''}
            onValueChange={(value) => onAnswer('ideaValidation', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="validation-yes" />
              <Label htmlFor="validation-yes" className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, I\'ve talked to potential customers' : 'Sí, he hablado con clientes potenciales'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="validation-somewhat" />
              <Label htmlFor="validation-somewhat" className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'I\'ve discussed it with friends/family' : 'Lo he discutido con amigos/familia'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="validation-no" />
              <Label htmlFor="validation-no" className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'Not yet' : 'Todavía no'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];
  
  // Extended questions for deeper analysis
  const extendedQuestions = [
    {
      id: 'competitorAnalysis',
      question: language === 'en' ? 'Have you researched competitors in your space?' : '¿Has investigado a los competidores en tu espacio?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.competitorAnalysis || ''}
            onValueChange={(value) => onAnswer('competitorAnalysis', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="competitors-yes" />
              <Label htmlFor="competitors-yes">
                {language === 'en' ? 'Yes, extensively' : 'Sí, extensamente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="competitors-somewhat" />
              <Label htmlFor="competitors-somewhat">
                {language === 'en' ? 'I know some competitors' : 'Conozco algunos competidores'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="competitors-no" />
              <Label htmlFor="competitors-no">
                {language === 'en' ? 'Not yet' : 'Todavía no'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'targetAudience',
      question: language === 'en' ? 'How well defined is your target audience?' : '¿Qué tan bien definida está tu audiencia objetivo?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.targetAudience || ''}
            onValueChange={(value) => onAnswer('targetAudience', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="veryWell" id="audience-veryWell" />
              <Label htmlFor="audience-veryWell">
                {language === 'en' ? 'Very well defined with clear persona(s)' : 'Muy bien definida con persona(s) clara(s)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="audience-somewhat" />
              <Label htmlFor="audience-somewhat">
                {language === 'en' ? 'I have a general idea' : 'Tengo una idea general'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="notReally" id="audience-notReally" />
              <Label htmlFor="audience-notReally">
                {language === 'en' ? 'Not really defined yet' : 'Aún no está realmente definida'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'businessModel',
      question: language === 'en' ? 'Do you have a business model in mind?' : '¿Tienes un modelo de negocio en mente?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.businessModel || ''}
            onValueChange={(value) => onAnswer('businessModel', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="model-yes" />
              <Label htmlFor="model-yes">
                {language === 'en' ? 'Yes, I have a clear business model' : 'Sí, tengo un modelo de negocio claro'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="considering" id="model-considering" />
              <Label htmlFor="model-considering">
                {language === 'en' ? 'I\'m considering a few options' : 'Estoy considerando algunas opciones'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="model-no" />
              <Label htmlFor="model-no">
                {language === 'en' ? 'Not yet' : 'Todavía no'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'milestones',
      question: language === 'en' ? 'Have you set any timelines or milestones?' : '¿Has establecido algún cronograma o hito?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.milestones || ''}
            onValueChange={(value) => onAnswer('milestones', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="milestones-yes" />
              <Label htmlFor="milestones-yes">
                {language === 'en' ? 'Yes, I have a project plan with milestones' : 'Sí, tengo un plan de proyecto con hitos'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="rough" id="milestones-rough" />
              <Label htmlFor="milestones-rough">
                {language === 'en' ? 'I have a rough timeline in mind' : 'Tengo un cronograma aproximado en mente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="milestones-no" />
              <Label htmlFor="milestones-no">
                {language === 'en' ? 'No timelines yet' : 'Aún no hay cronogramas'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'skillGaps',
      question: language === 'en' ? 'Are there any skills you need to acquire or hire for?' : '¿Hay alguna habilidad que necesites adquirir o contratar?',
      component: (
        <div className="space-y-3">
          <Textarea 
            placeholder={language === 'en' ? 'List skills you need...' : 'Enumera las habilidades que necesitas...'}
            value={answers.skillGaps || ''}
            onChange={(e) => onAnswer('skillGaps', e.target.value)}
            className="h-32"
          />
        </div>
      )
    }
  ];
  
  const questions = showExtendedQuestions 
    ? [...basicQuestions, ...extendedQuestions]
    : basicQuestions;
    
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) return null;
  
  return (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold mb-2 text-purple-800">{currentQuestion.question}</h2>
        {currentQuestion.component}
      </div>
    </motion.div>
  );
};
