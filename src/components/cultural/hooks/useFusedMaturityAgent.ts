import { useState, useCallback, useEffect, useRef } from 'react';
import { ConversationBlock, MaturityLevel, PersonalizedTask } from '../conversational/types/conversationalTypes';
import { UserProfileData } from '../types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { useAuth } from '@/context/AuthContext';
import { useMaturityScoresSaver } from '@/hooks/useMaturityScoresSaver';
import { createUserAgentsFromRecommendations, markOnboardingComplete } from '@/utils/onboardingUtils';
import { generateMaturityBasedRecommendations } from '@/utils/maturityRecommendations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getFusedConversationBlocks } from '../data/fusedConversationBlocks';

export const useFusedMaturityAgent = (
  language: 'en' | 'es',
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData) => void
) => {
  const { user } = useAuth();
  const { saveMaturityScores } = useMaturityScoresSaver();
  const blocks = getFusedConversationBlocks(language);
  
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [profileData, setProfileData] = useState<UserProfileData>({} as UserProfileData);
  const [isCompleted, setIsCompleted] = useState(false);
  const [businessType, setBusinessType] = useState<'creative' | 'service' | 'product' | 'tech' | 'other'>('creative');

  const currentBlock = blocks[currentBlockIndex];

  // Business type detection
  const detectBusinessType = useCallback((description: string, industry: string) => {
    const lowerDesc = description.toLowerCase();
    const lowerIndustry = industry?.toLowerCase() || '';
    
    if (lowerIndustry.includes('creative') || lowerDesc.includes('arte') || lowerDesc.includes('diseño') || 
        lowerDesc.includes('art') || lowerDesc.includes('design') || lowerDesc.includes('craft') || 
        lowerDesc.includes('music') || lowerDesc.includes('photo')) {
      return 'creative';
    }
    if (lowerIndustry.includes('service') || lowerDesc.includes('consultor') || lowerDesc.includes('coaching')) {
      return 'service';
    }
    if (lowerIndustry.includes('tech') || lowerDesc.includes('software') || lowerDesc.includes('app')) {
      return 'tech';
    }
    if (lowerDesc.includes('product') || lowerDesc.includes('vend') || lowerDesc.includes('sell')) {
      return 'product';
    }
    return 'creative'; // Default to creative for most solo entrepreneurs
  }, []);

  const updateProfileData = useCallback((data: Partial<UserProfileData>) => {
    console.log('Fused Agent: Smart profile data update', { data });
    
    setProfileData(prev => {
      const updated = { ...prev, ...data };
      
      // Detect business type on industry or description change
      if (data.industry || data.businessDescription) {
        const detectedType = detectBusinessType(
          updated.businessDescription || '', 
          updated.industry || ''
        );
        setBusinessType(detectedType);
      }
      
      return updated;
    });

    // Save to user profile if authenticated
    if (user && data) {
      saveToUserProfile(data);
    }
  }, [detectBusinessType, user]);

  const saveToUserProfile = useCallback(async (data: Partial<UserProfileData>) => {
    if (!user) return;

    try {
      // Map wizard data to user profile structure
      const profileUpdate = {
        business_description: data.businessDescription,
        brand_name: data.businessGoals, // Map appropriately 
        business_type: data.industry,
        target_market: data.targetAudience,
        current_stage: data.experience,
        business_goals: Array.isArray(data.businessGoals) ? data.businessGoals : [data.businessGoals].filter(Boolean),
        monthly_revenue_goal: data.urgencyLevel ? data.urgencyLevel * 1000 : null,
        time_availability: data.supportPreference,
        team_size: data.teamStructure,
        current_challenges: Array.isArray(data.mainObstacles) ? data.mainObstacles : [data.mainObstacles].filter(Boolean),
        sales_channels: Array.isArray(data.promotionChannels) ? data.promotionChannels : [data.promotionChannels].filter(Boolean),
        primary_skills: data.activities ? (Array.isArray(data.activities) ? data.activities : [data.activities]) : [],
        updated_at: new Date().toISOString()
      };

      // Filter out undefined values
      const cleanUpdate = Object.fromEntries(
        Object.entries(profileUpdate).filter(([_, value]) => value !== undefined)
      );

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...cleanUpdate
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      console.log('Profile data saved to database:', cleanUpdate);
    } catch (error) {
      console.error('Error saving to user profile:', error);
    }
  }, [user]);

  const answerQuestion = useCallback((questionId: string, answer: any) => {
    console.log('Fused Agent: Question answered', { questionId, answer });
    
    const question = currentBlock?.questions.find(q => q.id === questionId);
    if (question) {
      const fieldName = question.fieldName;
      updateProfileData({ [fieldName]: answer });
    }
  }, [currentBlock, updateProfileData]);

  const goToNextBlock = useCallback(() => {
    if (currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  }, [currentBlockIndex, blocks.length]);

  const goToPreviousBlock = useCallback(() => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(prev => prev - 1);
    }
  }, [currentBlockIndex]);

  const saveProgress = useCallback(() => {
    try {
      const progressData = {
        currentBlockIndex,
        profileData,
        businessType,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('fused_maturity_calculator_progress', JSON.stringify(progressData));
      console.log('Fused Agent: Progress saved');
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [currentBlockIndex, profileData, businessType]);

  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem('fused_maturity_calculator_progress');
      if (saved) {
        const progressData = JSON.parse(saved);
        setCurrentBlockIndex(progressData.currentBlockIndex || 0);
        setProfileData(progressData.profileData || {});
        setBusinessType(progressData.businessType || 'creative');
        console.log('Fused Agent: Progress loaded', progressData);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  const completeAssessment = useCallback(async () => {
    console.log('Fused Agent: Completing assessment', { profileData });
    
    try {
      // Calculate maturity scores based on profile data
      const scores = calculateMaturityScores(profileData, businessType);
      const recommendedAgents = generateMaturityBasedRecommendations(scores);
      
      if (user) {
        await saveMaturityScores(scores, profileData);
        await createUserAgentsFromRecommendations(user.id, recommendedAgents);
        markOnboardingComplete(scores, recommendedAgents);
        
        toast.success(
          language === 'es' 
            ? `¡Perfil completo! Detectamos que eres un emprendedor ${getBusinessTypeLabel(businessType, language)} en crecimiento.`
            : `Profile complete! We detected you're a growing ${getBusinessTypeLabel(businessType, language)} entrepreneur.`
        );
      }
      
      setIsCompleted(true);
      localStorage.removeItem('fused_maturity_calculator_progress');
      onComplete(scores, recommendedAgents, profileData);
    } catch (error) {
      console.error('Failed to complete assessment:', error);
      toast.error(
        language === 'es' 
          ? 'Error al completar la evaluación'
          : 'Error completing assessment'
      );
    }
  }, [profileData, businessType, user, saveMaturityScores, onComplete, language]);

  const getBlockProgress = useCallback(() => {
    return {
      current: currentBlockIndex + 1,
      total: blocks.length,
      percentage: Math.round(((currentBlockIndex + 1) / blocks.length) * 100)
    };
  }, [currentBlockIndex, blocks.length]);

  return {
    currentBlock,
    profileData,
    isCompleted,
    maturityLevel: getMaturityLevel(profileData, businessType, language),
    personalizedTasks: generatePersonalizedTasks(profileData, businessType, language),
    updateProfileData,
    answerQuestion,
    goToNextBlock,
    goToPreviousBlock,
    saveProgress,
    loadProgress,
    completeAssessment,
    getBlockProgress,
    businessType
  };
};

// Helper functions
const calculateMaturityScores = (profileData: UserProfileData, businessType: string): CategoryScore => {
  // Map wizard responses to maturity scores
  const ideaValidation = calculateIdeaValidation(profileData);
  const userExperience = calculateUserExperience(profileData);
  const marketFit = calculateMarketFit(profileData);
  const monetization = calculateMonetization(profileData);

  return {
    ideaValidation,
    userExperience,
    marketFit,
    monetization
  };
};

const calculateIdeaValidation = (profileData: UserProfileData): number => {
  let score = 1;
  
  // Business description clarity
  if (profileData.businessDescription && profileData.businessDescription.length > 50) score += 1;
  
  // Industry identification
  if (profileData.industry) score += 1;
  
  // Target audience clarity
  if (profileData.targetAudience && profileData.targetAudience !== 'unclear') score += 1;
  
  // Customer clarity rating
  if (profileData.customerClarity && profileData.customerClarity >= 4) score += 1;
  
  return Math.min(score, 5);
};

const calculateUserExperience = (profileData: UserProfileData): number => {
  let score = 1;
  
  // Experience level
  if (profileData.experience && profileData.experience !== 'just_starting') score += 1;
  
  // Has sold something
  if (profileData.hasSold) score += 2;
  
  // Sales consistency
  if (profileData.salesConsistency && ['regularly', 'consistently'].includes(profileData.salesConsistency)) score += 1;
  
  return Math.min(score, 5);
};

const calculateMarketFit = (profileData: UserProfileData): number => {
  let score = 1;
  
  // Customer clarity
  if (profileData.customerClarity && profileData.customerClarity >= 3) score += 1;
  
  // Marketing confidence
  if (profileData.marketingConfidence && profileData.marketingConfidence >= 3) score += 1;
  
  // Active promotion channels
  if (profileData.promotionChannels && profileData.promotionChannels.length > 1) score += 1;
  
  // Not targeting 'unclear' audience
  if (profileData.targetAudience && profileData.targetAudience !== 'unclear') score += 1;
  
  return Math.min(score, 5);
};

const calculateMonetization = (profileData: UserProfileData): number => {
  let score = 1;
  
  // Has clear pricing method
  if (profileData.pricingMethod && profileData.pricingMethod !== 'no_system') score += 1;
  
  // Profit clarity
  if (profileData.profitClarity && profileData.profitClarity >= 3) score += 1;
  
  // Has made sales
  if (profileData.hasSold) score += 1;
  
  // Regular sales
  if (profileData.salesConsistency && ['regularly', 'consistently'].includes(profileData.salesConsistency)) score += 1;
  
  return Math.min(score, 5);
};

const getMaturityLevel = (profileData: UserProfileData, businessType: string, language: 'en' | 'es'): MaturityLevel => {
  const scores = calculateMaturityScores(profileData, businessType);
  const average = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  
  if (average <= 2) {
    return {
      id: 'starting',
      level: 1,
      name: language === 'es' ? 'Iniciando' : 'Starting',
      description: language === 'es' ? 'Estás comenzando tu viaje emprendedor' : 'You are starting your entrepreneurial journey',
      characteristics: [],
      nextSteps: []
    };
  }
  if (average <= 3) {
    return {
      id: 'developing',
      level: 2,
      name: language === 'es' ? 'Desarrollando' : 'Developing',
      description: language === 'es' ? 'Tu negocio está tomando forma' : 'Your business is taking shape',
      characteristics: [],
      nextSteps: []
    };
  }
  if (average <= 4) {
    return {
      id: 'growing',
      level: 3,
      name: language === 'es' ? 'Creciendo' : 'Growing',
      description: language === 'es' ? 'Tu negocio está en crecimiento' : 'Your business is growing',
      characteristics: [],
      nextSteps: []
    };
  }
  return {
    id: 'advanced',
    level: 4,
    name: language === 'es' ? 'Avanzado' : 'Advanced',
    description: language === 'es' ? 'Tienes un negocio maduro y establecido' : 'You have a mature and established business',
    characteristics: [],
    nextSteps: []
  };
};

const generatePersonalizedTasks = (profileData: UserProfileData, businessType: string, language: 'en' | 'es'): PersonalizedTask[] => {
  const tasks: PersonalizedTask[] = [];
  
  // Generate tasks based on profile gaps
  if (!profileData.hasSold) {
    tasks.push({
      id: 'first-sale',
      title: language === 'es' ? 'Realizar tu primera venta' : 'Make your first sale',
      description: language === 'es' ? 'Enfócate en conseguir tu primer cliente y validar tu propuesta de valor' : 'Focus on getting your first customer and validating your value proposition',
      priority: 'high',
      category: 'validation',
      agentId: 'idea-validation',
      estimatedTime: '1-2 weeks'
    });
  }
  
  if (profileData.customerClarity && profileData.customerClarity < 3) {
    tasks.push({
      id: 'define-customer',
      title: language === 'es' ? 'Definir tu cliente ideal' : 'Define your ideal customer',
      description: language === 'es' ? 'Crea un perfil detallado de tu cliente objetivo' : 'Create a detailed profile of your target customer',
      priority: 'high',
      category: 'market-fit',
      agentId: 'market-fit',
      estimatedTime: '3-5 days'
    });
  }
  
  if (profileData.marketingConfidence && profileData.marketingConfidence < 3) {
    tasks.push({
      id: 'marketing-strategy',
      title: language === 'es' ? 'Desarrollar estrategia de marketing' : 'Develop marketing strategy',
      description: language === 'es' ? 'Crea un plan de marketing que te genere confianza' : 'Create a marketing plan that builds your confidence',
      priority: 'medium',
      category: 'growth',
      agentId: 'user-experience',
      estimatedTime: '1 week'
    });
  }
  
  return tasks;
};

const getBusinessTypeLabel = (businessType: string, language: 'en' | 'es'): string => {
  const labels = {
    en: {
      creative: 'creative',
      service: 'service provider',
      product: 'product entrepreneur',
      tech: 'tech entrepreneur',
      other: 'entrepreneur'
    },
    es: {
      creative: 'creativo',
      service: 'proveedor de servicios',  
      product: 'emprendedor de productos',
      tech: 'emprendedor tecnológico',
      other: 'emprendedor'
    }
  };
  
  return labels[language][businessType] || labels[language].other;
};