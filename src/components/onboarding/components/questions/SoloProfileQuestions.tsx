
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Clock, FileText, Laptop } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SoloProfileQuestionsProps {
  currentQuestionIndex: number;
  showExtendedQuestions: boolean;
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
  language: 'en' | 'es';
}

export const SoloProfileQuestions: React.FC<SoloProfileQuestionsProps> = ({
  currentQuestionIndex,
  showExtendedQuestions,
  answers,
  onAnswer,
  language
}) => {
  // Define basic questions for solo profile
  const basicQuestions = [
    {
      id: 'workActivities',
      question: language === 'en' ? 'What activities do you do in your business?' : '¿Qué actividades realizas en tu negocio?',
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-create" 
              checked={answers.workActivities?.includes('create')}
              onCheckedChange={(checked) => {
                const current = answers.workActivities || [];
                const newValue = checked 
                  ? [...current, 'create'] 
                  : current.filter((item: string) => item !== 'create');
                onAnswer('workActivities', newValue);
              }} 
            />
            <Label htmlFor="act-create">{language === 'en' ? 'Creating/producing' : 'Crear/producir'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-sell" 
              checked={answers.workActivities?.includes('sell')}
              onCheckedChange={(checked) => {
                const current = answers.workActivities || [];
                const newValue = checked 
                  ? [...current, 'sell'] 
                  : current.filter((item: string) => item !== 'sell');
                onAnswer('workActivities', newValue);
              }} 
            />
            <Label htmlFor="act-sell">{language === 'en' ? 'Selling/marketing' : 'Vender/mercadeo'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-admin" 
              checked={answers.workActivities?.includes('admin')}
              onCheckedChange={(checked) => {
                const current = answers.workActivities || [];
                const newValue = checked 
                  ? [...current, 'admin'] 
                  : current.filter((item: string) => item !== 'admin');
                onAnswer('workActivities', newValue);
              }} 
            />
            <Label htmlFor="act-admin">{language === 'en' ? 'Administration/finances' : 'Administración/finanzas'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-plan" 
              checked={answers.workActivities?.includes('plan')}
              onCheckedChange={(checked) => {
                const current = answers.workActivities || [];
                const newValue = checked 
                  ? [...current, 'plan'] 
                  : current.filter((item: string) => item !== 'plan');
                onAnswer('workActivities', newValue);
              }} 
            />
            <Label htmlFor="act-plan">{language === 'en' ? 'Planning/strategy' : 'Planificación/estrategia'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-client" 
              checked={answers.workActivities?.includes('client')}
              onCheckedChange={(checked) => {
                const current = answers.workActivities || [];
                const newValue = checked 
                  ? [...current, 'client'] 
                  : current.filter((item: string) => item !== 'client');
                onAnswer('workActivities', newValue);
              }} 
            />
            <Label htmlFor="act-client">{language === 'en' ? 'Client support/service' : 'Soporte/servicio al cliente'}</Label>
          </div>
        </div>
      )
    },
    {
      id: 'workload',
      question: language === 'en' ? 'How much time do you spend on your business per week?' : '¿Cuánto tiempo dedicas a tu negocio por semana?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.workload || ''}
            onValueChange={(value) => onAnswer('workload', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="fullTime" id="time-full" />
              <Label htmlFor="time-full" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'Full-time (40+ hours)' : 'Tiempo completo (40+ horas)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="partTime" id="time-part" />
              <Label htmlFor="time-part" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Part-time (15-39 hours)' : 'Tiempo parcial (15-39 horas)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="side" id="time-side" />
              <Label htmlFor="time-side" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Side hustle (less than 15 hours)' : 'Actividad secundaria (menos de 15 horas)'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'processes',
      question: language === 'en' ? 'Do you have defined workflows or processes?' : '¿Tienes flujos de trabajo o procesos definidos?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.processes || ''}
            onValueChange={(value) => onAnswer('processes', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="detailed" id="proc-detailed" />
              <Label htmlFor="proc-detailed" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, well-documented processes' : 'Sí, procesos bien documentados'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="some" id="proc-some" />
              <Label htmlFor="proc-some" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Some processes defined' : 'Algunos procesos definidos'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="adhoc" id="proc-adhoc" />
              <Label htmlFor="proc-adhoc" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'Ad-hoc as I go' : 'Improvisados sobre la marcha'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'revenue',
      question: language === 'en' ? 'What is your current monthly revenue?' : '¿Cuál es tu ingreso mensual actual?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.revenue || ''}
            onValueChange={(value) => onAnswer('revenue', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="consistent" id="revenue-consistent" />
              <Label htmlFor="revenue-consistent" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Consistent, stable income' : 'Ingresos consistentes y estables'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="variable" id="revenue-variable" />
              <Label htmlFor="revenue-variable" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Variable, but growing' : 'Variable, pero creciendo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="minimal" id="revenue-minimal" />
              <Label htmlFor="revenue-minimal" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-red-500" />
                {language === 'en' ? 'Minimal or breaking even' : 'Mínimo o en punto de equilibrio'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="pre-revenue" id="revenue-pre" />
              <Label htmlFor="revenue-pre" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'Pre-revenue' : 'Pre-ingresos'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'tools',
      question: language === 'en' ? 'What digital tools do you use for your business?' : '¿Qué herramientas digitales usas para tu negocio?',
      component: (
        <div className="space-y-3">
          <Textarea 
            placeholder={language === 'en' ? 'List your tools (e.g., Excel, social media, email marketing)...' : 'Lista tus herramientas (ej., Excel, redes sociales, email marketing)...'}
            value={answers.tools || ''}
            onChange={(e) => onAnswer('tools', e.target.value)}
            className="h-32"
          />
        </div>
      )
    }
  ];
  
  // Extended questions for deeper analysis
  const extendedQuestions = [
    {
      id: 'outsourcing',
      question: language === 'en' ? 'Do you outsource any aspects of your business?' : '¿Externalizas algún aspecto de tu negocio?',
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="out-accounting" 
              checked={answers.outsourcing?.includes('accounting')}
              onCheckedChange={(checked) => {
                const current = answers.outsourcing || [];
                const newValue = checked 
                  ? [...current, 'accounting'] 
                  : current.filter((item: string) => item !== 'accounting');
                onAnswer('outsourcing', newValue);
              }} 
            />
            <Label htmlFor="out-accounting">{language === 'en' ? 'Accounting/bookkeeping' : 'Contabilidad'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="out-marketing" 
              checked={answers.outsourcing?.includes('marketing')}
              onCheckedChange={(checked) => {
                const current = answers.outsourcing || [];
                const newValue = checked 
                  ? [...current, 'marketing'] 
                  : current.filter((item: string) => item !== 'marketing');
                onAnswer('outsourcing', newValue);
              }} 
            />
            <Label htmlFor="out-marketing">{language === 'en' ? 'Marketing/social media' : 'Marketing/redes sociales'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="out-production" 
              checked={answers.outsourcing?.includes('production')}
              onCheckedChange={(checked) => {
                const current = answers.outsourcing || [];
                const newValue = checked 
                  ? [...current, 'production'] 
                  : current.filter((item: string) => item !== 'production');
                onAnswer('outsourcing', newValue);
              }} 
            />
            <Label htmlFor="out-production">{language === 'en' ? 'Production/fulfillment' : 'Producción/cumplimiento'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="out-customer" 
              checked={answers.outsourcing?.includes('customer')}
              onCheckedChange={(checked) => {
                const current = answers.outsourcing || [];
                const newValue = checked 
                  ? [...current, 'customer'] 
                  : current.filter((item: string) => item !== 'customer');
                onAnswer('outsourcing', newValue);
              }} 
            />
            <Label htmlFor="out-customer">{language === 'en' ? 'Customer service' : 'Servicio al cliente'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="out-none" 
              checked={answers.outsourcing?.includes('none')}
              onCheckedChange={(checked) => {
                if (checked) {
                  onAnswer('outsourcing', ['none']);
                } else {
                  onAnswer('outsourcing', []);
                }
              }} 
            />
            <Label htmlFor="out-none">{language === 'en' ? 'None - I do everything myself' : 'Ninguno - Hago todo yo mismo/a'}</Label>
          </div>
        </div>
      )
    },
    {
      id: 'biggestChallenge',
      question: language === 'en' ? 'What\'s your biggest business challenge right now?' : '¿Cuál es tu mayor desafío empresarial en este momento?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.biggestChallenge || ''}
            onValueChange={(value) => onAnswer('biggestChallenge', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="time" id="challenge-time" />
              <Label htmlFor="challenge-time">
                {language === 'en' ? 'Not enough time' : 'No tengo suficiente tiempo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="revenue" id="challenge-revenue" />
              <Label htmlFor="challenge-revenue">
                {language === 'en' ? 'Not enough sales/revenue' : 'No tengo suficientes ventas/ingresos'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="skills" id="challenge-skills" />
              <Label htmlFor="challenge-skills">
                {language === 'en' ? 'Missing skills/expertise' : 'Me faltan habilidades/experiencia'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="growth" id="challenge-growth" />
              <Label htmlFor="challenge-growth">
                {language === 'en' ? 'Growing/scaling the business' : 'Crecimiento/escalabilidad del negocio'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="other" id="challenge-other" />
              <Label htmlFor="challenge-other">
                {language === 'en' ? 'Other' : 'Otro'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'businessGoals',
      question: language === 'en' ? 'What are your main business goals for the next 12 months?' : '¿Cuáles son tus principales objetivos comerciales para los próximos 12 meses?',
      component: (
        <div className="space-y-3">
          <Textarea 
            placeholder={language === 'en' ? 'Describe your goals...' : 'Describe tus objetivos...'}
            value={answers.businessGoals || ''}
            onChange={(e) => onAnswer('businessGoals', e.target.value)}
            className="h-32"
          />
        </div>
      )
    },
    {
      id: 'timeTracker',
      question: language === 'en' ? 'How do you track your time across different tasks?' : '¿Cómo haces seguimiento de tu tiempo en diferentes tareas?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.timeTracker || ''}
            onValueChange={(value) => onAnswer('timeTracker', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="dedicated" id="time-dedicated" />
              <Label htmlFor="time-dedicated" className="flex items-center">
                <Laptop className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'I use a time tracking tool' : 'Uso una herramienta de seguimiento de tiempo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="calendar" id="time-calendar" />
              <Label htmlFor="time-calendar" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'I use a calendar to block time' : 'Uso un calendario para bloquear tiempo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="manual" id="time-manual" />
              <Label htmlFor="time-manual" className="flex items-center">
                <Laptop className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'I track manually (notes, spreadsheet)' : 'Hago seguimiento manual (notas, hoja de cálculo)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="none" id="time-none" />
              <Label htmlFor="time-none" className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'I don\'t track my time' : 'No hago seguimiento de mi tiempo'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'futureHire',
      question: language === 'en' ? 'Are you planning to hire someone in the next 6 months?' : '¿Planeas contratar a alguien en los próximos 6 meses?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.futureHire || ''}
            onValueChange={(value) => onAnswer('futureHire', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="hire-yes" />
              <Label htmlFor="hire-yes">
                {language === 'en' ? 'Yes, definitely' : 'Sí, definitivamente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="maybe" id="hire-maybe" />
              <Label htmlFor="hire-maybe">
                {language === 'en' ? 'Maybe, if business grows' : 'Tal vez, si el negocio crece'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="hire-no" />
              <Label htmlFor="hire-no">
                {language === 'en' ? 'No, planning to stay solo' : 'No, planeo seguir solo/a'}
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
