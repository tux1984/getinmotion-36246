
import React from 'react';
import { ArrowLeft, Grid3X3, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface CompactAgentsGalleryHeaderProps {
  title: string;
  subtitle: string;
  backToDashboard: string;
}

export const CompactAgentsGalleryHeader: React.FC<CompactAgentsGalleryHeaderProps> = ({
  title,
  subtitle,
  backToDashboard
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
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
          <div className="flex items-center justify-center mb-4">
            <Grid3X3 className="w-8 h-8 text-purple-200 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">
              {title}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
