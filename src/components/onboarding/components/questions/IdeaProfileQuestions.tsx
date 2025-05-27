
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Palette, Scissors, Users, Heart, Calendar, Lightbulb, Target, Clock, Search } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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
  // BLOQUE 1 - Perfil cultural
  const culturalProfileQuestions = [
    {
      id: 'creativeIndustry',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'What is your main creative industry or field?' : '¿Cuál es tu industria o campo creativo principal?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.creativeIndustry || ''}
            onValueChange={(value) => onAnswer('creativeIndustry', value)}
            className="grid grid-cols-1 gap-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="music" id="industry-music" />
              <Label htmlFor="industry-music" className="flex items-center cursor-pointer">
                <Music className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'Music' : 'Música'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="visual" id="industry-visual" />
              <Label htmlFor="industry-visual" className="flex items-center cursor-pointer">
                <Palette className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Visual or plastic arts' : 'Artes visuales o plásticas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="crafts" id="industry-crafts" />
              <Label htmlFor="industry-crafts" className="flex items-center cursor-pointer">
                <Scissors className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Traditional or modern crafts' : 'Artesanía (tradicional o moderna)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="theater" id="industry-theater" />
              <Label htmlFor="industry-theater" className="flex items-center cursor-pointer">
                <Users className="mr-2 h-5 w-5 text-pink-500" />
                {language === 'en' ? 'Theater / dance / performance' : 'Teatro / danza / performance'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="wellness" id="industry-wellness" />
              <Label htmlFor="industry-wellness" className="flex items-center cursor-pointer">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                {language === 'en' ? 'Products for personal care or home' : 'Productos para el cuidado personal o del hogar'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="events" id="industry-events" />
              <Label htmlFor="industry-events" className="flex items-center cursor-pointer">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                {language === 'en' ? 'Cultural production or events' : 'Producción o eventos culturales'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'plannedActivities',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'What activities do you plan to develop in this venture?' : '¿Qué actividades planeás desarrollar en este emprendimiento?',
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-create" 
              checked={answers.plannedActivities?.includes('create')}
              onCheckedChange={(checked) => {
                const current = answers.plannedActivities || [];
                const newValue = checked 
                  ? [...current, 'create'] 
                  : current.filter((item: string) => item !== 'create');
                onAnswer('plannedActivities', newValue);
              }} 
            />
            <Label htmlFor="act-create">{language === 'en' ? 'Create and sell physical objects' : 'Crear y vender objetos físicos'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-teach" 
              checked={answers.plannedActivities?.includes('teach')}
              onCheckedChange={(checked) => {
                const current = answers.plannedActivities || [];
                const newValue = checked 
                  ? [...current, 'teach'] 
                  : current.filter((item: string) => item !== 'teach');
                onAnswer('plannedActivities', newValue);
              }} 
            />
            <Label htmlFor="act-teach">{language === 'en' ? 'Provide classes or workshops' : 'Brindar clases o talleres'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-artistic" 
              checked={answers.plannedActivities?.includes('artistic')}
              onCheckedChange={(checked) => {
                const current = answers.plannedActivities || [];
                const newValue = checked 
                  ? [...current, 'artistic'] 
                  : current.filter((item: string) => item !== 'artistic');
                onAnswer('plannedActivities', newValue);
              }} 
            />
            <Label htmlFor="act-artistic">{language === 'en' ? 'Offer artistic services in person (shows, exhibitions, performances)' : 'Ofrecer servicios artísticos presenciales (shows, exhibiciones, espectáculos)'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-online" 
              checked={answers.plannedActivities?.includes('online')}
              onCheckedChange={(checked) => {
                const current = answers.plannedActivities || [];
                const newValue = checked 
                  ? [...current, 'online'] 
                  : current.filter((item: string) => item !== 'online');
                onAnswer('plannedActivities', newValue);
              }} 
            />
            <Label htmlFor="act-online">{language === 'en' ? 'Publish or sell works online (social media, digital platforms)' : 'Publicar o vender obras en línea (redes sociales, plataformas digitales)'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-collaborate" 
              checked={answers.plannedActivities?.includes('collaborate')}
              onCheckedChange={(checked) => {
                const current = answers.plannedActivities || [];
                const newValue = checked 
                  ? [...current, 'collaborate'] 
                  : current.filter((item: string) => item !== 'collaborate');
                onAnswer('plannedActivities', newValue);
              }} 
            />
            <Label htmlFor="act-collaborate">{language === 'en' ? 'Collaborate with other creators or collectives' : 'Colaborar con otros creadores o colectivos'}</Label>
          </div>
        </div>
      )
    },
    {
      id: 'ideaAge',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'How long ago did this idea emerge?' : '¿Hace cuánto surgió esta idea?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.ideaAge || ''}
            onValueChange={(value) => onAnswer('ideaAge', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="under6months" id="idea-under6" />
              <Label htmlFor="idea-under6" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-500" />
                {language === 'en' ? 'Less than 6 months' : 'Menos de 6 meses'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="6months2years" id="idea-6m2y" />
              <Label htmlFor="idea-6m2y" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Between 6 months and 2 years' : 'Entre 6 meses y 2 años'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="over2years" id="idea-over2" />
              <Label htmlFor="idea-over2" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'More than 2 years' : 'Más de 2 años'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  // BLOQUE 2 - Estado del proyecto
  const projectStateQuestions = [
    {
      id: 'projectPhase',
      block: 'Estado del Proyecto',
      question: language === 'en' ? 'What phase is your project/idea in?' : '¿En qué fase se encuentra tu proyecto/idea?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.projectPhase || ''}
            onValueChange={(value) => onAnswer('projectPhase', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="justIdea" id="phase-idea" />
              <Label htmlFor="phase-idea" className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                {language === 'en' ? 'I only have the idea in mind, without prototype or plan' : 'Sólo tengo la idea en mente, sin prototipo ni plan'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="research" id="phase-research" />
              <Label htmlFor="phase-research" className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'I have done research or an initial sketch' : 'He hecho investigación o un boceto inicial'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="prototype" id="phase-prototype" />
              <Label htmlFor="phase-prototype" className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'I have a prototype or proof of concept sample' : 'Tengo un prototipo o muestra de prueba de concepto'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="funding" id="phase-funding" />
              <Label htmlFor="phase-funding" className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'I am looking for support or funding to start' : 'Busco apoyos o financiamiento para arrancar'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'businessPlan',
      block: 'Estado del Proyecto',
      question: language === 'en' ? 'Do you have a written plan or strategy?' : '¿Contás con un plan o estrategia escrita?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.businessPlan || ''}
            onValueChange={(value) => onAnswer('businessPlan', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="plan-yes" />
              <Label htmlFor="plan-yes">
                {language === 'en' ? 'Yes, I have a draft or preliminary plan' : 'Sí, tengo un borrador o plan preliminar'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="goals" id="plan-goals" />
              <Label htmlFor="plan-goals">
                {language === 'en' ? 'No, but I have some clear goals in mind' : 'No, pero tengo algunas metas claras en mente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="plan-no" />
              <Label htmlFor="plan-no">
                {language === 'en' ? 'No, I haven\'t defined it yet' : 'No, todavía no lo he definido'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'initialResources',
      block: 'Estado del Proyecto',
      question: language === 'en' ? 'Do you have initial resources (time, money or other support) to start?' : '¿Tenés recursos iniciales (tiempo, dinero u otros apoyos) para arrancar?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.initialResources || ''}
            onValueChange={(value) => onAnswer('initialResources', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="resources-yes" />
              <Label htmlFor="resources-yes">
                {language === 'en' ? 'Yes, I have some savings/investment to start' : 'Sí, tengo algún ahorro/inversión para comenzar'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="seeking" id="resources-seeking" />
              <Label htmlFor="resources-seeking">
                {language === 'en' ? 'I am looking for funding or grants' : 'Estoy buscando financiamiento o subvenciones'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="external" id="resources-external" />
              <Label htmlFor="resources-external">
                {language === 'en' ? 'Not yet, it will depend on getting external support' : 'Aún no, dependerá de conseguir apoyo externo'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  // All questions including extended ones for deep analysis
  const allQuestions = [
    ...culturalProfileQuestions,
    ...projectStateQuestions
  ];

  const extendedQuestions = [
    {
      id: 'audienceValidation',
      block: 'Análisis Profundo',
      question: language === 'en' ? 'Have you talked to people interested in your idea or potential audience?' : '¿Ya conversaste con personas interesadas en tu idea o potencial audiencia?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.audienceValidation || ''}
            onValueChange={(value) => onAnswer('audienceValidation', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="validation-yes" />
              <Label htmlFor="validation-yes">{language === 'en' ? 'Yes, extensively' : 'Sí, extensamente'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="some" id="validation-some" />
              <Label htmlFor="validation-some">{language === 'en' ? 'Some conversations' : 'Algunas conversaciones'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="validation-no" />
              <Label htmlFor="validation-no">{language === 'en' ? 'Not yet' : 'Todavía no'}</Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'fundingNeeds',
      block: 'Análisis Profundo',
      question: language === 'en' ? 'Do you know how much money you would need to develop the project?' : '¿Sabés cuánto dinero necesitarías para desarrollar el proyecto?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.fundingNeeds || ''}
            onValueChange={(value) => onAnswer('fundingNeeds', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="clear" id="funding-clear" />
              <Label htmlFor="funding-clear">{language === 'en' ? 'Yes, I have a clear estimate' : 'Sí, tengo una estimación clara'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="rough" id="funding-rough" />
              <Label htmlFor="funding-rough">{language === 'en' ? 'I have a rough idea' : 'Tengo una idea aproximada'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="funding-no" />
              <Label htmlFor="funding-no">{language === 'en' ? 'No idea yet' : 'Aún no tengo idea'}</Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  const questions = showExtendedQuestions 
    ? [...allQuestions, ...extendedQuestions]
    : allQuestions;
    
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
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {currentQuestion.block}
          </span>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-purple-800">{currentQuestion.question}</h2>
        {currentQuestion.component}
      </div>
    </motion.div>
  );
};
