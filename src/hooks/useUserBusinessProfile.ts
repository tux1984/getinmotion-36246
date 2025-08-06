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

    // Get from localStorage (onboarding data)
    const onboardingData = localStorage.getItem('onboarding-answers');
    const maturityData = localStorage.getItem('maturity-assessment');
    
    let parsedOnboarding = {};
    let parsedMaturity = {};
    
    try {
      if (onboardingData) parsedOnboarding = JSON.parse(onboardingData);
      if (maturityData) parsedMaturity = JSON.parse(maturityData);
    } catch (e) {
      console.warn('Failed to parse stored data:', e);
    }

    // Detect business model from answers
    const businessModel = detectBusinessModel(parsedOnboarding);
    const businessStage = detectBusinessStage(parsedOnboarding, parsedMaturity);

    return {
      userId: user.id,
      fullName: (profile as any)?.full_name || user.email?.split('@')[0] || 'Usuario',
      businessModel,
      businessStage,
      currentChannels: extractCurrentChannels(parsedOnboarding),
      desiredChannels: extractDesiredChannels(parsedOnboarding),
      timeAvailability: extractTimeAvailability(parsedOnboarding),
      financialResources: extractFinancialResources(parsedOnboarding),
      teamSize: extractTeamSize(parsedOnboarding),
      primaryGoals: extractPrimaryGoals(parsedOnboarding),
      urgentNeeds: extractUrgentNeeds(parsedOnboarding),
      monthlyRevenueGoal: extractRevenueGoal(parsedOnboarding),
      specificAnswers: parsedOnboarding,
      skillsAndExpertise: extractSkills(parsedOnboarding),
      currentChallenges: extractChallenges(parsedOnboarding),
      maturityLevel: calculateMaturityLevel(parsedMaturity),
      lastAssessmentDate: new Date().toISOString(),
      language: (parsedOnboarding as any).language || 'es'
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

// Helper functions to extract data from onboarding
function detectBusinessModel(answers: any): BusinessModel {
  const description = (answers.description || '').toLowerCase();
  
  // Artisan keywords
  if (description.includes('hago') || description.includes('tejo') || 
      description.includes('crafts') || description.includes('artesanal') ||
      description.includes('handmade') || description.includes('artesanía')) {
    return 'artisan';
  }
  
  // Service keywords
  if (description.includes('servicio') || description.includes('service') ||
      description.includes('consultoría') || description.includes('consulting')) {
    return 'services';
  }
  
  // E-commerce keywords
  if (description.includes('vendo') || description.includes('tienda') ||
      description.includes('productos') || description.includes('sell')) {
    return 'ecommerce';
  }
  
  return 'other';
}

function detectBusinessStage(onboarding: any, maturity: any): BusinessStage {
  const hasRevenue = onboarding.hasRevenue === 'yes';
  const isOperating = onboarding.isOperating === 'yes';
  
  if (!hasRevenue && !isOperating) return 'idea';
  if (hasRevenue && !isOperating) return 'mvp';
  if (hasRevenue && isOperating) return 'early';
  
  return 'growth';
}

function extractCurrentChannels(answers: any): any[] {
  const channels = [];
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
  return answers.goals || ['increase_revenue'];
}

function extractUrgentNeeds(answers: any): string[] {
  return answers.urgentNeeds || [];
}

function extractRevenueGoal(answers: any): number | undefined {
  return answers.revenueGoal ? parseInt(answers.revenueGoal) : undefined;
}

function extractSkills(answers: any): string[] {
  return answers.skills || [];
}

function extractChallenges(answers: any): string[] {
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