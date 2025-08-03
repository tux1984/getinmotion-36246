import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TaskEvolutionRequest {
  action: 'evolve_tasks' | 'get_coaching_message' | 'analyze_progress';
  completedTasks?: any[];
  maturityScores?: any;
  userProfile?: any;
  userId: string;
  currentTasks?: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, completedTasks, maturityScores, userProfile, userId, currentTasks }: TaskEvolutionRequest = await req.json();

    console.log(`Master Agent Coordinator - Action: ${action}, User: ${userId}`);

    switch (action) {
      case 'evolve_tasks':
        return await handleTaskEvolution(completedTasks || [], maturityScores, userProfile);
      
      case 'get_coaching_message':
        return await getCoachingMessage(currentTasks || [], completedTasks || [], maturityScores);
      
      case 'analyze_progress':
        return await analyzeUserProgress(userId, maturityScores);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in master-agent-coordinator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleTaskEvolution(completedTasks: any[], maturityScores: any, userProfile: any) {
  const suggestions = [];
  
  // Analyze completed tasks patterns
  const completedCategories = new Set(completedTasks.map(task => task.agent_id));
  const totalCompleted = completedTasks.length;
  
  console.log(`Analyzing evolution for ${totalCompleted} completed tasks across categories:`, Array.from(completedCategories));

  // Financial evolution path
  if (completedCategories.has('financial-management') && totalCompleted >= 2) {
    suggestions.push({
      id: 'financial-analytics-' + Date.now(),
      title: 'Implementar Dashboard Financiero',
      description: 'Crea un sistema de seguimiento de KPIs financieros clave para tu negocio',
      reason: 'Has completado tareas financieras básicas, es momento de obtener insights avanzados',
      impact: 'high',
      agentId: 'business-intelligence',
      priority: 95,
      unlockReason: 'Desbloqueado por completar configuración financiera'
    });
  }

  // Legal progression
  if (completedCategories.has('legal-advisor') && totalCompleted >= 1) {
    suggestions.push({
      id: 'contract-templates-' + Date.now(),
      title: 'Crear Plantillas de Contratos',
      description: 'Desarrolla contratos estandarizados para tus servicios más frecuentes',
      reason: 'Con tu estructura legal básica lista, optimiza tus procesos contractuales',
      impact: 'medium',
      agentId: 'legal-advisor',
      priority: 80
    });
  }

  // Marketing automation
  if (completedCategories.has('marketing-specialist') && totalCompleted >= 3) {
    suggestions.push({
      id: 'marketing-automation-' + Date.now(),
      title: 'Automatizar Campañas de Marketing',
      description: 'Configura secuencias de email y procesos de nutrición de leads',
      reason: 'Escalemos tu marketing con automatización inteligente',
      impact: 'high',
      agentId: 'marketing-specialist',
      priority: 90
    });
  }

  // Growth phase suggestions
  if (totalCompleted >= 5) {
    suggestions.push({
      id: 'team-building-' + Date.now(),
      title: 'Estructurar tu Primer Equipo',
      description: 'Define roles, procesos de contratación y cultura organizacional',
      reason: 'Tu negocio está creciendo, es hora de pensar en escalar con un equipo',
      impact: 'high',
      agentId: 'cultural-consultant',
      priority: 85,
      unlockReason: 'Desbloqueado por completar 5+ tareas - ¡Estás listo para crecer!'
    });
  }

  // Maturity-based suggestions
  if (maturityScores) {
    const avgMaturity = Object.values(maturityScores).reduce((a: number, b: number) => a + b, 0) / 4;
    
    if (avgMaturity > 60 && !completedCategories.has('expansion-specialist')) {
      suggestions.push({
        id: 'market-expansion-' + Date.now(),
        title: 'Explorar Nuevos Mercados',
        description: 'Investiga oportunidades de expansión a nuevos segmentos o geografías',
        reason: 'Tu madurez empresarial te permite explorar nuevas oportunidades',
        impact: 'high',
        agentId: 'expansion-specialist',
        priority: 75
      });
    }
  }

  // AI-enhanced suggestions if OpenAI is available
  if (openAIApiKey && suggestions.length < 2) {
    try {
      const aiSuggestions = await getAITaskSuggestions(completedTasks, maturityScores, userProfile);
      suggestions.push(...aiSuggestions);
    } catch (error) {
      console.log('AI suggestions failed, using fallback logic:', error.message);
    }
  }

  return new Response(
    JSON.stringify({ 
      suggestions: suggestions.slice(0, 3),
      totalAnalyzed: totalCompleted,
      categoriesCompleted: Array.from(completedCategories)
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAITaskSuggestions(completedTasks: any[], maturityScores: any, userProfile: any) {
  if (!openAIApiKey) return [];

  const prompt = `
    Eres un coach empresarial experto. Analiza el progreso del usuario y sugiere 2 tareas específicas para continuar su desarrollo.

    Tareas completadas: ${JSON.stringify(completedTasks.map(t => ({ title: t.title, category: t.agent_id })))}
    Puntuaciones de madurez: ${JSON.stringify(maturityScores)}
    Perfil del usuario: ${JSON.stringify(userProfile)}

    Responde SOLO con un array JSON de objetos con esta estructura:
    [{
      "title": "Título específico de la tarea",
      "description": "Descripción detallada y accionable",
      "reason": "Por qué esta tarea es el siguiente paso lógico",
      "impact": "high|medium|low",
      "agentId": "id del agente más apropiado",
      "priority": número del 1-100
    }]
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return JSON.parse(aiResponse).map((suggestion: any) => ({
      ...suggestion,
      id: 'ai-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return [];
  }
}

async function getCoachingMessage(currentTasks: any[], completedTasks: any[], maturityScores: any) {
  const totalTasks = currentTasks.length;
  const completedCount = completedTasks.length;
  
  let message = "¡Hola! ";
  
  if (completedCount === 0) {
    message += "¡Excelente que hayas comenzado tu viaje empresarial! Te he preparado las primeras tareas basadas en tu perfil.";
  } else if (completedCount < 3) {
    message += `¡Vas genial! Has completado ${completedCount} tareas. Cada paso te acerca más a tu objetivo.`;
  } else if (completedCount < 10) {
    message += `¡Impresionante progreso! Con ${completedCount} tareas completadas, tu negocio está tomando forma.`;
  } else {
    message += `¡Eres increíble! ${completedCount} tareas completadas. Estás construyendo algo realmente sólido.`;
  }

  if (totalTasks > 12) {
    message += ` Tienes ${totalTasks} tareas activas. Considera pausar algunas para mantener el foco.`;
  } else if (totalTasks < 5) {
    message += " ¿Te animas a activar algunas tareas más para acelerar tu progreso?";
  }

  return new Response(
    JSON.stringify({ message, stats: { currentTasks: totalTasks, completedTasks: completedCount } }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeUserProgress(userId: string, maturityScores: any) {
  try {
    // Get user's task history
    const { data: tasks } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
    const totalTasks = tasks?.length || 0;

    const analysis = {
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate: totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0,
      maturityScores,
      recentActivity: completedTasks.slice(0, 5),
      suggestions: completedTasks.length >= 3 ? [
        "Consider reviewing your business strategy",
        "Time to think about scaling operations",
        "Explore advanced tools and automation"
      ] : [
        "Focus on completing your current tasks",
        "Build momentum with quick wins",
        "Don't hesitate to ask for help"
      ]
    };

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing progress:', error);
    throw error;
  }
}