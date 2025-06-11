
import { 
  User, 
  Palette, 
  Calculator, 
  Scale, 
  Settings,
  FileText,
  Users,
  Target,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export interface CulturalAgent {
  id: string;
  name: string;
  category: string;
  expertise: string[];
  icon: any;
  description: string;
  color: string;
}

const agents: CulturalAgent[] = [
  {
    id: 'cost-calculator',
    name: 'Cálculo de Costos + Rentabilidad',
    category: 'Financiera',
    expertise: ['financial planning', 'cost analysis', 'pricing'],
    icon: Calculator,
    description: 'Calcula costos de producción, precios de venta y análisis de rentabilidad',
    color: 'bg-green-500'
  },
  {
    id: 'collaboration-agreement',
    name: 'Acuerdo de Colaboración / Cesión',
    category: 'Legal',
    expertise: ['contracts', 'collaboration', 'legal advice'],
    icon: Scale,
    description: 'Genera contratos de colaboración, cesión de derechos y acuerdos',
    color: 'bg-blue-500'
  },
  {
    id: 'maturity-evaluator',
    name: 'Evaluador de Madurez del Negocio',
    category: 'Diagnóstico',
    expertise: ['business analysis', 'maturity assessment', 'growth planning'],
    icon: TrendingUp,
    description: 'Evalúa el nivel de madurez empresarial y proporciona recomendaciones',
    color: 'bg-purple-500'
  },
  {
    id: 'cultural-consultant',
    name: 'Especialista Creativo',
    category: 'Creativo',
    expertise: ['idea validation', 'creative strategy', 'cultural projects'],
    icon: Palette,
    description: 'Orientación experta para industrias creativas y proyectos culturales',
    color: 'bg-pink-500'
  },
  {
    id: 'project-manager',
    name: 'Gestor de Proyectos',
    category: 'Operativo',
    expertise: ['project management', 'planning', 'organization'],
    icon: Settings,
    description: 'Optimiza flujos de trabajo y coordinación de equipos',
    color: 'bg-orange-500'
  },
  {
    id: 'marketing-advisor',
    name: 'Asesor de Marketing',
    category: 'Comercial',
    expertise: ['marketing', 'market analysis', 'brand strategy'],
    icon: Target,
    description: 'Desarrolla estrategias de marketing y análisis de mercado',
    color: 'bg-cyan-500'
  }
];

export const culturalAgentsDatabase = agents;

// Helper functions
export const getAgentById = (id: string) => agents.find(agent => agent.id === id);
export const getAgentsByCategory = (category: string) => agents.filter(agent => agent.category === category);
export const getAgentsByExpertise = (expertise: string) => agents.filter(agent => 
  agent.expertise.some(exp => exp.toLowerCase().includes(expertise.toLowerCase()))
);
export const getAllAgentIds = () => agents.map(agent => agent.id);
