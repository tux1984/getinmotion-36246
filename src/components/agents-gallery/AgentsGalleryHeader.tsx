
import React from 'react';
import { ArrowLeft, Grid3X3, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useRobustAuth } from '@/hooks/useRobustAuth';

interface AgentsGalleryHeaderProps {
  title: string;
  subtitle: string;
  backToDashboard: string;
}

export const AgentsGalleryHeader: React.FC<AgentsGalleryHeaderProps> = ({
  title,
  subtitle,
  backToDashboard
}) => {
  const navigate = useNavigate();
  const { user } = useRobustAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          {user && (
            <Link to="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {backToDashboard}
              </Button>
            </Link>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Grid3X3 className="w-12 h-12 text-purple-200 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">
              {title}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
