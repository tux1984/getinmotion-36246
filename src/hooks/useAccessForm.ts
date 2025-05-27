
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseAccessFormProps {
  translations: {
    incorrectCode: string;
    invalidCodeMessage: string;
    verifying: string;
  };
}

export const useAccessForm = ({ translations }: UseAccessFormProps) => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [validCode, setValidCode] = useState(false);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (accessCode === "motionproject") {
        setValidCode(true);
        window.location.href = "/maturity-calculator";
      } else {
        toast({
          title: translations.incorrectCode,
          description: translations.invalidCodeMessage,
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
      window.location.href = "/maturity-calculator";
    }
  };

  return {
    accessCode,
    setAccessCode,
    isLoading,
    showWaitlistForm,
    setShowWaitlistForm,
    validCode,
    handleAccessSubmit,
    handleWaitlistClick,
    handleWaitlistSubmitted,
    handleCodeSubmitted
  };
};
