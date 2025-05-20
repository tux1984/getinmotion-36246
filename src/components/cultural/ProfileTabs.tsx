
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatorProfile } from './types';

interface ProfileTabsProps {
  profiles: {
    musician: string;
    visualArtist: string;
    textileArtisan: string;
    indigenousArtisan: string;
  };
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ profiles }) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1">
      <TabsTrigger value="musician">{profiles.musician}</TabsTrigger>
      <TabsTrigger value="visual-artist">{profiles.visualArtist}</TabsTrigger>
      <TabsTrigger value="textile-artisan">{profiles.textileArtisan}</TabsTrigger>
      <TabsTrigger value="indigenous-artisan">{profiles.indigenousArtisan}</TabsTrigger>
    </TabsList>
  );
};
