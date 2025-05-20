
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileTabs } from './ProfileTabs';
import { ProfileContent } from './ProfileContent';
import { CreatorProfile } from './types';
import { useAgentData } from './useAgentData';
import { getTranslations } from './translations';

interface CulturalCreatorAgentsProps {
  onSelectAgent: (id: string) => void;
}

export const CulturalCreatorAgents: React.FC<CulturalCreatorAgentsProps> = ({ onSelectAgent }) => {
  const { language } = useLanguage();
  const [selectedProfile, setSelectedProfile] = useState<CreatorProfile>('visual-artist');
  
  const culturalAgents = useAgentData(language);
  const t = getTranslations(language);

  const handleProfileChange = (value: string) => {
    setSelectedProfile(value as CreatorProfile);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">{t.title}</h2>
      <p className="text-gray-600 mb-6">{t.description}</p>
      
      <Tabs defaultValue="visual-artist" className="mb-6" onValueChange={handleProfileChange}>
        <ProfileTabs profiles={t.profiles} />
        
        {/* Profile content tabs */}
        {(['musician', 'visual-artist', 'textile-artisan', 'indigenous-artisan'] as CreatorProfile[]).map((profile) => (
          <ProfileContent
            key={profile}
            profile={profile}
            agents={culturalAgents}
            selectButtonText={t.buttons.selectButton}
            onSelectAgent={onSelectAgent}
          />
        ))}
      </Tabs>
    </div>
  );
};
