
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

// Fallback questions when OpenAI fails
const getFallbackQuestions = (language: 'en' | 'es') => {
  const questions = language === 'es' ? [
    {
      question: "¿Cuál es el mayor desafío que enfrentas actualmente en tu proyecto creativo?",
      context: "Esta pregunta nos ayuda a entender tus obstáculos principales para ofrecerte mejor orientación."
    },
    {
      question: "¿Qué te motivó a comenzar este proyecto y qué esperas lograr con él?",
      context: "Conocer tu motivación nos permite personalizar las recomendaciones según tus objetivos."
    },
    {
      question: "¿Cómo mides actualmente el éxito de tu trabajo creativo?",
      context: "Entender tus métricas de éxito nos ayuda a sugerir estrategias más efectivas."
    }
  ] : [
    {
      question: "What is the biggest challenge you currently face in your creative project?",
      context: "This question helps us understand your main obstacles to provide better guidance."
    },
    {
      question: "What motivated you to start this project and what do you hope to achieve?",
      context: "Knowing your motivation allows us to personalize recommendations according to your goals."
    },
    {
      question: "How do you currently measure the success of your creative work?",
      context: "Understanding your success metrics helps us suggest more effective strategies."
    }
  ];

  return questions;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileData, language }: GenerateDynamicQuestionsRequest = await req.json();

    console.log('Generate Dynamic Questions request:', { 
      profileData: Object.keys(profileData || {}), 
      language 
    });

    // If OpenAI API key is not configured, return fallback questions
    if (!openAIApiKey) {
      console.log('OpenAI API key not configured, using fallback questions');
      const fallbackQuestions = getFallbackQuestions(language);
      return new Response(JSON.stringify({ questions: fallbackQuestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a comprehensive prompt based on the user's profile data
    const systemPrompt = language === 'es' 
      ? `Eres un experto consultor en negocios creativos y culturales. Basándote en las respuestas previas del usuario, genera entre 3 y 5 preguntas abiertas reflexivas que profundicen en su evaluación.

Información del perfil del usuario:
- Industria: ${profileData?.industry || 'No especificada'}
- Actividades: ${profileData?.activities ? profileData.activities.join(', ') : 'No especificadas'}
- Experiencia: ${profileData?.experience || 'No especificada'}
- Métodos de pago: ${profileData?.paymentMethods || 'No especificados'}
- Identidad de marca: ${profileData?.brandIdentity || 'No especificada'}
- Control financiero: ${profileData?.financialControl || 'No especificado'}
- Estructura de equipo: ${profileData?.teamStructure || 'No especificada'}
- Organización de tareas: ${profileData?.taskOrganization || 'No especificada'}
- Toma de decisiones: ${profileData?.decisionMaking || 'No especificada'}

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
- Industry: ${profileData?.industry || 'Not specified'}
- Activities: ${profileData?.activities ? profileData.activities.join(', ') : 'Not specified'}
- Experience: ${profileData?.experience || 'Not specified'}
- Payment methods: ${profileData?.paymentMethods || 'Not specified'}
- Brand identity: ${profileData?.brandIdentity || 'Not specified'}
- Financial control: ${profileData?.financialControl || 'Not specified'}
- Team structure: ${profileData?.teamStructure || 'Not specified'}
- Task organization: ${profileData?.taskOrganization || 'Not specified'}
- Decision making: ${profileData?.decisionMaking || 'Not specified'}

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

    console.log('Making OpenAI request for dynamic questions...');

    try {
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
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        
        // Return fallback questions on OpenAI error
        console.log('OpenAI failed, using fallback questions');
        const fallbackQuestions = getFallbackQuestions(language);
        return new Response(JSON.stringify({ questions: fallbackQuestions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const result = data.choices[0].message.content;

      console.log('OpenAI response received for questions, length:', result.length);

      // Parse the JSON response
      let questions;
      try {
        const parsed = JSON.parse(result);
        questions = parsed.questions;
        console.log('Successfully parsed questions:', questions.length);
      } catch (parseError) {
        console.error('Failed to parse AI response:', result);
        console.error('Parse error:', parseError);
        
        // Return fallback questions on parse error
        console.log('Parse failed, using fallback questions');
        const fallbackQuestions = getFallbackQuestions(language);
        return new Response(JSON.stringify({ questions: fallbackQuestions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (openaiError) {
      console.error('OpenAI request failed:', openaiError);
      
      // Return fallback questions on request failure
      console.log('OpenAI request failed, using fallback questions');
      const fallbackQuestions = getFallbackQuestions(language);
      return new Response(JSON.stringify({ questions: fallbackQuestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-dynamic-questions function:', error);
    
    // Return fallback questions on any error
    const fallbackQuestions = getFallbackQuestions('es'); // Default to Spanish
    
    return new Response(
      JSON.stringify({ 
        questions: fallbackQuestions
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
