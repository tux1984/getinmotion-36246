
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bot, CheckCircle2, Zap } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  recommended: boolean;
}

interface MaturityResultsProps {
  language: 'en' | 'es';
  score: number;
  profileType?: 'idea' | 'solo' | 'team';
  agents: Agent[];
}

const getRecommendationText = (language: 'en' | 'es', score: number, profileType?: 'idea' | 'solo' | 'team') => {
  if (language === 'en') {
    if (profileType === 'idea') {
      return "Based on your responses, you're at the early stages of your project. We recommend these agents to help you define your vision and start building a solid foundation.";
    } else if (profileType === 'solo') {
      return "You're making progress as a solo creator! These agents can help you streamline your workflows and free up your time for creative work.";
    } else if (profileType === 'team') {
      return "Managing a team requires coordination. These agents can help you organize your team's workflow and improve collaboration.";
    } else {
      return "Based on your assessment, here are the agents we recommend to help you move forward with your project.";
    }
  } else {
    if (profileType === 'idea') {
      return "Según tus respuestas, estás en las primeras etapas de tu proyecto. Recomendamos estos agentes para ayudarte a definir tu visión y comenzar a construir una base sólida.";
    } else if (profileType === 'solo') {
      return "¡Estás avanzando como creador independiente! Estos agentes pueden ayudarte a optimizar tus flujos de trabajo y liberar tu tiempo para el trabajo creativo.";
    } else if (profileType === 'team') {
      return "Gestionar un equipo requiere coordinación. Estos agentes pueden ayudarte a organizar el flujo de trabajo de tu equipo y mejorar la colaboración.";
    } else {
      return "Según tu evaluación, estos son los agentes que recomendamos para ayudarte a avanzar con tu proyecto.";
    }
  }
};

const getLevelText = (language: 'en' | 'es', score: number) => {
  if (score < 40) {
    return language === 'en' ? 'Early Stage' : 'Etapa Inicial';
  } else if (score < 70) {
    return language === 'en' ? 'Developing' : 'En Desarrollo';
  } else {
    return language === 'en' ? 'Established' : 'Establecido';
  }
};

export const MaturityResults: React.FC<MaturityResultsProps> = ({ 
  language, 
  score, 
  profileType,
  agents
}) => {
  const recommendedAgents = agents.filter(agent => agent.recommended);
  const otherAgents = agents.filter(agent => !agent.recommended);
  
  const levelText = getLevelText(language, score);
  const recommendationText = getRecommendationText(language, score, profileType);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">
          {language === 'en' ? 'Your Maturity Assessment Results' : 'Resultados de tu Evaluación de Madurez'}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {recommendationText}
        </p>
      </div>
      
      <Card className="border-2 border-indigo-100 shadow-lg bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">
            {language === 'en' ? 'Project Maturity Score' : 'Puntuación de Madurez del Proyecto'}
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">{language === 'en' ? 'Your Score' : 'Tu Puntuación'}</span>
              <span className="font-bold text-xl">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {levelText}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Based on your assessment' : 'Basado en tu evaluación'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
          <Zap className="mr-2 h-5 w-5 text-purple-500" />
          {language === 'en' ? 'Recommended Agents' : 'Agentes Recomendados'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedAgents.map(agent => (
            <Card key={agent.id} className="border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Bot className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <Badge className="ml-2 bg-green-100 text-green-700 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {language === 'en' ? 'Recommended' : 'Recomendado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                    <Button size="sm" variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                      {language === 'en' ? 'Activate Agent' : 'Activar Agente'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {otherAgents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            {language === 'en' ? 'Other Available Agents' : 'Otros Agentes Disponibles'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherAgents.map(agent => (
              <Card key={agent.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Bot className="h-5 w-5 text-gray-500 mr-2" />
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{agent.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    {language === 'en' ? 'Activate' : 'Activar'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
