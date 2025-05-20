
import React, { useState } from 'react';
import { Calculator, FileText, HelpCircle, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

export type CreatorProfile = 'musician' | 'visual-artist' | 'textile-artisan' | 'indigenous-artisan';

interface CulturalAgentProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  profiles: CreatorProfile[];
  priority: number;
  onSelect: (id: string) => void;
}

interface CulturalCreatorAgentsProps {
  onSelectAgent: (id: string) => void;
}

export const CulturalCreatorAgents: React.FC<CulturalCreatorAgentsProps> = ({ onSelectAgent }) => {
  const { language } = useLanguage();
  const [selectedProfile, setSelectedProfile] = useState<CreatorProfile>('visual-artist');
  
  const t = {
    en: {
      title: "Specialized Agents for Cultural Creators",
      description: "Choose the agent that best fits your current needs as a cultural creator",
      musician: "Musician",
      visualArtist: "Visual Artist",
      textileArtisan: "Textile Artisan",
      indigenousArtisan: "Indigenous Artisan",
      categories: {
        financial: "Financial Management",
        legal: "Legal Support",
        commercial: "Commercial Support",
        diagnosis: "Business Evaluation"
      },
      agents: {
        costCalculator: {
          title: "Cost & Profitability Calculator",
          description: "Calculate the true cost and profitability of your creations"
        },
        contractGenerator: {
          title: "Contract Generator",
          description: "Create professional contracts for your creative work"
        },
        maturityEvaluator: {
          title: "Creative Business Maturity Evaluator",
          description: "Assess the maturity level of your creative business"
        },
        exportAdvisor: {
          title: "Export & International Payments Advisor",
          description: "Learn how to export and receive international payments"
        },
        portfolioCatalog: {
          title: "Portfolio & Catalog Creator",
          description: "Create a professional portfolio or catalog of your work"
        }
      },
      selectButton: "Select",
      comingSoon: "Coming Soon"
    },
    es: {
      title: "Agentes Especializados para Creadores Culturales",
      description: "Elige el agente que mejor se adapte a tus necesidades actuales como creador cultural",
      musician: "Músico",
      visualArtist: "Artista Visual",
      textileArtisan: "Artesano Textil",
      indigenousArtisan: "Artesana Autóctona",
      categories: {
        financial: "Gestión Financiera",
        legal: "Soporte Legal",
        commercial: "Soporte Comercial",
        diagnosis: "Evaluación de Negocio"
      },
      agents: {
        costCalculator: {
          title: "Calculadora de Costos y Rentabilidad",
          description: "Calcula el costo real y la rentabilidad de tus creaciones"
        },
        contractGenerator: {
          title: "Generador de Contratos",
          description: "Crea contratos profesionales para tu trabajo creativo"
        },
        maturityEvaluator: {
          title: "Evaluador de Madurez de Negocio Creativo",
          description: "Evalúa el nivel de madurez de tu negocio creativo"
        },
        exportAdvisor: {
          title: "Asesor de Exportación y Pagos Internacionales",
          description: "Aprende cómo exportar y recibir pagos internacionales"
        },
        portfolioCatalog: {
          title: "Creador de Portafolio y Catálogo",
          description: "Crea un portafolio o catálogo profesional de tu trabajo"
        }
      },
      selectButton: "Seleccionar",
      comingSoon: "Próximamente"
    }
  };

  const handleAgentSelect = (id: string) => {
    console.log(`Selected agent: ${id} for profile ${selectedProfile}`);
    onSelectAgent(id);
  };

  // Define cultural agents based on the plan
  const culturalAgents: CulturalAgentProps[] = [
    {
      id: "cost-calculator",
      title: t[language].agents.costCalculator.title,
      description: t[language].agents.costCalculator.description,
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-700",
      profiles: ['visual-artist', 'textile-artisan', 'indigenous-artisan'],
      priority: 1,
      onSelect: handleAgentSelect
    },
    {
      id: "contract-generator",
      title: t[language].agents.contractGenerator.title,
      description: t[language].agents.contractGenerator.description,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-700",
      profiles: ['musician', 'visual-artist', 'indigenous-artisan'],
      priority: 1,
      onSelect: handleAgentSelect
    },
    {
      id: "maturity-evaluator",
      title: t[language].agents.maturityEvaluator.title,
      description: t[language].agents.maturityEvaluator.description,
      icon: <HelpCircle className="w-6 h-6" />,
      color: "bg-violet-100 text-violet-700",
      profiles: ['musician', 'visual-artist', 'textile-artisan', 'indigenous-artisan'],
      priority: 1,
      onSelect: handleAgentSelect
    },
    {
      id: "export-advisor",
      title: t[language].agents.exportAdvisor.title,
      description: t[language].agents.exportAdvisor.description,
      icon: <Globe className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-700",
      profiles: ['musician', 'visual-artist', 'textile-artisan'],
      priority: 2,
      onSelect: handleAgentSelect
    },
    {
      id: "portfolio-catalog",
      title: t[language].agents.portfolioCatalog.title,
      description: t[language].agents.portfolioCatalog.description,
      icon: <Palette className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-700",
      profiles: ['visual-artist', 'textile-artisan', 'indigenous-artisan'],
      priority: 2,
      onSelect: handleAgentSelect
    },
  ];

  // Filter agents by selected profile
  const filteredAgents = culturalAgents.filter(agent => 
    agent.profiles.includes(selectedProfile)
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">{t[language].title}</h2>
      <p className="text-gray-600 mb-6">{t[language].description}</p>
      
      <Tabs defaultValue="visual-artist" className="mb-6" onValueChange={(value) => setSelectedProfile(value as CreatorProfile)}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <TabsTrigger value="musician">{t[language].musician}</TabsTrigger>
          <TabsTrigger value="visual-artist">{t[language].visualArtist}</TabsTrigger>
          <TabsTrigger value="textile-artisan">{t[language].textileArtisan}</TabsTrigger>
          <TabsTrigger value="indigenous-artisan">{t[language].indigenousArtisan}</TabsTrigger>
        </TabsList>
        
        {/* The content is the same for all tabs, but agents are filtered based on the selected profile */}
        {['musician', 'visual-artist', 'textile-artisan', 'indigenous-artisan'].map((profile) => (
          <TabsContent key={profile} value={profile}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {culturalAgents
                .filter(agent => agent.profiles.includes(profile as CreatorProfile))
                .map((agent) => (
                <Card key={agent.id} className="border border-gray-200">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center mb-3`}>
                      {agent.icon}
                    </div>
                    <CardTitle>{agent.title}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => handleAgentSelect(agent.id)}
                      variant="default" 
                      className="w-full"
                    >
                      {t[language].selectButton}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
