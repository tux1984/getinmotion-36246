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
      ? `Eres un entrevistador profesional especializado en negocios creativos y culturales. Tu función es hacer preguntas de seguimiento específicas para recopilar más información sobre el emprendimiento del usuario.

### Contexto del Usuario:
- **Tipo de Perfil:** ${profileType} (${profileType === 'idea' ? 'Apenas una idea' : profileType === 'solo' ? 'Trabajando solo' : 'Liderando un equipo'})
- **Puntuaciones de Madurez (0-100):**
  - Validación de Idea: ${scores.ideaValidation}%
  - Experiencia de Usuario: ${scores.userExperience}%
  - Ajuste al Mercado: ${scores.marketFit}%
  - Monetización: ${scores.monetization}%
- **Respuestas del Usuario:**
  ${JSON.stringify(profileData, null, 2)}

### Tu Misión:
Analiza las respuestas y identifica 3-4 áreas específicas donde necesitas más información detallada. Haz preguntas directas y específicas para profundizar en su emprendimiento.

### Estilo de Preguntas:
- **Concisas:** Una línea por pregunta
- **Específicas:** Basadas en sus respuestas actuales
- **Enfocadas:** En obtener información práctica del negocio
- **Directas:** Sin mucha explicación previa

### Formato de Salida (JSON estricto):
{
  "questions": [
    {
      "question": "Pregunta específica de una línea",
      "context": "Breve contexto de por qué preguntas esto"
    }
  ]
}`
      : `You are a professional interviewer specialized in creative and cultural businesses. Your role is to ask specific follow-up questions to gather more information about the user's venture.

### User Context:
- **Profile Type:** ${profileType} (${profileType === 'idea' ? 'Just an idea' : profileType === 'solo' ? 'Working solo' : 'Leading a team'})
- **Maturity Scores (0-100):**
  - Idea Validation: ${scores.ideaValidation}%
  - User Experience: ${scores.userExperience}%
  - Market Fit: ${scores.marketFit}%
  - Monetization: ${scores.monetization}%
- **User's Answers:**
  ${JSON.stringify(profileData, null, 2)}

### Your Mission:
Analyze the responses and identify 3-4 specific areas where you need more detailed information. Ask direct and specific questions to deepen understanding of their venture.

### Question Style:
- **Concise:** One line per question
- **Specific:** Based on their current answers
- **Focused:** On getting practical business information
- **Direct:** Without much prior explanation

### Output Format (Strict JSON):
{
  "questions": [
    {
      "question": "Specific one-line question",
      "context": "Brief context of why you're asking this"
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
          { role: 'user', content: language === 'es' ? 'Analiza las respuestas y haz preguntas de seguimiento específicas.' : 'Analyze the answers and ask specific follow-up questions.' }
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
    let questions;
    try {
      const parsed = JSON.parse(analysisResult);
      questions = parsed.questions;
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisResult);
      throw new Error('Failed to parse AI questions');
    }

    return new Response(JSON.stringify({ questions }), {
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
