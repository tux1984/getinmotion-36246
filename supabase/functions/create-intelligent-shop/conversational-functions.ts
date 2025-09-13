// Conversational shop creation functions for Master Coordinator

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

  // Analyze what information is missing for shop creation
  const missingInfo = [];
  const requiredFields = {
    shop_name: profile?.brand_name || profile?.business_description?.split(' ').slice(0, 3).join(' '),
    description: profile?.business_description,
    craft_type: detectCraftType(profile, masterContext),
    region: profile?.business_location,
    phone: masterContext?.business_profile?.phone,
    email: profile?.email
  };

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (!value || value === 'other') {
      missingInfo.push(key);
    }
  });

  // Determine if we have enough info to create shop automatically
  const hasMinimumInfo = requiredFields.shop_name && requiredFields.description && requiredFields.craft_type;
  const needsMoreInfo = missingInfo.length > 2 || !hasMinimumInfo;

  let coordinatorMessage;
  let nextQuestion;

  if (!needsMoreInfo) {
    // Can create automatically
    coordinatorMessage = language === 'es' 
      ? `¡Perfecto! Tengo toda la información necesaria de tu perfil para crear tu tienda digital "${requiredFields.shop_name}". Voy a configurarla automáticamente.`
      : `Perfect! I have all the necessary information from your profile to create your digital shop "${requiredFields.shop_name}". I'll configure it automatically.`;
  } else {
    // Need conversation
    if (!requiredFields.shop_name) {
      coordinatorMessage = language === 'es'
        ? '¡Hola! Soy tu Coordinador Maestro y te voy a ayudar a crear la tienda digital perfecta. Para empezar, ¿cuál es el nombre de tu negocio o marca?'
        : 'Hello! I\'m your Master Coordinator and I\'ll help you create the perfect digital shop. To start, what\'s the name of your business or brand?';
      nextQuestion = 'business_name';
    } else if (!requiredFields.description) {
      coordinatorMessage = language === 'es'
        ? `Perfecto, ${requiredFields.shop_name} es un gran nombre. Ahora cuéntame, ¿qué tipo de productos vendes o qué servicios ofreces?`
        : `Perfect, ${requiredFields.shop_name} is a great name. Now tell me, what type of products do you sell or what services do you offer?`;
      nextQuestion = 'business_description';
    } else {
      coordinatorMessage = language === 'es'
        ? 'Necesito algunos detalles más para optimizar tu tienda. ¿En qué ciudad o región te encuentras?'
        : 'I need some more details to optimize your shop. What city or region are you located in?';
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

  // Process the user's response based on current question
  switch (currentQuestion) {
    case 'business_name':
      updatedShopData.shop_name = userResponse.trim();
      message = language === 'es'
        ? `¡Excelente! "${userResponse}" será el nombre de tu tienda. Ahora cuéntame, ¿qué tipo de productos vendes? Por ejemplo: textiles, cerámica, joyería, etc.`
        : `Excellent! "${userResponse}" will be your shop name. Now tell me, what type of products do you sell? For example: textiles, ceramics, jewelry, etc.`;
      nextQuestion = 'craft_type';
      break;

    case 'craft_type':
      const detectedCraftType = detectCraftTypeFromText(userResponse);
      updatedShopData.craft_type = detectedCraftType;
      updatedShopData.description = userResponse.trim();
      message = language === 'es'
        ? `Perfecto, detecté que trabajas con ${detectedCraftType}. ¿En qué ciudad o región te encuentras? Esto me ayuda a optimizar tu tienda para clientes locales.`
        : `Perfect, I detected that you work with ${detectedCraftType}. What city or region are you in? This helps me optimize your shop for local customers.`;
      nextQuestion = 'business_location';
      break;

    case 'business_location':
      updatedShopData.region = userResponse.trim();
      message = language === 'es'
        ? `¡Genial! Tengo toda la información esencial. ¿Tienes algún número de teléfono o WhatsApp donde los clientes puedan contactarte?`
        : `Great! I have all the essential information. Do you have a phone number or WhatsApp where customers can contact you?`;
      nextQuestion = 'contact_phone';
      break;

    case 'contact_phone':
      updatedShopData.contact_info = {
        ...updatedShopData.contact_info,
        phone: userResponse.trim(),
        whatsapp: userResponse.trim()
      };
      message = language === 'es'
        ? `¡Perfecto! Ya tengo toda la información necesaria para crear tu tienda digital optimizada. Voy a configurarla ahora con tu información.`
        : `Perfect! I now have all the necessary information to create your optimized digital shop. I'll configure it now with your information.`;
      readyToCreate = true;
      break;

    case 'business_description':
      updatedShopData.description = userResponse.trim();
      const craftFromDescription = detectCraftTypeFromText(userResponse);
      updatedShopData.craft_type = craftFromDescription;
      message = language === 'es'
        ? `Entiendo, trabajas con ${craftFromDescription}. ¿En qué ciudad o región te encuentras?`
        : `I understand, you work with ${craftFromDescription}. What city or region are you in?`;
      nextQuestion = 'business_location';
      break;

    default:
      message = language === 'es'
        ? 'Gracias por la información. ¿Hay algo más que quieras contarme sobre tu negocio?'
        : 'Thanks for the information. Is there anything else you\'d like to tell me about your business?';
      readyToCreate = Object.keys(updatedShopData).length >= 4;
  }

  // Generate story if ready to create
  if (readyToCreate) {
    updatedShopData.story = generateStoryFromConversation(conversationHistory, updatedShopData, language);
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