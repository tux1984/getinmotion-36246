import { ConversationBlock } from '../conversational/types/conversationalTypes';

export const getFusedConversationBlocks = (language: 'en' | 'es'): ConversationBlock[] => {
  const blocks = {
    en: [
      {
        id: 'business_fundamentals',
        title: 'Your Business',
        subtitle: 'Understanding what you do',
        agentMessage: "Hi! I'm your personalized growth agent. Let's start by understanding your business so I can give you the most relevant advice.",
        strategicContext: "This information helps me identify your business type, experience level, and current challenges to provide tailored recommendations.",
        questions: [
          {
            id: 'business_description',
            question: 'Describe your business in detail - what you do, who you help, and what makes you unique?',
            type: 'text-input' as const,
            fieldName: 'businessDescription',
            placeholder: 'E.g., I paint custom leather jackets with unique designs for motorcycle enthusiasts. I specialize in hand-painted artwork that tells personal stories...',
            explanation: 'The more specific you are, the better I can understand your business and create personalized recommendations.',
            required: true
          },
          {
            id: 'brand_name',
            question: 'What\'s your brand or business name?',
            type: 'text-input' as const,
            fieldName: 'brandName',
            placeholder: 'E.g., LeatherArt Custom, My Consulting...',
            explanation: 'Your brand name helps personalize recommendations.',
            required: false
          },
          {
            id: 'industry_category',
            question: 'Which category best describes your work?',
            type: 'single-choice' as const,
            fieldName: 'industry',
            explanation: 'Different industries have different growth patterns and challenges.',
            required: true,
            options: [
              { id: 'creative', label: 'Creative & Artisan', value: 'creative', description: 'Art, crafts, design, photography' },
              { id: 'services', label: 'Services & Consulting', value: 'services', description: 'Coaching, consulting, freelancing' },
              { id: 'retail', label: 'Retail & Commerce', value: 'retail', description: 'Selling products, e-commerce' },
              { id: 'tech', label: 'Technology', value: 'tech', description: 'Software, apps, digital products' },
              { id: 'education', label: 'Education & Training', value: 'education', description: 'Teaching, courses, workshops' },
              { id: 'other', label: 'Other', value: 'other', description: 'Something different' }
            ]
          },
          {
            id: 'experience_level',
            question: 'How would you describe your experience level?',
            type: 'single-choice' as const,
            fieldName: 'experience',
            explanation: 'This helps me adjust my recommendations to your current level.',
            required: true,
            options: [
              { id: 'just_starting', label: 'Just starting', value: 'just_starting', description: 'New to entrepreneurship' },
              { id: 'some_experience', label: 'Some experience', value: 'some_experience', description: 'Have tried a few things' },
              { id: 'experienced', label: 'Experienced', value: 'experienced', description: 'Been doing this for a while' },
              { id: 'expert', label: 'Expert', value: 'expert', description: 'Very experienced entrepreneur' }
            ]
          }
        ]
      },
      {
        id: 'target_market',
        title: 'Your Customers',
        subtitle: 'Understanding who you serve',
        agentMessage: "Great! Now let me understand your market better. Knowing your customers is crucial for growing your business effectively.",
        strategicContext: "Customer clarity directly impacts your marketing effectiveness and pricing strategy.",
        questions: [
          {
            id: 'target_audience',
            question: 'Who do you primarily serve?',
            type: 'single-choice' as const,
            fieldName: 'targetAudience',
            explanation: 'Different audiences require different approaches. B2C needs different strategies than B2B.',
            required: true,
            options: [
              { id: 'individuals', label: 'Individual Consumers (B2C)', value: 'individuals', description: 'Regular people buying for themselves' },
              { id: 'businesses', label: 'Other Businesses (B2B)', value: 'businesses', description: 'Companies or organizations' },
              { id: 'both', label: 'Both', value: 'both', description: 'I serve both individuals and businesses' },
              { id: 'unclear', label: 'Not sure yet', value: 'unclear', description: 'Still figuring this out' }
            ]
          },
          {
            id: 'customer_clarity',
            question: 'How well do you know your ideal customer?',
            type: 'slider' as const,
            fieldName: 'customerClarity',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Understanding your customer deeply is crucial for effective marketing and product development.',
            required: true
          },
          {
            id: 'main_activities',
            question: 'What specific activities or services do you offer?',
            type: 'multiple-choice' as const,
            fieldName: 'activities',
            explanation: 'This helps me understand the scope and nature of your offerings.',
            required: false,
            options: [
              { id: 'design', label: 'Design & Creative Work', value: 'design' },
              { id: 'consulting', label: 'Consulting & Advice', value: 'consulting' },
              { id: 'teaching', label: 'Teaching & Training', value: 'teaching' },
              { id: 'manufacturing', label: 'Making/Manufacturing', value: 'manufacturing' },
              { id: 'selling', label: 'Retail/Sales', value: 'selling' },
              { id: 'services', label: 'Personal Services', value: 'services' }
            ]
          }
        ]
      },
      {
        id: 'business_maturity',
        title: 'Business Reality',
        subtitle: 'Your current situation',
        agentMessage: "Let's talk about where you are right now. I need to understand your current business maturity to give you the right next steps.",
        strategicContext: "Your sales history and business structure determine whether you need validation or scaling strategies.",
        questions: [
          {
            id: 'has_sold',
            question: 'Have you already made sales?',
            type: 'yes-no' as const,
            fieldName: 'hasSold',
            explanation: 'Making your first sale is a major milestone that changes your entire growth strategy.',
            required: true
          },
          {
            id: 'sales_consistency',
            question: 'How often do you make sales?',
            type: 'single-choice' as const,
            fieldName: 'salesConsistency',
            explanation: 'Consistent sales indicate market validation and business maturity.',
            required: true,
            options: [
              { id: 'never', label: 'Never sold anything yet', value: 'never' },
              { id: 'rarely', label: 'Very rarely', value: 'rarely' },
              { id: 'occasionally', label: 'Occasionally', value: 'occasionally' },
              { id: 'regularly', label: 'Regularly', value: 'regularly' },
              { id: 'consistently', label: 'Very consistently', value: 'consistently' }
            ]
          },
          {
            id: 'pricing_method',
            question: 'How do you set your prices?',
            type: 'single-choice' as const,
            fieldName: 'pricingMethod',
            explanation: 'Your pricing method affects profitability and scalability.',
            required: true,
            options: [
              { id: 'hourly', label: 'By the hour', value: 'hourly', description: 'I charge per hour worked' },
              { id: 'project', label: 'Fixed project prices', value: 'project', description: 'One price per complete project' },
              { id: 'product', label: 'Per product/item', value: 'product', description: 'Each item has its own price' },
              { id: 'subscription', label: 'Monthly/recurring', value: 'subscription', description: 'Customers pay regularly' },
              { id: 'no_system', label: 'No clear system yet', value: 'no_system', description: 'Still figuring this out' }
            ]
          },
          {
            id: 'profit_clarity',
            question: 'How clear are you about your actual profits?',
            type: 'slider' as const,
            fieldName: 'profitClarity',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Understanding profitability is essential for smart business decisions.',
            required: true
          }
        ]
      },
      {
        id: 'team_operations',
        title: 'Your Team & Operations',
        subtitle: 'How you work',
        agentMessage: "Understanding your team structure and operations helps me recommend the right level of support and delegation strategies.",
        strategicContext: "Your team structure affects task prioritization, growth strategies, and delegation opportunities.",
        questions: [
          {
            id: 'team_structure',
            question: 'Do you work alone or with others?',
            type: 'single-choice' as const,
            fieldName: 'teamStructure',
            explanation: 'Your team structure determines what you can delegate and how quickly you can scale.',
            required: true,
            options: [
              { id: 'solo', label: 'Just me', value: 'solo', description: 'I handle everything myself' },
              { id: 'partner', label: 'With a partner', value: 'partner', description: 'I have one main collaborator' },
              { id: 'small_team', label: 'Small team (3-5 people)', value: 'small_team', description: 'We have a small group' },
              { id: 'larger_team', label: 'Larger team (6+ people)', value: 'larger_team', description: 'We have a bigger organization' }
            ]
          },
          {
            id: 'delegation_comfort',
            question: 'How comfortable are you delegating tasks?',
            type: 'slider' as const,
            fieldName: 'delegationComfort',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Delegation skills are crucial for scaling beyond yourself.',
            required: true
          },
          {
            id: 'promotion_channels',
            question: 'Where do you currently promote your work?',
            type: 'multiple-choice' as const,
            fieldName: 'promotionChannels',
            explanation: 'Understanding your current channels helps identify gaps and opportunities.',
            required: true,
            options: [
              { id: 'social_media', label: 'Social Media', value: 'social_media' },
              { id: 'word_of_mouth', label: 'Word of Mouth', value: 'word_of_mouth' },
              { id: 'website', label: 'My Website', value: 'website' },
              { id: 'referrals', label: 'Referrals', value: 'referrals' },
              { id: 'advertising', label: 'Paid Advertising', value: 'advertising' },
              { id: 'networking', label: 'Networking Events', value: 'networking' },
              { id: 'nowhere', label: 'Nowhere really', value: 'nowhere' }
            ]
          },
          {
            id: 'marketing_confidence',
            question: 'How confident do you feel about marketing yourself?',
            type: 'slider' as const,
            fieldName: 'marketingConfidence',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Marketing confidence affects how effectively you can promote your business.',
            required: true
          }
        ]
      },
      {
        id: 'business_profile_details',
        title: 'Business Details',
        subtitle: 'Additional information to personalize your experience',
        agentMessage: "Let's gather some additional details about your business to make my recommendations even more personalized.",
        strategicContext: "These details help create a complete business profile for optimal task and agent recommendations.",
        questions: [
          {
            id: 'business_location',
            question: 'Where is your business located?',
            type: 'text-input' as const,
            fieldName: 'businessLocation',
            placeholder: 'City, Country',
            explanation: 'Location affects market opportunities and strategies.',
            required: false
          },
          {
            id: 'years_in_business',
            question: 'How many years have you been in business?',
            type: 'slider' as const,
            fieldName: 'yearsInBusiness',
            min: 0,
            max: 20,
            step: 1,
            explanation: 'Experience level affects the type of advice you need.',
            required: false
          },
          {
            id: 'monthly_revenue_goal',
            question: 'What\'s your monthly revenue goal? (in USD)',
            type: 'slider' as const,
            fieldName: 'monthlyRevenueGoal',
            min: 500,
            max: 50000,
            step: 500,
            explanation: 'Revenue goals help determine the right growth strategies.',
            required: false
          },
          {
            id: 'team_size',
            question: 'What\'s your team size?',
            type: 'single-choice' as const,
            fieldName: 'teamSize',
            explanation: 'Team size affects delegation and scaling strategies.',
            required: false,
            options: [
              { id: 'solo', label: 'Just me', value: 'solo' },
              { id: 'small', label: '2-5 people', value: 'small' },
              { id: 'medium', label: '6-20 people', value: 'medium' },
              { id: 'large', label: 'More than 20 people', value: 'large' }
            ]
          },
          {
            id: 'current_challenges',
            question: 'What are your current business challenges?',
            type: 'multiple-choice' as const,
            fieldName: 'currentChallenges',
            explanation: 'Understanding challenges helps prioritize solutions.',
            required: false,
            options: [
              { id: 'pricing', label: 'Pricing strategy', value: 'pricing' },
              { id: 'marketing', label: 'Marketing', value: 'marketing' },
              { id: 'time_management', label: 'Time management', value: 'time_management' },
              { id: 'competition', label: 'Competition', value: 'competition' },
              { id: 'customer_acquisition', label: 'Customer acquisition', value: 'customer_acquisition' },
              { id: 'financial_management', label: 'Financial management', value: 'financial_management' },
              { id: 'technology', label: 'Technology', value: 'technology' },
              { id: 'legal_issues', label: 'Legal aspects', value: 'legal_issues' }
            ]
          },
          {
            id: 'sales_channels',
            question: 'Where do you currently sell?',
            type: 'multiple-choice' as const,
            fieldName: 'salesChannels',
            explanation: 'Current sales channels help identify expansion opportunities.',
            required: false,
            options: [
              { id: 'instagram', label: 'Instagram', value: 'instagram' },
              { id: 'facebook', label: 'Facebook', value: 'facebook' },
              { id: 'whatsapp', label: 'WhatsApp', value: 'whatsapp' },
              { id: 'website', label: 'Website', value: 'website' },
              { id: 'marketplace', label: 'Marketplace', value: 'marketplace' },
              { id: 'physical_store', label: 'Physical store', value: 'physical_store' },
              { id: 'word_of_mouth', label: 'Word of mouth', value: 'word_of_mouth' }
            ]
          },
          {
            id: 'primary_skills',
            question: 'What are your primary skills?',
            type: 'multiple-choice' as const,
            fieldName: 'primarySkills',
            explanation: 'Skills help identify what you can leverage vs. what you need help with.',
            required: false,
            options: [
              { id: 'design', label: 'Design', value: 'design' },
              { id: 'programming', label: 'Programming', value: 'programming' },
              { id: 'marketing', label: 'Marketing', value: 'marketing' },
              { id: 'sales', label: 'Sales', value: 'sales' },
              { id: 'finance', label: 'Finance', value: 'finance' },
              { id: 'leadership', label: 'Leadership', value: 'leadership' },
              { id: 'communication', label: 'Communication', value: 'communication' },
              { id: 'project_management', label: 'Project Management', value: 'project_management' }
            ]
          }
        ]
      },
      {
        id: 'challenges_goals',
        title: 'Challenges & Vision',
        subtitle: 'What\'s holding you back and where you want to go',
        agentMessage: "Finally, let's identify your biggest challenges and understand your goals. This helps me prioritize the most impactful recommendations.",
        strategicContext: "Understanding obstacles and goals helps me create a personalized action plan and recommend the right support level.",
        questions: [
          {
            id: 'main_obstacles',
            question: 'What are your biggest obstacles right now?',
            type: 'multiple-choice' as const,
            fieldName: 'mainObstacles',
            explanation: 'Identifying specific challenges helps me create targeted solutions.',
            required: true,
            options: [
              { id: 'time', label: 'Not enough time', value: 'time' },
              { id: 'money', label: 'Limited budget', value: 'money' },
              { id: 'knowledge', label: 'Don\'t know where to start', value: 'knowledge' },
              { id: 'confidence', label: 'Lack of confidence', value: 'confidence' },
              { id: 'customers', label: 'Finding customers', value: 'customers' },
              { id: 'pricing', label: 'Setting the right prices', value: 'pricing' },
              { id: 'competition', label: 'Too much competition', value: 'competition' },
              { id: 'technology', label: 'Technical challenges', value: 'technology' }
            ]
          },
          {
            id: 'urgency_level',
            question: 'How urgent do these obstacles feel?',
            type: 'slider' as const,
            fieldName: 'urgencyLevel',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Urgency level helps me prioritize which obstacles to tackle first.',
            required: true
          },
          {
            id: 'business_goals',
            question: 'What are your main business goals?',
            type: 'multiple-choice' as const,
            fieldName: 'businessGoals',
            explanation: 'Your goals determine the type and intensity of support you\'ll need.',
            required: true,
            options: [
              { id: 'increase_revenue', label: 'Increase revenue', value: 'increase_revenue' },
              { id: 'scale_operations', label: 'Scale operations', value: 'scale_operations' },
              { id: 'automate_processes', label: 'Automate processes', value: 'automate_processes' },
              { id: 'expand_market', label: 'Expand market', value: 'expand_market' },
              { id: 'improve_efficiency', label: 'Improve efficiency', value: 'improve_efficiency' },
              { id: 'build_brand', label: 'Build brand', value: 'build_brand' },
              { id: 'reduce_costs', label: 'Reduce costs', value: 'reduce_costs' }
            ]
          },
          {
            id: 'support_preference',
            question: 'What kind of support do you prefer?',
            type: 'single-choice' as const,
            fieldName: 'supportPreference',
            explanation: 'This helps me recommend the right balance of guidance, tools, and automation.',
            required: true,
            options: [
              { id: 'hands_on', label: 'Hands-on guidance', value: 'hands_on', description: 'I want detailed help with everything' },
              { id: 'strategic', label: 'Strategic direction', value: 'strategic', description: 'Give me the plan, I\'ll execute' },
              { id: 'tools', label: 'Tools and resources', value: 'tools', description: 'I need better systems and tools' },
              { id: 'minimal', label: 'Minimal intervention', value: 'minimal', description: 'Just point me in the right direction' }
            ]
          }
        ]
      }
    ],
    es: [
      {
        id: 'business_fundamentals',
        title: 'Tu Negocio',
        subtitle: 'Entendiendo a qué te dedicas',
        agentMessage: "¡Hola! Soy tu agente de crecimiento personalizado. Comencemos entendiendo tu negocio para poder darte los consejos más relevantes.",
        strategicContext: "Esta información me ayuda a identificar tu tipo de negocio, nivel de experiencia y desafíos actuales para darte recomendaciones personalizadas.",
        questions: [
          {
            id: 'business_description',
            question: '¿A qué te dedicas? Describe tu negocio en detalle - qué haces, a quién ayudas, y qué te hace único?',
            type: 'text-input' as const,
            fieldName: 'businessDescription',
            placeholder: 'Ej: Pinto chaquetas de cuero personalizadas con diseños únicos para motociclistas. Me especializo en arte pintado a mano que cuenta historias personales...',
            explanation: 'Mientras más específico seas, mejor podré entender tu negocio y crear recomendaciones personalizadas.',
            required: true
          },
          {
            id: 'brand_name',
            question: '¿Cuál es el nombre de tu marca o negocio?',
            type: 'text-input' as const,
            fieldName: 'brandName',
            placeholder: 'Ej: LeatherArt Custom, Mi Consultoría...',
            explanation: 'El nombre de tu marca ayuda a personalizar las recomendaciones.',
            required: false
          },
          {
            id: 'industry_category',
            question: '¿Qué categoría describe mejor tu trabajo?',
            type: 'single-choice' as const,
            fieldName: 'industry',
            explanation: 'Diferentes industrias tienen diferentes patrones de crecimiento y desafíos.',
            required: true,
            options: [
              { id: 'creative', label: 'Creativo y Artesanal', value: 'creative', description: 'Arte, manualidades, diseño, fotografía' },
              { id: 'services', label: 'Servicios y Consultoría', value: 'services', description: 'Coaching, consultoría, freelancing' },
              { id: 'retail', label: 'Retail y Comercio', value: 'retail', description: 'Venta de productos, e-commerce' },
              { id: 'tech', label: 'Tecnología', value: 'tech', description: 'Software, apps, productos digitales' },
              { id: 'education', label: 'Educación y Capacitación', value: 'education', description: 'Enseñanza, cursos, talleres' },
              { id: 'other', label: 'Otro', value: 'other', description: 'Algo diferente' }
            ]
          },
          {
            id: 'experience_level',
            question: '¿Cómo describirías tu nivel de experiencia?',
            type: 'single-choice' as const,
            fieldName: 'experience',
            explanation: 'Esto me ayuda a ajustar mis recomendaciones a tu nivel actual.',
            required: true,
            options: [
              { id: 'just_starting', label: 'Recién empezando', value: 'just_starting', description: 'Nuevo en el emprendimiento' },
              { id: 'some_experience', label: 'Algo de experiencia', value: 'some_experience', description: 'He intentado algunas cosas' },
              { id: 'experienced', label: 'Experimentado', value: 'experienced', description: 'Llevo tiempo haciendo esto' },
              { id: 'expert', label: 'Experto', value: 'expert', description: 'Muy experimentado en emprendimiento' }
            ]
          }
        ]
      },
      {
        id: 'target_market',
        title: 'Tus Clientes',
        subtitle: 'Entendiendo a quién sirves',
        agentMessage: "¡Excelente! Ahora déjame entender mejor tu mercado. Conocer a tus clientes es crucial para hacer crecer tu negocio efectivamente.",
        strategicContext: "La claridad sobre tus clientes impacta directamente la efectividad de tu marketing y estrategia de precios.",
        questions: [
          {
            id: 'target_audience',
            question: '¿A quién sirves principalmente?',
            type: 'single-choice' as const,
            fieldName: 'targetAudience',
            explanation: 'Diferentes audiencias requieren diferentes enfoques. B2C necesita estrategias diferentes a B2B.',
            required: true,
            options: [
              { id: 'individuals', label: 'Consumidores Individuales (B2C)', value: 'individuals', description: 'Personas regulares comprando para sí mismas' },
              { id: 'businesses', label: 'Otros Negocios (B2B)', value: 'businesses', description: 'Empresas u organizaciones' },
              { id: 'both', label: 'Ambos', value: 'both', description: 'Sirvo tanto a individuos como empresas' },
              { id: 'unclear', label: 'No estoy seguro aún', value: 'unclear', description: 'Todavía estoy descubriendo esto' }
            ]
          },
          {
            id: 'customer_clarity',
            question: '¿Qué tan bien conoces a tu cliente ideal?',
            type: 'slider' as const,
            fieldName: 'customerClarity',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Entender profundamente a tu cliente es crucial para marketing efectivo y desarrollo de productos.',
            required: true
          },
          {
            id: 'main_activities',
            question: '¿Qué actividades o servicios específicos ofreces?',
            type: 'multiple-choice' as const,
            fieldName: 'activities',
            explanation: 'Esto me ayuda a entender el alcance y naturaleza de tus ofertas.',
            required: false,
            options: [
              { id: 'design', label: 'Diseño y Trabajo Creativo', value: 'design' },
              { id: 'consulting', label: 'Consultoría y Asesoría', value: 'consulting' },
              { id: 'teaching', label: 'Enseñanza y Capacitación', value: 'teaching' },
              { id: 'manufacturing', label: 'Fabricación/Manufactura', value: 'manufacturing' },
              { id: 'selling', label: 'Retail/Ventas', value: 'selling' },
              { id: 'services', label: 'Servicios Personales', value: 'services' }
            ]
          }
        ]
      },
      {
        id: 'business_maturity',
        title: 'Realidad del Negocio',
        subtitle: 'Tu situación actual',
        agentMessage: "Hablemos de dónde estás ahora mismo. Necesito entender la madurez actual de tu negocio para darte los próximos pasos correctos.",
        strategicContext: "Tu historial de ventas y estructura de negocio determinan si necesitas estrategias de validación o de escalamiento.",
        questions: [
          {
            id: 'has_sold',
            question: '¿Ya has hecho ventas?',
            type: 'yes-no' as const,
            fieldName: 'hasSold',
            explanation: 'Hacer tu primera venta es un hito importante que cambia toda tu estrategia de crecimiento.',
            required: true
          },
          {
            id: 'sales_consistency',
            question: '¿Con qué frecuencia haces ventas?',
            type: 'single-choice' as const,
            fieldName: 'salesConsistency',
            explanation: 'Las ventas consistentes indican validación del mercado y madurez del negocio.',
            required: true,
            options: [
              { id: 'never', label: 'Nunca he vendido nada aún', value: 'never' },
              { id: 'rarely', label: 'Muy raramente', value: 'rarely' },
              { id: 'occasionally', label: 'Ocasionalmente', value: 'occasionally' },
              { id: 'regularly', label: 'Regularmente', value: 'regularly' },
              { id: 'consistently', label: 'Muy consistentemente', value: 'consistently' }
            ]
          },
          {
            id: 'pricing_method',
            question: '¿Cómo estableces tus precios?',
            type: 'single-choice' as const,
            fieldName: 'pricingMethod',
            explanation: 'Tu método de precios afecta la rentabilidad y escalabilidad.',
            required: true,
            options: [
              { id: 'hourly', label: 'Por hora', value: 'hourly', description: 'Cobro por hora trabajada' },
              { id: 'project', label: 'Precios fijos por proyecto', value: 'project', description: 'Un precio por proyecto completo' },
              { id: 'product', label: 'Por producto/artículo', value: 'product', description: 'Cada artículo tiene su propio precio' },
              { id: 'subscription', label: 'Mensual/recurrente', value: 'subscription', description: 'Los clientes pagan regularmente' },
              { id: 'no_system', label: 'No tengo un sistema claro aún', value: 'no_system', description: 'Todavía estoy descubriendo esto' }
            ]
          },
          {
            id: 'profit_clarity',
            question: '¿Qué tan claro tienes tus ganancias reales?',
            type: 'slider' as const,
            fieldName: 'profitClarity',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Entender la rentabilidad es esencial para decisiones inteligentes de negocio.',
            required: true
          }
        ]
      },
      {
        id: 'team_operations',
        title: 'Tu Equipo y Operaciones',
        subtitle: 'Cómo trabajas',
        agentMessage: "Entender la estructura de tu equipo y operaciones me ayuda a recomendar el nivel correcto de apoyo y estrategias de delegación.",
        strategicContext: "La estructura de tu equipo afecta la priorización de tareas, estrategias de crecimiento y oportunidades de delegación.",
        questions: [
          {
            id: 'team_structure',
            question: '¿Trabajas solo o con otros?',
            type: 'single-choice' as const,
            fieldName: 'teamStructure',
            explanation: 'La estructura de tu equipo determina qué puedes delegar y qué tan rápido puedes escalar.',
            required: true,
            options: [
              { id: 'solo', label: 'Solo yo', value: 'solo', description: 'Manejo todo yo mismo' },
              { id: 'partner', label: 'Con un socio', value: 'partner', description: 'Tengo un colaborador principal' },
              { id: 'small_team', label: 'Equipo pequeño (3-5 personas)', value: 'small_team', description: 'Tenemos un grupo pequeño' },
              { id: 'larger_team', label: 'Equipo más grande (6+ personas)', value: 'larger_team', description: 'Tenemos una organización más grande' }
            ]
          },
          {
            id: 'delegation_comfort',
            question: '¿Qué tan cómodo te sientes delegando tareas?',
            type: 'slider' as const,
            fieldName: 'delegationComfort',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'Las habilidades de delegación son cruciales para escalar más allá de ti mismo.',
            required: true
          },
          {
            id: 'promotion_channels',
            question: '¿Dónde promocionas actualmente tu trabajo?',
            type: 'multiple-choice' as const,
            fieldName: 'promotionChannels',
            explanation: 'Entender tus canales actuales ayuda a identificar brechas y oportunidades.',
            required: true,
            options: [
              { id: 'social_media', label: 'Redes Sociales', value: 'social_media' },
              { id: 'word_of_mouth', label: 'Boca a Boca', value: 'word_of_mouth' },
              { id: 'website', label: 'Mi Sitio Web', value: 'website' },
              { id: 'referrals', label: 'Referencias', value: 'referrals' },
              { id: 'advertising', label: 'Publicidad Pagada', value: 'advertising' },
              { id: 'networking', label: 'Eventos de Networking', value: 'networking' },
              { id: 'nowhere', label: 'En ningún lado realmente', value: 'nowhere' }
            ]
          },
          {
            id: 'marketing_confidence',
            question: '¿Qué tan confiado te sientes promocionándote?',
            type: 'slider' as const,
            fieldName: 'marketingConfidence',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'La confianza en marketing afecta qué tan efectivamente puedes promocionar tu negocio.',
            required: true
          }
        ]
      },
      {
        id: 'business_profile_details',
        title: 'Detalles del Negocio',
        subtitle: 'Información adicional para personalizar tu experiencia',
        agentMessage: "Recopilemos algunos detalles adicionales sobre tu negocio para hacer mis recomendaciones aún más personalizadas.",
        strategicContext: "Estos detalles ayudan a crear un perfil completo de negocio para recomendaciones óptimas de tareas y agentes.",
        questions: [
          {
            id: 'business_location',
            question: '¿Dónde está ubicado tu negocio?',
            type: 'text-input' as const,
            fieldName: 'businessLocation',
            placeholder: 'Ciudad, País',
            explanation: 'La ubicación afecta las oportunidades de mercado y estrategias.',
            required: false
          },
          {
            id: 'years_in_business',
            question: '¿Cuántos años llevas en el negocio?',
            type: 'slider' as const,
            fieldName: 'yearsInBusiness',
            min: 0,
            max: 20,
            step: 1,
            explanation: 'El nivel de experiencia afecta el tipo de consejo que necesitas.',
            required: false
          },
          {
            id: 'monthly_revenue_goal',
            question: '¿Cuál es tu meta de ingresos mensuales? (en USD)',
            type: 'slider' as const,
            fieldName: 'monthlyRevenueGoal',
            min: 500,
            max: 50000,
            step: 500,
            explanation: 'Las metas de ingresos ayudan a determinar las estrategias de crecimiento correctas.',
            required: false
          },
          {
            id: 'team_size',
            question: '¿Cuál es el tamaño de tu equipo?',
            type: 'single-choice' as const,
            fieldName: 'teamSize',
            explanation: 'El tamaño del equipo afecta las estrategias de delegación y escalamiento.',
            required: false,
            options: [
              { id: 'solo', label: 'Solo yo', value: 'solo' },
              { id: 'small', label: '2-5 personas', value: 'small' },
              { id: 'medium', label: '6-20 personas', value: 'medium' },
              { id: 'large', label: 'Más de 20 personas', value: 'large' }
            ]
          },
          {
            id: 'current_challenges',
            question: '¿Cuáles son tus desafíos actuales de negocio?',
            type: 'multiple-choice' as const,
            fieldName: 'currentChallenges',
            explanation: 'Entender los desafíos ayuda a priorizar soluciones.',
            required: false,
            options: [
              { id: 'pricing', label: 'Estrategia de precios', value: 'pricing' },
              { id: 'marketing', label: 'Marketing', value: 'marketing' },
              { id: 'time_management', label: 'Gestión del tiempo', value: 'time_management' },
              { id: 'competition', label: 'Competencia', value: 'competition' },
              { id: 'customer_acquisition', label: 'Adquisición de clientes', value: 'customer_acquisition' },
              { id: 'financial_management', label: 'Gestión financiera', value: 'financial_management' },
              { id: 'technology', label: 'Tecnología', value: 'technology' },
              { id: 'legal_issues', label: 'Aspectos legales', value: 'legal_issues' }
            ]
          },
          {
            id: 'sales_channels',
            question: '¿Dónde vendes actualmente?',
            type: 'multiple-choice' as const,
            fieldName: 'salesChannels',
            explanation: 'Los canales de venta actuales ayudan a identificar oportunidades de expansión.',
            required: false,
            options: [
              { id: 'instagram', label: 'Instagram', value: 'instagram' },
              { id: 'facebook', label: 'Facebook', value: 'facebook' },
              { id: 'whatsapp', label: 'WhatsApp', value: 'whatsapp' },
              { id: 'website', label: 'Sitio Web', value: 'website' },
              { id: 'marketplace', label: 'Marketplace', value: 'marketplace' },
              { id: 'physical_store', label: 'Tienda física', value: 'physical_store' },
              { id: 'word_of_mouth', label: 'Boca a boca', value: 'word_of_mouth' }
            ]
          },
          {
            id: 'primary_skills',
            question: '¿Cuáles son tus habilidades principales?',
            type: 'multiple-choice' as const,
            fieldName: 'primarySkills',
            explanation: 'Las habilidades ayudan a identificar qué puedes aprovechar vs. en qué necesitas ayuda.',
            required: false,
            options: [
              { id: 'design', label: 'Diseño', value: 'design' },
              { id: 'programming', label: 'Programación', value: 'programming' },
              { id: 'marketing', label: 'Marketing', value: 'marketing' },
              { id: 'sales', label: 'Ventas', value: 'sales' },
              { id: 'finance', label: 'Finanzas', value: 'finance' },
              { id: 'leadership', label: 'Liderazgo', value: 'leadership' },
              { id: 'communication', label: 'Comunicación', value: 'communication' },
              { id: 'project_management', label: 'Gestión de Proyectos', value: 'project_management' }
            ]
          }
        ]
      },
      {
        id: 'challenges_goals',
        title: 'Desafíos y Visión',
        subtitle: 'Qué te detiene y hacia dónde quieres ir',
        agentMessage: "Finalmente, identifiquemos tus mayores desafíos y entendamos tus metas. Esto me ayuda a priorizar las recomendaciones más impactantes.",
        strategicContext: "Entender obstáculos y metas me ayuda a crear un plan de acción personalizado y recomendar el nivel correcto de apoyo.",
        questions: [
          {
            id: 'main_obstacles',
            question: '¿Cuáles son tus mayores obstáculos ahora mismo?',
            type: 'multiple-choice' as const,
            fieldName: 'mainObstacles',
            explanation: 'Identificar desafíos específicos me ayuda a crear soluciones dirigidas.',
            required: true,
            options: [
              { id: 'time', label: 'No tengo suficiente tiempo', value: 'time' },
              { id: 'money', label: 'Presupuesto limitado', value: 'money' },
              { id: 'knowledge', label: 'No sé por dónde empezar', value: 'knowledge' },
              { id: 'confidence', label: 'Falta de confianza', value: 'confidence' },
              { id: 'customers', label: 'Encontrar clientes', value: 'customers' },
              { id: 'pricing', label: 'Establecer precios correctos', value: 'pricing' },
              { id: 'competition', label: 'Demasiada competencia', value: 'competition' },
              { id: 'technology', label: 'Desafíos técnicos', value: 'technology' }
            ]
          },
          {
            id: 'urgency_level',
            question: '¿Qué tan urgentes se sienten estos obstáculos?',
            type: 'slider' as const,
            fieldName: 'urgencyLevel',
            min: 1,
            max: 5,
            step: 1,
            explanation: 'El nivel de urgencia me ayuda a priorizar qué obstáculos abordar primero.',
            required: true
          },
          {
            id: 'business_goals',
            question: '¿Cuáles son tus principales metas de negocio?',
            type: 'multiple-choice' as const,
            fieldName: 'businessGoals',
            explanation: 'Tus metas determinan el tipo e intensidad de apoyo que necesitarás.',
            required: true,
            options: [
              { id: 'increase_revenue', label: 'Aumentar ingresos', value: 'increase_revenue' },
              { id: 'scale_operations', label: 'Escalar operaciones', value: 'scale_operations' },
              { id: 'automate_processes', label: 'Automatizar procesos', value: 'automate_processes' },
              { id: 'expand_market', label: 'Expandir mercado', value: 'expand_market' },
              { id: 'improve_efficiency', label: 'Mejorar eficiencia', value: 'improve_efficiency' },
              { id: 'build_brand', label: 'Construir marca', value: 'build_brand' },
              { id: 'reduce_costs', label: 'Reducir costos', value: 'reduce_costs' }
            ]
          },
          {
            id: 'support_preference',
            question: '¿Qué tipo de apoyo prefieres?',
            type: 'single-choice' as const,
            fieldName: 'supportPreference',
            explanation: 'Esto me ayuda a recomendar el equilibrio correcto de orientación, herramientas y automatización.',
            required: true,
            options: [
              { id: 'hands_on', label: 'Orientación práctica', value: 'hands_on', description: 'Quiero ayuda detallada con todo' },
              { id: 'strategic', label: 'Dirección estratégica', value: 'strategic', description: 'Dame el plan, yo lo ejecuto' },
              { id: 'tools', label: 'Herramientas y recursos', value: 'tools', description: 'Necesito mejores sistemas y herramientas' },
              { id: 'minimal', label: 'Intervención mínima', value: 'minimal', description: 'Solo apúntame en la dirección correcta' }
            ]
          }
        ]
      }
    ]
  };

  return blocks[language] || blocks.en;
};
