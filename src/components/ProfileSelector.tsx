
import React, { useState } from 'react';
import { Lightbulb, User, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

type ProfileType = 'idea' | 'solo' | 'team' | null;

interface ProfileSelectorProps {
  onProfileSelected: (profileType: ProfileType) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onProfileSelected }) => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>(null);
  const { toast } = useToast();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const handleSelect = (type: ProfileType) => {
    setSelectedProfile(type);
  };

  const handleConfirm = () => {
    if (selectedProfile) {
      onProfileSelected(selectedProfile);
      
      // Guardamos el perfil seleccionado en localStorage
      localStorage.setItem('userProfile', selectedProfile);
      
      toast({
        title: t.profileSelector.selectedMessage,
        description: new Date().toLocaleTimeString(),
      });
      
      // Redireccionamos al onboarding con el tipo de perfil
      navigate('/dashboard', { state: { startOnboarding: true, profileType: selectedProfile } });
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-indigo-900/70 to-purple-900/70 rounded-xl backdrop-blur-sm" id="profile-selector">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-serif">{t.profileSelector.title}</h2>
          <p className="text-lg text-indigo-100 max-w-3xl mx-auto">{t.profileSelector.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Option 1: Just have the idea */}
          <Card 
            className={`relative group cursor-pointer transition-all ${
              selectedProfile === 'idea' 
                ? 'ring-2 ring-pink-500 shadow-lg shadow-pink-500/20 scale-105' 
                : 'hover:shadow-md hover:-translate-y-1'
            } bg-indigo-900/50 border-indigo-800/30`}
            onClick={() => handleSelect('idea')}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-200">{t.profileSelector.ideaTitle}</h3>
              </div>
              
              <RadioGroup className="mb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="idea" 
                    id="idea" 
                    checked={selectedProfile === 'idea'}
                    className="border-pink-400 text-pink-500"
                  />
                  <Label htmlFor="idea" className="text-indigo-100">{t.profileSelector.ideaDescription}</Label>
                </div>
              </RadioGroup>
              
              {selectedProfile === 'idea' && (
                <Badge className="mt-2 bg-pink-500/30 text-pink-200 hover:bg-pink-500/40">
                  Copilot: Definamos tu visión
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Option 2: Working alone */}
          <Card 
            className={`relative group cursor-pointer transition-all ${
              selectedProfile === 'solo' 
                ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20 scale-105' 
                : 'hover:shadow-md hover:-translate-y-1'
            } bg-indigo-900/50 border-indigo-800/30`}
            onClick={() => handleSelect('solo')}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-200">{t.profileSelector.soloTitle}</h3>
              </div>
              
              <RadioGroup className="mb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="solo" 
                    id="solo" 
                    checked={selectedProfile === 'solo'}
                    className="border-purple-400 text-purple-500"
                  />
                  <Label htmlFor="solo" className="text-indigo-100">{t.profileSelector.soloDescription}</Label>
                </div>
              </RadioGroup>
              
              {selectedProfile === 'solo' && (
                <Badge className="mt-2 bg-purple-500/30 text-purple-200 hover:bg-purple-500/40">
                  Copilot: Liberá tu tiempo
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Option 3: Have a team */}
          <Card 
            className={`relative group cursor-pointer transition-all ${
              selectedProfile === 'team' 
                ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' 
                : 'hover:shadow-md hover:-translate-y-1'
            } bg-indigo-900/50 border-indigo-800/30`}
            onClick={() => handleSelect('team')}
          >
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-indigo-200">{t.profileSelector.teamTitle}</h3>
              </div>
              
              <RadioGroup className="mb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="team" 
                    id="team" 
                    checked={selectedProfile === 'team'}
                    className="border-indigo-400 text-indigo-500"
                  />
                  <Label htmlFor="team" className="text-indigo-100">{t.profileSelector.teamDescription}</Label>
                </div>
              </RadioGroup>
              
              {selectedProfile === 'team' && (
                <Badge className="mt-2 bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40">
                  Copilot: Organizá tu equipo
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Button
            onClick={handleConfirm}
            disabled={!selectedProfile}
            size="lg"
            className={`transition-all duration-300 ${
              selectedProfile 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {t.profileSelector.confirmButton}
          </Button>
        </div>
      </div>
    </div>
  );
};
