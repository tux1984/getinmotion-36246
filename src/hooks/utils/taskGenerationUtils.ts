
import { CategoryScore } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/culturalAgentsDatabase';
import { OptimizedRecommendedTask } from '../types/recommendedTasksTypes';

export const getAvailableAgents = (enabledAgents: string[]) => {
  const allAgents = culturalAgentsDatabase.getAll();
  const availableAgents = allAgents.filter(agent => enabledAgents.includes(agent.id));
  
  console.log('Available agents for task generation:', {
    totalAgents: allAgents.length,
    enabledAgentIds: enabledAgents,
    availableAgents: availableAgents.map(a => ({ id: a.id, name: a.name }))
  });
  
  return availableAgents;
};

export const generateTasksFromScores = (scores: CategoryScore, enabledAgents: string[]): OptimizedRecommendedTask[] => {
  const generatedTasks: OptimizedRecommendedTask[] = [];
  const availableAgents = getAvailableAgents(enabledAgents);

  console.log('Generating tasks from scores:', scores);
  console.log('Available agents for task generation:', availableAgents.map(a => ({ id: a.id, name: a.name })));

  // ARREGLO CRÍTICO: Verificar que hay agentes antes de generar tareas
  if (availableAgents.length === 0) {
    console.log('No available agents found, cannot generate tasks');
    return [];
  }

  // Generate tasks based on low scores and available agents
  if (scores.ideaValidation < 60) {
    const culturalAgent = availableAgents.find(agent => 
      agent.expertise.includes('idea validation') || 
      agent.name.toLowerCase().includes('cultural') ||
      agent.name.toLowerCase().includes('creative')
    );
    
    if (culturalAgent) {
      generatedTasks.push({
        id: 'validate-concept',
        title: 'Valida tu Concepto Creativo',
        description: 'Investiga tu público objetivo y valida la demanda del mercado para tu propuesta creativa',
        agentId: culturalAgent.id,
        agentName: culturalAgent.name,
        priority: 'high',
        category: 'Validación',
        estimatedTime: '2 horas',
        prompt: `Ayúdame a validar mi concepto creativo. Necesito investigar mi público objetivo y entender la demanda del mercado. ¿Qué pasos específicos debería seguir para validar esta idea?`,
        completed: false,
        isRealAgent: true
      });
    }
  }

  if (scores.userExperience < 60) {
    const projectAgent = availableAgents.find(agent => 
      agent.expertise.includes('project management') || 
      agent.name.toLowerCase().includes('project') ||
      agent.name.toLowerCase().includes('admin')
    );
    
    if (projectAgent) {
      generatedTasks.push({
        id: 'user-journey',
        title: 'Diseña la Experiencia del Usuario',
        description: 'Crea un mapa detallado de la experiencia que tendrán tus usuarios con tu servicio creativo',
        agentId: projectAgent.id,
        agentName: projectAgent.name,
        priority: 'medium',
        category: 'Experiencia',
        estimatedTime: '1.5 horas',
        prompt: `Necesito diseñar la experiencia completa del usuario para mi servicio creativo. ¿Puedes ayudarme a crear un mapa de experiencia que incluya todos los puntos de contacto desde que conocen mi servicio hasta que se convierten en clientes satisfechos?`,
        completed: false,
        isRealAgent: true
      });
    }
  }

  if (scores.marketFit < 60) {
    const marketingAgent = availableAgents.find(agent => 
      agent.expertise.includes('marketing') || 
      agent.expertise.includes('market analysis') ||
      agent.name.toLowerCase().includes('marketing')
    );
    
    if (marketingAgent) {
      generatedTasks.push({
        id: 'market-analysis',
        title: 'Analiza tu Posición en el Mercado',
        description: 'Estudia a tu competencia y define tu propuesta de valor única en el mercado cultural',
        agentId: marketingAgent.id,
        agentName: marketingAgent.name,
        priority: 'high',
        category: 'Mercado',
        estimatedTime: '2.5 horas',
        prompt: `Ayúdame a analizar mi posición en el mercado cultural. Necesito entender quiénes son mis competidores directos e indirectos, y cómo puedo diferenciarme. ¿Cómo puedo crear una propuesta de valor única?`,
        completed: false,
        isRealAgent: true
      });
    }
  }

  if (scores.monetization < 60) {
    const financeAgent = availableAgents.find(agent => 
      agent.expertise.includes('financial') || 
      agent.expertise.includes('pricing') ||
      agent.name.toLowerCase().includes('cost') ||
      agent.name.toLowerCase().includes('financial')
    );
    
    if (financeAgent) {
      generatedTasks.push({
        id: 'pricing-strategy',
        title: 'Desarrolla tu Estrategia de Precios',
        description: 'Crea un modelo de precios competitivo y sostenible para tus servicios creativos',
        agentId: financeAgent.id,
        agentName: financeAgent.name,
        priority: 'high',
        category: 'Monetización',
        estimatedTime: '1 hora',
        prompt: `Necesito desarrollar una estrategia de precios para mi servicio creativo. ¿Puedes ayudarme a analizar diferentes modelos de precios, calcular mis costos base y determinar precios competitivos que me permitan ser rentable?`,
        completed: false,
        isRealAgent: true
      });
    }
  }

  // Add growth tasks for higher-scoring areas
  if (scores.ideaValidation >= 60 && scores.monetization < 80) {
    const businessAgent = availableAgents.find(agent => 
      agent.expertise.includes('business development') || 
      agent.expertise.includes('revenue optimization') ||
      agent.name.toLowerCase().includes('business')
    );
    
    if (businessAgent) {
      generatedTasks.push({
        id: 'revenue-optimization',
        title: 'Optimiza tus Fuentes de Ingresos',
        description: 'Explora nuevas formas de monetizar tu talento creativo y diversificar ingresos',
        agentId: businessAgent.id,
        agentName: businessAgent.name,
        priority: 'medium',
        category: 'Crecimiento',
        estimatedTime: '1.5 horas',
        prompt: `Mi negocio creativo ya está validado, pero quiero optimizar y diversificar mis fuentes de ingresos. ¿Qué estrategias puedes sugerirme para maximizar la monetización de mi talento creativo?`,
        completed: false,
        isRealAgent: true
      });
    }
  }

  console.log('Generated tasks from scores:', {
    scoresUsed: scores,
    tasksGenerated: generatedTasks.length,
    taskTitles: generatedTasks.map(t => t.title)
  });
  
  return generatedTasks;
};
