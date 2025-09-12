
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Settings, LogOut, Users, ArrowLeft } from 'lucide-react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { useLocation } from 'react-router-dom';
import { MotionLogo } from '@/components/MotionLogo';

interface NewDashboardHeaderProps {
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick?: () => void;
}

export const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({ 
  onMaturityCalculatorClick,
  onAgentManagerClick
}) => {
  const { signOut } = useRobustAuth();
  const location = useLocation();

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
          <Button
            variant="outline"
            size="sm"
            onClick={onMaturityCalculatorClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-violet-100 hover:border-purple-300 hover:text-purple-800 transition-all duration-300 hover:scale-110 hover:shadow-lg rounded-xl transform"
          >
            <Calculator className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Maturity Calculator</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAgentManagerClick}
            className="group flex items-center gap-2 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 text-violet-700 hover:from-violet-100 hover:to-purple-100 hover:border-violet-300 hover:text-violet-800 transition-all duration-300 hover:scale-110 hover:shadow-lg rounded-xl transform"
          >
            {isOnAgentManager ? (
              <>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Back to Dashboard</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Agent Manager</span>
              </>
            )}
          </Button>
          
          
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="group flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110 rounded-xl transform"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
