// Conversational shop creation functions for Master Coordinator

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Detect vague responses that need clarification
function isVagueResponse(response: string): boolean {
  const vaguePhrases = [
    'el mismo que', 'la misma que', 'como antes', 'igual que antes',
    'lo mismo', 'como siempre', 'como ya dije', 'ya lo mencioné',
    'pues', 'eh', 'este', 'bueno', 'si', 'sí', 'ok', 'vale',
    'normal', 'básico', 'común', 'típico', 'tradicional'
  ];
  
  const normalizedResponse = response.toLowerCase().trim();
  
  // Check if response is too short (less than 3 words)
  if (normalizedResponse.split(' ').length < 3) return true;
  
  // Check for vague phrases
  return vaguePhrases.some(phrase => normalizedResponse.includes(phrase));
}

// Generate intelligent contextual questions using OpenAI
async function generateIntelligentQuestion(userResponse: string, currentQuestion: string, conversationHistory: any[], userProfile: any, language: string): Promise<string> {
  if (!openAIApiKey) {
    return getDefaultContextualQuestion(currentQuestion, language);
  }

  const prompt = language === 'es' ? `
Eres el Coordinador Maestro, un asistente IA especializado en crear tiendas digitales para artesanos colombianos.

CONTEXT DEL USUARIO:
- Pregunta actual: ${currentQuestion}
- Respuesta del usuario: "${userResponse}"
- Historial de conversación: ${JSON.stringify(conversationHistory.slice(-3))}
- Perfil disponible: ${JSON.stringify(userProfile)}

SITUACIÓN: La respuesta del usuario "${userResponse}" es vaga o insuficiente. 

TU MISIÓN: Generar una pregunta inteligente, específica y conversacional que:
1. Detecte qué información concreta necesitas
2. Sea amigable y natural, no robótica
3. Incluya ejemplos relevantes para artesanos colombianos
4. Ayude al usuario a dar una respuesta más específica

EJEMPLOS DE BUENAS PREGUNTAS:
- Si dice "El mismo que yo tenía" → "Entiendo que ya tenías un negocio antes. ¿Podrías contarme específicamente qué productos vendías? Por ejemplo: ¿eran bolsos de cuero, cerámicas, tejidos, joyería?"
- Si dice "Pues normal" → "Claro, quiero entender mejor. ¿Podrías ser más específico? Por ejemplo, ¿es una ciudad grande como Bogotá o Medellín, o un pueblo más pequeño?"

Responde SOLO con la pregunta, sin explicaciones adicionales.
` : `
You are the Master Coordinator, an AI assistant specialized in creating digital shops for Colombian artisans.

USER CONTEXT:
- Current question: ${currentQuestion}  
- User response: "${userResponse}"
- Conversation history: ${JSON.stringify(conversationHistory.slice(-3))}
- Available profile: ${JSON.stringify(userProfile)}

SITUATION: The user's response "${userResponse}" is vague or insufficient.

YOUR MISSION: Generate an intelligent, specific and conversational question that:
1. Detects what concrete information you need
2. Is friendly and natural, not robotic
3. Includes relevant examples for Colombian artisans
4. Helps the user give a more specific response

Respond ONLY with the question, no additional explanations.
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
          { role: 'system', content: 'You are an expert conversational AI that generates intelligent, specific questions to clarify vague responses.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating intelligent question:', error);
    return getDefaultContextualQuestion(currentQuestion, language);
  }
}

// Fallback contextual questions
function getDefaultContextualQuestion(currentQuestion: string, language: string): string {
  const questions = {
    es: {
      business_name: 'Entiendo. ¿Podrías contarme específicamente cuál es el nombre de tu marca o negocio? Por ejemplo: "Artesanías Luna", "Cerámica Andina", etc.',
      business_description: '¿Podrías ser más específico sobre los productos que vendes? Por ejemplo: ¿trabajas con cerámica, textiles, joyería, cuero, madera?',
      business_location: 'Claro. ¿En qué ciudad específicamente? Por ejemplo: Bogotá, Medellín, Cartagena, o algún municipio particular.',
      craft_type: 'Perfecto. ¿Podrías darme más detalles sobre el tipo de artesanía? Por ejemplo: ¿qué técnicas usas, qué materiales, qué tipo de productos específicos?'
    },
    en: {
      business_name: 'I understand. Could you tell me specifically what your brand or business name is? For example: "Luna Crafts", "Andean Ceramics", etc.',
      business_description: 'Could you be more specific about the products you sell? For example: do you work with ceramics, textiles, jewelry, leather, wood?',
      business_location: 'Of course. In which city specifically? For example: Bogotá, Medellín, Cartagena, or a particular municipality.',
      craft_type: 'Perfect. Could you give me more details about the type of craftsmanship? For example: what techniques do you use, what materials, what specific types of products?'
    }
  };

  return questions[language as keyof typeof questions]?.[currentQuestion as keyof typeof questions.es] || 
         'Could you provide more specific details about that?';
}

export async function analyzeProfileForConversation(supabase: any, userId: string, language: string) {
  // Fetch comprehensive user data
  const [profileResult, contextResult, maturityResult] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
    supabase.from('user_master_context').select('*').eq('user_id', userId).single(),
    supabase.from('user_maturity_scores').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
  ]);

  const profile = profileResult.data;
  const masterContext = contextResult.data;
  const maturityScores = maturityResult.data;

  // Analyze what information is missing for shop creation - WITH VAGUE DETECTION
  const missingInfo = [];
  const requiredFields = {
    shop_name: profile?.brand_name || profile?.business_description?.split(' ').slice(0, 3).join(' '),
    description: profile?.business_description,
    craft_type: detectCraftType(profile, masterContext),
    region: profile?.business_location,
    phone: masterContext?.business_profile?.phone,
    email: profile?.email
  };

  // Check for vague responses in existing data
  const hasVagueData = Object.entries(requiredFields).some(([key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      return isVagueResponse(value);
    }
    return false;
  });

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (!value || value === 'other' || (typeof value === 'string' && isVagueResponse(value))) {
      missingInfo.push(key);
    }
  });

  // Determine if we have enough info to create shop automatically
  const hasMinimumInfo = requiredFields.shop_name && requiredFields.description && requiredFields.craft_type && !hasVagueData;
  const needsMoreInfo = missingInfo.length > 1 || !hasMinimumInfo || hasVagueData;

  let coordinatorMessage;
  let nextQuestion;

  if (!needsMoreInfo) {
    // Can create automatically
    coordinatorMessage = language === 'es' 
      ? `¡Perfecto! Tengo toda la información necesaria de tu perfil para crear tu tienda digital "${requiredFields.shop_name}". Voy a configurarla automáticamente con IA.`
      : `Perfect! I have all the necessary information from your profile to create your digital shop "${requiredFields.shop_name}". I'll configure it automatically with AI.`;
  } else {
    // Need intelligent conversation
    if (!requiredFields.shop_name || isVagueResponse(requiredFields.shop_name || '')) {
      coordinatorMessage = language === 'es'
        ? '¡Hola! Soy tu Coordinador Maestro IA 🤖 Voy a crear la tienda digital perfecta para tu negocio artesanal. Veo que ya tienes experiencia, pero necesito algunos detalles específicos. ¿Cuál es el nombre exacto de tu marca o negocio?'
        : 'Hello! I\'m your Master AI Coordinator 🤖 I\'ll create the perfect digital shop for your artisan business. I see you have experience, but I need some specific details. What\'s the exact name of your brand or business?';
      nextQuestion = 'business_name';
    } else if (!requiredFields.description || isVagueResponse(requiredFields.description || '')) {
      coordinatorMessage = language === 'es'
        ? `Perfecto, "${requiredFields.shop_name}" es un excelente nombre. Ahora necesito entender mejor tu artesanía. ¿Qué productos específicos creas? Por ejemplo: ¿trabajas con cerámica, textiles, joyería, cuero, madera? Cuéntame los detalles.`
        : `Perfect, "${requiredFields.shop_name}" is an excellent name. Now I need to better understand your craftsmanship. What specific products do you create? For example: do you work with ceramics, textiles, jewelry, leather, wood? Tell me the details.`;
      nextQuestion = 'business_description';
    } else {
      coordinatorMessage = language === 'es'
        ? 'Excelente información sobre tu artesanía. Para optimizar tu tienda para clientes locales, ¿en qué ciudad o región específica te encuentras? Esto me ayuda a configurar mejor las opciones de envío y marketing local.'
        : 'Excellent information about your craftsmanship. To optimize your shop for local customers, what specific city or region are you in? This helps me better configure shipping options and local marketing.';
      nextQuestion = 'business_location';
    }
  }

  return new Response(JSON.stringify({
    needsMoreInfo,
    coordinatorMessage,
    nextQuestion,
    missingInfo,
    userContext: {
      hasExistingData: !!(profile?.business_description || profile?.brand_name),
      detectedCraft: detectCraftType(profile, masterContext),
      maturityLevel: calculateOverallMaturity(maturityScores)
    },
    shopData: needsMoreInfo ? {} : generateFallbackShopData(profile, masterContext)
  }), {
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
  });
}

export async function processConversationStep(supabase: any, userId: string, language: string, userResponse: string, currentQuestion: string, conversationHistory: any[], shopData: any) {
  let updatedShopData = { ...shopData };
  let nextQuestion;
  let message;
  let readyToCreate = false;

  console.log('Processing conversation step:', { currentQuestion, userResponse, isVague: isVagueResponse(userResponse) });

  // INTELLIGENT VAGUE RESPONSE DETECTION
  if (isVagueResponse(userResponse)) {
    console.log('Detected vague response, generating intelligent question');
    
    // Get user profile for context
    const { data: profile } = await supabase.from('user_profiles').select('*').eq('user_id', userId).single();
    
    message = await generateIntelligentQuestion(
      userResponse, 
      currentQuestion, 
      conversationHistory, 
      profile, 
      language
    );
    
    // Keep the same question for retry
    nextQuestion = currentQuestion;
    
    return new Response(JSON.stringify({
      message,
      nextQuestion,
      updatedShopData,
      readyToCreate: false,
      isVagueResponseDetected: true,
      finalShopData: null
    }), {
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  }

  // INTELLIGENT PROCESSING OF SPECIFIC RESPONSES
  switch (currentQuestion) {
    case 'business_name':
      updatedShopData.shop_name = userResponse.trim();
      
      // Generate AI-powered follow-up if OpenAI available
      if (openAIApiKey) {
        try {
          message = await generateContextualResponse(userResponse, 'business_name_confirmation', language, updatedShopData);
        } catch (error) {
          console.error('AI response generation failed, using fallback');
          message = language === 'es'
            ? `¡Excelente! "${userResponse}" será el nombre de tu tienda. Ahora cuéntame específicamente qué productos artesanales creas. Por ejemplo: ¿trabajas con cerámica, textiles, joyería, cuero, madera?`
            : `Excellent! "${userResponse}" will be your shop name. Now tell me specifically what artisan products you create. For example: do you work with ceramics, textiles, jewelry, leather, wood?`;
        }
      } else {
        message = language === 'es'
          ? `¡Excelente! "${userResponse}" será el nombre de tu tienda. Ahora cuéntame específicamente qué productos artesanales creas.`
          : `Excellent! "${userResponse}" will be your shop name. Now tell me specifically what artisan products you create.`;
      }
      nextQuestion = 'business_description';
      break;

    case 'business_description':
      const detectedCraftType = detectCraftTypeFromText(userResponse);
      updatedShopData.craft_type = detectedCraftType;
      updatedShopData.description = userResponse.trim();
      
      if (openAIApiKey) {
        try {
          message = await generateContextualResponse(userResponse, 'craft_confirmation', language, { ...updatedShopData, detectedCraftType });
        } catch (error) {
          console.error('AI response generation failed, using fallback');
          message = language === 'es'
            ? `Perfecto, detecté que trabajas con ${detectedCraftType}. Para optimizar tu tienda, ¿en qué ciudad específica te encuentras? Esto me ayuda con envíos y marketing local.`
            : `Perfect, I detected that you work with ${detectedCraftType}. To optimize your shop, what specific city are you in? This helps me with shipping and local marketing.`;
        }
      } else {
        message = language === 'es'
          ? `Perfecto, detecté que trabajas con ${detectedCraftType}. ¿En qué ciudad te encuentras?`
          : `Perfect, I detected that you work with ${detectedCraftType}. What city are you in?`;
      }
      nextQuestion = 'business_location';
      break;

    case 'business_location':
      updatedShopData.region = userResponse.trim();
      
      if (openAIApiKey) {
        try {
          message = await generateContextualResponse(userResponse, 'location_confirmation', language, updatedShopData);
        } catch (error) {
          message = language === 'es'
            ? `¡Excelente! Ya tengo toda la información esencial para crear tu tienda digital optimizada. La IA va a configurarla automáticamente con toda esta información.`
            : `Excellent! I have all the essential information to create your optimized digital shop. AI will configure it automatically with all this information.`;
        }
      } else {
        message = language === 'es'
          ? `¡Perfecto! Ya tengo la información necesaria para crear tu tienda digital.`
          : `Perfect! I have the necessary information to create your digital shop.`;
      }
      readyToCreate = true;
      break;

    case 'contact_phone':
      updatedShopData.contact_info = {
        ...updatedShopData.contact_info,
        phone: userResponse.trim(),
        whatsapp: userResponse.trim()
      };
      message = language === 'es'
        ? `¡Perfecto! Ya tengo toda la información necesaria. La IA está creando tu tienda digital optimizada ahora mismo...`
        : `Perfect! I have all the necessary information. AI is creating your optimized digital shop right now...`;
      readyToCreate = true;
      break;

    default:
      message = language === 'es'
        ? 'Gracias por la información. ¿Hay algo más específico que quieras contarme sobre tu negocio?'
        : 'Thanks for the information. Is there anything else specific you\'d like to tell me about your business?';
      readyToCreate = Object.keys(updatedShopData).length >= 3;
  }

  // Generate intelligent story if ready to create
  if (readyToCreate) {
    // Import AI story generation
    const { generateIntelligentStory } = await import('./ai-conversation-helpers.ts');
    
    try {
      updatedShopData.story = await generateIntelligentStory(conversationHistory, updatedShopData, language);
    } catch (error) {
      console.error('AI story generation failed, using fallback');
      updatedShopData.story = generateStoryFromConversation(conversationHistory, updatedShopData, language);
    }
    
    updatedShopData.shop_slug = updatedShopData.shop_name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'mi-tienda';
    
    // Set default contact info if not provided
    if (!updatedShopData.contact_info) {
      updatedShopData.contact_info = {
        phone: '',
        email: '',
        whatsapp: ''
      };
    }
    
    if (!updatedShopData.social_links) {
      updatedShopData.social_links = {
        instagram: '',
        facebook: '',
        website: ''
      };
    }
  }

  return new Response(JSON.stringify({
    message,
    nextQuestion,
    updatedShopData,
    readyToCreate,
    finalShopData: readyToCreate ? updatedShopData : null
  }), {
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
  });
}

function detectCraftTypeFromText(text: string): string {
  const lowerText = text.toLowerCase();
  
  const craftMappings: Record<string, string> = {
    'tejido': 'textiles', 'textil': 'textiles', 'bordado': 'textiles', 'ropa': 'textiles',
    'cerámica': 'ceramics', 'alfarería': 'ceramics', 'barro': 'ceramics', 'arcilla': 'ceramics',
    'joyería': 'jewelry', 'orfebrería': 'jewelry', 'bisutería': 'jewelry',
    'cuero': 'leather', 'marroquinería': 'leather', 'bolsos': 'leather',
    'madera': 'woodwork', 'carpintería': 'woodwork', 'muebles': 'woodwork',
    'metal': 'metalwork', 'forja': 'metalwork', 'hierro': 'metalwork',
    'vidrio': 'glasswork', 'vitral': 'glasswork',
    'pintura': 'painting', 'arte': 'painting', 'cuadros': 'painting',
    'escultura': 'sculpture', 'tallado': 'sculpture'
  };

  for (const [keyword, craftType] of Object.entries(craftMappings)) {
    if (lowerText.includes(keyword)) {
      return craftType;
    }
  }

  return 'other';
}

function generateStoryFromConversation(conversation: any[], shopData: any, language: string): string {
  const businessType = shopData.craft_type || 'artesanía';
  const location = shopData.region || 'Colombia';
  const businessName = shopData.shop_name || 'nuestro negocio';

  if (language === 'es') {
    return `En ${businessName}, nos especializamos en crear ${businessType} únicos y de alta calidad. Ubicados en ${location}, combinamos técnicas tradicionales con un toque moderno para ofrecer productos excepcionales. Cada pieza está hecha con amor y dedicación, reflejando nuestra pasión por el arte y la artesanía. Trabajamos con los mejores materiales para garantizar que cada cliente reciba un producto único que perdure en el tiempo.`;
  } else {
    return `At ${businessName}, we specialize in creating unique and high-quality ${businessType}. Located in ${location}, we combine traditional techniques with a modern touch to offer exceptional products. Each piece is made with love and dedication, reflecting our passion for art and craftsmanship. We work with the best materials to ensure each customer receives a unique product that will last over time.`;
  }
}

// Import AI helper function for contextual responses
async function generateContextualResponse(userResponse: string, responseType: string, language: string, shopData: any): Promise<string> {
  const { generateContextualResponse: aiHelper } = await import('./ai-conversation-helpers.ts');
  return aiHelper(userResponse, responseType, language, shopData);
}

// Helper functions (reuse existing ones)
function detectCraftType(profile: any, masterContext: any): string {
  const textToAnalyze = [
    profile?.business_description || '',
    profile?.brand_name || '',
    masterContext?.business_profile?.description || ''
  ].join(' ').toLowerCase();

  const craftMappings: Record<string, string> = {
    'tejido': 'textiles', 'textil': 'textiles', 'bordado': 'textiles',
    'cerámica': 'ceramics', 'alfarería': 'ceramics', 'barro': 'ceramics',
    'joyería': 'jewelry', 'orfebrería': 'jewelry',
    'cuero': 'leather', 'marroquinería': 'leather',
    'madera': 'woodwork', 'carpintería': 'woodwork',
    'metal': 'metalwork', 'forja': 'metalwork',
    'vidrio': 'glasswork', 'vitral': 'glasswork',
    'pintura': 'painting', 'arte': 'painting',
    'escultura': 'sculpture'
  };

  for (const [keyword, craftType] of Object.entries(craftMappings)) {
    if (textToAnalyze.includes(keyword)) {
      return craftType;
    }
  }

  return 'other';
}

function calculateOverallMaturity(maturityScores: any): number {
  if (!maturityScores) return 25;
  
  const { idea_validation, user_experience, market_fit, monetization } = maturityScores;
  return Math.round((idea_validation + user_experience + market_fit + monetization) / 4);
}

function generateFallbackShopData(profile: any, masterContext: any) {
  const businessProfile = masterContext?.business_profile || {};
  const socialMedia = profile?.social_media_presence || {};

  return {
    shop_name: profile?.brand_name || profile?.business_description?.split(' ').slice(0, 3).join(' ') || 'Mi Tienda Artesanal',
    description: profile?.business_description || 'Productos artesanales únicos hechos con amor',
    story: businessProfile.story || 'Nuestra tradición artesanal se transmite de generación en generación, creando piezas únicas que reflejan la riqueza cultural de Colombia.',
    craft_type: detectCraftType(profile, masterContext) || 'other',
    region: profile?.business_location || '',
    contact_info: {
      phone: businessProfile.phone || '',
      email: profile?.email || '',
      whatsapp: businessProfile.whatsapp || '',
    },
    social_links: {
      instagram: socialMedia.instagram || '',
      facebook: socialMedia.facebook || '',
      website: socialMedia.website || '',
    },
  };
}