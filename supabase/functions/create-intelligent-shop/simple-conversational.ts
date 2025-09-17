// Simple conversational shop creation - streamlined for 3 questions only

export function processSimpleConversation(
  userResponse: string, 
  currentQuestion: string,
  shopData: any,
  language: string = 'es'
) {
  const responses = {
    es: {
      shop_name: {
        message: '✅ Excelente nombre! Ahora, ¿qué productos específicos vendes?',
        nextQuestion: 'products'
      },
      products: {
        message: '✅ Perfecto! Por último, ¿en qué ciudad estás ubicado?',
        nextQuestion: 'location'
      },
      location: {
        message: '🎉 ¡Listo! Tengo toda la información necesaria. Creando tu tienda...',
        nextQuestion: null,
        readyToCreate: true
      }
    },
    en: {
      shop_name: {
        message: '✅ Excellent name! Now, what specific products do you sell?',
        nextQuestion: 'products'
      },
      products: {
        message: '✅ Perfect! Finally, what city are you located in?',
        nextQuestion: 'location'
      },
      location: {
        message: '🎉 Ready! I have all the necessary information. Creating your shop...',
        nextQuestion: null,
        readyToCreate: true
      }
    }
  };

  const langResponses = responses[language as keyof typeof responses] || responses.es;
  const response = langResponses[currentQuestion as keyof typeof langResponses];

  if (!response) {
    return {
      message: 'Por favor, responde la pregunta actual.',
      nextQuestion: currentQuestion,
      readyToCreate: false,
      updatedShopData: shopData
    };
  }

  // Update shop data based on question
  const updatedShopData = { ...shopData };
  
  if (currentQuestion === 'shop_name') {
    updatedShopData.shop_name = userResponse.trim();
  } else if (currentQuestion === 'products') {
    updatedShopData.description = userResponse.trim();
    updatedShopData.craft_type = detectSimpleCraftType(userResponse);
  } else if (currentQuestion === 'location') {
    updatedShopData.region = userResponse.trim();
  }

  return {
    message: response.message,
    nextQuestion: response.nextQuestion,
    readyToCreate: response.readyToCreate || false,
    updatedShopData,
    finalShopData: response.readyToCreate ? createFinalShopData(updatedShopData) : null
  };
}

function detectSimpleCraftType(text: string): string {
  const craftTypes: Record<string, string[]> = {
    'textiles': ['tejido', 'tela', 'lana', 'algodón', 'bordado', 'tapiz', 'hilo'],
    'ceramica': ['cerámica', 'barro', 'arcilla', 'maceta', 'vasija', 'porcelana'],
    'joyeria': ['collar', 'arete', 'pulsera', 'anillo', 'joya', 'plata', 'oro'],
    'cuero': ['cuero', 'bolso', 'cartera', 'cinturón', 'marroquinería', 'piel'],
    'madera': ['madera', 'tallado', 'mueble', 'decorativo', 'carpintería']
  };

  const lowerText = text.toLowerCase();
  for (const [type, keywords] of Object.entries(craftTypes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }
  return 'artesanias';
}

function createFinalShopData(shopData: any) {
  return {
    ...shopData,
    story: `Somos ${shopData.shop_name}, especialistas en ${shopData.description} desde ${shopData.region}. Cada producto está hecho con amor y tradición artesanal colombiana.`,
    contact_info: { email: '' },
    social_links: {}
  };
}