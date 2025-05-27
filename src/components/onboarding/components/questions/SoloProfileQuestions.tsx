
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Palette, Scissors, Users, Heart, Calendar, DollarSign, Eye, CreditCard, Instagram, FileText, Clock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  // BLOQUE 1 - Perfil cultural y actividad
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
                {language === 'en' ? 'Traditional or modern crafts' : 'Artesanía tradicional o moderna'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="theater" id="industry-theater" />
              <Label htmlFor="industry-theater" className="flex items-center cursor-pointer">
                <Users className="mr-2 h-5 w-5 text-pink-500" />
                {language === 'en' ? 'Theater, performance, dance' : 'Teatro, performance, danza'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="wellness" id="industry-wellness" />
              <Label htmlFor="industry-wellness" className="flex items-center cursor-pointer">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                {language === 'en' ? 'Personal care (products or services)' : 'Cuidado personal (productos o servicios)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50">
              <RadioGroupItem value="events" id="industry-events" />
              <Label htmlFor="industry-events" className="flex items-center cursor-pointer">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                {language === 'en' ? 'Events or cultural production' : 'Eventos o producción cultural'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'currentActivities',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'What types of activities do you do today as part of your business?' : '¿Qué tipo de cosas hacés hoy como parte de tu emprendimiento?',
      component: (
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-produce" 
              checked={answers.currentActivities?.includes('produce')}
              onCheckedChange={(checked) => {
                const current = answers.currentActivities || [];
                const newValue = checked 
                  ? [...current, 'produce'] 
                  : current.filter((item: string) => item !== 'produce');
                onAnswer('currentActivities', newValue);
              }} 
            />
            <Label htmlFor="act-produce">{language === 'en' ? 'I produce and sell physical objects' : 'Produzco y vendo objetos físicos'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-teach" 
              checked={answers.currentActivities?.includes('teach')}
              onCheckedChange={(checked) => {
                const current = answers.currentActivities || [];
                const newValue = checked 
                  ? [...current, 'teach'] 
                  : current.filter((item: string) => item !== 'teach');
                onAnswer('currentActivities', newValue);
              }} 
            />
            <Label htmlFor="act-teach">{language === 'en' ? 'I give classes or workshops' : 'Doy clases o talleres'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-services" 
              checked={answers.currentActivities?.includes('services')}
              onCheckedChange={(checked) => {
                const current = answers.currentActivities || [];
                const newValue = checked 
                  ? [...current, 'services'] 
                  : current.filter((item: string) => item !== 'services');
                onAnswer('currentActivities', newValue);
              }} 
            />
            <Label htmlFor="act-services">{language === 'en' ? 'I offer in-person services' : 'Ofrezco servicios presenciales'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-live" 
              checked={answers.currentActivities?.includes('live')}
              onCheckedChange={(checked) => {
                const current = answers.currentActivities || [];
                const newValue = checked 
                  ? [...current, 'live'] 
                  : current.filter((item: string) => item !== 'live');
                onAnswer('currentActivities', newValue);
              }} 
            />
            <Label htmlFor="act-live">{language === 'en' ? 'I live from live shows or performances' : 'Vivo de funciones o shows en vivo'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-social" 
              checked={answers.currentActivities?.includes('social')}
              onCheckedChange={(checked) => {
                const current = answers.currentActivities || [];
                const newValue = checked 
                  ? [...current, 'social'] 
                  : current.filter((item: string) => item !== 'social');
                onAnswer('currentActivities', newValue);
              }} 
            />
            <Label htmlFor="act-social">{language === 'en' ? 'I handle sales through social media or platforms' : 'Manejo ventas por redes sociales o plataformas'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="act-export" 
              checked={answers.currentActivities?.includes('export')}
              onCheckedChange={(checked) => {
                const current = answers.currentActivities || [];
                const newValue = checked 
                  ? [...current, 'export'] 
                  : current.filter((item: string) => item !== 'export');
                onAnswer('currentActivities', newValue);
              }} 
            />
            <Label htmlFor="act-export">{language === 'en' ? 'I export or sell to other countries' : 'Exporto o vendo a otros países'}</Label>
          </div>
        </div>
      )
    },
    {
      id: 'timeInBusiness',
      block: 'Perfil Cultural',
      question: language === 'en' ? 'How long have you been working on this?' : '¿Hace cuánto estás en esto?',
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

  // BLOQUE 2 - Estado y madurez del negocio
  const businessMaturityQuestions = [
    {
      id: 'paymentMethods',
      block: 'Madurez del Negocio',
      question: language === 'en' ? 'How do you currently charge for your work?' : '¿Cómo cobrás actualmente por tu trabajo o productos?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.paymentMethods || ''}
            onValueChange={(value) => onAnswer('paymentMethods', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="cash" id="pay-cash" />
              <Label htmlFor="pay-cash" className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Only cash or bank transfers' : 'Solo efectivo o transferencias'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="digital" id="pay-digital" />
              <Label htmlFor="pay-digital" className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                {language === 'en' ? 'Digital platforms (Nequi, MercadoPago, etc.)' : 'Plataformas digitales (Nequi, MercadoPago, etc.)'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="invoicing" id="pay-invoicing" />
              <Label htmlFor="pay-invoicing" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                {language === 'en' ? 'I have an invoicing system' : 'Tengo sistema de facturación'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="others" id="pay-others" />
              <Label htmlFor="pay-others" className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-500" />
                {language === 'en' ? 'Others charge for me (manager or platform)' : 'Cobran otros por mí (manager o plataforma)'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'brandIdentity',
      block: 'Madurez del Negocio',
      question: language === 'en' ? 'Do you have a defined brand or visual identity?' : '¿Tenés una marca o identidad visual definida?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.brandIdentity || ''}
            onValueChange={(value) => onAnswer('brandIdentity', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="complete" id="brand-complete" />
              <Label htmlFor="brand-complete" className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, completely' : 'Sí, totalmente'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="partial" id="brand-partial" />
              <Label htmlFor="brand-partial" className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'I have something' : 'Algo tengo'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="none" id="brand-none" />
              <Label htmlFor="brand-none" className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No, I use whatever comes up' : 'No, uso lo que sale'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'financialControl',
      block: 'Madurez del Negocio',
      question: language === 'en' ? 'Do you have control of your income and expenses?' : '¿Tenés control de tus ingresos y gastos?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.financialControl || ''}
            onValueChange={(value) => onAnswer('financialControl', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="detailed" id="finance-detailed" />
              <Label htmlFor="finance-detailed" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, I keep it detailed' : 'Sí, lo llevo detallado'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="somewhat" id="finance-somewhat" />
              <Label htmlFor="finance-somewhat" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'I have it more or less clear' : 'Lo tengo más o menos claro'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="intuition" id="finance-intuition" />
              <Label htmlFor="finance-intuition" className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No, I go by intuition' : 'No, me guío por intuición'}
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'contentStrategy',
      block: 'Madurez del Negocio',
      question: language === 'en' ? 'Do you make posts or content with strategy or frequency?' : '¿Hacés publicaciones o contenidos con estrategia o frecuencia?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.contentStrategy || ''}
            onValueChange={(value) => onAnswer('contentStrategy', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="planned" id="content-planned" />
              <Label htmlFor="content-planned" className="flex items-center">
                <Instagram className="mr-2 h-5 w-5 text-green-500" />
                {language === 'en' ? 'Yes, planned' : 'Sí, planificadas'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="sometimes" id="content-sometimes" />
              <Label htmlFor="content-sometimes" className="flex items-center">
                <Instagram className="mr-2 h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Sometimes' : 'A veces'}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="content-no" />
              <Label htmlFor="content-no" className="flex items-center">
                <Instagram className="mr-2 h-5 w-5 text-gray-400" />
                {language === 'en' ? 'No' : 'No'}
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
    ...businessMaturityQuestions
  ];

  const extendedQuestions = [
    {
      id: 'priceDefinition',
      block: 'Análisis Profundo',
      question: language === 'en' ? 'Do you define prices on your own or with help?' : '¿Definís precios por tu cuenta o con ayuda?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.priceDefinition || ''}
            onValueChange={(value) => onAnswer('priceDefinition', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="alone" id="price-alone" />
              <Label htmlFor="price-alone">{language === 'en' ? 'On my own' : 'Por mi cuenta'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="withHelp" id="price-help" />
              <Label htmlFor="price-help">{language === 'en' ? 'With help from others' : 'Con ayuda de otros'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="struggling" id="price-struggling" />
              <Label htmlFor="price-struggling">{language === 'en' ? 'I struggle with pricing' : 'Me cuesta definir precios'}</Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      id: 'exportExperience',
      block: 'Análisis Profundo',
      question: language === 'en' ? 'Do you have experience selling outside the country?' : '¿Tenés experiencia vendiendo fuera del país?',
      component: (
        <div className="space-y-4">
          <RadioGroup
            value={answers.exportExperience || ''}
            onValueChange={(value) => onAnswer('exportExperience', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="export-yes" />
              <Label htmlFor="export-yes">{language === 'en' ? 'Yes, regularly' : 'Sí, regularmente'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="some" id="export-some" />
              <Label htmlFor="export-some">{language === 'en' ? 'Some experience' : 'Algo de experiencia'}</Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="export-no" />
              <Label htmlFor="export-no">{language === 'en' ? 'No experience' : 'Sin experiencia'}</Label>
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
