
import { CulturalAgentTranslations, CreatorProfilesTranslations, CategoryTranslations, ButtonTranslations } from './types';

export const agentTranslations: Record<string, CulturalAgentTranslations> = {
  costCalculator: {
    en: {
      title: "Cost & Profitability Calculator",
      description: "Calculate the true cost and profitability of your creations"
    },
    es: {
      title: "Calculadora de Costos y Rentabilidad",
      description: "Calcula el costo real y la rentabilidad de tus creaciones"
    }
  },
  contractGenerator: {
    en: {
      title: "Contract Generator",
      description: "Create professional contracts for your creative work"
    },
    es: {
      title: "Generador de Contratos",
      description: "Crea contratos profesionales para tu trabajo creativo"
    }
  },
  maturityEvaluator: {
    en: {
      title: "Creative Business Maturity Evaluator",
      description: "Assess the maturity level of your creative business"
    },
    es: {
      title: "Evaluador de Madurez de Negocio Creativo",
      description: "Evalúa el nivel de madurez de tu negocio creativo"
    }
  },
  exportAdvisor: {
    en: {
      title: "Export & International Payments Advisor",
      description: "Learn how to export and receive international payments"
    },
    es: {
      title: "Asesor de Exportación y Pagos Internacionales",
      description: "Aprende cómo exportar y recibir pagos internacionales"
    }
  },
  portfolioCatalog: {
    en: {
      title: "Portfolio & Catalog Creator",
      description: "Create a professional portfolio or catalog of your work"
    },
    es: {
      title: "Creador de Portafolio y Catálogo",
      description: "Crea un portafolio o catálogo profesional de tu trabajo"
    }
  }
};

export const profileTranslations: CreatorProfilesTranslations = {
  en: {
    musician: "Musician",
    visualArtist: "Visual Artist",
    textileArtisan: "Textile Artisan",
    indigenousArtisan: "Indigenous Artisan",
    ceramicArtisan: "Ceramic Artisan",
    jewelryArtisan: "Jewelry Artisan",
    woodworkArtisan: "Woodwork Artisan",
    leatherArtisan: "Leather Artisan"
  },
  es: {
    musician: "Músico",
    visualArtist: "Artista Visual",
    textileArtisan: "Artesano Textil",
    indigenousArtisan: "Artesana Autóctona",
    ceramicArtisan: "Artesano Ceramista",
    jewelryArtisan: "Artesano Joyero",
    woodworkArtisan: "Artesano en Madera",
    leatherArtisan: "Artesano en Cuero"
  }
};

export const categoryTranslations: CategoryTranslations = {
  en: {
    financial: "Financial Management",
    legal: "Legal Support",
    commercial: "Commercial Support",
    diagnosis: "Business Evaluation"
  },
  es: {
    financial: "Gestión Financiera",
    legal: "Soporte Legal",
    commercial: "Soporte Comercial",
    diagnosis: "Evaluación de Negocio"
  }
};

export const buttonTranslations: ButtonTranslations = {
  en: {
    selectButton: "Select",
    comingSoon: "Coming Soon"
  },
  es: {
    selectButton: "Seleccionar",
    comingSoon: "Próximamente"
  }
};

export const getTranslations = (language: 'en' | 'es') => {
  return {
    title: language === 'en' 
      ? "Specialized Agents for Cultural Creators" 
      : "Agentes Especializados para Creadores Culturales",
    description: language === 'en'
      ? "Choose the agent that best fits your current needs as a cultural creator"
      : "Elige el agente que mejor se adapte a tus necesidades actuales como creador cultural",
    profiles: profileTranslations[language],
    categories: categoryTranslations[language],
    buttons: buttonTranslations[language]
  };
};
