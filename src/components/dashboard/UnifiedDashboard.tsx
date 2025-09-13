import React, { useState } from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { DashboardBackground } from './DashboardBackground';
import { NewDashboardHeader } from './NewDashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { BusinessProfileCard } from './BusinessProfileCard';
import { BusinessProfileDialog } from '@/components/master-coordinator/BusinessProfileDialog';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { useNavigate } from 'react-router-dom';

// Single, unified dashboard component that replaces all fragmented experiences
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
  
  // Everything flows through the Master Coordinator - no more fragmentation
  // Disable FloatingMasterAgent on main dashboard to avoid duplication
  return (
    <div className="min-h-screen flex flex-col">
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleAgentManagerClick}
      />
      
      <div className="flex-1 pt-24 pb-6"> {/* Increased padding-top to prevent overlap with header */}
        <DashboardBackground showFloatingAgent={false}>
          <div className="container mx-auto px-4 space-y-6">
            {/* Business Profile Enhancement Card */}
            <BusinessProfileCard
              onOpenProfile={() => setShowBusinessDialog(true)}
              language={mapToLegacyLanguage(language)}
              isProfileComplete={isProfileComplete}
            />
            
            {/* Main Coordinator Dashboard */}
            <MasterCoordinatorDashboard language={mapToLegacyLanguage(language)} />
          </div>
        </DashboardBackground>
      </div>
      
      <DashboardFooter />
      
      {/* Business Profile Dialog */}
      <BusinessProfileDialog
        open={showBusinessDialog}
        onOpenChange={setShowBusinessDialog}
        language={mapToLegacyLanguage(language)}
      />
    </div>
  );
};