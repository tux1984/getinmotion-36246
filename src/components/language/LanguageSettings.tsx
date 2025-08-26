import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Languages, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type Language, getLanguageConfig } from '@/types/language';
import { useLanguageSystem } from '@/hooks/useLanguageSystem';

export const LanguageSettings: React.FC = () => {
  const { language, setLanguage, isLoading } = useLanguageSystem();

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      await setLanguage(newLanguage);
      // Force page reload to apply language changes
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentConfig = getLanguageConfig(language);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Preferencias de Idioma
        </CardTitle>
        <CardDescription>
          Configura el idioma de la plataforma y el Coordinador Maestro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium">Idioma actual</label>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentConfig.flag}</span>
              <span className="font-medium">{currentConfig.nativeName}</span>
              <Badge variant="secondary" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Coordinador Maestro
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cambiar idioma</label>
          <Select
            value={language}
            onValueChange={handleLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground text-sm">({lang.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> El cambio de idioma afectará toda la plataforma, 
            incluyendo las recomendaciones y mensajes generados por el Coordinador Maestro.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};