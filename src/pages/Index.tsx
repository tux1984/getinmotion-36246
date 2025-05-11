
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
      formTitle: "Join Motion",
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
      formTitle: "Únete a Motion",
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <MotionLogo />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex gap-2 ml-4">
            <Button variant="ghost" className="hidden md:flex">{t.navAbout}</Button>
            <Button variant="ghost" className="hidden md:flex">{t.navCases}</Button>
            <Button variant="outline" onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}>
              {t.navAccess}
            </Button>
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-center mb-6">{t.formTitle}</h2>
                  
                  <Tabs defaultValue="waitlist" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="waitlist" onClick={() => setShowWaitlistForm(true)}>{t.waitlist}</TabsTrigger>
                      <TabsTrigger value="access">{t.accessCode}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="waitlist">
                      <Button 
                        onClick={() => setShowWaitlistForm(true)}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
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
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                          disabled={isLoading}
                        >
                          {isLoading ? t.verifying : t.accessButton}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
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
