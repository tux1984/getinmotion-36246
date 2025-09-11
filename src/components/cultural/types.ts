
export type CreatorProfile = 'musician' | 'visual-artist' | 'textile-artisan' | 'indigenous-artisan' | 'ceramic-artisan' | 'jewelry-artisan' | 'woodwork-artisan' | 'leather-artisan';

export interface CulturalAgent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  profiles: CreatorProfile[];
  priority: number;
}

export interface CulturalAgentTranslations {
  en: {
    title: string;
    description: string;
  };
  es: {
    title: string;
    description: string;
  };
}

export interface CreatorProfilesTranslations {
  en: {
    musician: string;
    visualArtist: string;
    textileArtisan: string;
    indigenousArtisan: string;
    ceramicArtisan: string;
    jewelryArtisan: string;
    woodworkArtisan: string;
    leatherArtisan: string;
  };
  es: {
    musician: string;
    visualArtist: string;
    textileArtisan: string;
    indigenousArtisan: string;
    ceramicArtisan: string;
    jewelryArtisan: string;
    woodworkArtisan: string;
    leatherArtisan: string;
  };
}

export interface CategoryTranslations {
  en: {
    financial: string;
    legal: string;
    commercial: string;
    diagnosis: string;
  };
  es: {
    financial: string;
    legal: string;
    commercial: string;
    diagnosis: string;
  };
}

export interface ButtonTranslations {
  en: {
    selectButton: string;
    comingSoon: string;
  };
  es: {
    selectButton: string;
    comingSoon: string;
  };
}
