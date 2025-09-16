import React, { useState } from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { NewDashboardHeader } from './NewDashboardHeader';
import { BusinessProfileDialog } from '@/components/master-coordinator/BusinessProfileDialog';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useNavigate } from 'react-router-dom';

// Simplified unified dashboard - minimal containers
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { businessProfile } = useUserBusinessProfile();
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  
  const handleMaturityCalculatorClick = () => {
    navigate('/maturity-calculator');
  };

  const handleAgentManagerClick = () => {
    navigate('/dashboard/agents');
  };

  const isProfileComplete = !!(businessProfile?.businessDescription && businessProfile?.brandName);
  
  return (
    <div className="min-h-screen bg-background">
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleAgentManagerClick}
      />
      
      <main className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* Business Profile Enhancement */}
          {!isProfileComplete && (
            <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg">
              <h3 className="font-semibold text-primary mb-2">Complete Your Business Profile</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get more personalized recommendations by completing your profile
              </p>
              <button
                onClick={() => setShowBusinessDialog(true)}
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          )}
          
          {/* Main Dashboard */}
          <MasterCoordinatorDashboard language={mapToLegacyLanguage(language)} />
        </div>
      </main>
      
      {/* Business Profile Dialog */}
      <BusinessProfileDialog
        open={showBusinessDialog}
        onOpenChange={setShowBusinessDialog}
        language={mapToLegacyLanguage(language)}
      />
    </div>
  );
};