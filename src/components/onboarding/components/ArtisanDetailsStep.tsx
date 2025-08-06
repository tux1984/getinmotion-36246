import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface ArtisanDetailsStepProps {
  language: 'en' | 'es';
  onNext: () => void;
  onPrevious: () => void;
  onProfileDataUpdate: (data: any) => void;
  profileData: any;
}

export const ArtisanDetailsStep: React.FC<ArtisanDetailsStepProps> = ({
  language,
  onNext,
  onPrevious,
  onProfileDataUpdate,
  profileData
}) => {
  const [formData, setFormData] = useState({
    productType: profileData.productType || '',
    hasSold: profileData.hasSold || '',
    timeInvested: profileData.timeInvested || '',
    knowsCosts: profileData.knowsCosts || '',
    dreamGoal: profileData.dreamGoal || '',
    costDetails: profileData.costDetails || '',
    salesExperience: profileData.salesExperience || '',
    timePerProduct: profileData.timePerProduct || ''
  });

  const t = {
    en: {
      title: 'Tell us more about your craft',
      subtitle: 'This helps us create personalized recommendations for your artisan business',
      productType: 'What specific products do you make?',
      productTypePlaceholder: 'E.g: knitted dolls, ceramic mugs, handmade jewelry, painted jackets...',
      hasSold: 'Have you sold your products before?',
      timeInvested: 'How much time do you currently dedicate to this?',
      knowsCosts: 'Do you know your production costs?',
      dreamGoal: 'What is your biggest dream with this craft?',
      dreamGoalPlaceholder: 'E.g: Live off my art, have my own store, be recognized in my community...',
      costDetails: 'If you know costs, what do you estimate per product?',
      costDetailsPlaceholder: 'E.g: $5 in materials, 2 hours of work...',
      salesExperience: 'Tell us about your sales experience',
      salesExperiencePlaceholder: 'E.g: I\'ve sold to friends, at local fairs, never sold before...',
      timePerProduct: 'How long does it take you to make one product?',
      timePerProductPlaceholder: 'E.g: 3 hours, half a day, a week...',
      yes: 'Yes',
      no: 'No',
      sometimes: 'Sometimes',
      continue: 'Continue',
      back: 'Back',
      timeOptions: {
        'few-hours': 'A few hours per week',
        'part-time': 'Part-time (10-20 hours/week)',
        'full-time': 'Full-time (40+ hours/week)',
        'weekends': 'Only weekends',
        'hobby': 'Just as a hobby'
      }
    },
    es: {
      title: 'Cuéntanos más sobre tu arte',
      subtitle: 'Esto nos ayuda a crear recomendaciones personalizadas para tu negocio artesanal',
      productType: '¿Qué productos específicos haces?',
      productTypePlaceholder: 'Ej: muñecos tejidos, tazas de cerámica, joyas artesanales, chaquetas pintadas...',
      hasSold: '¿Has vendido tus productos antes?',
      timeInvested: '¿Cuánto tiempo dedicas actualmente a esto?',
      knowsCosts: '¿Conoces tus costos de producción?',
      dreamGoal: '¿Cuál es tu mayor sueño con este arte?',
      dreamGoalPlaceholder: 'Ej: Vivir de mi arte, tener mi propia tienda, ser reconocida en mi comunidad...',
      costDetails: 'Si conoces los costos, ¿qué estimas por producto?',
      costDetailsPlaceholder: 'Ej: $5 en materiales, 2 horas de trabajo...',
      salesExperience: 'Cuéntanos sobre tu experiencia vendiendo',
      salesExperiencePlaceholder: 'Ej: He vendido a amigos, en ferias locales, nunca he vendido...',
      timePerProduct: '¿Cuánto tiempo te toma hacer un producto?',
      timePerProductPlaceholder: 'Ej: 3 horas, medio día, una semana...',
      yes: 'Sí',
      no: 'No',
      sometimes: 'A veces',
      continue: 'Continuar',
      back: 'Atrás',
      timeOptions: {
        'few-hours': 'Pocas horas por semana',
        'part-time': 'Medio tiempo (10-20 horas/semana)',
        'full-time': 'Tiempo completo (40+ horas/semana)',
        'weekends': 'Solo fines de semana',
        'hobby': 'Solo como hobby'
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onProfileDataUpdate({ ...profileData, ...newData });
  };

  const handleContinue = () => {
    console.log('Artisan details completed with:', formData);
    onNext();
  };

  const isFormValid = formData.productType && formData.hasSold && formData.timeInvested && formData.dreamGoal;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t[language].title}
        </h2>
        <p className="text-gray-600">
          {t[language].subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {/* Product Type */}
        <div>
          <Label htmlFor="productType" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].productType}
          </Label>
          <Textarea
            id="productType"
            value={formData.productType}
            onChange={(e) => handleInputChange('productType', e.target.value)}
            placeholder={t[language].productTypePlaceholder}
            rows={3}
            className="w-full"
          />
        </div>

        {/* Has Sold */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            {t[language].hasSold}
          </Label>
          <RadioGroup value={formData.hasSold} onValueChange={(value) => handleInputChange('hasSold', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="sold-yes" />
              <Label htmlFor="sold-yes">{t[language].yes}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="sold-sometimes" />
              <Label htmlFor="sold-sometimes">{t[language].sometimes}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="sold-no" />
              <Label htmlFor="sold-no">{t[language].no}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Sales Experience (if has sold) */}
        {(formData.hasSold === 'yes' || formData.hasSold === 'sometimes') && (
          <div>
            <Label htmlFor="salesExperience" className="text-sm font-medium text-gray-700 mb-2 block">
              {t[language].salesExperience}
            </Label>
            <Textarea
              id="salesExperience"
              value={formData.salesExperience}
              onChange={(e) => handleInputChange('salesExperience', e.target.value)}
              placeholder={t[language].salesExperiencePlaceholder}
              rows={2}
              className="w-full"
            />
          </div>
        )}

        {/* Time Invested */}
        <div>
          <Label htmlFor="timeInvested" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].timeInvested}
          </Label>
          <Select value={formData.timeInvested} onValueChange={(value) => handleInputChange('timeInvested', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t[language].timeInvested} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t[language].timeOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time per Product */}
        <div>
          <Label htmlFor="timePerProduct" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].timePerProduct}
          </Label>
          <Input
            id="timePerProduct"
            value={formData.timePerProduct}
            onChange={(e) => handleInputChange('timePerProduct', e.target.value)}
            placeholder={t[language].timePerProductPlaceholder}
            className="w-full"
          />
        </div>

        {/* Knows Costs */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            {t[language].knowsCosts}
          </Label>
          <RadioGroup value={formData.knowsCosts} onValueChange={(value) => handleInputChange('knowsCosts', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="costs-yes" />
              <Label htmlFor="costs-yes">{t[language].yes}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="costs-no" />
              <Label htmlFor="costs-no">{t[language].no}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Cost Details (if knows costs) */}
        {formData.knowsCosts === 'yes' && (
          <div>
            <Label htmlFor="costDetails" className="text-sm font-medium text-gray-700 mb-2 block">
              {t[language].costDetails}
            </Label>
            <Textarea
              id="costDetails"
              value={formData.costDetails}
              onChange={(e) => handleInputChange('costDetails', e.target.value)}
              placeholder={t[language].costDetailsPlaceholder}
              rows={2}
              className="w-full"
            />
          </div>
        )}

        {/* Dream Goal */}
        <div>
          <Label htmlFor="dreamGoal" className="text-sm font-medium text-gray-700 mb-2 block">
            {t[language].dreamGoal}
          </Label>
          <Textarea
            id="dreamGoal"
            value={formData.dreamGoal}
            onChange={(e) => handleInputChange('dreamGoal', e.target.value)}
            placeholder={t[language].dreamGoalPlaceholder}
            rows={3}
            className="w-full"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            {t[language].back}
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!isFormValid}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {t[language].continue}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};