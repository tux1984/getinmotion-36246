
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRecommendationsRequest {
  scores: {
    ideaValidation: number;
    userExperience: number;
    marketFit: number;
    monetization: number;
  };
  profileData: any;
  language: 'en' | 'es';
}

// Fallback recommendations when OpenAI fails
const getFallbackRecommendations = (scores: any) => {
  const recommendations = [];
  
  // Generate basic recommendations based on scores
  const sortedScores = Object.entries(scores).sort(([,a], [,b]) => (a as number) - (b as number));
  
  for (const [category, score] of sortedScores.slice(0, 3)) {
    if ((score as number) < 70) {
      let title = '';
      let description = '';
      
      switch (category) {
        case 'ideaValidation':
          title = 'Validar tu Propuesta de Valor';
          description = 'Realiza entrevistas con clientes potenciales para validar que tu idea resuelve un problema real y significativo.';
          break;
        case 'userExperience':
          title = 'Mejorar la Experiencia del Usuario';
          description = 'Diseña prototipos simples y obtén feedback directo de usuarios para optimizar la experiencia.';
          break;
        case 'marketFit':
          title = 'Analizar tu Mercado Objetivo';
          description = 'Investiga a fondo tu mercado, competencia y posicionamiento para encontrar tu nicho específico.';
          break;
        case 'monetization':
          title = 'Desarrollar Modelo de Ingresos';
          description = 'Define una estrategia clara de monetización adaptada a tu mercado y tipo de cliente.';
          break;
      }
      
      recommendations.push({
        title,
        description,
        priority: (score as number) < 30 ? 'Alta' : (score as number) < 60 ? 'Media' : 'Baja',
        timeframe: '1-2 semanas'
      });
    }
  }
  
  // Ensure we always have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Continuar Desarrollando tu Proyecto',
      description: 'Mantén el momentum y sigue trabajando en las áreas que has identificado como prioritarias.',
      priority: 'Media',
      timeframe: '1 semana'
    });
  }
  
  return recommendations;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scores, profileData, language }: AIRecommendationsRequest = await req.json();

    console.log('AI Recommendations request:', { scores, profileData: Object.keys(profileData || {}), language });

    // If OpenAI API key is not configured, return fallback recommendations
    if (!openAIApiKey) {
      console.log('OpenAI API key not configured, using fallback recommendations');
      const fallbackRecommendations = getFallbackRecommendations(scores);
      return new Response(JSON.stringify({ recommendations: fallbackRecommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate overall maturity level
    const overallScore = Math.round(
      (scores.ideaValidation + scores.userExperience + scores.marketFit + scores.monetization) / 4
    );

    // Include dynamic question answers in the analysis with proper formatting
    const dynamicAnswersText = profileData?.dynamicQuestionAnswers 
      ? Object.entries(profileData.dynamicQuestionAnswers)
          .map(([questionId, answer]) => `Q: ${questionId.replace('dynamic_', 'Question ')}\nA: ${answer}`)
          .join('\n\n')
      : 'No additional insights provided through open-ended questions';

    console.log('Dynamic answers processed:', dynamicAnswersText.length > 0 ? 'Yes' : 'No');

    // Create comprehensive profile summary
    const profileSummary = `
Industry: ${profileData?.industry || 'Not specified'}
Activities: ${Array.isArray(profileData?.activities) ? profileData.activities.join(', ') : profileData?.activities || 'Not specified'}
Experience: ${profileData?.experience || 'Not specified'}
Payment Methods: ${profileData?.paymentMethods || 'Not specified'}
Brand Identity: ${profileData?.brandIdentity || 'Not specified'}
Financial Control: ${profileData?.financialControl || 'Not specified'}
Team Structure: ${profileData?.teamStructure || 'Not specified'}
Task Organization: ${profileData?.taskOrganization || 'Not specified'}
Decision Making: ${profileData?.decisionMaking || 'Not specified'}
Analysis Type: ${profileData?.analysisPreference || 'Not specified'}
    `.trim();

    const systemPrompt = language === 'es' 
      ? `Eres un experto consultor en negocios creativos y culturales. Analiza los resultados de evaluación de madurez de un creador cultural y sus respuestas detalladas.

PUNTUACIONES DE MADUREZ (0-100):
- Validación de Idea: ${scores.ideaValidation}%
- Experiencia de Usuario: ${scores.userExperience}%
- Ajuste al Mercado: ${scores.marketFit}%
- Monetización: ${scores.monetization}%
- Puntuación General: ${overallScore}%

PERFIL DEL USUARIO:
${profileSummary}

RESPUESTAS ABIERTAS DETALLADAS:
${dynamicAnswersText}

INSTRUCCIONES:
Basándote en TODA la información (puntuaciones + perfil + respuestas abiertas), proporciona entre 3 y 5 recomendaciones de acción específicas y accionables.

CADA RECOMENDACIÓN DEBE:
1. Ser específica para su nivel de madurez actual y contexto personal
2. Dirigirse a las áreas más débiles identificadas en las puntuaciones
3. Considerar las respuestas abiertas para personalización profunda
4. Ser accionable en los próximos 30-90 días
5. Ser relevante para el sector creativo/cultural
6. Incluir pasos concretos, no solo consejos generales

RESPONDE SOLO CON UN JSON VÁLIDO:
{
  "recommendations": [
    {
      "title": "Título específico y accionable",
      "description": "Descripción detallada con pasos concretos (2-3 oraciones que incluyan qué hacer específicamente)",
      "priority": "Alta" | "Media" | "Baja",
      "timeframe": "Tiempo estimado realista para completar"
    }
  ]
}`
      : `You are an expert consultant in creative and cultural businesses. Analyze the maturity assessment results for a cultural creator and their detailed responses.

MATURITY SCORES (0-100):
- Idea Validation: ${scores.ideaValidation}%
- User Experience: ${scores.userExperience}%
- Market Fit: ${scores.marketFit}%
- Monetization: ${scores.monetization}%
- Overall Score: ${overallScore}%

USER PROFILE:
${profileSummary}

DETAILED OPEN-ENDED RESPONSES:
${dynamicAnswersText}

INSTRUCTIONS:
Based on ALL the information (scores + profile + open-ended responses), provide between 3 and 5 specific, actionable recommendations.

EACH RECOMMENDATION MUST:
1. Be specific to their current maturity level and personal context
2. Target the weakest areas identified in the scores
3. Consider the open-ended responses for deep personalization
4. Be actionable within the next 30-90 days
5. Be relevant to the creative/cultural sector
6. Include concrete steps, not just general advice

RESPOND ONLY WITH VALID JSON:
{
  "recommendations": [
    {
      "title": "Specific and actionable title",
      "description": "Detailed description with concrete steps (2-3 sentences that include what specifically to do)",
      "priority": "High" | "Medium" | "Low",
      "timeframe": "Realistic estimated time to complete"
    }
  ]
}`;

    console.log('Making OpenAI request...');

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
            { role: 'user', content: 'Analyze these comprehensive results and provide personalized recommendations.' }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        
        // Return fallback recommendations on OpenAI error
        console.log('OpenAI failed, using fallback recommendations');
        const fallbackRecommendations = getFallbackRecommendations(scores);
        return new Response(JSON.stringify({ recommendations: fallbackRecommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const analysisResult = data.choices[0].message.content;

      console.log('OpenAI response received, length:', analysisResult.length);

      // Parse the JSON response
      let recommendations;
      try {
        const parsed = JSON.parse(analysisResult);
        recommendations = parsed.recommendations;
        console.log('Successfully parsed recommendations:', recommendations.length);
      } catch (parseError) {
        console.error('Failed to parse AI response:', analysisResult);
        console.error('Parse error:', parseError);
        
        // Return fallback recommendations on parse error
        console.log('Parse failed, using fallback recommendations');
        const fallbackRecommendations = getFallbackRecommendations(scores);
        return new Response(JSON.stringify({ recommendations: fallbackRecommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (openaiError) {
      console.error('OpenAI request failed:', openaiError);
      
      // Return fallback recommendations on request failure
      console.log('OpenAI request failed, using fallback recommendations');
      const fallbackRecommendations = getFallbackRecommendations(scores);
      return new Response(JSON.stringify({ recommendations: fallbackRecommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
    
    // Return fallback recommendations on any error
    const fallbackRecommendations = [
      {
        title: 'Desarrollar tu Proyecto Paso a Paso',
        description: 'Enfócate en completar una tarea pequeña a la vez y busca feedback regular de tu audiencia objetivo.',
        priority: 'Alta',
        timeframe: '1-2 semanas'
      }
    ];
    
    return new Response(
      JSON.stringify({ 
        recommendations: fallbackRecommendations
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
