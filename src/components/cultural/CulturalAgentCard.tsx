
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CulturalAgent } from './types';

interface CulturalAgentCardProps {
  agent: CulturalAgent;
  onSelect: (id: string) => void;
  buttonText: string;
}

export const CulturalAgentCard: React.FC<CulturalAgentCardProps> = ({ 
  agent, 
  onSelect, 
  buttonText 
}) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center mb-3`}>
          {agent.icon}
        </div>
        <CardTitle>{agent.title}</CardTitle>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={() => onSelect(agent.id)}
          variant="default" 
          className="w-full"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
