
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Settings, LogOut, Users, ArrowLeft, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BusinessProfileDialog } from '@/components/master-coordinator/BusinessProfileDialog';
import { useLanguage } from '@/context/LanguageContext';

interface NewDashboardHeaderProps {
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick?: () => void;
}

export const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({ 
  onMaturityCalculatorClick,
  onAgentManagerClick
}) => {
  const { signOut } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [showBusinessProfileDialog, setShowBusinessProfileDialog] = useState(false);

  const isOnAgentManager = location.pathname.includes('/dashboard/agents');

  const handleAgentManagerClick = () => {
    console.log('Agent Manager button clicked');
    if (onAgentManagerClick) {
      onAgentManagerClick();
    } else {
      console.warn('onAgentManagerClick is not provided');
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 mx-2 sm:mx-4 lg:mx-6">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MotionLogo variant="dark" size="lg" />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBusinessProfileDialog(true)}
            className="group flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Mejorar Perfil</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onMaturityCalculatorClick}
            className="group flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Maturity Calculator</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAgentManagerClick}
            className="group flex items-center gap-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 transition-colors"
          >
            {isOnAgentManager ? (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Back to Dashboard</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Agent Manager</span>
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="group flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Sign Out</span>
          </Button>
        </div>
      </div>

      <BusinessProfileDialog
        open={showBusinessProfileDialog}
        onOpenChange={setShowBusinessProfileDialog}
        language={language === 'pt' || language === 'fr' ? 'es' : (language as 'en' | 'es')}
      />
    </header>
  );
};
