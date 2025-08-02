export const getContextualMessage = (
  questionId: string, 
  selectedValue: string, 
  language: 'en' | 'es'
): string => {
  const messages = {
    en: {
      // Industry messages
      'industry': {
        'visual-arts': "Hey! I see you work with visual arts. Tell me more about what you create - are you more into digital work, traditional art, or maybe a mix of both?",
        'music': "Cool, music! What's your vibe - are you performing, producing, teaching, or maybe all of the above?",
        'literature': "A writer! What kind of stuff do you write? Fiction, non-fiction, poetry, or something totally different?",
        'performing-arts': "Performing arts, awesome! Are you more into theater, dance, or something else? And do you perform solo or with a group?",
        'design': "Design is such a broad field! Are you doing graphic design, product design, UX/UI, or something else entirely?",
        'audiovisual': "Audiovisual work, nice! Are you into film, video content, podcasts, or maybe multimedia projects?",
        'fashion': "Fashion! That's exciting. Are you designing clothes, accessories, or maybe working more on the styling side?",
        'crafts': "Crafts and handmade stuff! What do you love making? Is it more traditional techniques or are you putting a modern twist on things?",
        'gastronomy': "Food! Are you cooking, baking, running a restaurant, or maybe doing something creative with food content?",
        'technology': "Tech in the creative space - interesting combo! Are you developing apps, working with AI, gaming, or something else?",
        'arts-crafts': "Arts & crafts! That's such a fun space. What kind of things do you make? Are they more functional pieces or purely artistic?"
      },
      // Payment methods messages
      'payment-methods': {
        'cash': "I see you're sticking with cash! How's that working out for you? Are you thinking about adding other payment options?",
        'bank-transfer': "Bank transfers are solid and reliable! Do you find clients are comfortable with that, or do they sometimes want other options?",
        'credit-card': "Credit cards, nice! Are you using a specific payment processor, or maybe thinking about expanding to other methods too?",
        'digital-wallet': "Digital wallets are super convenient! Which ones are you using? And how do your clients feel about them?",
        'cryptocurrency': "Crypto payments, that's pretty forward-thinking! How's the adoption been with your clients? Any particular cryptocurrencies you prefer?"
      },
      // Business experience messages
      'experience': {
        'beginner': "Just starting out? That's exciting! What's been the biggest challenge so far, and what are you most excited to learn about?",
        'intermediate': "You've got some experience under your belt! What's working well for you, and where do you feel you could level up?",
        'advanced': "Nice, you're experienced! What strategies have worked best for you, and are there any new areas you're looking to explore?"
      },
      // Default fallback
      'default': "Interesting choice! Tell me more about this - I'd love to understand how this fits into your creative business journey."
    },
    es: {
      // Industry messages  
      'industry': {
        'visual-arts': "¡Oye! Veo que trabajas con artes visuales. Cuéntame más sobre lo que creas: ¿te va más lo digital, el arte tradicional, o quizás una mezcla de ambos?",
        'music': "¡Música! ¿Cuál es tu onda? ¿Tocas, produces, enseñas, o tal vez haces de todo un poco?",
        'literature': "¡Un escritor! ¿Qué tipo de cosas escribes? ¿Ficción, no ficción, poesía, o algo totalmente diferente?",
        'performing-arts': "¡Artes escénicas, genial! ¿Te va más el teatro, la danza, o algo más? ¿Y actúas solo o con un grupo?",
        'design': "¡El diseño es un campo súper amplio! ¿Haces diseño gráfico, de productos, UX/UI, o algo completamente diferente?",
        'audiovisual': "¡Trabajo audiovisual, qué bueno! ¿Te dedicas al cine, contenido de video, podcasts, o proyectos multimedia?",
        'fashion': "¡Moda! Eso está padrísimo. ¿Diseñas ropa, accesorios, o trabajas más del lado del styling?",
        'crafts': "¡Artesanías y cosas hechas a mano! ¿Qué te gusta hacer? ¿Son más técnicas tradicionales o les das un toque moderno?",
        'gastronomy': "¡Comida! ¿Cocinas, horneas, tienes restaurante, o haces algo creativo con contenido gastronómico?",
        'technology': "Tecnología en el espacio creativo, ¡qué combo interesante! ¿Desarrollas apps, trabajas con IA, gaming, o algo más?",
        'arts-crafts': "¡Artes y manualidades! Ese es un espacio súper divertido. ¿Qué tipo de cosas haces? ¿Son más piezas funcionales o puramente artísticas?"
      },
      // Payment methods messages
      'payment-methods': {
        'cash': "Veo que sigues con efectivo! ¿Qué tal te va con eso? ¿Has pensado en agregar otras opciones de pago?",
        'bank-transfer': "¡Las transferencias bancarias son sólidas y confiables! ¿Tus clientes se sienten cómodos con eso, o a veces quieren otras opciones?",
        'credit-card': "¡Tarjetas de crédito, perfecto! ¿Usas algún procesador de pagos específico, o estás pensando en expandir a otros métodos también?",
        'digital-wallet': "¡Las billeteras digitales son súper convenientes! ¿Cuáles usas? ¿Y cómo se sienten tus clientes con ellas?",
        'cryptocurrency': "Pagos con cripto, ¡eso es bastante visionario! ¿Cómo ha sido la adopción con tus clientes? ¿Hay alguna criptomoneda que prefieras?"
      },
      // Business experience messages
      'experience': {
        'beginner': "¿Apenas empezando? ¡Qué emocionante! ¿Cuál ha sido el mayor reto hasta ahora, y qué es lo que más te emociona aprender?",
        'intermediate': "¡Ya tienes algo de experiencia! ¿Qué te está funcionando bien, y en dónde sientes que podrías subir de nivel?",
        'advanced': "¡Órale, ya tienes experiencia! ¿Qué estrategias te han funcionado mejor, y hay alguna área nueva que quieras explorar?"
      },
      // Default fallback
      'default': "¡Interesante elección! Cuéntame más sobre esto - me encantaría entender cómo encaja en tu journey de negocio creativo."
    }
  };

  const questionMessages = messages[language][questionId as keyof typeof messages[typeof language]];
  
  if (questionMessages && typeof questionMessages === 'object') {
    return (questionMessages as Record<string, string>)[selectedValue] || messages[language].default;
  }
  
  return messages[language].default;
};