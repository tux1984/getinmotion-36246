
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface WaitlistFormAlertsProps {
  submitted: boolean;
  error: string | null;
  language: 'en' | 'es';
}

export const WaitlistFormAlerts: React.FC<WaitlistFormAlertsProps> = ({
  submitted,
  error,
  language
}) => {
  return (
    <>
      {submitted && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {language === 'en' ? 
              'Your information has been submitted. Thank you!' : 
              '¡Tu información ha sido enviada. Gracias!'}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
