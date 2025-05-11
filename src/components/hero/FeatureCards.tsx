
import React from 'react';
import { Palette, Briefcase, Clock, Rocket } from 'lucide-react';

interface FeatureCardsProps {
  whatIsMotion: string;
  motionDescription: string;
  motionPurpose: string;
  creativePlatform: string;
  creativePlatformDesc: string;
  businessSuite: string;
  businessSuiteDesc: string;
  timeProtector: string;
  timeProtectorDesc: string;
  growthPartner: string;
  growthPartnerDesc: string;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  whatIsMotion,
  motionDescription,
  motionPurpose,
  creativePlatform,
  creativePlatformDesc,
  businessSuite,
  businessSuiteDesc,
  timeProtector,
  timeProtectorDesc,
  growthPartner,
  growthPartnerDesc
}) => {
  return (
    <div className="mt-24 bg-gradient-to-br from-indigo-950 to-purple-950 py-16 text-white relative">
      {/* Abstract art elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-indigo-500 mix-blend-soft-light blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-pink-500 mix-blend-soft-light blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-serif">{whatIsMotion}</h2>
        
        <p className="text-xl mb-16 max-w-4xl leading-relaxed text-indigo-100">
          {motionDescription}
        </p>
        
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Arrow connector for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 -z-1"></div>
          
          <div className="relative group transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-pink-200">{creativePlatform}</h3>
              <p className="text-indigo-200">{creativePlatformDesc}</p>
            </div>
          </div>
          
          <div className="relative group transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-200">{businessSuite}</h3>
              <p className="text-indigo-200">{businessSuiteDesc}</p>
            </div>
          </div>
          
          <div className="relative group transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-200">{timeProtector}</h3>
              <p className="text-indigo-200">{timeProtectorDesc}</p>
            </div>
          </div>
          
          <div className="relative group transition-all duration-300 hover:-translate-y-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-200">{growthPartner}</h3>
              <p className="text-indigo-200">{growthPartnerDesc}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-2xl italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">{motionPurpose}</p>
        </div>
      </div>
    </div>
  );
};
