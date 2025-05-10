
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

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "¡Gracias por tu interés!",
        description: "Te hemos añadido a nuestra lista de espera.",
      });
      setEmail('');
    }, 1000);
  };
  
  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (accessCode === "motionproject") {
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "Código incorrecto",
          description: "El código de acceso que has introducido no es válido.",
          variant: "destructive",
        });
      }
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <MotionLogo />
        <div className="flex gap-2">
          <Button variant="ghost" className="hidden md:flex">Nosotros</Button>
          <Button variant="ghost" className="hidden md:flex">Casos</Button>
          <Button variant="outline" onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}>
            Acceder
          </Button>
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-16" id="access">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6">Únete a Motion</h2>
              
              <Tabs defaultValue="waitlist" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="waitlist">Lista de espera</TabsTrigger>
                  <TabsTrigger value="access">Tengo un código</TabsTrigger>
                </TabsList>
                
                <TabsContent value="waitlist">
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Enviando..." : "Unirme a la lista de espera"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="access">
                  <form onSubmit={handleAccessSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Código de acceso"
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
                      {isLoading ? "Verificando..." : "Acceder al MVP"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <ValueProposition />
        <FeaturesSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
