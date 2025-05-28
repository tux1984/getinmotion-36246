
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DashboardBackground } from './DashboardBackground';

interface DashboardErrorStateProps {
  error: string;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <DashboardBackground>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-lg font-medium">Error cargando el dashboard</div>
          <p className="text-purple-200">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/maturity-calculator')}
              className="border-purple-300 text-purple-200 hover:bg-purple-800"
            >
              Ir a Evaluación
            </Button>
          </div>
        </div>
      </div>
    </DashboardBackground>
  );
};
