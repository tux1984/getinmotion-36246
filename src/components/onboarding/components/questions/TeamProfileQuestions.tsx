
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Palette, Scissors, Users, Heart, Calendar, Clock, Building, CreditCard, FileText, MessagesSquare, Target } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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
  // BLOQUE 1 - Perfil cultural (same as others)
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
      id: 'teamActivities',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'What activities does your venture perform?' : '¿Qué actividades realiza tu emprendimiento?',
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-produce" 
              checked={answers.teamActivities?.includes('produce')}
              onCheckedChange={(checked) => {
                const current = answers.teamActivities || [];
                const newValue = checked 
                  ? [...current, 'produce'] 
                  : current.filter((item: string) => item !== 'produce');
                onAnswer('teamActivities', newValue);
              }} 
            />
            <Label htmlFor="act-produce">{language === 'en' ? 'We produce and sell physical objects' : 'Producimos y vendemos objetos físicos'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-classes" 
              checked={answers.teamActivities?.includes('classes')}
              onCheckedChange={(checked) => {
                const current = answers.teamActivities || [];
                const newValue = checked 
                  ? [...current, 'classes'] 
                  : current.filter((item: string) => item !== 'classes');
                onAnswer('teamActivities', newValue);
              }} 
            />
            <Label htmlFor="act-classes">{language === 'en' ? 'We provide classes or workshops' : 'Impartimos clases o talleres'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-live" 
              checked={answers.teamActivities?.includes('live')}
              onCheckedChange={(checked) => {
                const current = answers.teamActivities || [];
                const newValue = checked 
                  ? [...current, 'live'] 
                  : current.filter((item: string) => item !== 'live');
                onAnswer('teamActivities', newValue);
              }} 
            />
            <Label htmlFor="act-live">{language === 'en' ? 'We organize live presentations or exhibitions' : 'Organizamos presentaciones o exhibiciones en vivo'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-digital" 
              checked={answers.teamActivities?.includes('digital')}
              onCheckedChange={(checked) => {
                const current = answers.teamActivities || [];
                const newValue = checked 
                  ? [...current, 'digital'] 
                  : current.filter((item: string) => item !== 'digital');
                onAnswer('teamActivities', newValue);
              }} 
            />
            <Label htmlFor="act-digital">{language === 'en' ? 'We manage sales or visibility on digital networks' : 'Gestionamos ventas o visibilidad en redes digitales'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-collaborate" 
              checked={answers.teamActivities?.includes('collaborate')}
              onCheckedChange={(checked) => {
                const current = answers.teamActivities || [];
                const newValue = checked 
                  ? [...current, 'collaborate'] 
                  : current.filter((item: string) => item !== 'collaborate');
                onAnswer('teamActivities', newValue);
              }} 
            />
            <Label htmlFor="act-collaborate">{language === 'en' ? 'We collaborate with other collectives or projects' : 'Colaboramos con otros colectivos o proyectos'}</Label>
          </div>
        </div>
      )
    },
    {
      id: 'timeInBusiness',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'How long has your venture been running?' : '¿Hace cuánto tiempo está en marcha tu emprendimiento?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.timeInBusiness || ''}
            onValueChange={(value) => onAnswer('timeInBusiness', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="under6months" id="time-under6" />
              <Label htmlFor="time-under6" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange-500" />
                {language === 'en' ? 'Less than 6 months' : 'Menos de 6 meses'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="6months2years" id="time-6m2y" />
              <Label htmlFor="time-6m2y" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Between 6 months and 2 years' : 'Entre 6 meses y 2 años'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="over2years" id="time-over2" />
              <Label htmlFor="time-over2" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'More than 2 years' : 'Más de 2 años'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  // BLOQUE 2 - Estado del emprendimiento
  const businessStateQuestions = [
    {
      id: 'regularIncome',
      block: 'Estado del Emprendimiento',
      question: language === 'en' ? 'Do you currently obtain regular income?' : '¿Obtienen ingresos regulares actualmente?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.regularIncome || ''}
            onValueChange={(value) => onAnswer('regularIncome', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="income-yes" />
              <Label htmlFor="income-yes" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, we have regular sales or active contracts' : 'Sí, tenemos ventas regulares o contratos activos'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="partial" id="income-partial" />
              <Label htmlFor="income-partial" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Partially, sometimes we lack consistency' : 'Parcialmente, a veces falta consistencia'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="income-no" />
              <Label htmlFor="income-no" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'Not yet, we are in initial validation stages' : 'No aún, estamos en etapas iniciales de validación'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'legalStructure',
      block: 'Estado del Emprendimiento',
      question: language === 'en' ? 'Do you have a legal or formal structure?' : '¿Tienen una estructura legal o formal?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.legalStructure || ''}
            onValueChange={(value) => onAnswer('legalStructure', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="formal" id="legal-formal" />
              <Label htmlFor="legal-formal" className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, we are formalized and invoice legally' : 'Sí, estamos formalizados y facturamos legalmente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="process" id="legal-process" />
              <Label htmlFor="legal-process" className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'In process of formalizing or researching' : 'En proceso de formalizar o en investigación'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="informal" id="legal-informal" />
              <Label htmlFor="legal-informal" className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No, we operate informally for now' : 'No, operamos de manera informal por ahora'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'fundingReceived',
      block: 'Estado del Emprendimiento',
      question: language === 'en' ? 'Have you received any funding or support so far?' : '¿Recibieron algún financiamiento o apoyo hasta ahora?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.fundingReceived || ''}
            onValueChange={(value) => onAnswer('fundingReceived', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="funding-yes" />
              <Label htmlFor="funding-yes">
                {language === 'en' ? 'Yes (grants, loans or external investment)' : 'Sí (subvenciones, préstamos o inversión externa)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="small" id="funding-small" />
              <Label htmlFor="funding-small">
                {language === 'en' ? 'Some small support (self-financing or donations)' : 'Algo de apoyo pequeño (autofinanciación o donaciones)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="funding-no" />
              <Label htmlFor="funding-no">
                {language === 'en' ? 'No, everything is our own without external support' : 'No, todo es propio sin apoyos externos'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  // BLOQUE 3 - Organización y gestión
  const organizationQuestions = [
    {
      id: 'teamSize',
      block: 'Organización y Gestión',
      question: language === 'en' ? 'How many people work in the team (including you)?' : '¿Cuántas personas trabajan en el equipo (incluyéndote)?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.teamSize || ''}
            onValueChange={(value) => onAnswer('teamSize', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="2-3" id="size-small" />
              <Label htmlFor="size-small" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-500" />
                {language === 'en' ? '2-3 people' : '2-3 personas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="4-6" id="size-medium" />
              <Label htmlFor="size-medium" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? '4-6 people' : '4-6 personas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="7+" id="size-large" />
              <Label htmlFor="size-large" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-pink-500" />
                {language === 'en' ? '7 or more people' : '7 o más personas'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'taskOrganization',
      block: 'Organización y Gestión',
      question: language === 'en' ? 'How do you organize tasks and internal communication?' : '¿Cómo organizan las tareas y la comunicación interna?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.taskOrganization || ''}
            onValueChange={(value) => onAnswer('taskOrganization', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="software" id="org-software" />
              <Label htmlFor="org-software" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Mainly with management apps/software (e.g. Trello, Slack, Notion)' : 'Principalmente con apps/software de gestión (ej. Trello, Slack, Notion)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="chats" id="org-chats" />
              <Label htmlFor="org-chats" className="flex items-center">
                <MessagesSquare className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'With group chats (WhatsApp, Telegram) and sporadic meetings' : 'Con chats de grupo (WhatsApp, Telegram) y reuniones esporádicas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="meetings" id="org-meetings" />
              <Label htmlFor="org-meetings" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'Regular in-person/virtual meetings and shared spreadsheets' : 'Reuniones regulares presenciales/virtuales y planillas compartidas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="individual" id="org-individual" />
              <Label htmlFor="org-individual" className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'Each one decides on their own without a fixed tool' : 'Cada uno decide por su cuenta sin una herramienta fija'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'definedRoles',
      block: 'Organización y Gestión',
      question: language === 'en' ? 'Do you have defined roles?' : '¿Tienen roles definidos?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.definedRoles || ''}
            onValueChange={(value) => onAnswer('definedRoles', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="clear" id="roles-clear" />
              <Label htmlFor="roles-clear" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, each member has clear responsibilities' : 'Sí, cada integrante tiene responsabilidades claras'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="informal" id="roles-informal" />
              <Label htmlFor="roles-informal" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Not formally, but each one assumes tasks as needed' : 'No formalmente, pero cada uno asume tareas según la necesidad'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="working" id="roles-working" />
              <Label htmlFor="roles-working" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'We are working on it, looking to better define roles' : 'Estamos en ello, buscando definir mejor los roles'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];

  const allQuestions = [
    ...culturalProfileQuestions,
    ...businessStateQuestions,
    ...organizationQuestions
  ];

  const extendedQuestions = [
    {
      id: 'decisionMaking',
      block: 'Análisis Profundo',
      question: language === 'en' ? 'How do you make key decisions?' : '¿Cómo toman decisiones clave?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.decisionMaking || ''}
            onValueChange={(value) => onAnswer('decisionMaking', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="together" id="decisions-together" />
              <Label htmlFor="decisions-together">{language === 'en' ? 'Together as a team' : 'Juntos como equipo'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="leader" id="decisions-leader" />
              <Label htmlFor="decisions-leader">{language === 'en' ? 'One person decides' : 'Una persona decide'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="depends" id="decisions-depends" />
              <Label htmlFor="decisions-depends">{language === 'en' ? 'Depends on the topic' : 'Depende del tema'}</Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'financialManagement',
      block: 'Análisis Profundo',
      question: language === 'en' ? 'How do you currently handle joint cash flow and expenses?' : '¿Cómo manejan actualmente el flujo de caja y gastos conjuntos?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.financialManagement || ''}
            onValueChange={(value) => onAnswer('financialManagement', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="systematic" id="finance-systematic" />
              <Label htmlFor="finance-systematic">{language === 'en' ? 'We have a systematic approach' : 'Tenemos un enfoque sistemático'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="basic" id="finance-basic" />
              <Label htmlFor="finance-basic">{language === 'en' ? 'Basic tracking, could be improved' : 'Seguimiento básico, se puede mejorar'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="informal" id="finance-informal" />
              <Label htmlFor="finance-informal">{language === 'en' ? 'Very informal, we handle it as we go' : 'Muy informal, lo manejamos sobre la marcha'}</Label>
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
