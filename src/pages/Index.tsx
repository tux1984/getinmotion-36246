
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MotionLogo } from '@/components/MotionLogo';
import { HeroSection } from '@/components/HeroSection';
import { ValueProposition } from '@/components/ValueProposition';
import { Footer } from '@/components/Footer';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserProfileTypes } from '@/components/user-types/UserProfileTypes';
import { VisualMaturityCalculator } from '@/components/maturity/VisualMaturityCalculator';
import { MaturityResults } from '@/components/maturity/MaturityResults';
import { Link } from 'react-router-dom';

// Sample agent data (this would come from your backend in a real application)
const sampleAgents = [
  {
    id: "agent1",
    name: "Vision Copilot",
    description: "Helps you define and refine your project vision",
    icon: "🧠",
    category: "planning",
    recommended: true
  },
  {
    id: "agent2",
    name: "Audience Analyzer",
    description: "Identifies and understands your target audience",
    icon: "👥",
    category: "research",
    recommended: true
  },
  {
    id: "agent3",
    name: "Schedule Manager",
    description: "Organizes your calendar and manages deadlines",
    icon: "📅",
    category: "productivity",
    recommended: true
  },
  {
    id: "agent4",
    name: "Content Creator",
    description: "Helps generate and optimize content",
    icon: "✍️",
    category: "content",
    recommended: false
  },
  {
    id: "agent5",
    name: "Financial Advisor",
    description: "Manages budget and financial planning",
    icon: "💰",
    category: "finance",
    recommended: false
  },
  {
    id: "agent6",
    name: "Marketing Assistant",
    description: "Develops and executes marketing strategies",
    icon: "📢",
    category: "marketing",
    recommended: false
  }
];

const Index = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [showMaturityCalculator, setShowMaturityCalculator] = useState(false);
  const [showMaturityResults, setShowMaturityResults] = useState(false);
  const [maturityScore, setMaturityScore] = useState(0);
  const [userProfile, setUserProfile] = useState<'idea' | 'solo' | 'team' | null>(null);
  const [maturityAnswers, setMaturityAnswers] = useState<Record<string, number>>({});
  const isMobile = useIsMobile();
  
  // Translations object
  const translations = {
    en: {
      navAbout: "About Us",
      navCases: "Case Studies",
      navAccess: "Access",
      formTitle: "Join GET IN MOTION",
      waitlist: "Waitlist",
      accessCode: "I have a code",
      accessCodePlaceholder: "Access code",
      verifying: "Verifying...",
      accessButton: "Access MVP",
      incorrectCode: "Incorrect code",
      invalidCodeMessage: "The access code you entered is invalid."
    },
    es: {
      navAbout: "Nosotros",
      navCases: "Casos",
      navAccess: "Acceder",
      formTitle: "Únete a GET IN MOTION",
      waitlist: "Lista de espera",
      accessCode: "Tengo un código",
      accessCodePlaceholder: "Código de acceso",
      verifying: "Verificando...",
      accessButton: "Acceder al MVP",
      incorrectCode: "Código incorrecto",
      invalidCodeMessage: "El código de acceso que has introducido no es válido."
    }
  };
  
  const t = translations[language];
  
  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (accessCode === "motionproject") {
        setValidCode(true);
        setShowMaturityCalculator(true);
        document.getElementById('maturity-calculator')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        toast({
          title: t.incorrectCode,
          description: t.invalidCodeMessage,
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleWaitlistClick = () => {
    setShowWaitlistForm(true);
    document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleWaitlistSubmitted = () => {
    setShowWaitlistForm(false);
  };
  
  const handleCodeSubmitted = (code: string) => {
    if (code === "motionproject") {
      setValidCode(true);
      setShowMaturityCalculator(true);
      
      // Scroll to the maturity calculator section
      setTimeout(() => {
        document.getElementById('maturity-calculator')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  const handleMaturityComplete = (answers: Record<string, number>, score: number) => {
    setMaturityAnswers(answers);
    setMaturityScore(score);
    setShowMaturityResults(true);
    setShowMaturityCalculator(false);
    
    // Scroll to the results section
    setTimeout(() => {
      document.getElementById('maturity-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-indigo-950/80 border-b border-indigo-800/30 shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <MotionLogo />
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-indigo-900/40 p-2 rounded-lg">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-1 sm:gap-2">
              <Button variant="ghost" className="hidden md:flex text-indigo-100 hover:text-white hover:bg-indigo-800/50">{t.navAbout}</Button>
              <Button variant="ghost" className="hidden md:flex text-indigo-100 hover:text-white hover:bg-indigo-800/50">{t.navCases}</Button>
              <Button 
                variant="outline" 
                className="text-xs sm:text-sm md:text-base border-pink-500 text-pink-200 hover:bg-pink-900/30 hover:text-pink-100 px-2 sm:px-4"
                onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.navAccess}
              </Button>
              <Link to="/admin">
                <Button 
                  variant="ghost"
                  size="icon"
                  className="text-indigo-300 hover:text-white hover:bg-indigo-800/50 hidden sm:flex"
                >
                  <span className="sr-only">Admin</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 12-3-3m0 0-3 3m3-3v9"></path>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection language={language} onJoinWaitlist={handleWaitlistClick} />
        
        <UserProfileTypes />
        
        <div className="container mx-auto px-4 py-8 md:py-16" id="access">
          <div className="max-w-4xl mx-auto">
            {showWaitlistForm ? (
              <WaitlistForm 
                language={language} 
                onSubmit={handleWaitlistSubmitted} 
                onCodeSubmit={handleCodeSubmitted}
              />
            ) : (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="bg-indigo-950/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative border border-indigo-800/30">
                  <div className="p-4 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">{t.formTitle}</h2>
                    
                    <Tabs defaultValue="waitlist" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6 bg-indigo-900/50">
                        <TabsTrigger 
                          value="waitlist" 
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
                          onClick={() => setShowWaitlistForm(true)}
                        >
                          {t.waitlist}
                        </TabsTrigger>
                        <TabsTrigger 
                          value="access"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
                        >
                          {t.accessCode}
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="waitlist">
                        <Button 
                          onClick={() => setShowWaitlistForm(true)}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none"
                        >
                          {t.waitlist}
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="access">
                        <form onSubmit={handleAccessSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              type="text"
                              placeholder={t.accessCodePlaceholder}
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value)}
                              required
                              className="bg-indigo-900/50 border-indigo-700 placeholder:text-indigo-400 text-indigo-100"
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none"
                            disabled={isLoading}
                          >
                            {isLoading ? t.verifying : t.accessButton}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showMaturityCalculator && (
          <div className="container mx-auto px-4 py-8 md:py-16" id="maturity-calculator">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                <VisualMaturityCalculator 
                  language={language}
                  profileType={userProfile} 
                  onComplete={handleMaturityComplete}
                />
              </div>
            </div>
          </div>
        )}
        
        {showMaturityResults && (
          <div className="container mx-auto px-4 py-8 md:py-16" id="maturity-results">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100">
                <MaturityResults 
                  language={language}
                  score={maturityScore}
                  profileType={userProfile}
                  agents={sampleAgents}
                />
              </div>
            </div>
          </div>
        )}
        
        <ValueProposition language={language} />
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
