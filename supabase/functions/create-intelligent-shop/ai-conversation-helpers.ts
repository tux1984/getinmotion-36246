// AI-powered conversation helpers for intelligent shop creation

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Generate contextual AI responses for better conversation flow
export async function generateContextualResponse(userResponse: string, responseType: string, language: string, shopData: any): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not available');
  }

  const prompts = {
    business_name_confirmation: language === 'es' ? `
El usuario me dijo que su negocio se llama "${userResponse}". 

Como Coordinador Maestro IA, genera una respuesta entusiasta y contextual que:
1. Confirme el nombre de forma positiva
2. Haga la siguiente pregunta sobre productos específicos
3. Incluya ejemplos relevantes para artesanos colombianos
4. Sea conversacional y cálida, no robótica

Responde SOLO con el mensaje, máximo 2 oraciones.
    ` : `
The user told me their business is called "${userResponse}".

As Master AI Coordinator, generate an enthusiastic and contextual response that:
1. Confirms the name positively  
2. Asks the next question about specific products
3. Includes relevant examples for Colombian artisans
4. Is conversational and warm, not robotic

Respond ONLY with the message, maximum 2 sentences.
    `,

    craft_confirmation: language === 'es' ? `
El usuario describió su artesanía como: "${userResponse}"
Detecté que trabaja con: ${shopData.detectedCraftType}

Como Coordinador Maestro IA, genera una respuesta que:
1. Confirme inteligentemente lo que detectaste
2. Haga la siguiente pregunta sobre ubicación
3. Explique brevemente por qué necesitas la ubicación (envíos, marketing local)
4. Sea específica y útil

Responde SOLO con el mensaje, máximo 2 oraciones.
    ` : `
The user described their craftsmanship as: "${userResponse}"
I detected they work with: ${shopData.detectedCraftType}

As Master AI Coordinator, generate a response that:
1. Intelligently confirms what you detected
2. Asks the next question about location
3. Briefly explains why you need location (shipping, local marketing)
4. Is specific and useful

Respond ONLY with the message, maximum 2 sentences.
    `,

    location_confirmation: language === 'es' ? `
El usuario me dijo que está en: "${userResponse}"
Información de la tienda hasta ahora:
- Nombre: ${shopData.shop_name}
- Artesanía: ${shopData.craft_type}
- Ubicación: ${userResponse}

Como Coordinador Maestro IA, genera una respuesta final entusiasta que:
1. Confirme que tienes toda la información necesaria
2. Mencione que vas a crear la tienda automáticamente con IA
3. Sea emocionante y profesional
4. Indique que la creación empieza ahora

Responde SOLO con el mensaje, máximo 2 oraciones.
    ` : `
The user told me they are in: "${userResponse}"
Shop information so far:
- Name: ${shopData.shop_name}
- Craft: ${shopData.craft_type}
- Location: ${userResponse}

As Master AI Coordinator, generate an enthusiastic final response that:
1. Confirms you have all necessary information
2. Mentions you'll create the shop automatically with AI
3. Is exciting and professional
4. Indicates creation starts now

Respond ONLY with the message, maximum 2 sentences.
    `
  };

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
          { 
            role: 'system', 
            content: language === 'es' 
              ? 'Eres el Coordinador Maestro, un asistente IA conversacional y entusiasta que ayuda a artesanos colombianos a crear tiendas digitales. Hablas de forma natural y cálida.'
              : 'You are the Master Coordinator, a conversational and enthusiastic AI assistant that helps Colombian artisans create digital shops. You speak naturally and warmly.'
          },
          { role: 'user', content: prompts[responseType as keyof typeof prompts] || prompts.business_name_confirmation }
        ],
        max_tokens: 100,
        temperature: 0.8
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating contextual response:', error);
    throw error;
  }
}

// Enhanced story generation with AI
export async function generateIntelligentStory(conversationHistory: any[], shopData: any, language: string): Promise<string> {
  if (!openAIApiKey) {
    return generateFallbackStory(shopData, language);
  }

  const conversationSummary = conversationHistory
    .filter(msg => msg.type === 'user')
    .map(msg => msg.content)
    .join(' | ');

  const prompt = language === 'es' ? `
Basándote en esta conversación real con un artesano colombiano, crea una historia auténtica y compelling para su tienda digital:

INFORMACIÓN RECOPILADA:
- Nombre del negocio: ${shopData.shop_name}
- Tipo de artesanía: ${shopData.craft_type}
- Ubicación: ${shopData.region}
- Conversación: ${conversationSummary}

GENERA UNA HISTORIA que:
1. Sea auténtica y personal (200-300 palabras)
2. Refleje la tradición artesanal colombiana
3. Mencione técnicas, materiales, pasión por el arte
4. Conecte con clientes que valoran lo hecho a mano
5. Sea profesional pero cálida

Escribe en tercera persona sobre el artesano y su arte.
  ` : `
Based on this real conversation with a Colombian artisan, create an authentic and compelling story for their digital shop:

COLLECTED INFORMATION:
- Business name: ${shopData.shop_name}
- Craft type: ${shopData.craft_type}
- Location: ${shopData.region}
- Conversation: ${conversationSummary}

GENERATE A STORY that:
1. Is authentic and personal (200-300 words)
2. Reflects Colombian artisan tradition
3. Mentions techniques, materials, passion for art
4. Connects with customers who value handmade
5. Is professional but warm

Write in third person about the artisan and their art.
  `;

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
          { 
            role: 'system', 
            content: 'You are an expert storyteller specializing in authentic artisan brand stories that connect emotionally with customers.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating intelligent story:', error);
    return generateFallbackStory(shopData, language);
  }
}

function generateFallbackStory(shopData: any, language: string): string {
  const businessType = shopData.craft_type || 'artesanía';
  const location = shopData.region || 'Colombia';
  const businessName = shopData.shop_name || 'nuestro negocio';

  if (language === 'es') {
    return `En ${businessName}, nos especializamos en crear ${businessType} únicos y de alta calidad. Ubicados en ${location}, combinamos técnicas tradicionales con un toque moderno para ofrecer productos excepcionales. Cada pieza está hecha con amor y dedicación, reflejando nuestra pasión por el arte y la artesanía. Trabajamos con los mejores materiales para garantizar que cada cliente reciba un producto único que perdure en el tiempo.`;
  } else {
    return `At ${businessName}, we specialize in creating unique and high-quality ${businessType}. Located in ${location}, we combine traditional techniques with a modern touch to offer exceptional products. Each piece is made with love and dedication, reflecting our passion for art and craftsmanship. We work with the best materials to ensure each customer receives a unique product that will last over time.`;
  }
}