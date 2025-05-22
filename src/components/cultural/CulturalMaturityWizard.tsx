import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileStep } from './wizard-steps/ProfileStep';
import { BusinessStep } from './wizard-steps/BusinessStep';
import { ManagementStep } from './wizard-steps/ManagementStep';
import { AnalysisChoiceStep } from './wizard-steps/AnalysisChoiceStep';
import { DetailedAnalysisStep } from './wizard-steps/DetailedAnalysisStep';
import { ResultsStep } from './wizard-steps/ResultsStep';
import { WizardHeader } from './wizard-components/WizardHeader';
import { StepProgress } from './wizard-components/StepProgress';
import { WizardBackground } from './wizard-components/WizardBackground';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { motion, AnimatePresence } from 'framer-motion';

type WizardStep = 
  | 'profile' 
  | 'business' 
  | 'management' 
  | 'analysis-choice'
  | 'detailed-analysis'
  | 'results';

export interface UserProfileData {
  industry: string;
  activities: string[];
  experience: string;
  paymentMethods: string;
  brandIdentity: string;
  financialControl: string;
  teamStructure: string;
  taskOrganization: string;
  decisionMaking: string;
  analysisPreference?: 'quick' | 'detailed';
  pricingMethod?: string;
  internationalSales?: string;
  formalizedBusiness?: string;
  collaboration?: string;
  economicSustainability?: string;
}

export const CulturalMaturityWizard: React.FC<{
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}> = ({ onComplete }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<WizardStep>('profile');
  const [profileData, setProfileData] = useState<UserProfileData>({
    industry: '',
    activities: [],
    experience: '',
    paymentMethods: '',
    brandIdentity: '',
    financialControl: '',
    teamStructure: '',
    taskOrganization: '',
    decisionMaking: '',
  });
  
  // Track progress
  const totalSteps = 5; // Profile, Business, Management, Analysis Choice, Results
  const currentStepNumber = (() => {
    switch (currentStep) {
      case 'profile': return 1;
      case 'business': return 2;
      case 'management': return 3;
      case 'analysis-choice': return 4;
      case 'detailed-analysis': return 4.5; // This is a branch
      case 'results': return 5;
      default: return 1;
    }
  })();
  
  // Step labels
  const stepLabels = {
    en: ['Profile', 'Business', 'Management', 'Analysis', 'Results'],
    es: ['Perfil', 'Negocio', 'Gestión', 'Análisis', 'Resultados']
  };
  
  // Update profile data
  const updateProfileData = (data: Partial<UserProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };
  
  // Handle navigation
  const handleNext = () => {
    switch (currentStep) {
      case 'profile':
        setCurrentStep('business');
        break;
      case 'business':
        setCurrentStep('management');
        break;
      case 'management':
        setCurrentStep('analysis-choice');
        break;
      case 'analysis-choice':
        if (profileData.analysisPreference === 'detailed') {
          setCurrentStep('detailed-analysis');
        } else {
          setCurrentStep('results');
        }
        break;
      case 'detailed-analysis':
        setCurrentStep('results');
        break;
      case 'results':
        // We're done - we don't navigate further
        break;
    }
  };
  
  const handlePrevious = () => {
    switch (currentStep) {
      case 'profile':
        // We're at the beginning - we don't navigate back
        break;
      case 'business':
        setCurrentStep('profile');
        break;
      case 'management':
        setCurrentStep('business');
        break;
      case 'analysis-choice':
        setCurrentStep('management');
        break;
      case 'detailed-analysis':
        setCurrentStep('analysis-choice');
        break;
      case 'results':
        if (profileData.analysisPreference === 'detailed') {
          setCurrentStep('detailed-analysis');
        } else {
          setCurrentStep('analysis-choice');
        }
        break;
    }
  };
  
  // Animation variants
  const pageVariants = {
    enter: {
      x: 100,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -100,
      opacity: 0
    }
  };
  
  // Compute maturity scores based on answers
  const calculateMaturityScores = (): CategoryScore => {
    let ideaValidation = 0;
    let userExperience = 0;
    let marketFit = 0;
    let monetization = 0;
    
    // Calculate idea validation score
    if (profileData.experience === 'more-than-2-years') {
      ideaValidation += 30;
    } else if (profileData.experience === '6-months-to-2-years') {
      ideaValidation += 20;
    } else {
      ideaValidation += 10;
    }
    
    if (profileData.brandIdentity === 'yes') {
      ideaValidation += 20;
    } else if (profileData.brandIdentity === 'somewhat') {
      ideaValidation += 10;
    }
    
    // Calculate user experience score
    if (profileData.activities.includes('classes') || 
        profileData.activities.includes('services')) {
      userExperience += 15;
    }
    
    if (profileData.brandIdentity === 'yes') {
      userExperience += 25;
    } else if (profileData.brandIdentity === 'somewhat') {
      userExperience += 15;
    }
    
    // Calculate market fit score
    if (profileData.activities.includes('selling-online') || 
        profileData.activities.includes('export')) {
      marketFit += 20;
    }
    
    if (profileData.teamStructure === 'team') {
      marketFit += 20;
    } else if (profileData.teamStructure === 'occasional') {
      marketFit += 10;
    }
    
    // Calculate monetization score
    if (profileData.paymentMethods === 'billing-system') {
      monetization += 25;
    } else if (profileData.paymentMethods === 'digital-platforms') {
      monetization += 15;
    } else if (profileData.paymentMethods === 'cash-or-transfer') {
      monetization += 5;
    }
    
    if (profileData.financialControl === 'detailed') {
      monetization += 25;
    } else if (profileData.financialControl === 'somewhat') {
      monetization += 15;
    } else {
      monetization += 5;
    }
    
    // Add more detailed analysis points if available
    if (profileData.analysisPreference === 'detailed') {
      if (profileData.pricingMethod === 'myself') {
        monetization += 10;
      }
      
      if (profileData.internationalSales === 'yes') {
        marketFit += 15;
      }
      
      if (profileData.formalizedBusiness === 'yes') {
        monetization += 10;
        marketFit += 10;
      }
      
      if (profileData.collaboration === 'yes') {
        userExperience += 10;
      }
      
      if (profileData.economicSustainability === 'yes') {
        marketFit += 10;
        monetization += 10;
      }
    }
    
    // Cap scores at 100
    return {
      ideaValidation: Math.min(100, ideaValidation),
      userExperience: Math.min(100, userExperience),
      marketFit: Math.min(100, marketFit),
      monetization: Math.min(100, monetization)
    };
  };
  
  // Determine recommended agents based on profile data and scores
  const getRecommendedAgents = (scores: CategoryScore): RecommendedAgents => {
    const recommendedAgents: RecommendedAgents = {
      admin: false,
      accounting: false,
      legal: false,
      operations: false,
      cultural: false
    };
    
    // Admin is recommended if the user has a team or complex operations
    if (profileData.teamStructure === 'team' || 
        profileData.activities.length > 2 || 
        profileData.taskOrganization === 'digital-tools') {
      recommendedAgents.admin = true;
    }
    
    // Accounting is recommended if monetization is focus area
    if (scores.monetization < 50 || 
        profileData.financialControl !== 'detailed' || 
        profileData.activities.includes('export')) {
      recommendedAgents.accounting = true;
    }
    
    // Legal is recommended for formal businesses or international sales
    if (profileData.activities.includes('export') || 
        profileData.formalizedBusiness === 'yes' || 
        profileData.paymentMethods === 'billing-system') {
      recommendedAgents.legal = true;
    }
    
    // Operations is recommended for teams
    if (profileData.teamStructure === 'team' || 
        profileData.taskOrganization === 'digital-tools' ||
        profileData.activities.length > 3) {
      recommendedAgents.operations = true;
    }
    
    // Cultural agent is always recommended for cultural creators
    recommendedAgents.cultural = true;
    
    return recommendedAgents;
  };
  
  // Handle completion of the wizard
  const handleCompleteWizard = () => {
    const scores = calculateMaturityScores();
    const recommendedAgents = getRecommendedAgents(scores);
    onComplete(scores, recommendedAgents);
  };
  
  // Render active step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'profile':
        return (
          <ProfileStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'business':
        return (
          <BusinessStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'management':
        return (
          <ManagementStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'analysis-choice':
        return (
          <AnalysisChoiceStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'detailed-analysis':
        return (
          <DetailedAnalysisStep 
            profileData={profileData} 
            updateProfileData={updateProfileData} 
            language={language}
          />
        );
      case 'results':
        return (
          <ResultsStep 
            profileData={profileData}
            scores={calculateMaturityScores()}
            recommendedAgents={getRecommendedAgents(calculateMaturityScores())}
            language={language}
            onComplete={handleCompleteWizard}
          />
        );
      default:
        return null;
    }
  };
  
  const t = {
    en: {
      next: 'Continue',
      previous: 'Back',
    },
    es: {
      next: 'Continuar',
      previous: 'Atrás',
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto relative">
      <WizardBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 overflow-hidden bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl">
          <WizardHeader 
            step={currentStepNumber} 
            totalSteps={totalSteps} 
            language={language} 
            industry={profileData.industry} 
          />
          
          <CardContent className="p-6 md:p-8 pb-10">
            <StepProgress 
              currentStep={currentStepNumber}
              totalSteps={totalSteps}
              stepLabels={stepLabels[language]}
              language={language}
            />
            
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {currentStep !== 'results' && (
              <motion.div 
                className="flex justify-between mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 'profile'}
                  className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t[language].previous}
                </Button>
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md px-6 py-6 text-lg rounded-xl"
                >
                  {t[language].next}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
