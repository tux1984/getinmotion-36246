
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  language: 'en' | 'es';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { messages, language }: ChatRequest = await req.json();

    const systemPrompt = language === 'es'
      ? `Eres un asistente de IA especializado en negocios creativos y culturales. Tu objetivo es ayudar a los usuarios a completar su evaluación de madurez. Haz preguntas de seguimiento para obtener más detalles sobre su proyecto, sus desafíos y sus metas. Esta información adicional se utilizará para generar recomendaciones más precisas al final. Sé amable, conciso y directo.`
      : `You are an AI assistant specializing in creative and cultural businesses. Your goal is to help users complete their maturity assessment. Ask follow-up questions to get more details about their project, challenges, and goals. This additional information will be used to generate more accurate recommendations at the end. Be friendly, concise, and to the point.`;

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
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
