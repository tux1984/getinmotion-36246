import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const { context, currentValue, userPrompt, additionalContext } = await req.json();

    console.log('AI Content Refiner request:', {
      context,
      userPrompt,
      currentValueLength: currentValue?.length,
      additionalContext
    });

    // Create context-specific system prompts
    let systemPrompt = '';
    
    switch (context) {
      case 'product_name':
        systemPrompt = `Eres un experto en marketing de productos artesanales. Tu trabajo es refinar nombres de productos para que sean más atractivos, memorables y comerciales.

INSTRUCCIONES:
- Responde SOLO con el nombre refinado, sin explicaciones
- Mantén la esencia del producto original
- El nombre debe ser en español
- Máximo 60 caracteres
- Debe ser comercial pero auténtico
- Evita palabras muy técnicas o complicadas`;
        break;

      case 'product_description':
        systemPrompt = `Eres un copywriter especializado en productos artesanales. Tu trabajo es crear descripciones que conecten emocionalmente con los clientes y destaquen el valor artesanal.

INSTRUCCIONES:
- Responde SOLO con la descripción refinada, sin explicaciones adicionales
- Usa un lenguaje cálido y auténtico
- Destaca la artesanía y calidad
- Incluye beneficios emocionales
- Mantén entre 100-300 palabras
- Usa párrafos cortos para facilidad de lectura
- En español`;
        break;

      default:
        systemPrompt = `Eres un asistente experto en refinamiento de contenido. Ayuda a mejorar el texto según las instrucciones del usuario, manteniendo la esencia original pero haciéndolo más efectivo.`;
    }

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Contenido actual: "${currentValue}"

Instrucción de refinamiento: ${userPrompt}

${additionalContext?.productName ? `Nombre del producto: ${additionalContext.productName}` : ''}
${additionalContext?.hasImages ? `El producto tiene ${additionalContext.imageCount} imagen(es)` : ''}

Refina el contenido siguiendo la instrucción.`
      }
    ];

    console.log('Sending request to OpenAI...');

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
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const refinedContent = data.choices[0].message.content.trim();

    console.log('Content refined successfully');

    return new Response(JSON.stringify({ refinedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-content-refiner:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error refinando contenido' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});