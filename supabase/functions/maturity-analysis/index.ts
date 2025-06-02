
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

    // Calculate overall maturity level
    const overallScore = Math.round(
      (scores.ideaValidation + scores.userExperience + scores.marketFit + scores.monetization) / 4
    );

    const systemPrompt = language === 'es' 
      ? `Eres un experto consultor en negocios creativos y culturales. Analiza los resultados de evaluación de madurez de un ${profileType === 'idea' ? 'emprendedor con una idea' : profileType === 'solo' ? 'creador independiente' : 'equipo creativo'}.

Puntuaciones de madurez (0-100):
- Validación de Idea: ${scores.ideaValidation}%
- Experiencia de Usuario: ${scores.userExperience}%
- Ajuste al Mercado: ${scores.marketFit}%
- Monetización: ${scores.monetization}%
- Puntuación General: ${overallScore}%

Tipo de perfil: ${profileType}
Datos adicionales del perfil: ${JSON.stringify(profileData)}

Proporciona exactamente 3 recomendaciones de acción específicas, prácticas y accionables para mejorar su negocio creativo. Cada recomendación debe:
1. Ser específica para su nivel de madurez actual
2. Dirigirse a las áreas más débiles identificadas
3. Ser accionable en los próximos 30-60 días
4. Ser relevante para el sector creativo/cultural

Responde SOLO con un JSON en este formato:
{
  "recommendations": [
    {
      "title": "Título de la recomendación",
      "description": "Descripción detallada de la acción a tomar",
      "priority": "Alta" | "Media" | "Baja",
      "timeframe": "Tiempo estimado para completar"
    }
  ]
}`
      : `You are an expert consultant in creative and cultural businesses. Analyze the maturity assessment results for a ${profileType === 'idea' ? 'entrepreneur with an idea' : profileType === 'solo' ? 'solo creator' : 'creative team'}.

Maturity scores (0-100):
- Idea Validation: ${scores.ideaValidation}%
- User Experience: ${scores.userExperience}%
- Market Fit: ${scores.marketFit}%
- Monetization: ${scores.monetization}%
- Overall Score: ${overallScore}%

Profile type: ${profileType}
Additional profile data: ${JSON.stringify(profileData)}

Provide exactly 3 specific, practical, and actionable recommendations to improve their creative business. Each recommendation should:
1. Be specific to their current maturity level
2. Target the weakest areas identified
3. Be actionable within the next 30-60 days
4. Be relevant to the creative/cultural sector

Respond ONLY with a JSON in this format:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description of the action to take",
      "priority": "High" | "Medium" | "Low",
      "timeframe": "Estimated time to complete"
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
          { role: 'user', content: 'Analyze these results and provide recommendations.' }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
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
    });

  } catch (error) {
    console.error('Error in maturity-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        recommendations: [] // Return empty array as fallback
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
