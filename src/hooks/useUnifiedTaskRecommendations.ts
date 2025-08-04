import { useMemo } from 'react';
import { CategoryScore } from '@/types/dashboard';
import { OptimizedRecommendedTask } from './types/recommendedTasksTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseUnifiedTaskRecommendationsProps {
  maturityScores: CategoryScore | null;
  language?: 'en' | 'es';
}

export const useUnifiedTaskRecommendations = ({ 
  maturityScores, 
  language = 'es' 
}: UseUnifiedTaskRecommendationsProps): OptimizedRecommendedTask[] => {
  
  return useMemo(() => {
    if (!maturityScores) return [];

    // Calculate maturity level
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    let maturityLevel = 'Explorador';
    if (average >= 80) maturityLevel = 'Visionario';
    else if (average >= 60) maturityLevel = 'Estratega';
    else if (average >= 40) maturityLevel = 'Constructor';

    const tasksByLevel = {
      'Explorador': [
        { 
          title: 'Validar tu idea de negocio con expertos', 
          description: 'Obtén feedback profesional sobre tu concepto de negocio y valida su viabilidad en el mercado',
          agent: 'cultural-consultant',
          agentName: 'Consultor Cultural',
          priority: 'high' as const,
          category: 'Validación',
          estimatedTime: '2-3 horas',
          prompt: 'Necesito validar mi idea de negocio con expertos. Ayúdame a estructurar mi propuesta y encontrar el feedback necesario.'
        },
        { 
          title: 'Calcular costos reales de tu proyecto', 
          description: 'Define presupuestos precisos y entiende todos los costos involucrados en tu proyecto',
          agent: 'cost-calculator',
          agentName: 'Calculadora de Costos',
          priority: 'high' as const,
          category: 'Finanzas',
          estimatedTime: '1-2 horas',
          prompt: 'Ayúdame a calcular todos los costos reales de mi proyecto para tener un presupuesto preciso.'
        },
        { 
          title: 'Establecer estructura legal básica', 
          description: 'Protege tu negocio legalmente con la estructura jurídica adecuada',
          agent: 'collaboration-agreement',
          agentName: 'Asesor Legal',
          priority: 'medium' as const,
          category: 'Legal',
          estimatedTime: '2-4 horas',
          prompt: 'Necesito establecer la estructura legal básica para mi negocio. Guíame en el proceso.'
        }
      ],
      'Constructor': [
        { 
          title: 'Desarrollar estrategia de marketing digital', 
          description: 'Atrae a tus primeros clientes con una estrategia de marketing efectiva',
          agent: 'marketing-advisor',
          agentName: 'Asesor de Marketing',
          priority: 'high' as const,
          category: 'Marketing',
          estimatedTime: '3-5 horas',
          prompt: 'Ayúdame a desarrollar una estrategia de marketing digital para atraer mis primeros clientes.'
        },
        { 
          title: 'Optimizar gestión de proyectos', 
          description: 'Organiza tu flujo de trabajo para maximizar la productividad',
          agent: 'project-manager',
          agentName: 'Gestor de Proyectos',
          priority: 'medium' as const,
          category: 'Operaciones',
          estimatedTime: '2-3 horas',
          prompt: 'Necesito optimizar la gestión de mis proyectos para ser más eficiente.'
        },
        { 
          title: 'Crear sistema de precios competitivo', 
          description: 'Maximiza tus ingresos con una estrategia de precios inteligente',
          agent: 'pricing-assistant',
          agentName: 'Asistente de Precios',
          priority: 'medium' as const,
          category: 'Estrategia',
          estimatedTime: '1-2 horas',
          prompt: 'Ayúdame a crear un sistema de precios competitivo para mis productos/servicios.'
        }
      ],
      'Estratega': [
        { 
          title: 'Explorar mercados internacionales', 
          description: 'Expande globalmente y encuentra nuevas oportunidades de mercado',
          agent: 'export-advisor',
          agentName: 'Asesor de Exportación',
          priority: 'high' as const,
          category: 'Expansión',
          estimatedTime: '4-6 horas',
          prompt: 'Quiero explorar oportunidades en mercados internacionales. Ayúdame con la estrategia.'
        },
        { 
          title: 'Desarrollar red de stakeholders', 
          description: 'Conecta con socios clave para potenciar tu negocio',
          agent: 'stakeholder-matching',
          agentName: 'Conector de Stakeholders',
          priority: 'high' as const,
          category: 'Networking',
          estimatedTime: '3-4 horas',
          prompt: 'Necesito desarrollar una red sólida de stakeholders para mi negocio.'
        },
        { 
          title: 'Optimizar marca personal', 
          description: 'Fortalece tu posicionamiento y presencia en el mercado',
          agent: 'branding-strategy',
          agentName: 'Estratega de Marca',
          priority: 'medium' as const,
          category: 'Branding',
          estimatedTime: '2-3 horas',
          prompt: 'Ayúdame a optimizar mi marca personal y posicionamiento en el mercado.'
        }
      ],
      'Visionario': [
        { 
          title: 'Desarrollar estrategia de escalabilidad', 
          description: 'Multiplica tu impacto con sistemas escalables',
          agent: 'business-scaling',
          agentName: 'Especialista en Escalabilidad',
          priority: 'high' as const,
          category: 'Crecimiento',
          estimatedTime: '5-8 horas',
          prompt: 'Necesito desarrollar una estrategia para escalar mi negocio de manera sostenible.'
        },
        { 
          title: 'Implementar innovación disruptiva', 
          description: 'Lidera el cambio en tu industria con innovación',
          agent: 'innovation-consultant',
          agentName: 'Consultor de Innovación',
          priority: 'high' as const,
          category: 'Innovación',
          estimatedTime: '4-6 horas',
          prompt: 'Quiero implementar innovación disruptiva en mi industria. Guíame en el proceso.'
        },
        { 
          title: 'Crear ecosistema de negocios', 
          description: 'Construye un imperio empresarial integrado',
          agent: 'ecosystem-builder',
          agentName: 'Constructor de Ecosistemas',
          priority: 'medium' as const,
          category: 'Estrategia',
          estimatedTime: '6-10 horas',
          prompt: 'Ayúdame a crear un ecosistema de negocios integrado y rentable.'
        }
      ]
    };

    const selectedTasks = tasksByLevel[maturityLevel] || tasksByLevel['Explorador'];
    
    return selectedTasks.map(task => ({
      id: `rec_${uuidv4()}`,
      title: task.title,
      description: task.description,
      agentId: task.agent,
      agentName: task.agentName,
      priority: task.priority,
      category: task.category,
      estimatedTime: task.estimatedTime,
      prompt: task.prompt,
      completed: false,
      isRealAgent: true
    }));
  }, [maturityScores, language]);
};