
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
    <div className="w-full py-16 md:py-20 relative">
      {/* Subtle decorative elements matching hero style */}
      <div className="absolute top-10 right-10 text-pink-300/30 text-4xl opacity-50 rotate-12 animate-pulse" style={{animationDuration: '4s'}}>♪</div>
      <div className="absolute bottom-20 left-10 text-indigo-300/30 text-5xl opacity-40 -rotate-6 animate-pulse" style={{animationDuration: '6s'}}>♫</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-serif tracking-tight">
            {whatIsMotion}
          </h2>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 leading-relaxed">
              {motionDescription}
            </p>
          </div>
        </div>
        
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Creative Platform Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/60 to-purple-600/60 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-xl shadow-xl border border-white/10 bg-indigo-900/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              <div className="relative p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-pink-200">{creativePlatform}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{creativePlatformDesc}</p>
              </div>
            </div>
          </div>
          
          {/* Business Suite Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/60 to-indigo-600/60 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-xl shadow-xl border border-white/10 bg-indigo-900/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              <div className="relative p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-purple-200">{businessSuite}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{businessSuiteDesc}</p>
              </div>
            </div>
          </div>
          
          {/* Time Protector Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/60 to-blue-600/60 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-xl shadow-xl border border-white/10 bg-indigo-900/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              <div className="relative p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-indigo-200">{timeProtector}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{timeProtectorDesc}</p>
              </div>
            </div>
          </div>
          
          {/* Growth Partner Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/60 to-cyan-600/60 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-xl shadow-xl border border-white/10 bg-indigo-900/40 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              <div className="relative p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-200">{growthPartner}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{growthPartnerDesc}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Purpose Statement */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl sm:text-2xl md:text-3xl italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 leading-relaxed">
              {motionPurpose}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
