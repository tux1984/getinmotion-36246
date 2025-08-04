import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StepData {
  id: string;
  title: string;
  description: string;
  input_type: string;
  ai_context_prompt?: string;
  user_input_data: Record<string, any>;
}

interface RequestBody {
  message: string;
  step: StepData;
  language: 'en' | 'es';
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, step, language, conversation_history }: RequestBody = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build specialized context for the step
    const stepContext = `
CONTEXTO DEL PASO ACTUAL:
- Paso: ${step.title}
- Descripción: ${step.description}
- Tipo de input esperado: ${step.input_type}
- Datos actuales del usuario: ${JSON.stringify(step.user_input_data)}
${step.ai_context_prompt ? `- Contexto específico: ${step.ai_context_prompt}` : ''}

INSTRUCCIONES PARA LA IA:
1. Eres un asistente especializado SOLO en este paso específico
2. NO ofrezcas ayuda sobre otros pasos o temas generales
3. Enfócate en ayudar al usuario a completar ESTE paso exitosamente
4. Proporciona instrucciones claras y accionables
5. Si el usuario hace preguntas fuera del contexto del paso, redirige amablemente
6. Ayuda con ejemplos, aclaraciones o solución de bloqueos específicos de este paso
7. Responde en ${language === 'es' ? 'español' : 'inglés'}
8. Mantén respuestas concisas y enfocadas en la acción
`;

    // Build conversation messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: stepContext
      },
      // Include previous conversation for context
      ...conversation_history.slice(-4).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in step-ai-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});