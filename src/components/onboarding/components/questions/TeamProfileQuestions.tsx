
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessagesSquare, ClipboardList, Target, Building } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  // Define basic questions for team profile
  const basicQuestions = [
    {
      id: 'teamSize',
      question: language === 'en' ? 'How many people are in your team?' : '¿Cuántas personas hay en tu equipo?',
      component: (
        <div className="space-y-3">
          <Input 
            type="number" 
            placeholder={language === 'en' ? 'Enter team size' : 'Ingresa el tamaño del equipo'}
            value={answers.teamSize || ''}
            onChange={(e) => onAnswer('teamSize', e.target.value)}
            min={1}
            max={100}
            className="max-w-xs"
          />
        </div>
      )
    },
    {
      id: 'definedRoles',
      question: language === 'en' ? 'Do team members have defined roles?' : '¿Los miembros del equipo tienen roles definidos?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.definedRoles || ''}
            onValueChange={(value) => onAnswer('definedRoles', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="roles-yes" />
              <Label htmlFor="roles-yes" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, clear roles and responsibilities' : 'Sí, roles y responsabilidades claras'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="roles-somewhat" />
              <Label htmlFor="roles-somewhat" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Somewhat, but roles overlap' : 'En cierto modo, pero los roles se superponen'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="roles-no" />
              <Label htmlFor="roles-no" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No, we all do everything' : 'No, todos hacemos todo'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'taskOrganization',
      question: language === 'en' ? 'How do you organize tasks and decisions?' : '¿Cómo organizan las tareas y decisiones?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.taskOrganization || ''}
            onValueChange={(value) => onAnswer('taskOrganization', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="formal" id="tasks-formal" />
              <Label htmlFor="tasks-formal" className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'Formal process with tools (Jira, Asana, etc.)' : 'Proceso formal con herramientas (Jira, Asana, etc.)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="basic" id="tasks-basic" />
              <Label htmlFor="tasks-basic" className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Basic tools (Trello, spreadsheet, etc.)' : 'Herramientas básicas (Trello, hoja de cálculo, etc.)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="informal" id="tasks-informal" />
              <Label htmlFor="tasks-informal" className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Informal (meetings, WhatsApp, etc.)' : 'Informal (reuniones, WhatsApp, etc.)'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'communication',
      question: language === 'en' ? 'What tools do you use for team communication?' : '¿Qué herramientas usan para la comunicación del equipo?',
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="comm-whatsapp" 
              checked={answers.communication?.includes('whatsapp')}
              onCheckedChange={(checked) => {
                const current = answers.communication || [];
                const newValue = checked 
                  ? [...current, 'whatsapp'] 
                  : current.filter((item: string) => item !== 'whatsapp');
                onAnswer('communication', newValue);
              }} 
            />
            <Label htmlFor="comm-whatsapp">WhatsApp</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="comm-slack" 
              checked={answers.communication?.includes('slack')}
              onCheckedChange={(checked) => {
                const current = answers.communication || [];
                const newValue = checked 
                  ? [...current, 'slack'] 
                  : current.filter((item: string) => item !== 'slack');
                onAnswer('communication', newValue);
              }} 
            />
            <Label htmlFor="comm-slack">Slack</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="comm-email" 
              checked={answers.communication?.includes('email')}
              onCheckedChange={(checked) => {
                const current = answers.communication || [];
                const newValue = checked 
                  ? [...current, 'email'] 
                  : current.filter((item: string) => item !== 'email');
                onAnswer('communication', newValue);
              }} 
            />
            <Label htmlFor="comm-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="comm-meetings" 
              checked={answers.communication?.includes('meetings')}
              onCheckedChange={(checked) => {
                const current = answers.communication || [];
                const newValue = checked 
                  ? [...current, 'meetings'] 
                  : current.filter((item: string) => item !== 'meetings');
                onAnswer('communication', newValue);
              }} 
            />
            <Label htmlFor="comm-meetings">{language === 'en' ? 'In-person meetings' : 'Reuniones presenciales'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="comm-video" 
              checked={answers.communication?.includes('video')}
              onCheckedChange={(checked) => {
                const current = answers.communication || [];
                const newValue = checked 
                  ? [...current, 'video'] 
                  : current.filter((item: string) => item !== 'video');
                onAnswer('communication', newValue);
              }} 
            />
            <Label htmlFor="comm-video">{language === 'en' ? 'Video calls' : 'Videollamadas'}</Label>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      question: language === 'en' ? 'Do you have clear goals or KPIs?' : '¿Tienen metas claras o KPIs?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.goals || ''}
            onValueChange={(value) => onAnswer('goals', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="goals-yes" />
              <Label htmlFor="goals-yes" className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, we have clear metrics we track' : 'Sí, tenemos métricas claras que seguimos'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="goals-somewhat" />
              <Label htmlFor="goals-somewhat" className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'We have general goals but not specific metrics' : 'Tenemos metas generales pero no métricas específicas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="goals-no" />
              <Label htmlFor="goals-no" className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No clear goals yet' : 'Aún no hay metas claras'}
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
      id: 'legalStructure',
      question: language === 'en' ? 'What is your business\'s legal structure?' : '¿Cuál es la estructura legal de tu negocio?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.legalStructure || ''}
            onValueChange={(value) => onAnswer('legalStructure', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="registered" id="legal-registered" />
              <Label htmlFor="legal-registered" className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Formally registered business (LLC, Inc, etc.)' : 'Negocio formalmente registrado (SRL, SA, etc.)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="soleProprietor" id="legal-sole" />
              <Label htmlFor="legal-sole" className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Sole proprietor / self-employed' : 'Autónomo / trabajador por cuenta propia'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="undefined" id="legal-undefined" />
              <Label htmlFor="legal-undefined" className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No formal structure yet' : 'Aún no hay estructura formal'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'decisionMaking',
      question: language === 'en' ? 'How are decisions made in your team?' : '¿Cómo se toman las decisiones en tu equipo?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.decisionMaking || ''}
            onValueChange={(value) => onAnswer('decisionMaking', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="hierarchical" id="decision-hierarchical" />
              <Label htmlFor="decision-hierarchical">
                {language === 'en' ? 'One person makes most decisions' : 'Una persona toma la mayoría de las decisiones'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="collaborative" id="decision-collaborative" />
              <Label htmlFor="decision-collaborative">
                {language === 'en' ? 'Collaborative decision-making process' : 'Proceso de toma de decisiones colaborativo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="specialized" id="decision-specialized" />
              <Label htmlFor="decision-specialized">
                {language === 'en' ? 'Decisions made by those with relevant expertise' : 'Decisiones tomadas por aquellos con experiencia relevante'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'remoteWork',
      question: language === 'en' ? 'How does your team work together?' : '¿Cómo trabaja tu equipo junto?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.remoteWork || ''}
            onValueChange={(value) => onAnswer('remoteWork', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="inPerson" id="work-inPerson" />
              <Label htmlFor="work-inPerson">
                {language === 'en' ? 'All in-person' : 'Todo presencial'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="hybrid" id="work-hybrid" />
              <Label htmlFor="work-hybrid">
                {language === 'en' ? 'Hybrid (mix of in-person and remote)' : 'Híbrido (combinación de presencial y remoto)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="remote" id="work-remote" />
              <Label htmlFor="work-remote">
                {language === 'en' ? 'Fully remote' : 'Totalmente remoto'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'challenges',
      question: language === 'en' ? 'What are your biggest team challenges right now?' : '¿Cuáles son tus mayores desafíos de equipo en este momento?',
      component: (
        <div className="space-y-3">
          <Textarea 
            placeholder={language === 'en' ? 'Describe your challenges...' : 'Describe tus desafíos...'}
            value={answers.challenges || ''}
            onChange={(e) => onAnswer('challenges', e.target.value)}
            className="h-32"
          />
        </div>
      )
    },
    {
      id: 'growth',
      question: language === 'en' ? 'Are you planning to grow your team in the next 6 months?' : '¿Planeas hacer crecer tu equipo en los próximos 6 meses?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.growth || ''}
            onValueChange={(value) => onAnswer('growth', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="growth-yes" />
              <Label htmlFor="growth-yes">
                {language === 'en' ? 'Yes, actively hiring' : 'Sí, contratando activamente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="maybe" id="growth-maybe" />
              <Label htmlFor="growth-maybe">
                {language === 'en' ? 'Maybe, if business grows' : 'Tal vez, si el negocio crece'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="growth-no" />
              <Label htmlFor="growth-no">
                {language === 'en' ? 'No plans to hire' : 'Sin planes de contratar'}
              </Label>
            </div>
          </RadioGroup>
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
