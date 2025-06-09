
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { scores, profileData, language }: AIRecommendationsRequest = await req.json();

    console.log('AI Recommendations request:', { scores, profileData: Object.keys(profileData), language });

    // Calculate overall maturity level
    const overallScore = Math.round(
      (scores.ideaValidation + scores.userExperience + scores.marketFit + scores.monetization) / 4
    );

    // Include dynamic question answers in the analysis with proper formatting
    const dynamicAnswersText = profileData.dynamicQuestionAnswers 
      ? Object.entries(profileData.dynamicQuestionAnswers)
          .map(([questionId, answer]) => `Q: ${questionId.replace('dynamic_', 'Question ')}\nA: ${answer}`)
          .join('\n\n')
      : 'No additional insights provided through open-ended questions';

    console.log('Dynamic answers processed:', dynamicAnswersText.length > 0 ? 'Yes' : 'No');

    // Create comprehensive profile summary
    const profileSummary = `
Industry: ${profileData.industry || 'Not specified'}
Activities: ${Array.isArray(profileData.activities) ? profileData.activities.join(', ') : profileData.activities || 'Not specified'}
Experience: ${profileData.experience || 'Not specified'}
Payment Methods: ${profileData.paymentMethods || 'Not specified'}
Brand Identity: ${profileData.brandIdentity || 'Not specified'}
Financial Control: ${profileData.financialControl || 'Not specified'}
Team Structure: ${profileData.teamStructure || 'Not specified'}
Task Organization: ${profileData.taskOrganization || 'Not specified'}
Decision Making: ${profileData.decisionMaking || 'Not specified'}
Analysis Type: ${profileData.analysisPreference || 'Not specified'}
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
Basándote en TODA la información (puntuaciones + perfil + respuestas abiertas), proporciona entre 4 y 6 recomendaciones de acción específicas y accionables.

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
Based on ALL the information (scores + profile + open-ended responses), provide between 4 and 6 specific, actionable recommendations.

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
      throw new Error(`OpenAI API error: ${response.status}`);
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
      throw new Error('Failed to parse AI recommendations');
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
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
