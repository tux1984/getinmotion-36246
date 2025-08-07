import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate intelligent task recommendations using AI
export async function generateIntelligentRecommendations(userId: string, maturityScores: any, language: string = 'es') {
  try {
    // Get user profile and completed tasks from Supabase
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: masterContext } = await supabase
      .from('master_context')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: completedTasks } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed');

    const { data: activeTasks } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'in_progress']);

    // Check if we have enough information to generate recommendations
    const hasMinimalInfo = maturityScores && (userProfile || masterContext?.business_profile);
    
    if (!hasMinimalInfo) {
      return new Response(
        JSON.stringify({ 
          needsMoreInfo: true,
          message: language === 'en' 
            ? 'We need more information about your business to create personalized recommendations.'
            : 'Necesitamos más información sobre tu negocio para crear recomendaciones personalizadas.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context for AI
    const businessContext = masterContext?.business_profile || {};
    const maturityAverage = Object.values(maturityScores).reduce((a: number, b: number) => a + b, 0) / 4;
    
    let maturityLevel = 'explorador';
    if (maturityAverage >= 80) maturityLevel = 'visionario';
    else if (maturityAverage >= 60) maturityLevel = 'estratega';
    else if (maturityAverage >= 40) maturityLevel = 'constructor';

    const prompt = `
Eres un consultor de negocios experto. Genera 3 recomendaciones de tareas altamente personalizadas para este emprendedor.

INFORMACIÓN DEL USUARIO:
Nivel de Madurez: ${maturityLevel} (promedio: ${maturityAverage})
Puntuaciones detalladas: ${JSON.stringify(maturityScores)}
Perfil de negocio: ${JSON.stringify(businessContext)}

TAREAS COMPLETADAS (${completedTasks?.length || 0}):
${completedTasks?.map((task: any) => `- ${task.title} (${task.agent_id})`).join('\n') || 'Ninguna'}

TAREAS ACTIVAS (${activeTasks?.length || 0}):
${activeTasks?.map((task: any) => `- ${task.title} (${task.agent_id})`).join('\n') || 'Ninguna'}

INSTRUCCIONES:
1. Analiza el contexto completo del usuario y evita recomendar tareas similares a las ya completadas o activas
2. Genera recomendaciones que sean el siguiente paso lógico en su journey empresarial
3. Considera su nivel de madurez para determinar la complejidad apropiada
4. Cada tarea debe tener un agente específico disponible
5. Las tareas deben ser accionables y específicas para su contexto de negocio

AGENTES DISPONIBLES:
- cultural-consultant: Identidad de marca, posicionamiento, valores
- cost-calculator: Análisis financiero, presupuestos, proyecciones
- marketing-advisor: Estrategias de marketing, audiencias, canales
- legal-advisor: Aspectos legales, contratos, cumplimiento
- export-advisor: Expansión internacional, mercados globales
- business-scaling: Escalabilidad, crecimiento, optimización
- operations-specialist: Procesos, eficiencia operativa
- content-creator: Creación de contenido, storytelling

Responde SOLO con un array JSON con exactamente 3 recomendaciones:
[{
  "title": "Título específico y accionable",
  "description": "Descripción detallada de por qué es importante ahora",
  "agentId": "id-del-agente",
  "agentName": "Nombre del Agente",
  "priority": "high|medium|low",
  "category": "Categoría relevante",
  "estimatedTime": "Tiempo estimado",
  "prompt": "Prompt específico para el agente"
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
    
    // Clean up the response
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const recommendations = JSON.parse(aiResponse);

    // Transform recommendations to include IDs and proper format
    const transformedRecommendations = recommendations.map((rec: any) => ({
      id: `ai_rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: rec.title,
      description: rec.description,
      agentId: rec.agentId,
      agentName: rec.agentName,
      priority: rec.priority,
      category: rec.category,
      estimatedTime: rec.estimatedTime,
      prompt: rec.prompt,
      completed: false,
      isRealAgent: true
    }));

    return new Response(
      JSON.stringify({ recommendations: transformedRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating intelligent recommendations:', error);
    
    // Fallback to basic recommendations
    const fallbackRecs = [{
      id: `fallback_${Date.now()}`,
      title: language === 'en' ? 'Validate Your Business Concept' : 'Valida tu Concepto de Negocio',
      description: language === 'en' 
        ? 'Get expert validation on your business idea and market potential'
        : 'Obtén validación experta sobre tu idea de negocio y potencial de mercado',
      agentId: 'cultural-consultant',
      agentName: 'Cultural Consultant',
      priority: 'high',
      category: 'Validation',
      estimatedTime: '2-3 hours',
      prompt: language === 'en' ? 'Help me validate my business concept' : 'Ayúdame a validar mi concepto de negocio',
      completed: false,
      isRealAgent: true
    }];

    return new Response(
      JSON.stringify({ recommendations: fallbackRecs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}