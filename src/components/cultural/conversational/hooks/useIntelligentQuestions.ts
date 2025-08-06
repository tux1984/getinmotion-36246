import { useState, useCallback } from 'react';
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

  const generateContextualQuestions = useCallback(async ({
    profileData,
    language,
    currentBlock
  }: IntelligentQuestionParams) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating contextual questions for:', currentBlock.id);
      
      // Call the edge function to generate dynamic questions
      const { data, error } = await supabase.functions.invoke('generate-dynamic-questions', {
        body: {
          profileData,
          language,
          blockContext: currentBlock.strategicContext,
          businessDescription: profileData.businessDescription,
          industry: profileData.industry
        }
      });

      if (error) {
        console.error('Error generating questions:', error);
        return [];
      }

      const questions = data?.questions || [];
      
      // Transform AI questions into ConversationQuestion format
      const transformedQuestions: ConversationQuestion[] = questions.map((q: any, index: number) => ({
        id: `dynamic_${currentBlock.id}_${index}`,
        question: q.question,
        type: 'text-input' as const,
        fieldName: `dynamic_${currentBlock.id}_${index}`,
        explanation: q.context,
        required: false,
        placeholder: language === 'es' 
          ? 'Comparte tus pensamientos...' 
          : 'Share your thoughts...'
      }));

      setDynamicQuestions(transformedQuestions);
      return transformedQuestions;
      
    } catch (error) {
      console.error('Failed to generate contextual questions:', error);
      return [];
    } finally {
      setIsGenerating(false);
    }
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

  return {
    generateContextualQuestions,
    getIndustrySpecificQuestions,
    getConditionalQuestions,
    isGenerating,
    dynamicQuestions
  };
};