
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {backToDashboard}
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
