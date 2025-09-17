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

    const { images } = await req.json();

    console.log('AI Image Analyzer request:', {
      imageCount: images?.length
    });

    if (!images || images.length === 0) {
      throw new Error('No images provided');
    }

    const messages = [
      {
        role: 'system',
        content: `Eres un experto en análisis de productos artesanales. Analiza las imágenes y proporciona sugerencias para un producto artesanal.

RESPONDE EXACTAMENTE en este formato JSON (sin texto adicional):
{
  "suggestedName": "Nombre sugerido del producto (máx 60 caracteres)",
  "suggestedDescription": "Descripción detallada del producto que destaque su valor artesanal (100-250 palabras)",
  "detectedCategory": "Categoría más apropiada",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

INSTRUCCIONES:
- Nombre: Debe ser comercial, atractivo y describir el producto
- Descripción: Enfócate en la artesanía, materiales, técnica y beneficios emocionales
- Categoría: Elige entre: Joyería, Textiles, Cerámica, Madera, Cuero, Decoración, Arte, Accesorios, Juguetes, Otros
- Tags: Palabras clave relevantes para búsqueda (artesanal, hecho a mano, materiales, colores, etc.)
- TODO en español`
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analiza estas imágenes del producto artesanal y proporciona las sugerencias en el formato JSON especificado:'
          },
          ...images.slice(0, 3).map((image: string) => ({
            type: 'image_url',
            image_url: {
              url: image
            }
          }))
        ]
      }
    ];

    console.log('Sending request to OpenAI Vision...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content.trim();

    console.log('Raw AI analysis:', analysisText);

    try {
      // Try to parse the JSON response
      const analysis = JSON.parse(analysisText);
      
      // Validate the response structure
      if (!analysis.suggestedName || !analysis.suggestedDescription) {
        throw new Error('Invalid analysis structure');
      }

      console.log('Images analyzed successfully');

      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, 'Raw response:', analysisText);
      
      // Fallback analysis
      const fallbackAnalysis = {
        suggestedName: 'Producto Artesanal Único',
        suggestedDescription: 'Este hermoso producto artesanal ha sido cuidadosamente elaborado a mano, combinando técnicas tradicionales con un diseño contemporáneo. Cada pieza es única y refleja la pasión y dedicación del artesano, convirtiéndolo en una adquisición especial que destacará en cualquier espacio.',
        detectedCategory: 'Artesanías',
        suggestedTags: ['artesanal', 'hecho a mano', 'único', 'calidad premium', 'diseño original']
      };

      return new Response(JSON.stringify({ analysis: fallbackAnalysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in ai-image-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error analizando imágenes' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});