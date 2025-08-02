
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  language: 'en' | 'es';
  questionContext?: {
    id: string;
    title: string;
    subtitle?: string;
  };
  taskContext?: {
    taskId: string;
    agentId: string;
    taskTitle: string;
    taskDescription?: string;
  };
  userId?: string;
  agentId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { messages, language, questionContext, taskContext, userId, agentId }: ChatRequest = await req.json();
    
    // Initialize Supabase client for task context
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let systemPrompt: string;
    let additionalContext = "";

    // Check if we should use master context system
    if (userId && agentId) {
      try {
        console.log('Getting master prompt for user:', userId, 'agent:', agentId);
        
        const { data: promptResponse, error: promptError } = await supabase.functions.invoke('master-prompt-generator', {
          body: { agentId, userId, language }
        });

        if (promptResponse && promptResponse.success) {
          systemPrompt = promptResponse.systemPrompt;
          console.log('Using master context system prompt');
        } else {
          console.warn('Failed to get master prompt:', promptError);
        }
      } catch (error) {
        console.error('Error getting master context:', error);
      }
    }

    // If we have task context, get task details and create specialized prompt
    if (taskContext) {
      try {
        const { data: taskData } = await supabase
          .from('agent_tasks')
          .select('*')
          .eq('id', taskContext.taskId)
          .single();

        if (taskData) {
          additionalContext = `
Task Details:
- Title: ${taskData.title}
- Description: ${taskData.description || 'No specific description'}
- Current Progress: ${taskData.progress_percentage}%
- Status: ${taskData.status}
- Agent: ${taskContext.agentId}
`;

          systemPrompt = language === 'es'
            ? `Eres un agente especializado trabajando específicamente en el desarrollo de una tarea con el usuario. 

${additionalContext}

Tu rol es ser un mentor experto que guía al usuario paso a paso para completar esta tarea específica. Debes:
- Proporcionar pasos claros y accionables
- Dar recursos específicos y herramientas útiles
- Hacer preguntas para entender mejor las necesidades del usuario
- Celebrar el progreso y mantener la motivación
- Resolver problemas específicos que surjan
- Adaptar tu enfoque según el progreso actual

Mantén un tono amigable, profesional y enfocado en resultados. Tu objetivo es que el usuario complete exitosamente esta tarea.`
            : `You are a specialized agent working specifically on developing a task with the user.

${additionalContext}

Your role is to be an expert mentor who guides the user step by step to complete this specific task. You should:
- Provide clear and actionable steps
- Give specific resources and useful tools
- Ask questions to better understand user needs
- Celebrate progress and maintain motivation
- Solve specific problems that arise
- Adapt your approach based on current progress

Maintain a friendly, professional tone focused on results. Your goal is for the user to successfully complete this task.`;
        }
      } catch (error) {
        console.error('Error fetching task context:', error);
      }
    }

    // Fallback to original logic if no task context or if task context failed
    if (!systemPrompt) {
      if (questionContext && questionContext.title) {
        systemPrompt = language === 'es'
          ? `Eres un asistente de IA experto en negocios creativos. Ayuda al usuario a profundizar en su respuesta para la pregunta: "${questionContext.title}" ${questionContext.subtitle ? `(${questionContext.subtitle})` : ''}. Haz preguntas de seguimiento para obtener detalles clave que mejoren sus recomendaciones finales. Sé amable, conciso y directo.`
          : `You are an AI assistant expert in creative businesses. Help the user elaborate on their answer for the question: "${questionContext.title}" ${questionContext.subtitle ? `(${questionContext.subtitle})` : ''}. Ask follow-up questions to get key details for their final recommendations. Be friendly, concise, and to the point.`;
      } else {
        systemPrompt = language === 'es'
          ? `Eres un asistente de IA especializado en negocios creativos y culturales. Tu objetivo es ayudar a los usuarios a completar su evaluación de madurez. Haz preguntas de seguimiento para obtener más detalles sobre su proyecto, sus desafíos y sus metas. Esta información adicional se utilizará para generar recomendaciones más precisas al final. Sé amable, conciso y directo.`
          : `You are an AI assistant specializing in creative and cultural businesses. Your goal is to help users complete their maturity assessment. Ask follow-up questions to get more details about their project, challenges, and goals. This additional information will be used to generate more accurate recommendations at the end. Be friendly, concise, and to the point.`;
      }
    }

    console.log('Making OpenAI request with model gpt-4.1-2025-04-14...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} ${errorText}`);
      
      // Provide more specific error messages
      if (response.status === 429) {
        throw new Error(language === 'es' 
          ? 'Has alcanzado el límite de tu cuenta de OpenAI. Por favor revisa tu plan y facturación.'
          : 'You have reached your OpenAI account limit. Please check your plan and billing.');
      } else if (response.status === 401) {
        throw new Error(language === 'es' 
          ? 'Clave de API de OpenAI inválida. Por favor verifica tu configuración.'
          : 'Invalid OpenAI API key. Please check your configuration.');
      } else {
        throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const assistantResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    
    // Return user-friendly error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        fallback: language === 'es' 
          ? 'Lo siento, no puedo responder en este momento. Por favor intenta más tarde.'
          : "I'm sorry, I can't respond right now. Please try again later."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
