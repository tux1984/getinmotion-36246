
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const QuickActions = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{language === 'en' ? 'Quick Actions' : 'Acciones Rápidas'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Schedule New Event' : 'Programar Nuevo Evento'}
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <MessageSquare className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Create Message Template' : 'Crear Plantilla de Mensaje'}
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Users className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Audience Analysis' : 'Análisis de Audiencia'}
        </Button>
      </CardContent>
    </Card>
  );
};
