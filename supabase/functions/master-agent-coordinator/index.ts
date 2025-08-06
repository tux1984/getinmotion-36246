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
  action: 'evolve_tasks' | 'get_coaching_message' | 'analyze_progress' | 'analyze_and_generate_tasks' | 'start_conversation' | 'generate_intelligent_questions' | 'create_task_steps' | 'complete_step' | 'generate_deliverable';
  completedTasks?: any[];
  maturityScores?: any;
  userProfile?: any;
  userId: string;
  currentTasks?: any[];
  businessDescription?: string;
  conversationContext?: string;
  taskId?: string;
  taskData?: any;
  profileContext?: any;
  stepId?: string;
  stepData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, completedTasks, maturityScores, userProfile, userId, currentTasks, businessDescription, conversationContext, taskId, taskData, profileContext, stepId, stepData }: TaskEvolutionRequest = await req.json();

    console.log(`Master Agent Coordinator - Action: ${action}, User: ${userId}`);

    switch (action) {
      case 'evolve_tasks':
        return await handleTaskEvolution(completedTasks || [], maturityScores, userProfile);
      
      case 'get_coaching_message':
        return await getCoachingMessage(currentTasks || [], completedTasks || [], maturityScores);
      
      case 'analyze_progress':
        return await analyzeUserProgress(userId, maturityScores);
      
      case 'analyze_and_generate_tasks':
        return await analyzeAndGenerateTasks(userId, userProfile, maturityScores, businessDescription);
      
      case 'start_conversation':
        return await startIntelligentConversation(userId, userProfile, conversationContext);
      
      case 'generate_intelligent_questions':
        return await generateIntelligentQuestions(userId, userProfile);
      
      case 'create_task_steps':
        return await createTaskSteps(taskId!, taskData, profileContext);
      
      case 'complete_step':
        return await completeStep(taskId!, stepId!, stepData, userId);
      
      case 'generate_deliverable':
        return await generateDeliverable(taskId!, userId);
      
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

async function analyzeAndGenerateTasks(userId: string, userProfile: any, maturityScores: any, businessDescription?: string) {
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Obtener información COMPLETA del usuario desde Supabase - FUSIÓN REAL
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: maturityData } = await supabase
      .from('user_maturity_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // FUSIÓN COMPLETA: Combinar TODOS los datos del perfil y madurez
    const businessInfo = businessDescription || profile?.business_description || 'No hay descripción del negocio disponible';
    const brandName = profile?.brand_name || profile?.full_name + ' Business' || 'Negocio sin nombre definido';
    
    // Datos completos del perfil unificado
    const unifiedProfile = {
      // Datos básicos
      businessName: brandName,
      businessDescription: businessInfo,
      businessType: profile?.business_type,
      marketTarget: profile?.target_market,
      currentStage: profile?.current_stage,
      location: profile?.business_location,
      
      // Recursos y capacidades
      teamSize: profile?.team_size,
      timeAvailability: profile?.time_availability,
      salesChannels: profile?.sales_channels || [],
      monthlyRevenueGoal: profile?.monthly_revenue_goal,
      yearsInBusiness: profile?.years_in_business,
      initialInvestment: profile?.initial_investment_range,
      
      // Habilidades y desafíos
      primarySkills: profile?.primary_skills || [],
      currentChallenges: profile?.current_challenges || [],
      businessGoals: profile?.business_goals || [],
      socialMediaPresence: profile?.social_media_presence,
      
      // Puntuaciones de madurez
      maturityScores: maturityData ? {
        ideaValidation: maturityData.idea_validation,
        userExperience: maturityData.user_experience,
        marketFit: maturityData.market_fit,
        monetization: maturityData.monetization
      } : null
    };
    
    const prompt = `
Eres un Master Coordinator AI experto en emprendimiento. Analiza el PERFIL COMPLETO Y FUSIONADO del usuario y genera tareas ULTRA-PERSONALIZADAS y ESPECÍFICAS para su negocio.

PERFIL EMPRESARIAL COMPLETO:
Negocio: "${unifiedProfile.businessName}"
Descripción: "${unifiedProfile.businessDescription}"
Tipo: ${unifiedProfile.businessType || 'No definido'}
Mercado objetivo: ${unifiedProfile.marketTarget || 'No definido'}
Etapa actual: ${unifiedProfile.currentStage || 'No definido'}
Ubicación: ${unifiedProfile.location || 'No definido'}
Canales de venta: ${JSON.stringify(unifiedProfile.salesChannels)}
Tamaño del equipo: ${unifiedProfile.teamSize || 'No definido'}
Tiempo disponible: ${unifiedProfile.timeAvailability || 'No definido'}
Meta de ingresos: $${unifiedProfile.monthlyRevenueGoal || 'No definido'} mensuales
Años en el negocio: ${unifiedProfile.yearsInBusiness || 'Nuevo'}
Inversión inicial: ${unifiedProfile.initialInvestment || 'No definido'}

HABILIDADES Y CONTEXTO:
Habilidades principales: ${JSON.stringify(unifiedProfile.primarySkills)}
Desafíos actuales: ${JSON.stringify(unifiedProfile.currentChallenges)}
Objetivos del negocio: ${JSON.stringify(unifiedProfile.businessGoals)}
Presencia en redes: ${JSON.stringify(unifiedProfile.socialMediaPresence)}

PUNTUACIONES DE MADUREZ (PRIORIZAR ÁREAS MÁS BAJAS):
${unifiedProfile.maturityScores ? `
- Validación de idea: ${unifiedProfile.maturityScores.ideaValidation}/100
- Experiencia de usuario: ${unifiedProfile.maturityScores.userExperience}/100  
- Ajuste al mercado: ${unifiedProfile.maturityScores.marketFit}/100
- Monetización: ${unifiedProfile.maturityScores.monetization}/100
` : 'No hay datos de madurez disponibles'}

INSTRUCCIONES CRÍTICAS:
1. Usa EXACTAMENTE el nombre del negocio "${unifiedProfile.businessName}" en los títulos cuando sea relevante
2. Si el negocio es específico (ej: "cositas lindas", "muñecos tejidos"), haz tareas ULTRA ESPECÍFICAS
3. Prioriza las áreas con puntuaciones de madurez más bajas
4. Genera EXACTAMENTE 5 tareas súper personalizadas
5. Cada tarea debe tener 2-4 pasos específicos y útiles
6. NO uses términos genéricos - todo debe ser contextual al negocio

EJEMPLOS DE ESPECIFICIDAD REQUERIDA:
❌ MAL: "Define una estrategia de precios"
✅ BIEN: "Define precios para los muñecos tejidos de ${unifiedProfile.businessName} según complejidad del diseño"

❌ MAL: "Identifica tu mercado objetivo"  
✅ BIEN: "Identifica quién compra muñecos tejidos personalizados en ${unifiedProfile.location || 'tu área'}"

Responde SOLO con un array JSON con esta estructura:
[{
  "title": "Título súper específico usando el nombre del negocio",
  "description": "Descripción detallada mencionando el tipo de negocio específico",
  "agent_id": "financial-management|marketing-specialist|legal-advisor|operations-specialist|cultural-consultant",
  "relevance": "high|medium|low",
  "priority": 1-10,
  "estimated_time": "15 min|30 min|1 hora|2 horas",
  "category": "Categoría específica del tipo de negocio",
  "steps": [
    {
      "title": "Paso súper específico 1",
      "description": "Descripción detallada del paso con contexto del negocio",
      "deliverable": "Entregable concreto y específico"
    },
    {
      "title": "Paso súper específico 2", 
      "description": "Descripción detallada del paso con contexto del negocio",
      "deliverable": "Entregable concreto y específico"
    }
  ]
}]
`;

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
        max_tokens: 2000
      }),
    });

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    // Clean up the response to ensure it's valid JSON
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Raw AI response:', aiResponse);
    
    const tasks = JSON.parse(aiResponse);

    // Crear las tareas en la base de datos
    const tasksToInsert = tasks.map((task: any) => ({
      user_id: userId,
      agent_id: task.agent_id,
      title: task.title,
      description: task.description,
      relevance: task.relevance,
      status: 'pending',
      priority: task.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: insertedTasks, error } = await supabase
      .from('agent_tasks')
      .insert(tasksToInsert)
      .select();

    if (error) throw error;

    console.log(`✅ Generated ${insertedTasks?.length} personalized tasks for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tasks: insertedTasks,
        message: `He generado ${insertedTasks?.length} tareas específicas para tu negocio: ${businessInfo}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating personalized tasks:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// NUEVAS FUNCIONES INTELIGENTES - IMPLEMENTACIÓN COMPLETA

async function generateIntelligentQuestions(userId: string, userProfile: any) {
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Obtener perfil completo del usuario
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: maturityData } = await supabase
      .from('user_maturity_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Crear contexto completo del perfil
    const profileContext = {
      businessName: profile?.brand_name || 'Negocio sin nombre',
      businessDescription: profile?.business_description || 'Sin descripción',
      businessType: profile?.business_type,
      salesChannels: profile?.sales_channels || [],
      teamSize: profile?.team_size,
      timeAvailability: profile?.time_availability,
      monthlyRevenueGoal: profile?.monthly_revenue_goal,
      currentChallenges: profile?.current_challenges || [],
      businessGoals: profile?.business_goals || [],
      maturityScores: maturityData
    };

    const prompt = `
Eres un Master Coordinator especializado en hacer preguntas inteligentes para profundizar en el perfil empresarial.

PERFIL ACTUAL DEL USUARIO:
Negocio: "${profileContext.businessName}"
Descripción: "${profileContext.businessDescription}"
Tipo: ${profileContext.businessType || 'No definido'}
Canales: ${JSON.stringify(profileContext.salesChannels)}
Equipo: ${profileContext.teamSize || 'No definido'}
Meta mensual: $${profileContext.monthlyRevenueGoal || 'No definido'}
Desafíos: ${JSON.stringify(profileContext.currentChallenges)}

TU MISIÓN: Identifica gaps o información poco clara y genera 3-5 preguntas ESPECÍFICAS para enriquecer el perfil.

EJEMPLOS DE BUENAS PREGUNTAS:
- Si dice "vendo muñecos tejidos" pero no menciona precios → "¿Ya tienes definidos los precios para tus muñecos? ¿Varían según el tamaño o complejidad?"
- Si no menciona canales específicos → "¿Dónde vendes principalmente? ¿Instagram, Facebook, ferias, catálogo físico?"
- Si no hay información de costos → "¿Tienes claro cuánto te cuesta producir cada muñeco? ¿Qué materiales usas?"

INSTRUCCIONES:
1. Analiza QUÉ INFORMACIÓN FALTA o es vaga
2. Genera preguntas conversacionales y específicas
3. Enfócate en información crítica para el negocio
4. Usa el nombre del negocio cuando sea relevante
5. Haz preguntas que ayuden a generar tareas más personalizadas

Responde SOLO con un array JSON:
[{
  "question": "Pregunta específica y conversacional",
  "context": "Por qué esta pregunta es importante para el negocio",
  "category": "pricing|marketing|operations|strategy|product"
}]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    // Limpiar respuesta
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questions = JSON.parse(aiResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        questions,
        message: `He generado ${questions.length} preguntas inteligentes para enriquecer tu perfil empresarial.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating intelligent questions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// FASE 5: Crear pasos específicos para tareas
export async function createTaskSteps(taskId: string, taskData: any, profileContext: any) {
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const prompt = `
Eres un Master Coordinator experto en crear pasos específicos y útiles para tareas empresariales.

TAREA A DESARROLLAR:
Título: "${taskData.title}"
Descripción: "${taskData.description}"

CONTEXTO DEL NEGOCIO:
${JSON.stringify(profileContext)}

INSTRUCCIONES:
1. Crea 3-6 pasos específicos y accionables
2. Cada paso debe ser claro y tener un entregable concreto
3. Usa el contexto del negocio para personalizar los pasos
4. Ordena los pasos lógicamente
5. Incluye validaciones y ayuda contextual

EJEMPLO DE PASOS ESPECÍFICOS:
Para "Definir precios de muñecos tejidos de Cositas lindas":
Paso 1: "Lista todos los tipos de muñecos que haces (bebés, animales, personajes)"
Paso 2: "Calcula el costo de materiales para cada tipo de muñeco"
Paso 3: "Cronometra cuánto tardas en tejer cada tipo"
Paso 4: "Define tu ganancia deseada por hora de trabajo"
Paso 5: "Compara con precios de artesanos similares en tu zona"

Responde SOLO con un array JSON:
[{
  "step_number": 1,
  "title": "Título específico del paso",
  "description": "Descripción detallada y contextual",
  "input_type": "text|number|select|file",
  "validation_criteria": "Criterios de validación",
  "ai_context_prompt": "Prompt para ayuda de IA en este paso",
  "deliverable": "Qué entregable concreto debe producir"
}]
`;

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
        max_tokens: 1500
      }),
    });

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const steps = JSON.parse(aiResponse);

    // Insertar pasos en la base de datos
    const stepsToInsert = steps.map((step: any) => ({
      task_id: taskId,
      step_number: step.step_number,
      title: step.title,
      description: step.description,
      input_type: step.input_type || 'text',
      validation_criteria: step.validation_criteria || {},
      ai_context_prompt: step.ai_context_prompt,
      completion_status: 'pending'
    }));

    const { data: insertedSteps, error } = await supabase
      .from('task_steps')
      .insert(stepsToInsert)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        steps: insertedSteps,
        message: `He creado ${insertedSteps.length} pasos específicos para tu tarea.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating task steps:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Completar paso y generar ayuda contextual
export async function completeStep(taskId: string, stepId: string, stepData: any, userId: string) {
  try {
    // Actualizar el paso como completado
    const { error } = await supabase
      .from('task_steps')
      .update({ 
        completion_status: 'completed',
        user_input_data: stepData,
        updated_at: new Date().toISOString()
      })
      .eq('id', stepId);

    if (error) throw error;

    // Verificar si todos los pasos están completos
    const { data: allSteps } = await supabase
      .from('task_steps')
      .select('completion_status')
      .eq('task_id', taskId);

    const allCompleted = allSteps?.every(step => step.completion_status === 'completed');

    if (allCompleted) {
      // Marcar tarea como completada
      await supabase
        .from('agent_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        allCompleted,
        message: allCompleted ? '¡Tarea completada! Generando entregable...' : 'Paso completado exitosamente.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error completing step:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Generar entregable para tarea completada
export async function generateDeliverable(taskId: string, userId: string) {
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Obtener información de la tarea y sus pasos
    const { data: task } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    const { data: steps } = await supabase
      .from('task_steps')
      .select('*')
      .eq('task_id', taskId)
      .order('step_number');

    const stepData = steps?.map(step => ({
      title: step.title,
      userInput: step.user_input_data
    }));

    const prompt = `
Eres un experto en crear entregables empresariales profesionales.

TAREA COMPLETADA:
Título: "${task.title}"
Descripción: "${task.description}"

PASOS REALIZADOS Y DATOS:
${JSON.stringify(stepData, null, 2)}

INSTRUCCIONES:
1. Crea un entregable profesional y útil
2. Organiza la información de forma clara
3. Incluye recomendaciones específicas
4. Haz que sea un documento que el usuario pueda usar inmediatamente

FORMATO DE ENTREGABLE:
- Título del documento
- Resumen ejecutivo
- Desarrollo basado en los pasos completados
- Recomendaciones específicas
- Próximos pasos sugeridos

Responde con un documento en formato markdown profesional.
`;

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
        max_tokens: 2000
      }),
    });

    const data = await response.json();
    const deliverableContent = data.choices[0].message.content;

    // Crear entregable en la base de datos
    const { data: deliverable, error } = await supabase
      .from('agent_deliverables')
      .insert({
        user_id: userId,
        task_id: taskId,
        agent_id: task.agent_id,
        title: `Entregable: ${task.title}`,
        description: `Documento generado al completar la tarea: ${task.title}`,
        file_type: 'text',
        content: deliverableContent,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        deliverable,
        message: 'Entregable generado exitosamente.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating deliverable:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function startIntelligentConversation(userId: string, userProfile: any, conversationContext?: string) {
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Obtener información del perfil del usuario
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: tasks } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const businessInfo = profile?.business_description || 'No definido';
    const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
    const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];

    const prompt = `
Eres el Master Coordinator, un guía empresarial empático y conversacional. Tu trabajo es hablar con ${profile?.full_name || 'el usuario'} sobre su negocio de forma natural y personalizada.

INFORMACIÓN DEL NEGOCIO:
Descripción: ${businessInfo}
Nombre de marca: ${profile?.brand_name || 'Sin definir'}
Tareas completadas: ${completedTasks.length}
Tareas pendientes: ${pendingTasks.length}

CONTEXTO DE CONVERSACIÓN: ${conversationContext || 'Inicio de conversación'}

INSTRUCCIONES:
1. Habla de forma conversacional y empática como un coach personal
2. SIEMPRE menciona específicamente su negocio si está definido
3. Usa frases como: "Veo que te dedicas a ____", "¿Ya tienes ____?", "Vamos a ayudarte con ____"
4. Haz preguntas específicas sobre su negocio para obtener más información
5. Proporciona opciones de acción claras con botones
6. Si no tienes suficiente información del negocio, pregunta por detalles específicos

Ejemplos de respuestas:
- "¡Hola! Veo que pintas chaquetas de cuero personalizadas. ¿Ya tienes una marca definida o vamos a crearla desde cero?"
- "Perfecto, tu negocio de [negocio] tiene mucho potencial. ¿Qué te gustaría mejorar primero: precios, visibilidad o procesos?"

Responde en JSON con este formato:
{
  "message": "Mensaje conversacional específico para su negocio",
  "questions": ["¿Pregunta específica 1?", "¿Pregunta específica 2?"],
  "actionButtons": [
    {"text": "Empezar ahora", "action": "start_tasks"},
    {"text": "Explícame más", "action": "explain_more"},
    {"text": "Hablar de mi negocio", "action": "business_details"}
  ],
  "nextSteps": ["Paso específico 1", "Paso específico 2"]
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    const conversationData = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(conversationData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error starting intelligent conversation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
