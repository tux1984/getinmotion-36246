
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WaitlistForm } from '@/components/waitlist/WaitlistForm';
import { Link } from 'react-router-dom';

interface AccessSectionProps {
  language: 'en' | 'es';
  translations: {
    formTitle: string;
    waitlist: string;
    accessCode: string;
    accessCodePlaceholder: string;
    verifying: string;
    accessButton: string;
    maturityCalculator: string;
    maturityCalculatorDesc: string;
  };
  accessCode: string;
  setAccessCode: (code: string) => void;
  isLoading: boolean;
  showWaitlistForm: boolean;
  setShowWaitlistForm: (show: boolean) => void;
  validCode: boolean;
  handleAccessSubmit: (e: React.FormEvent) => void;
  handleWaitlistSubmitted: () => void;
  handleCodeSubmitted: (code: string) => void;
}

export const AccessSection: React.FC<AccessSectionProps> = ({
  language,
  translations,
  accessCode,
  setAccessCode,
  isLoading,
  showWaitlistForm,
  setShowWaitlistForm,
  validCode,
  handleAccessSubmit,
  handleWaitlistSubmitted,
  handleCodeSubmitted
}) => {
  const t = translations;

  return (
    <div className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8" id="access">
      <div className="w-full max-w-2xl mx-auto">
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
                
                {validCode && (
                  <div className="mt-6 pt-6 border-t border-indigo-800/30">
                    <Link to="/maturity-calculator">
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none flex items-center gap-2"
                      >
                        {t.maturityCalculator}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </Button>
                    </Link>
                    <p className="text-center text-xs text-indigo-300 mt-2">{t.maturityCalculatorDesc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
