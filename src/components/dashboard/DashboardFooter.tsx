import React from 'react';
import { MotionLogo } from '@/components/MotionLogo';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Phone } from 'lucide-react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-white/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <MotionLogo variant="dark" size="md" />
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <a 
              href="/privacy" 
              className="hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="/support" 
              className="hover:text-primary transition-colors duration-200 flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              Support
            </a>
          </div>
          
          {/* Contact Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>© 2024 Get in Motion</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-primary"
              onClick={() => window.open('https://getinmotion.com', '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Website
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};