
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TaskRecommendation {
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  agent_id: string;
  relevance: 'high' | 'medium' | 'low';
  estimated_time: number; // in minutes
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileData, maturityScores, language, userId } = await req.json();
    
    console.log('Generate Task Recommendations request:', {
      userId,
      language,
      hasProfileData: !!profileData,
      hasMaturityScores: !!maturityScores
    });

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate task recommendations using AI
    let taskRecommendations: TaskRecommendation[] = [];

    if (openAIApiKey && profileData) {
      try {
        const userProfile = `
Industria: ${profileData.industry || 'No especificada'}
Experiencia: ${profileData.experience || 'No especificada'}
Actividades: ${profileData.activities ? profileData.activities.join(', ') : 'No especificadas'}
Control financiero: ${profileData.financialControl || 'No especificado'}
Estructura del equipo: ${profileData.teamStructure || 'No especificada'}
Respuestas extendidas: ${profileData.extendedAnswers ? Object.values(profileData.extendedAnswers).join('. ') : 'Ninguna'}
Respuestas dinámicas: ${profileData.dynamicQuestionAnswers ? Object.values(profileData.dynamicQuestionAnswers).join('. ') : 'Ninguna'}

Puntuaciones de madurez:
- Validación de idea: ${maturityScores?.ideaValidation || 0}%
- Experiencia de usuario: ${maturityScores?.userExperience || 0}%
- Ajuste al mercado: ${maturityScores?.marketFit || 0}%
- Monetización: ${maturityScores?.monetization || 0}%
        `.trim();

        const systemPrompt = language === 'es' 
          ? `Eres un experto consultor en negocios creativos. Basándote en el perfil del usuario, genera entre 5-8 tareas específicas y accionables que le ayuden a hacer crecer su proyecto.

PERFIL DEL USUARIO:
${userProfile}

AGENTES DISPONIBLES:
- admin: Asistente administrativo general
- cultural: Especialista en proyectos creativos y culturales
- accounting: Asesor financiero
- legal: Consultor legal
- operations: Gerente de operaciones

INSTRUCCIONES:
1. Genera tareas ESPECÍFICAS, no genéricas
2. Prioriza según las puntuaciones de madurez (tareas para áreas con menor puntuación tienen mayor prioridad)
3. Asigna cada tarea al agente más apropiado
4. Incluye tiempo estimado realista
5. Las tareas deben ser accionables en los próximos 30 días

Responde SOLO con un JSON válido:
{
  "tasks": [
    {
      "title": "Título específico de la tarea",
      "description": "Descripción detallada de qué hacer exactamente",
      "priority": 1,
      "agent_id": "cultural",
      "relevance": "high",
      "estimated_time": 120
    }
  ]
}`
          : `You are an expert consultant in creative businesses. Based on the user's profile, generate 5-8 specific, actionable tasks that will help them grow their project.

USER PROFILE:
${userProfile}

AVAILABLE AGENTS:
- admin: General administrative assistant
- cultural: Creative and cultural projects specialist
- accounting: Financial advisor
- legal: Legal consultant
- operations: Operations manager

INSTRUCTIONS:
1. Generate SPECIFIC tasks, not generic ones
2. Prioritize based on maturity scores (tasks for lower-scoring areas get higher priority)
3. Assign each task to the most appropriate agent
4. Include realistic estimated time
5. Tasks should be actionable within the next 30 days

Respond ONLY with valid JSON:
{
  "tasks": [
    {
      "title": "Specific task title",
      "description": "Detailed description of exactly what to do",
      "priority": 1,
      "agent_id": "cultural",
      "relevance": "high",
      "estimated_time": 120
    }
  ]
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: 'Generate personalized task recommendations for this user.' }
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.choices[0].message.content;
          
          try {
            const parsed = JSON.parse(result);
            taskRecommendations = parsed.tasks || [];
            console.log('Generated AI task recommendations:', taskRecommendations.length);
          } catch (parseError) {
            console.error('Failed to parse AI task recommendations:', parseError);
          }
        }
      } catch (aiError) {
        console.error('AI task generation failed:', aiError);
      }
    }

    // Fallback recommendations if AI fails
    if (taskRecommendations.length === 0) {
      console.log('Using fallback task recommendations');
      taskRecommendations = [
        {
          title: language === 'es' ? 'Definir propuesta de valor única' : 'Define unique value proposition',
          description: language === 'es' 
            ? 'Crear una declaración clara de lo que hace único tu proyecto y por qué los usuarios te elegirían'
            : 'Create a clear statement of what makes your project unique and why users would choose you',
          priority: 1,
          agent_id: 'cultural',
          relevance: 'high',
          estimated_time: 90
        },
        {
          title: language === 'es' ? 'Investigar competencia directa' : 'Research direct competition',
          description: language === 'es'
            ? 'Analizar 3-5 proyectos similares para identificar oportunidades de diferenciación'
            : 'Analyze 3-5 similar projects to identify differentiation opportunities',
          priority: 2,
          agent_id: 'cultural',
          relevance: 'high',
          estimated_time: 120
        },
        {
          title: language === 'es' ? 'Establecer métricas clave' : 'Establish key metrics',
          description: language === 'es'
            ? 'Definir 3-5 métricas principales para medir el éxito de tu proyecto'
            : 'Define 3-5 main metrics to measure your project success',
          priority: 2,
          agent_id: 'admin',
          relevance: 'medium',
          estimated_time: 60
        }
      ];
    }

    // Create tasks in the database
    const createdTasks = [];
    for (const taskRec of taskRecommendations) {
      try {
        const { data: task, error } = await supabase
          .from('agent_tasks')
          .insert({
            user_id: userId,
            agent_id: taskRec.agent_id,
            title: taskRec.title,
            description: taskRec.description,
            priority: taskRec.priority,
            status: 'pending',
            relevance: taskRec.relevance,
            progress_percentage: 0,
            time_spent: 0,
            notes: language === 'es' 
              ? `Esta tarea fue generada automáticamente basada en tu perfil. Tiempo estimado: ${taskRec.estimated_time} minutos.`
              : `This task was automatically generated based on your profile. Estimated time: ${taskRec.estimated_time} minutes.`
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating task:', error);
        } else {
          createdTasks.push(task);
          console.log('Created task:', task.title);
        }
      } catch (taskError) {
        console.error('Error creating individual task:', taskError);
      }
    }

    console.log(`Successfully created ${createdTasks.length} tasks for user ${userId}`);

    return new Response(JSON.stringify({ 
      success: true,
      tasksCreated: createdTasks.length,
      tasks: createdTasks
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-task-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate task recommendations',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
