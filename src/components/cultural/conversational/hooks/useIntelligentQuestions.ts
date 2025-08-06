import { useState, useCallback, useRef } from 'react';
import { ConversationBlock, ConversationQuestion } from '../types/conversationalTypes';
import { UserProfileData } from '../../types/wizardTypes';
import { supabase } from '@/integrations/supabase/client';

interface IntelligentQuestionParams {
  profileData: UserProfileData;
  language: 'en' | 'es';
  currentBlock: ConversationBlock;
}

export const useIntelligentQuestions = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<ConversationQuestion[]>([]);
  const generationTimeoutRef = useRef<NodeJS.Timeout>();

  const generateContextualQuestions = useCallback(async ({
    profileData,
    language,
    currentBlock
  }: IntelligentQuestionParams) => {
    // TEMPORARILY DISABLED: Edge functions are returning insights as options
    console.log('🚫 Dynamic question generation DISABLED - returning static questions only');
    setIsGenerating(false);
    
    // Return high-quality static questions instead
    const staticQuestions = getHighQualityStaticQuestions(profileData, language, currentBlock);
    setDynamicQuestions(staticQuestions);
    return staticQuestions;
  }, []);

  const getIndustrySpecificQuestions = useCallback((
    industry: string, 
    businessDescription: string, 
    language: 'en' | 'es'
  ): ConversationQuestion[] => {
    const industryQuestions: Record<string, ConversationQuestion[]> = {
      creative: [
        {
          id: 'creative_portfolio',
          question: language === 'es' 
            ? '¿Cómo muestras tu trabajo creativo a clientes potenciales?'
            : 'How do you showcase your creative work to potential clients?',
          type: 'multiple-choice',
          fieldName: 'portfolioChannels',
          options: [
            { id: 'website', label: language === 'es' ? 'Sitio web personal' : 'Personal website', value: 'website' },
            { id: 'social', label: language === 'es' ? 'Redes sociales' : 'Social media', value: 'social' },
            { id: 'marketplace', label: language === 'es' ? 'Plataformas como Etsy' : 'Platforms like Etsy', value: 'marketplace' },
            { id: 'physical', label: language === 'es' ? 'Portafolio físico' : 'Physical portfolio', value: 'physical' }
          ],
          explanation: language === 'es' 
            ? 'Tu portafolio es clave para atraer clientes en industrias creativas'
            : 'Your portfolio is key to attracting clients in creative industries',
          required: true
        }
      ],
      tech: [
        {
          id: 'tech_stack',
          question: language === 'es'
            ? '¿Qué tecnologías usas principalmente en tus proyectos?'
            : 'What technologies do you primarily use in your projects?',
          type: 'multiple-choice',
          fieldName: 'techStack',
          options: [
            { id: 'web', label: 'Web Development', value: 'web' },
            { id: 'mobile', label: 'Mobile Apps', value: 'mobile' },
            { id: 'ai', label: 'AI/Machine Learning', value: 'ai' },
            { id: 'blockchain', label: 'Blockchain', value: 'blockchain' }
          ],
          explanation: language === 'es'
            ? 'Conocer tu stack tecnológico nos ayuda a recomendar herramientas específicas'
            : 'Knowing your tech stack helps us recommend specific tools',
          required: true
        }
      ],
      services: [
        {
          id: 'service_delivery',
          question: language === 'es'
            ? '¿Cómo entregas tus servicios a los clientes?'
            : 'How do you deliver your services to clients?',
          type: 'multiple-choice',
          fieldName: 'serviceDelivery',
          options: [
            { id: 'in_person', label: language === 'es' ? 'En persona' : 'In person', value: 'in_person' },
            { id: 'online', label: language === 'es' ? 'Online/Virtual' : 'Online/Virtual', value: 'online' },
            { id: 'hybrid', label: language === 'es' ? 'Híbrido' : 'Hybrid', value: 'hybrid' }
          ],
          explanation: language === 'es'
            ? 'El método de entrega afecta la escalabilidad de tu negocio'
            : 'Delivery method affects your business scalability',
          required: true
        }
      ]
    };

    return industryQuestions[industry] || [];
  }, []);

  const getConditionalQuestions = useCallback((
    profileData: UserProfileData,
    language: 'en' | 'es'
  ): ConversationQuestion[] => {
    const conditionalQuestions: ConversationQuestion[] = [];

    // Add questions based on previous answers
    if (profileData.hasSold === false) {
      conditionalQuestions.push({
        id: 'validation_strategy',
        question: language === 'es'
          ? '¿Qué estrategia planeas usar para validar tu primera venta?'
          : 'What strategy do you plan to use to validate your first sale?',
        type: 'single-choice',
        fieldName: 'validationStrategy',
        options: [
          { id: 'mvp', label: language === 'es' ? 'Crear un MVP' : 'Create an MVP', value: 'mvp' },
          { id: 'pre_order', label: language === 'es' ? 'Pre-órdenes' : 'Pre-orders', value: 'pre_order' },
          { id: 'prototype', label: language === 'es' ? 'Mostrar prototipos' : 'Show prototypes', value: 'prototype' },
          { id: 'free_trial', label: language === 'es' ? 'Prueba gratuita' : 'Free trial', value: 'free_trial' }
        ],
        explanation: language === 'es'
          ? 'Validar antes de invertir tiempo es crucial para el éxito'
          : 'Validating before investing time is crucial for success',
        required: true
      });
    }

    if (profileData.teamStructure === 'solo') {
      conditionalQuestions.push({
        id: 'solo_challenges',
        question: language === 'es'
          ? '¿Cuál es tu mayor desafío trabajando solo?'
          : 'What is your biggest challenge working alone?',
        type: 'single-choice',
        fieldName: 'soloChallenges',
        options: [
          { id: 'time', label: language === 'es' ? 'Falta de tiempo' : 'Lack of time', value: 'time' },
          { id: 'skills', label: language === 'es' ? 'Habilidades limitadas' : 'Limited skills', value: 'skills' },
          { id: 'motivation', label: language === 'es' ? 'Motivación' : 'Motivation', value: 'motivation' },
          { id: 'resources', label: language === 'es' ? 'Recursos limitados' : 'Limited resources', value: 'resources' }
        ],
        explanation: language === 'es'
          ? 'Entender tus limitaciones nos ayuda a sugerir soluciones específicas'
          : 'Understanding your limitations helps us suggest specific solutions',
        required: true
      });
    }

    return conditionalQuestions;
  }, []);

  const getHighQualityStaticQuestions = useCallback((
    profileData: UserProfileData,
    language: 'en' | 'es',
    currentBlock: ConversationBlock
  ): ConversationQuestion[] => {
    // Return curated, high-quality text-input questions based on context
    const questions: ConversationQuestion[] = [];
    
    if (currentBlock.id === 'whoYouServe') {
      questions.push({
        id: 'target_audience_detail',
        question: language === 'es' 
          ? '¿Qué problema específico resuelves para tus clientes ideales?'
          : 'What specific problem do you solve for your ideal clients?',
        type: 'text-input',
        fieldName: 'problemSolved',
        explanation: language === 'es' 
          ? 'Entender el problema que resuelves nos ayuda a crear mejores estrategias'
          : 'Understanding the problem you solve helps us create better strategies',
        required: false,
        placeholder: language === 'es' 
          ? 'Describe el problema principal que resuelves...' 
          : 'Describe the main problem you solve...'
      });
    }
    
    if (currentBlock.id === 'howYouCharge') {
      questions.push({
        id: 'pricing_challenges',
        question: language === 'es' 
          ? '¿Cuál es tu mayor desafío al establecer precios?'
          : 'What is your biggest challenge when setting prices?',
        type: 'text-input',
        fieldName: 'pricingChallenges',
        explanation: language === 'es' 
          ? 'Los desafíos de precios nos ayudan a sugerir mejores estrategias'
          : 'Pricing challenges help us suggest better strategies',
        required: false,
        placeholder: language === 'es' 
          ? 'Comparte tus desafíos con los precios...' 
          : 'Share your pricing challenges...'
      });
    }
    
    return questions;
  }, []);

  return {
    generateContextualQuestions,
    getIndustrySpecificQuestions,
    getConditionalQuestions,
    getHighQualityStaticQuestions,
    isGenerating,
    dynamicQuestions
  };
};