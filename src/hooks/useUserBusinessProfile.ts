import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserBusinessProfile, BusinessModel, BusinessStage } from '@/types/profile';

export const useUserBusinessProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserBusinessProfile | null>(null);

  // Derive business profile from various sources
  const businessProfile = useMemo((): UserBusinessProfile | null => {
    if (!user || !profile) return null;

    // Get from localStorage - prioritize conversational agent data
    const conversationalData = localStorage.getItem('enhanced_conversational_agent_progress');
    const oldConversationalData = localStorage.getItem('conversational-agent-progress');
    const onboardingData = localStorage.getItem('onboarding-answers');
    const maturityData = localStorage.getItem('maturity-assessment');
    
    let parsedConversational = {};
    let parsedOnboarding = {};
    let parsedMaturity = {};
    
    try {
      // Priority: enhanced conversational > old conversational > onboarding
      if (conversationalData) {
        const data = JSON.parse(conversationalData);
        parsedConversational = data.profileData || {};
        console.log('Using enhanced conversational data:', parsedConversational);
      } else if (oldConversationalData) {
        const data = JSON.parse(oldConversationalData);
        parsedConversational = data.profileData || {};
        console.log('Using old conversational data:', parsedConversational);
      }
      
      if (onboardingData) parsedOnboarding = JSON.parse(onboardingData);
      if (maturityData) parsedMaturity = JSON.parse(maturityData);
    } catch (e) {
      console.warn('Failed to parse stored data:', e);
    }

    // Merge data with conversational taking priority
    const mergedData = { ...parsedOnboarding, ...parsedConversational };

    // Detect business model from answers using merged data
    const businessModel = detectBusinessModel(mergedData);
    const businessStage = detectBusinessStage(mergedData, parsedMaturity);

    return {
      userId: user.id,
      fullName: (profile as any)?.full_name || user.email?.split('@')[0] || 'Usuario',
      businessModel,
      businessStage,
      currentChannels: extractCurrentChannels(mergedData),
      desiredChannels: extractDesiredChannels(mergedData),
      timeAvailability: extractTimeAvailability(mergedData),
      financialResources: extractFinancialResources(mergedData),
      teamSize: extractTeamSize(mergedData),
      primaryGoals: extractPrimaryGoals(mergedData),
      urgentNeeds: extractUrgentNeeds(mergedData),
      monthlyRevenueGoal: extractRevenueGoal(mergedData),
      specificAnswers: mergedData,
      skillsAndExpertise: extractSkills(mergedData),
      currentChallenges: extractChallenges(mergedData),
      maturityLevel: calculateMaturityLevel(parsedMaturity),
      lastAssessmentDate: new Date().toISOString(),
      language: (mergedData as any).language || 'es'
    };
  }, [user, profile]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setProfile(data as any);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return {
    businessProfile,
    loading,
    error,
    refreshProfile: () => {
      if (user) {
        setLoading(true);
        // Refresh logic would go here
        setLoading(false);
      }
    }
  };
};

// Helper functions to extract data from onboarding and conversational agent
function detectBusinessModel(answers: any): BusinessModel {
  // Check conversational agent format first
  if (answers.industry) {
    const industry = answers.industry.toLowerCase();
    if (industry.includes('ceramic') || industry.includes('craft') || 
        industry.includes('artisan') || industry.includes('artesanal') ||
        industry.includes('handmade') || industry.includes('artesanía')) {
      return 'artisan';
    }
    if (industry.includes('tech') || industry.includes('software') || 
        industry.includes('app') || industry.includes('saas')) {
      return 'saas';
    }
    if (industry.includes('consult') || industry.includes('service') ||
        industry.includes('coaching') || industry.includes('freelance')) {
      return 'consulting';
    }
    if (industry.includes('content') || industry.includes('media') ||
        industry.includes('blog') || industry.includes('youtube')) {
      return 'content';
    }
  }

  // Check business description from conversational agent
  const description = (answers.businessDescription || answers.description || '').toLowerCase();
  
  // Artisan keywords
  if (description.includes('hago') || description.includes('tejo') || 
      description.includes('crafts') || description.includes('artesanal') ||
      description.includes('handmade') || description.includes('artesanía') ||
      description.includes('ceramic') || description.includes('pottery')) {
    return 'artisan';
  }
  
  // Service keywords
  if (description.includes('servicio') || description.includes('service') ||
      description.includes('consultoría') || description.includes('consulting') ||
      description.includes('coach') || description.includes('freelance')) {
    return 'services';
  }
  
  // E-commerce keywords
  if (description.includes('vendo') || description.includes('tienda') ||
      description.includes('productos') || description.includes('sell') ||
      description.includes('ecommerce') || description.includes('online store')) {
    return 'ecommerce';
  }

  // Content creator keywords
  if (description.includes('content') || description.includes('blog') ||
      description.includes('youtube') || description.includes('influencer') ||
      description.includes('creator') || description.includes('media')) {
    return 'content';
  }
  
  return 'other';
}

function detectBusinessStage(answers: any, maturity: any): BusinessStage {
  // Check conversational agent format first
  if (answers.hasSold !== undefined) {
    if (!answers.hasSold) return 'idea';
    
    // If they have sold, check sales consistency
    const consistency = answers.salesConsistency;
    if (consistency === 'never' || consistency === 'rarely') return 'mvp';
    if (consistency === 'sometimes') return 'early';
    if (consistency === 'regularly') return 'growth';
  }

  // Fallback to old format
  const hasRevenue = answers.hasRevenue === 'yes';
  const isOperating = answers.isOperating === 'yes';
  
  if (!hasRevenue && !isOperating) return 'idea';
  if (hasRevenue && !isOperating) return 'mvp';
  if (hasRevenue && isOperating) return 'early';
  
  return 'growth';
}

function extractCurrentChannels(answers: any): any[] {
  const channels = [];
  
  // Check conversational agent format
  if (answers.promotionChannels && Array.isArray(answers.promotionChannels)) {
    return answers.promotionChannels;
  }
  
  // Fallback to old format
  if (answers.instagram) channels.push('instagram');
  if (answers.facebook) channels.push('facebook');
  if (answers.whatsapp) channels.push('whatsapp');
  if (answers.website) channels.push('website');
  return channels;
}

function extractDesiredChannels(answers: any): any[] {
  return extractCurrentChannels(answers); // For now, same as current
}

function extractTimeAvailability(answers: any): any {
  return answers.timeAvailability || 'part_time';
}

function extractFinancialResources(answers: any): any {
  return answers.financialResources || 'minimal';
}

function extractTeamSize(answers: any): any {
  return answers.teamSize || 'solo';
}

function extractPrimaryGoals(answers: any): any[] {
  // Check conversational agent format
  if (answers.businessGoals) {
    const goals = answers.businessGoals.toLowerCase();
    const goalArray = [];
    
    if (goals.includes('revenue') || goals.includes('sales') || goals.includes('income')) {
      goalArray.push('increase_revenue');
    }
    if (goals.includes('scale') || goals.includes('grow') || goals.includes('expand')) {
      goalArray.push('scale_operations');
    }
    if (goals.includes('automat') || goals.includes('efficiency')) {
      goalArray.push('automate_processes');
    }
    if (goals.includes('brand') || goals.includes('recognition')) {
      goalArray.push('build_brand');
    }
    
    return goalArray.length > 0 ? goalArray : ['increase_revenue'];
  }
  
  return answers.goals || ['increase_revenue'];
}

function extractUrgentNeeds(answers: any): string[] {
  // Check conversational agent format
  if (answers.mainObstacles && Array.isArray(answers.mainObstacles)) {
    return answers.mainObstacles;
  }
  
  return answers.urgentNeeds || [];
}

function extractRevenueGoal(answers: any): number | undefined {
  return answers.revenueGoal ? parseInt(answers.revenueGoal) : undefined;
}

function extractSkills(answers: any): string[] {
  // Check conversational agent format
  if (answers.experience) {
    const exp = answers.experience.toLowerCase();
    const skills = [];
    
    if (exp.includes('marketing') || exp.includes('promotion')) skills.push('marketing');
    if (exp.includes('sales') || exp.includes('selling')) skills.push('sales');
    if (exp.includes('design') || exp.includes('creative')) skills.push('design');
    if (exp.includes('tech') || exp.includes('technical')) skills.push('technical');
    
    return skills;
  }
  
  return answers.skills || [];
}

function extractChallenges(answers: any): string[] {
  // Check conversational agent format
  if (answers.mainObstacles && Array.isArray(answers.mainObstacles)) {
    return answers.mainObstacles;
  }
  
  return answers.challenges || [];
}

function calculateMaturityLevel(maturity: any): number {
  if (!maturity) return 1;
  
  const scores = [
    maturity.ideaValidation || 1,
    maturity.userExperience || 1,
    maturity.marketFit || 1,
    maturity.monetization || 1
  ];
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}