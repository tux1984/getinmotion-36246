
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateDynamicQuestionsRequest {
  profileData: any;
  language: 'en' | 'es';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { profileData, language }: GenerateDynamicQuestionsRequest = await req.json();

    // Create a comprehensive prompt based on the user's profile data
    const systemPrompt = language === 'es' 
      ? `Eres un experto consultor en negocios creativos y culturales. Basándote en las respuestas previas del usuario, genera entre 3 y 5 preguntas abiertas reflexivas que profundicen en su evaluación.

Información del perfil del usuario:
- Industria: ${profileData.industry || 'No especificada'}
- Actividades: ${profileData.activities ? profileData.activities.join(', ') : 'No especificadas'}
- Experiencia: ${profileData.experience || 'No especificada'}
- Métodos de pago: ${profileData.paymentMethods || 'No especificados'}
- Identidad de marca: ${profileData.brandIdentity || 'No especificada'}
- Control financiero: ${profileData.financialControl || 'No especificado'}
- Estructura de equipo: ${profileData.teamStructure || 'No especificada'}
- Organización de tareas: ${profileData.taskOrganization || 'No especificada'}
- Toma de decisiones: ${profileData.decisionMaking || 'No especificada'}

Genera preguntas que:
1. Exploren el "por qué" y "cómo" detrás de sus elecciones
2. Sean relevantes para su contexto empresarial específico
3. Estén escritas en un tono natural y amigable
4. Eviten ser genéricas o repetitivas
5. Ayuden a generar insights más profundos para recomendaciones personalizadas

Responde SOLO con un JSON en este formato:
{
  "questions": [
    {
      "question": "Pregunta abierta aquí",
      "context": "Contexto opcional sobre por qué esta pregunta es relevante para su perfil"
    }
  ]
}`
      : `You are an expert consultant in creative and cultural businesses. Based on the user's previous responses, generate 3 to 5 thoughtful open-ended questions that deepen their assessment.

User profile information:
- Industry: ${profileData.industry || 'Not specified'}
- Activities: ${profileData.activities ? profileData.activities.join(', ') : 'Not specified'}
- Experience: ${profileData.experience || 'Not specified'}
- Payment methods: ${profileData.paymentMethods || 'Not specified'}
- Brand identity: ${profileData.brandIdentity || 'Not specified'}
- Financial control: ${profileData.financialControl || 'Not specified'}
- Team structure: ${profileData.teamStructure || 'Not specified'}
- Task organization: ${profileData.taskOrganization || 'Not specified'}
- Decision making: ${profileData.decisionMaking || 'Not specified'}

Generate questions that:
1. Explore the "why" and "how" behind their choices
2. Are relevant to their specific business context
3. Are written in a natural, friendly tone
4. Avoid being generic or repetitive
5. Help generate deeper insights for personalized recommendations

Respond ONLY with a JSON in this format:
{
  "questions": [
    {
      "question": "Open-ended question here",
      "context": "Optional context about why this question is relevant to their profile"
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
          { role: 'user', content: 'Generate personalized follow-up questions based on this user profile.' }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the JSON response
    let questions;
    try {
      const parsed = JSON.parse(result);
      questions = parsed.questions;
    } catch (parseError) {
      console.error('Failed to parse AI response:', result);
      throw new Error('Failed to parse AI questions');
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-dynamic-questions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        questions: [] // Return empty array as fallback
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
