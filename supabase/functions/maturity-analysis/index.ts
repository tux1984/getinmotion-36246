import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MaturityAnalysisRequest {
  scores: {
    ideaValidation: number;
    userExperience: number;
    marketFit: number;
    monetization: number;
  };
  profileType: 'idea' | 'solo' | 'team';
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

    const { scores, profileType, profileData, language }: MaturityAnalysisRequest = await req.json();

    const systemPrompt = language === 'es' 
      ? `Eres un experto consultor en negocios creativos y culturales. Tu tarea es generar recomendaciones de acción ULTRA-PERSONALIZADAS para un emprendedor.

### Contexto del Usuario:
- **Tipo de Perfil:** ${profileType} (${profileType === 'idea' ? 'Apenas una idea' : profileType === 'solo' ? 'Trabajando solo' : 'Liderando un equipo'})
- **Puntuaciones de Madurez (0-100):**
  - Validación de Idea: ${scores.ideaValidation}%
  - Experiencia de Usuario: ${scores.userExperience}%
  - Ajuste al Mercado: ${scores.marketFit}%
  - Monetización: ${scores.monetization}%
- **Respuestas Detalladas del Usuario (su voz, sus palabras):**
  ${JSON.stringify(profileData, null, 2)}

### Tu Misión:
Analiza PROFUNDAMENTE las respuestas detalladas del usuario. No te bases solo en las puntuaciones. Sumérgete en sus problemas, ideas y desafíos específicos.

Proporciona exactamente 3 recomendaciones de acción que sean:
1.  **Hiper-Específicas:** Basadas directamente en una respuesta o un dato concreto que el usuario proporcionó. Cita la fuente de tu recomendación si es posible (ej: "Dado que mencionaste que tu mayor reto es 'encontrar colaboradores', te recomiendo...").
2.  **Prácticas y Accionables:** Pasos claros que puede tomar en los próximos 15-30 días.
3.  **Orientadas a sus áreas más débiles:** Usa las puntuaciones bajas como guía, pero el "porqué" de la recomendación debe venir de sus respuestas cualitativas.
4.  **Relevantes para el sector creativo/cultural.**

### Formato de Salida (JSON estricto):
Responde SOLO con un JSON en este formato. No incluyas texto antes o después del JSON.
{
  "recommendations": [
    {
      "title": "Título conciso y accionable de la recomendación",
      "description": "Descripción detallada (2-3 frases) de la acción, explicando por qué es importante para ELLOS específicamente, basándote en sus respuestas.",
      "priority": "Alta" | "Media",
      "timeframe": "Tiempo estimado (ej: '1-2 semanas')"
    }
  ]
}`
      : `You are an expert consultant for creative and cultural businesses. Your task is to generate ULTRA-PERSONALIZED action recommendations for an entrepreneur.

### User Context:
- **Profile Type:** ${profileType} (${profileType === 'idea' ? 'Just an idea' : profileType === 'solo' ? 'Working solo' : 'Leading a team'})
- **Maturity Scores (0-100):**
  - Idea Validation: ${scores.ideaValidation}%
  - User Experience: ${scores.userExperience}%
  - Market Fit: ${scores.marketFit}%
  - Monetization: ${scores.monetization}%
- **User's Detailed Answers (their voice, their words):**
  ${JSON.stringify(profileData, null, 2)}

### Your Mission:
DEEPLY analyze the user's detailed answers. Do not just rely on the scores. I want you to dive into their specific problems, ideas, and challenges.

Provide exactly 3 action recommendations that are:
1.  **Hyper-Specific:** Based directly on a specific answer or piece of data the user provided. Cite the source of your recommendation if possible (e.g., "Since you mentioned your biggest challenge is 'finding collaborators', I recommend...").
2.  **Practical and Actionable:** Clear steps they can take in the next 15-30 days.
3.  **Targeting their weakest areas:** Use the low scores as a guide, but the "why" of the recommendation must come from their qualitative answers.
4.  **Relevant to the creative/cultural sector.**

### Output Format (Strict JSON):
Respond ONLY with a JSON in this format. Do not include any text before or after the JSON.
{
  "recommendations": [
    {
      "title": "Concise, actionable title for the recommendation",
      "description": "Detailed description (2-3 sentences) of the action, explaining why it's important for THEM specifically, based on their answers.",
      "priority": "High" | "Medium",
      "timeframe": "Estimated time (e.g., '1-2 weeks')"
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
          { role: 'user', content: language === 'es' ? 'Analiza estos resultados y proporciona recomendaciones.' : 'Analyze these results and provide recommendations.' }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`OpenAI API error: ${response.status}`, errorBody);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = data.choices[0].message.content;

    // Parse the JSON response
    let recommendations;
    try {
      const parsed = JSON.parse(analysisResult);
      recommendations = parsed.recommendations;
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisResult);
      throw new Error('Failed to parse AI recommendations');
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    console.error(err);
    return new Response(String(err?.message || err), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
