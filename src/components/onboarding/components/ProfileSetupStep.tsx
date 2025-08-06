
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileType } from '@/types/dashboard';
import { ArrowRight, User, Briefcase, Target } from 'lucide-react';

interface ProfileSetupStepProps {
  profileType: ProfileType;
  language: 'en' | 'es';
  onNext: () => void;
  onProfileDataUpdate: (data: any) => void;
  profileData: any;
}

export const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({
  profileType,
  language,
  onNext,
  onProfileDataUpdate,
  profileData
}) => {
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    industry: profileData.industry || '',
    experience: profileData.experience || '',
    projectDescription: profileData.projectDescription || '',
    mainGoal: profileData.mainGoal || '',
    productType: profileData.productType || '',
    hasSold: profileData.hasSold || '',
    timeInvested: profileData.timeInvested || '',
    knowsCosts: profileData.knowsCosts || '',
    dreamGoal: profileData.dreamGoal || ''
  });

  // Detect if this is an artisan based on project description keywords
  const isArtisan = formData.projectDescription.toLowerCase().includes('hago') || 
                   formData.projectDescription.toLowerCase().includes('tejo') ||
                   formData.projectDescription.toLowerCase().includes('creo') ||
                   formData.projectDescription.toLowerCase().includes('artesanía') ||
                   formData.projectDescription.toLowerCase().includes('make') ||
                   formData.projectDescription.toLowerCase().includes('knit') ||
                   formData.projectDescription.toLowerCase().includes('craft') ||
                   formData.projectDescription.toLowerCase().includes('handmade') ||
                   formData.industry === 'crafts';

  const t = {
    en: {
      title: 'Tell us about yourself',
      subtitle: 'This helps us personalize your experience',
      name: 'Your Name',
      namePlaceholder: 'Enter your full name',
      industry: 'Industry/Field',
      selectIndustry: 'Select your industry',
      experience: 'Experience Level',
      selectExperience: 'Select your experience',
      projectDescription: 'Project Description',
      projectPlaceholder: 'Briefly describe your creative project or business idea (e.g. "I make hand-knitted dolls", "I paint custom jackets")',
      mainGoal: 'Main Goal',
      goalPlaceholder: 'What do you want to achieve in the next 6 months?',
      continue: 'Continue',
      artisanQuestions: {
        productType: 'What products do you make?',
        productTypePlaceholder: 'E.g: knitted dolls, artisan candles, jewelry, etc.',
        hasSold: 'Have you sold before?',
        timeInvested: 'How much time do you dedicate to this?',
        knowsCosts: 'Do you know how much it costs to make?',
        dreamGoal: 'What do you dream to achieve with this?'
      },
      industries: {
        'visual-arts': 'Visual Arts',
        'performing-arts': 'Performing Arts',
        'digital-content': 'Digital Content',
        'crafts': 'Crafts & Handmade',
        'design': 'Design',
        'writing': 'Writing & Literature',
        'music': 'Music',
        'film': 'Film & Video',
        'photography': 'Photography',
        'fashion': 'Fashion',
        'food': 'Food & Culinary',
        'technology': 'Creative Technology',
        'education': 'Creative Education',
        'other': 'Other'
      },
      experienceLevels: {
        'beginner': 'Beginner (0-1 years)',
        'intermediate': 'Intermediate (1-3 years)',
        'experienced': 'Experienced (3-5 years)',
        'expert': 'Expert (5+ years)'
      }
    },
    es: {
      title: 'Cuéntanos sobre ti',
      subtitle: 'Esto nos ayuda a personalizar tu experiencia',
      name: 'Tu Nombre',
      namePlaceholder: 'Ingresa tu nombre completo',
      industry: 'Industria/Campo',
      selectIndustry: 'Selecciona tu industria',
      experience: 'Nivel de Experiencia',
      selectExperience: 'Selecciona tu experiencia',
      projectDescription: 'Descripción del Proyecto',
      projectPlaceholder: 'Describe brevemente tu proyecto creativo o idea de negocio (ej: "Hago muñecos tejidos a mano", "Pinto chaquetas personalizadas")',
      mainGoal: 'Objetivo Principal',
      goalPlaceholder: '¿Qué quieres lograr en los próximos 6 meses?',
      continue: 'Continuar',
      artisanQuestions: {
        productType: '¿Qué productos haces?',
        productTypePlaceholder: 'Ej: muñecos tejidos, velas artesanales, joyas, etc.',
        hasSold: '¿Has vendido antes?',
        timeInvested: '¿Cuánto tiempo dedicas a esto?',
        knowsCosts: '¿Sabes cuánto te cuesta hacerlo?',
        dreamGoal: '¿Qué sueñas lograr con esto?'
      },
      industries: {
        'visual-arts': 'Artes Visuales',
        'performing-arts': 'Artes Escénicas',
        'digital-content': 'Contenido Digital',
        'crafts': 'Artesanías y Manualidades',
        'design': 'Diseño',
        'writing': 'Escritura y Literatura',
        'music': 'Música',
        'film': 'Cine y Video',
        'photography': 'Fotografía',
        'fashion': 'Moda',
        'food': 'Gastronomía',
        'technology': 'Tecnología Creativa',
        'education': 'Educación Creativa',
        'other': 'Otro'
      },
      experienceLevels: {
        'beginner': 'Principiante (0-1 años)',
        'intermediate': 'Intermedio (1-3 años)',
        'experienced': 'Experimentado (3-5 años)',
        'expert': 'Experto (5+ años)'
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onProfileDataUpdate(newData);
  };

  const handleContinue = () => {
    console.log('Profile setup completed with:', formData);
    onNext();
  };

  const isFormValid = formData.name && formData.industry && formData.experience && formData.projectDescription;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t[language].title}
        </h2>
        <p className="text-gray-600">
          {t[language].subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].name}
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t[language].namePlaceholder}
            className="w-full"
          />
        </div>

        {/* Industry */}
        <div>
          <Label htmlFor="industry" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].industry}
          </Label>
          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t[language].selectIndustry} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t[language].industries).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience */}
        <div>
          <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].experience}
          </Label>
          <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t[language].selectExperience} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t[language].experienceLevels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project Description */}
        <div>
          <Label htmlFor="projectDescription" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].projectDescription}
          </Label>
          <Textarea
            id="projectDescription"
            value={formData.projectDescription}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            placeholder={t[language].projectPlaceholder}
            rows={4}
            className="w-full"
          />
        </div>

        {/* Main Goal */}
        <div>
          <Label htmlFor="mainGoal" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].mainGoal}
          </Label>
          <Textarea
            id="mainGoal"
            value={formData.mainGoal}
            onChange={(e) => handleInputChange('mainGoal', e.target.value)}
            placeholder={t[language].goalPlaceholder}
            rows={3}
            className="w-full"
          />
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium"
          size="lg"
        >
          {t[language].continue}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
