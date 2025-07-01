
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardDebugPanelProps {
  user: any;
  isAuthorized: boolean;
  agents: any[];
  maturityScores: any;
  profileData: any;
  onboardingStatus: boolean;
  loading: boolean;
  error: string | null;
}

export const DashboardDebugPanel: React.FC<DashboardDebugPanelProps> = ({
  user,
  isAuthorized,
  agents,
  maturityScores,
  profileData,
  onboardingStatus,
  loading,
  error
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-red-100 border-red-300 text-red-700 hover:bg-red-200"
        >
          Debug Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between">
            Debug Dashboard
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>User:</strong> {user ? user.email : 'No user'}
          </div>
          <div>
            <strong>Authorized:</strong> {isAuthorized ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Error:</strong> {error || 'None'}
          </div>
          <div>
            <strong>Onboarding:</strong> {onboardingStatus ? 'Complete' : 'Incomplete'}
          </div>
          <div>
            <strong>Agents:</strong> {agents.length} loaded
          </div>
          <div>
            <strong>Maturity Scores:</strong> {maturityScores ? 'Available' : 'None'}
          </div>
          <div>
            <strong>Profile Data:</strong> {profileData ? 'Available' : 'None'}
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Dashboard Debug Info:', {
                  user,
                  isAuthorized,
                  agents,
                  maturityScores,
                  profileData,
                  onboardingStatus,
                  loading,
                  error
                });
              }}
            >
              Log Debug Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
