import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useArtisanShop } from '@/hooks/useArtisanShop';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Store, Sparkles, ArrowRight, MessageCircle, Bot, User, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationalMessage {
  id: string;
  type: 'coordinator' | 'user';
  content: string;
  data?: any;
  timestamp: Date;
  isTyping?: boolean;
}

interface ShopCreationState {
  phase: 'conversing' | 'creating' | 'complete';
  shopData: any;
  conversation: ConversationalMessage[];
  currentQuestion: string;
  questionIndex: number;
  isCoordinatorThinking?: boolean;
}

interface ConversationalShopCreationProps {
  existingShop?: any;
}

export const ConversationalShopCreation: React.FC<ConversationalShopCreationProps> = ({ existingShop }) => {
  const [state, setState] = useState<ShopCreationState>(() => {
    // If continuing existing shop, load its data and start from appropriate step
    if (existingShop) {
      return {
        phase: 'conversing',
        shopData: {
          shop_name: existingShop.shop_name || '',
          description: existingShop.description || '',
          craft_type: existingShop.craft_type || '',
          region: existingShop.region || '',
        },
        conversation: [{
          id: 'initial',
          type: 'coordinator',
          content: `¡Hola de nuevo! Veo que ya habías empezado a crear tu tienda "${existingShop.shop_name || 'sin nombre'}". Continuemos desde donde nos quedamos.`,
          timestamp: new Date()
        }],
        currentQuestion: 'shop_name',
        questionIndex: existingShop.creation_step || 0,
        isCoordinatorThinking: false,
      };
    }
    
    // New shop creation
    return {
      phase: 'conversing',
      shopData: {},
      conversation: [{
        id: 'initial',
        type: 'coordinator',
        content: '¡Hola! 🎯 Soy tu Coordinador Maestro. Voy a crear tu tienda digital en 3 simples pasos. ¿Cuál es el nombre de tu tienda?',
        timestamp: new Date()
      }],
      currentQuestion: 'shop_name',
      questionIndex: 0,
      isCoordinatorThinking: false,
    };
  });
  
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createShop, updateShopProgress } = useArtisanShop();

  // Define the 3 essential questions
  const questions = [
    {
      key: 'shop_name',
      text: '¿Cuál es el nombre de tu tienda?',
      suggestions: ['Artesanías Luna', 'Taller Creativo', 'Mi Marca Artesanal'],
      examples: '💡 Ejemplo: "Tejidos Colombia", "Cerámica Bella", "Cueros del Valle"'
    },
    {
      key: 'products',
      text: '¿Qué productos específicos vendes?',
      suggestions: ['Collares y aretes', 'Bolsos de cuero', 'Cerámicas decorativas', 'Textiles tejidos'],
      examples: '💡 Sé específico: "collares de semillas", "bolsos de cuero", "macetas de barro"'
    },
    {
      key: 'location',
      text: '¿En qué ciudad estás ubicado?',
      suggestions: ['Bogotá', 'Medellín', 'Cartagena', 'Cali'],
      examples: '💡 Esto nos ayuda a configurar los envíos correctamente'
    }
  ];

  const createShopAutomatically = async (shopData: any) => {
    setState(prev => ({
      ...prev,
      phase: 'creating',
      conversation: [...prev.conversation, {
        id: Date.now().toString(),
        type: 'coordinator',
        content: '✨ Perfecto! Tengo toda la información necesaria. Estoy creando tu tienda digital ahora...',
        timestamp: new Date()
      }]
    }));

    try {
      let result;
      if (existingShop) {
        // Update existing shop
        result = await updateShopProgress(existingShop.id, {
          shop_name: shopData.shop_name,
          description: shopData.description,
          story: shopData.story,
          craft_type: shopData.craft_type,
          region: shopData.region,
          contact_info: shopData.contact_info,
          social_links: shopData.social_links,
        }, 'complete', 0);
      } else {
        // Create new shop
        result = await createShop({
          shop_name: shopData.shop_name,
          description: shopData.description,
          story: shopData.story,
          craft_type: shopData.craft_type,
          region: shopData.region,
          contact_info: shopData.contact_info,
          social_links: shopData.social_links,
        });
      }

      setState(prev => ({
        ...prev,
        phase: 'complete',
        conversation: [...prev.conversation, {
          id: Date.now().toString(),
          type: 'coordinator',
          content: '🎉 ¡Listo! Tu tienda digital ha sido creada exitosamente. Ahora puedes ir al dashboard para gestionarla o empezar a cargar productos.',
          timestamp: new Date()
        }]
      }));

      toast({
        title: "¡Tienda creada!",
        description: "Tu tienda digital está lista.",
      });

    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear tu tienda. Intentémoslo de nuevo.",
        variant: "destructive"
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.conversation]);

  // Fast typing animation for quick flow
  const simulateTyping = async (text: string, callback: () => void) => {
    setState(prev => ({ ...prev, isCoordinatorThinking: true }));
    setTypingText('');
    
    // Fast typing - 10ms per character maximum
    for (let i = 0; i <= text.length; i++) {
      setTypingText(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setState(prev => ({ ...prev, isCoordinatorThinking: false }));
    setTypingText('');
    callback();
  };

  // Get current question suggestions
  const getCurrentSuggestions = () => {
    return questions[state.questionIndex]?.suggestions || [];
  };

  const handleUserResponse = async (response: string) => {
    if (!response.trim()) return;

    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage: ConversationalMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: response,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      conversation: [...prev.conversation, userMessage]
    }));

    // Update shop data based on current question
    const updatedShopData = { ...state.shopData };
    const currentQ = questions[state.questionIndex];
    
    if (currentQ.key === 'shop_name') {
      updatedShopData.shop_name = response.trim();
    } else if (currentQ.key === 'products') {
      updatedShopData.description = response.trim();
      updatedShopData.craft_type = detectCraftTypeFromText(response);
    } else if (currentQ.key === 'location') {
      updatedShopData.region = response.trim();
    }

    // Check if we have more questions
    const nextIndex = state.questionIndex + 1;
    
    if (nextIndex < questions.length) {
      // Move to next question
      const nextQuestion = questions[nextIndex];
      
      await simulateTyping(`✅ Perfecto! ${nextQuestion.text}`, () => {
        const coordinatorMessage: ConversationalMessage = {
          id: (Date.now() + 1).toString(),
          type: 'coordinator',
          content: `✅ Perfecto! ${nextQuestion.text}\n\n${nextQuestion.examples}`,
          timestamp: new Date()
        };

        setState(prev => ({
          ...prev,
          conversation: [...prev.conversation, coordinatorMessage],
          shopData: updatedShopData,
          currentQuestion: nextQuestion.key,
          questionIndex: nextIndex
        }));
        
        setQuickReplies(nextQuestion.suggestions);
        setShowSuggestions(true);
      });
    } else {
      // All questions answered - create shop
      const finalShopData = {
        ...updatedShopData,
        story: `Somos ${updatedShopData.shop_name}, especialistas en ${updatedShopData.description} desde ${updatedShopData.region}. Cada producto está hecho con amor y tradición artesanal colombiana.`,
        contact_info: { email: user?.email },
        social_links: {}
      };

      await simulateTyping('🎉 ¡Excelente! Ya tengo toda la información. Creando tu tienda digital...', () => {
        const coordinatorMessage: ConversationalMessage = {
          id: (Date.now() + 1).toString(),
          type: 'coordinator',
          content: '🎉 ¡Excelente! Ya tengo toda la información. Creando tu tienda digital...',
          timestamp: new Date()
        };

        setState(prev => ({
          ...prev,
          conversation: [...prev.conversation, coordinatorMessage],
          shopData: finalShopData
        }));
        
        setTimeout(() => createShopAutomatically(finalShopData), 1000);
      });
    }

    setIsProcessing(false);
    setUserInput('');
  };

  // Simple craft type detection
  const detectCraftTypeFromText = (text: string): string => {
    const craftTypes: Record<string, string[]> = {
      'textiles': ['tejido', 'tela', 'lana', 'algodón', 'bordado', 'tapiz'],
      'ceramica': ['cerámica', 'barro', 'arcilla', 'maceta', 'vasija'],
      'joyeria': ['collar', 'arete', 'pulsera', 'anillo', 'joya', 'plata'],
      'cuero': ['cuero', 'bolso', 'cartera', 'cinturón', 'marroquinería'],
      'madera': ['madera', 'tallado', 'mueble', 'decorativo']
    };

    const lowerText = text.toLowerCase();
    for (const [type, keywords] of Object.entries(craftTypes)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return type;
      }
    }
    return 'artesanias';
  };


  const renderConversationPhase = () => (
    <div className="space-y-6">
      {/* Conversation Display */}
      <div className="space-y-4 max-h-96 overflow-y-auto px-2" style={{ scrollBehavior: 'smooth' }}>
        <AnimatePresence mode="popLayout">
          {state.conversation.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div 
                className={`max-w-[85%] rounded-2xl ${
                  message.type === 'coordinator' 
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border border-purple-200/50 dark:border-purple-800/50' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg ml-auto'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {message.type === 'coordinator' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    {message.type === 'user' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 order-2"
                      >
                        <User className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    <div className={message.type === 'user' ? 'order-1' : ''}>
                      <p className={`font-semibold text-sm mb-1 ${
                        message.type === 'coordinator' 
                          ? 'text-purple-800 dark:text-purple-200' 
                          : 'text-white/90'
                      }`}>
                        {message.type === 'coordinator' ? '🎯 Coordinador Maestro' : '👤 Tú'}
                      </p>
                      <motion.p 
                        className={`leading-relaxed ${
                          message.type === 'coordinator' 
                            ? 'text-gray-700 dark:text-gray-200' 
                            : 'text-white'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {message.content}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Coordinator thinking indicator */}
        <AnimatePresence>
          {state.isCoordinatorThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border border-purple-200/50 dark:border-purple-800/50 rounded-2xl p-4 max-w-[85%]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-purple-800 dark:text-purple-200 mb-1">
                      🎯 Coordinador Maestro
                    </p>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <span>{typingText}</span>
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-4 bg-purple-500 inline-block"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={conversationEndRef} />
      </div>

      {/* Quick Reply Suggestions */}
      <AnimatePresence>
        {showSuggestions && quickReplies.length > 0 && !state.isCoordinatorThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <p className="text-sm text-muted-foreground mb-2 w-full">✨ Sugerencias rápidas:</p>
            {quickReplies.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setUserInput(suggestion);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full text-sm border border-purple-200/50 dark:border-purple-800/50 hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Input */}
      <motion.div 
        className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 border shadow-sm relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 0.5, 1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${50}%`,
              }}
            />
          ))}
        </div>

        <div className="flex gap-3 relative z-10">
          <div className="flex-1 relative">
            <Textarea
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                if (showSuggestions && e.target.value.length > 0) {
                  setShowSuggestions(false);
                }
              }}
              placeholder="💬 Escribe tu respuesta aquí... (Enter para enviar)"
              className="border-0 resize-none bg-transparent focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-400"
              rows={2}
              disabled={isProcessing || state.isCoordinatorThinking}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleUserResponse(userInput);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {userInput.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-2 right-2 text-xs text-gray-400"
              >
                Enter ↵
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleUserResponse(userInput)}
              disabled={!userInput.trim() || isProcessing || state.isCoordinatorThinking}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg h-auto px-6 py-3"
            >
              {isProcessing || state.isCoordinatorThinking ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const renderCreatingPhase = () => (
    <div className="text-center py-12 relative">
      {/* Advanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full opacity-40"
            style={{
              background: `linear-gradient(45deg, 
                hsl(${240 + i * 10}, 70%, 60%), 
                hsl(${300 + i * 15}, 80%, 70%))`,
              left: `${10 + (i % 4) * 25}%`,
              top: `${20 + Math.floor(i / 4) * 25}%`,
            }}
            animate={{
              scale: [1, 1.5, 0.5, 1],
              opacity: [0.4, 0.8, 0.2, 0.4],
              rotate: [0, 180, 360],
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Main creation animation */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.3, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="mx-auto w-28 h-28 mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse" />
        <div className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-30 animate-ping" />
        <Store className="w-28 h-28 text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text relative z-10" style={{
          filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
        }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          ✨ Creando tu tienda digital con IA
        </h3>
        <div className="space-y-3 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-3 text-left"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
            />
            <span className="text-muted-foreground">Analizando tu información con IA...</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className="flex items-center gap-3 text-left"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
            <span className="text-muted-foreground">Generando descripción optimizada...</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 }}
            className="flex items-center gap-3 text-left"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
            />
            <span className="text-muted-foreground">Configurando tu perfil artesanal...</span>
          </motion.div>
        </div>
        <motion.p 
          className="text-lg text-muted-foreground mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          El Coordinador Maestro está trabajando su magia... 🪄
        </motion.p>
      </motion.div>
    </div>
  );


  const renderCompletePhase = () => (
    <div className="text-center py-12">
      <Store className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
      <h3 className="text-xl font-semibold mb-2">¡Tienda creada exitosamente!</h3>
      <p className="text-muted-foreground mb-6">
        Tu tienda digital está lista. ¿Qué quieres hacer ahora?
      </p>
      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => navigate('/dashboard')}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Store className="w-4 h-4 mr-2" />
          Ver mi dashboard
        </Button>
        
        <Button 
          variant="outline"
          size="lg" 
          onClick={() => navigate('/productos/subir')}
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Subir productos
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creación Inteligente de Tienda</h1>
        <p className="text-muted-foreground">
          El Coordinador Maestro te guiará para crear tu tienda digital perfecta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            {state.phase === 'conversing' && 'Conversación Rápida'}
            {state.phase === 'creating' && 'Creando tu Tienda'}
            {state.phase === 'complete' && '¡Tienda Creada!'}
          </CardTitle>
          <CardDescription>
            {state.phase === 'conversing' && '3 preguntas simples para crear tu tienda'}
            {state.phase === 'creating' && 'Configurando automáticamente tu tienda digital'}
            {state.phase === 'complete' && 'Tu tienda está lista. Sigamos con los productos.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.phase === 'conversing' && renderConversationPhase()}
          {state.phase === 'creating' && renderCreatingPhase()}
          {state.phase === 'complete' && renderCompletePhase()}
        </CardContent>
      </Card>
    </div>
  );
};