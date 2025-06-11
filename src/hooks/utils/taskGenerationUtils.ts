
import { CategoryScore } from '@/types/dashboard';
import { culturalAgentsDatabase, CulturalAgent } from '@/data/agentsDatabase';
import { OptimizedRecommendedTask } from '../types/recommendedTasksTypes';

export const getAvailableAgents = (enabledAgentIds: string[]): CulturalAgent[] => {
  console.log('getAvailableAgents called with:', { enabledAgentIds, totalAgents: culturalAgentsDatabase.length });
  
  const availableAgents = culturalAgentsDatabase.filter(agent => 
    enabledAgentIds.includes(agent.id)
  );
  
  console.log('Available agents found:', {
    totalAgents: culturalAgentsDatabase.length,
    enabledAgentIds,
    availableAgents: availableAgents.map(a => ({ id: a.id, name: a.name }))
  });
  
  return availableAgents;
};

export const generateTasksFromScores = (
  scores: CategoryScore, 
  enabledAgentIds: string[]
): OptimizedRecommendedTask[] => {
  console.log('Generating tasks from scores:', scores);
  console.log('Available agents for task generation:', enabledAgentIds);
  
  const availableAgents = getAvailableAgents(enabledAgentIds);
  
  if (availableAgents.length === 0) {
    console.log('No available agents found, generating fallback tasks');
    return generateFallbackTasks(scores);
  }
  
  const tasks: OptimizedRecommendedTask[] = [];
  
  // Generate tasks based on lowest scores (highest priority)
  const scoreEntries = Object.entries(scores).sort(([,a], [,b]) => a - b);
  
  scoreEntries.forEach(([category, score], index) => {
    if (score < 70 && index < availableAgents.length) { // Only create tasks for scores below 70%
      const agent = availableAgents[index % availableAgents.length];
      const priority = score < 30 ? 'high' : score < 60 ? 'medium' : 'low';
      
      const task: OptimizedRecommendedTask = {
        id: `score-task-${category}`,
        title: getTaskTitleForCategory(category),
        description: getTaskDescriptionForCategory(category, score),
        agentId: agent.id,
        agentName: agent.name,
        priority: priority as 'high' | 'medium' | 'low',
        category: 'Mejora Recomendada',
        estimatedTime: '2-3 horas',
        prompt: getTaskPromptForCategory(category, score),
        completed: false,
        isRealAgent: true
      };
      
      tasks.push(task);
    }
  });
  
  // Si no se generaron tareas desde scores, crear al menos una tarea básica
  if (tasks.length === 0 && availableAgents.length > 0) {
    const primaryAgent = availableAgents[0];
    tasks.push({
      id: 'default-task-1',
      title: 'Desarrollar tu Proyecto Creativo',
      description: 'Comienza a trabajar en los aspectos fundamentales de tu proyecto creativo.',
      agentId: primaryAgent.id,
      agentName: primaryAgent.name,
      priority: 'medium',
      category: 'Desarrollo',
      estimatedTime: '1-2 horas',
      prompt: '¿Cómo puedo empezar a desarrollar mi proyecto creativo de manera efectiva?',
      completed: false,
      isRealAgent: true
    });
  }
  
  return tasks;
};

const generateFallbackTasks = (scores: CategoryScore): OptimizedRecommendedTask[] => {
  console.log('Generating fallback tasks for scores:', scores);
  
  const fallbackTasks: OptimizedRecommendedTask[] = [];
  
  // Get the lowest scoring area
  const lowestScore = Math.min(...Object.values(scores));
  const lowestCategory = Object.entries(scores).find(([, score]) => score === lowestScore)?.[0];
  
  if (lowestCategory) {
    fallbackTasks.push({
      id: 'fallback-task-1',
      title: `Mejorar ${getCategoryDisplayName(lowestCategory)}`,
      description: `Tu puntuación en ${getCategoryDisplayName(lowestCategory)} es ${lowestScore}%. Te sugerimos enfocarte en esta área.`,
      agentId: 'cultural-consultant', // Default agent
      agentName: 'Especialista Creativo',
      priority: 'high',
      category: 'Área de Mejora',
      estimatedTime: '1-2 horas',
      prompt: `Mi puntuación en ${getCategoryDisplayName(lowestCategory)} es ${lowestScore}%. ¿Cómo puedo mejorar en esta área específicamente?`,
      completed: false,
      isRealAgent: false // Mark as fallback
    });
  }
  
  // Agregar una tarea adicional general
  fallbackTasks.push({
    id: 'fallback-task-2',
    title: 'Comenzar con lo Básico',
    description: 'Enfócate en establecer los fundamentos de tu proyecto creativo paso a paso.',
    agentId: 'cultural-consultant',
    agentName: 'Especialista Creativo',
    priority: 'medium',
    category: 'Fundamentos',
    estimatedTime: '30 min',
    prompt: '¿Cuáles son los primeros pasos más importantes para mi proyecto creativo?',
    completed: false,
    isRealAgent: false
  });
  
  return fallbackTasks;
};

const getTaskTitleForCategory = (category: string): string => {
  const titles = {
    ideaValidation: 'Validar y Refinar tu Idea de Negocio',
    userExperience: 'Mejorar la Experiencia del Usuario',
    marketFit: 'Analizar el Ajuste al Mercado',
    monetization: 'Desarrollar Estrategia de Monetización'
  };
  return titles[category as keyof typeof titles] || 'Mejorar Área de Negocio';
};

const getTaskDescriptionForCategory = (category: string, score: number): string => {
  const descriptions = {
    ideaValidation: `Tu puntuación de validación de idea es ${score}%. Necesitas validar mejor tu propuesta de valor.`,
    userExperience: `Tu puntuación de experiencia de usuario es ${score}%. Mejora cómo interactúan los usuarios con tu producto.`,
    marketFit: `Tu puntuación de ajuste al mercado es ${score}%. Analiza mejor tu mercado objetivo y competencia.`,
    monetization: `Tu puntuación de monetización es ${score}%. Desarrolla una estrategia de ingresos más sólida.`
  };
  return descriptions[category as keyof typeof descriptions] || `Mejora necesaria en esta área (${score}%)`;
};

const getTaskPromptForCategory = (category: string, score: number): string => {
  const prompts = {
    ideaValidation: `Mi puntuación de validación de idea es ${score}%. ¿Cómo puedo validar mejor mi propuesta de valor y asegurarme de que resuelve un problema real?`,
    userExperience: `Mi puntuación de experiencia de usuario es ${score}%. ¿Qué pasos específicos puedo tomar para mejorar la experiencia de mis usuarios?`,
    marketFit: `Mi puntuación de ajuste al mercado es ${score}%. ¿Cómo puedo analizar mejor mi mercado objetivo y entender a mi competencia?`,
    monetization: `Mi puntuación de monetización es ${score}%. ¿Qué estrategias de monetización son más apropiadas para mi tipo de negocio creativo?`
  };
  return prompts[category as keyof typeof prompts] || `Ayúdame a mejorar en esta área donde tengo ${score}% de puntuación.`;
};

const getCategoryDisplayName = (category: string): string => {
  const displayNames = {
    ideaValidation: 'Validación de Idea',
    userExperience: 'Experiencia de Usuario',
    marketFit: 'Ajuste al Mercado',
    monetization: 'Monetización'
  };
  return displayNames[category as keyof typeof displayNames] || category;
};
