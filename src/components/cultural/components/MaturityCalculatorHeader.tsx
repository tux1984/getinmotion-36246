
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MotionLogo } from '@/components/MotionLogo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MaturityCalculatorHeaderProps {
  language: 'en' | 'es';
  onSaveAndExit: () => void;
  currentStep?: string;
}

export const MaturityCalculatorHeader: React.FC<MaturityCalculatorHeaderProps> = ({
  language,
  onSaveAndExit,
  currentStep
}) => {
  const navigate = useNavigate();

  const translations = {
    en: {
      exitTitle: "Exit Assessment",
      exitDescription: "Your progress will be saved and you can continue later. Are you sure you want to exit?",
      saveAndExit: "Save & Exit",
      cancel: "Cancel",
      backToDashboard: "Back to Dashboard"
    },
    es: {
      exitTitle: "Salir de la Evaluación", 
      exitDescription: "Tu progreso se guardará y podrás continuar después. ¿Estás seguro que quieres salir?",
      saveAndExit: "Guardar y Salir",
      cancel: "Cancelar",
      backToDashboard: "Volver al Dashboard"
    }
  };

  const t = translations[language];

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSaveAndExit = () => {
    onSaveAndExit();
    navigate('/dashboard');
  };

  // Only show back button if we're not on the first step
  const showBackButton = currentStep !== 'profileType';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MotionLogo variant="dark" size="sm" />
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.backToDashboard}
            </Button>
          )}
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.exitTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.exitDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveAndExit}>
                {t.saveAndExit}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
