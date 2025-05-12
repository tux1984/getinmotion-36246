import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MotionLogo } from '@/components/MotionLogo';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ValueProposition } from '@/components/ValueProposition';
import { Footer } from '@/components/Footer';
import { WaitlistForm } from '@/components/WaitlistForm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const Index = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  
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
        window.location.href = "/dashboard";
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-indigo-950/80 border-b border-indigo-800/30 shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <MotionLogo />
          <div className="flex items-center gap-4">
            <div className="bg-indigo-900/40 p-2 rounded-lg">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="ghost" className="hidden md:flex text-indigo-100 hover:text-white hover:bg-indigo-800/50">{t.navAbout}</Button>
              <Button variant="ghost" className="hidden md:flex text-indigo-100 hover:text-white hover:bg-indigo-800/50">{t.navCases}</Button>
              <Button 
                variant="outline" 
                className="border-pink-500 text-pink-200 hover:bg-pink-900/30 hover:text-pink-100"
                onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.navAccess}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection language={language} onJoinWaitlist={handleWaitlistClick} />
        
        <div className="container mx-auto px-4 py-16" id="access">
          <div className="max-w-4xl mx-auto">
            {showWaitlistForm ? (
              <WaitlistForm language={language} onSubmit={handleWaitlistSubmitted} />
            ) : (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="bg-indigo-950/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative border border-indigo-800/30">
                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">{t.formTitle}</h2>
                    
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
        
        <ValueProposition language={language} />
        <FeaturesSection language={language} />
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
