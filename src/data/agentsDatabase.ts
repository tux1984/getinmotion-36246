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
  code: string;
  name: string;
  category: 'Financiera' | 'Legal' | 'Diagnóstico' | 'Comercial' | 'Operativo' | 'Comunidad';
  impact: 1 | 2 | 3 | 4;
  priority: 'Muy Baja' | 'Baja' | 'Media' | 'Media-Alta' | 'Alta';
  description: string;
  icon: any;
  color: string;
  profiles?: string[];
  exampleQuestion?: string;
  exampleAnswer?: string;
  expertise?: string[];
}

export const culturalAgentsDatabase: CulturalAgent[] = [
  {
    id: 'cost-calculator',
    code: 'A1',
    name: 'Cálculo de Costos + Rentabilidad',
    category: 'Financiera',
    impact: 4,
    priority: 'Alta',
    description: 'Calcula costos de producción, precios de venta y análisis de rentabilidad para proyectos culturales',
    icon: Calculator,
    color: 'bg-green-500',
    expertise: ['financial planning', 'cost analysis', 'pricing'],
    profiles: ['visual-artist', 'textile-artisan', 'indigenous-artisan'],
    exampleQuestion: "¿Cómo calculo el precio de venta de mi obra de arte?",
    exampleAnswer: "Te ayudo a calcular todos los costos (materiales, tiempo, gastos generales) y agregar un margen de ganancia adecuado para tu mercado."
  },
  {
    id: 'collaboration-agreement',
    code: 'A2',
    name: 'Acuerdo de Colaboración / Cesión',
    category: 'Legal',
    impact: 4,
    priority: 'Alta',
    description: 'Genera contratos de colaboración, cesión de derechos y acuerdos entre creadores',
    icon: Scale,
    color: 'bg-blue-500',
    expertise: ['contracts', 'collaboration', 'legal advice'],
    profiles: ['musician', 'visual-artist', 'indigenous-artisan'],
    exampleQuestion: "Necesito un contrato para colaborar con otro artista",
    exampleAnswer: "Creo contratos personalizados que protejan los derechos de ambas partes, definiendo claramente la propiedad intelectual y las responsabilidades."
  },
  {
    id: 'maturity-evaluator',
    code: 'A3',
    name: 'Evaluador de Madurez del Negocio',
    category: 'Diagnóstico',
    impact: 3,
    priority: 'Media',
    description: 'Evalúa el nivel de madurez empresarial y proporciona recomendaciones de crecimiento',
    icon: TrendingUp,
    color: 'bg-purple-500',
    expertise: ['business analysis', 'maturity assessment', 'growth planning'],
    profiles: ['musician', 'visual-artist', 'textile-artisan', 'indigenous-artisan'],
    exampleQuestion: "¿En qué etapa está mi negocio creativo?",
    exampleAnswer: "Evalúo tu nivel de madurez empresarial y te doy un plan de crecimiento personalizado con pasos específicos a seguir."
  },
  {
    id: 'cultural-consultant',
    code: 'A4',
    name: 'Especialista Creativo',
    category: 'Operativo',
    impact: 3,
    priority: 'Alta',
    description: 'Orientación experta para industrias creativas y proyectos culturales',
    icon: Palette,
    color: 'bg-pink-500',
    expertise: ['idea validation', 'creative strategy', 'cultural projects'],
    profiles: ['musician', 'visual-artist', 'textile-artisan', 'indigenous-artisan'],
    exampleQuestion: "¿Cómo puedo validar mi idea creativa?",
    exampleAnswer: "Te ayudo a analizar tu propuesta creativa, identificar tu audiencia objetivo y desarrollar una estrategia para validar tu concepto en el mercado."
  },
  {
    id: 'project-manager',
    code: 'A5',
    name: 'Gestor de Proyectos',
    category: 'Operativo',
    impact: 3,
    priority: 'Media',
    description: 'Optimiza flujos de trabajo y coordinación de equipos',
    icon: Settings,
    color: 'bg-orange-500',
    expertise: ['project management', 'planning', 'organization'],
    profiles: ['musician', 'visual-artist', 'textile-artisan'],
    exampleQuestion: "¿Cómo organizo mejor mis proyectos creativos?",
    exampleAnswer: "Te ayudo a estructurar tus proyectos, definir timelines realistas y coordinar recursos para maximizar tu productividad creativa."
  },
  {
    id: 'marketing-advisor',
    code: 'A6',
    name: 'Asesor de Marketing',
    category: 'Comercial',
    impact: 3,
    priority: 'Media',
    description: 'Desarrolla estrategias de marketing y análisis de mercado',
    icon: Target,
    color: 'bg-cyan-500',
    expertise: ['marketing', 'market analysis', 'brand strategy'],
    profiles: ['musician', 'visual-artist', 'textile-artisan'],
    exampleQuestion: "¿Cómo promociono mi trabajo creativo?",
    exampleAnswer: "Desarrollo estrategias de marketing personalizadas para tu perfil creativo, incluyendo redes sociales, networking y posicionamiento de marca."
  },
  {
    id: 'export-advisor',
    code: 'A4',
    name: 'Exportación + Cobros Internacionales',
    category: 'Legal',
    impact: 4,
    priority: 'Media-Alta',
    description: 'Asesora sobre exportación de productos culturales y gestión de cobros internacionales',
    icon: FileText,
    color: 'bg-indigo-500',
    profiles: ['musician', 'visual-artist', 'textile-artisan']
  },
  {
    id: 'collaboration-pitch',
    code: 'A5',
    name: 'Pitch para Colaboraciones',
    category: 'Comercial',
    impact: 2,
    priority: 'Baja',
    description: 'Crea presentaciones profesionales para propuestas de colaboración',
    icon: Users,
    color: 'bg-orange-500'
  },
  {
    id: 'portfolio-catalog',
    code: 'A6',
    name: 'Catálogo de Obras / Productos',
    category: 'Comercial',
    impact: 3,
    priority: 'Baja',
    description: 'Organiza y presenta catálogos profesionales de obras y productos',
    icon: FileText,
    color: 'bg-pink-500',
    profiles: ['visual-artist', 'textile-artisan', 'indigenous-artisan']
  },
  {
    id: 'artwork-description',
    code: 'A7',
    name: 'Descripción Optimizada de Obra',
    category: 'Comercial',
    impact: 2,
    priority: 'Muy Baja',
    description: 'Genera descripciones optimizadas y atractivas para obras de arte',
    icon: FileText,
    color: 'bg-teal-500'
  },
  {
    id: 'income-calculator',
    code: 'A8',
    name: 'Calculadora de Ingresos/Gastos',
    category: 'Financiera',
    impact: 3,
    priority: 'Baja',
    description: 'Gestiona y analiza flujos de ingresos y gastos del negocio cultural',
    icon: Calculator,
    color: 'bg-emerald-500'
  },
  {
    id: 'branding-strategy',
    code: 'A9',
    name: 'Estrategia de Branding y Exposición',
    category: 'Comercial',
    impact: 3,
    priority: 'Baja',
    description: 'Desarrolla estrategias de marca personal y planes de exposición',
    icon: Palette,
    color: 'bg-violet-500'
  },
  {
    id: 'personal-brand-eval',
    code: 'A10',
    name: 'Evaluación de Marca Personal',
    category: 'Diagnóstico',
    impact: 2,
    priority: 'Muy Baja',
    description: 'Analiza y evalúa la efectividad de la marca personal del creador',
    icon: User,
    color: 'bg-cyan-500'
  },
  {
    id: 'funding-routes',
    code: 'A11',
    name: 'Rutas de Fondeo y Convocatorias',
    category: 'Legal',
    impact: 3,
    priority: 'Media',
    description: 'Identifica oportunidades de financiamiento y convocatorias relevantes',
    icon: Target,
    color: 'bg-amber-500'
  },
  {
    id: 'contract-generator',
    code: 'A12',
    name: 'Generador General de Contratos',
    category: 'Legal',
    impact: 4,
    priority: 'Media',
    description: 'Crea contratos personalizados para diversos tipos de proyectos culturales',
    icon: Scale,
    color: 'bg-red-500'
  },
  {
    id: 'tax-compliance',
    code: 'A13',
    name: 'Rendición de Cuentas e Impuestos',
    category: 'Legal',
    impact: 4,
    priority: 'Media',
    description: 'Asiste con declaraciones fiscales y cumplimiento tributario',
    icon: FileText,
    color: 'bg-gray-500'
  },
  {
    id: 'social-impact-eval',
    code: 'A14',
    name: 'Evaluador de Impacto en Redes Sociales',
    category: 'Comercial',
    impact: 2,
    priority: 'Baja',
    description: 'Analiza el impacto y efectividad de la presencia en redes sociales',
    icon: Target,
    color: 'bg-rose-500'
  },
  {
    id: 'pricing-assistant',
    code: 'A15',
    name: 'Asistente de Precios por Canal de Venta',
    category: 'Comercial',
    impact: 4,
    priority: 'Media',
    description: 'Optimiza estrategias de precios según diferentes canales de venta',
    icon: Calculator,
    color: 'bg-lime-500'
  },
  {
    id: 'portfolio-visualization',
    code: 'A16',
    name: 'Visualización de Portafolio',
    category: 'Comercial',
    impact: 3,
    priority: 'Baja',
    description: 'Crea visualizaciones atractivas y profesionales del portafolio',
    icon: Palette,
    color: 'bg-sky-500'
  },
  {
    id: 'active-calls-curator',
    code: 'A17',
    name: 'Curador de Convocatorias Activas',
    category: 'Comercial',
    impact: 3,
    priority: 'Media',
    description: 'Rastrea y cura convocatorias activas relevantes para el perfil del creador',
    icon: Lightbulb,
    color: 'bg-fuchsia-500'
  },
  {
    id: 'advisor-hiring-guide',
    code: 'A18',
    name: 'Guía para Contratar Asesores Legales/Contables',
    category: 'Legal',
    impact: 3,
    priority: 'Media',
    description: 'Proporciona guías para seleccionar y contratar profesionales especializados',
    icon: Users,
    color: 'bg-yellow-500'
  },
  {
    id: 'collaborator-management',
    code: 'A19',
    name: 'Gestión de Colaboradores (tipo RRHH)',
    category: 'Operativo',
    impact: 3,
    priority: 'Media',
    description: 'Gestiona equipos de trabajo y colaboradores en proyectos culturales',
    icon: Users,
    color: 'bg-slate-500'
  },
  {
    id: 'stakeholder-matching',
    code: 'A20',
    name: 'Matching de Stakeholders Creativos',
    category: 'Comunidad',
    impact: 4,
    priority: 'Alta',
    description: 'Conecta creadores con stakeholders relevantes del ecosistema cultural',
    icon: Users,
    color: 'bg-neutral-500'
  }
];

// Helper functions
export const getAgentById = (id: string) => culturalAgentsDatabase.find(agent => agent.id === id);
export const getAgentsByCategory = (category: string) => culturalAgentsDatabase.filter(agent => agent.category === category);
export const getAgentsByExpertise = (expertise: string) => culturalAgentsDatabase.filter(agent => 
  agent.expertise?.some(exp => exp.toLowerCase().includes(expertise.toLowerCase()))
);
export const getAllAgentIds = () => culturalAgentsDatabase.map(agent => agent.id);
export const getRecommendedAgentsForProfile = (profileType: string) => {
  return culturalAgentsDatabase.filter(agent => 
    agent.profiles?.includes(profileType) || 
    agent.priority === 'Alta' || 
    agent.impact >= 3
  );
};

// Legacy compatibility - keep old function names working
export const getAgentsByPriority = (priority: string) => {
  return culturalAgentsDatabase.filter(agent => agent.priority === priority);
};

export const getAgentsByImpact = (impact: number) => {
  return culturalAgentsDatabase.filter(agent => agent.impact === impact);
};
