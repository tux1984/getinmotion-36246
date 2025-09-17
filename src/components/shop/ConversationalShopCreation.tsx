import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  phase: 'analyzing' | 'conversing' | 'creating' | 'complete';
  userProfile: any;
  shopData: any;
  missingInfo: string[];
  conversation: ConversationalMessage[];
  currentQuestion?: string;
  isCoordinatorThinking?: boolean;
}

export const ConversationalShopCreation: React.FC = () => {
  const [state, setState] = useState<ShopCreationState>({
    phase: 'analyzing',
    userProfile: null,
    shopData: {},
    missingInfo: [],
    conversation: [],
    currentQuestion: undefined,
    isCoordinatorThinking: false,
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

  // Initial analysis and profile loading with loop protection
  useEffect(() => {
    let isAnalyzing = false;
    let timeoutId: NodeJS.Timeout;

    const analyzeUserProfile = async () => {
      if (!user || isAnalyzing) return;
      
      isAnalyzing = true;
      console.log('Starting profile analysis for user:', user.id);
      
      // Set timeout to prevent infinite waiting
      timeoutId = setTimeout(() => {
        console.log('Analysis timeout - falling back to conversation mode');
        setState(prev => ({
          ...prev,
          phase: 'conversing',
          conversation: [{
            id: Date.now().toString(),
            type: 'coordinator',
            content: '¡Hola! Soy tu Coordinador Maestro. Vamos a crear tu tienda digital juntos. Para empezar, ¿cuál es el nombre de tu negocio?',
            timestamp: new Date()
          }],
          currentQuestion: 'business_name'
        }));
        isAnalyzing = false;
      }, 15000); // 15 second timeout

      try {
        // Call intelligent shop creation for analysis
        const { data: analysisResult, error } = await supabase.functions.invoke('create-intelligent-shop', {
          body: {
            userId: user.id,
            language: 'es',
            action: 'analyze_profile'
          }
        });

        clearTimeout(timeoutId);

        if (error || !analysisResult) {
          throw new Error(error?.message || 'Analysis failed');
        }

        if (analysisResult) {
          const initialMessage: ConversationalMessage = {
            id: Date.now().toString(),
            type: 'coordinator',
            content: analysisResult.coordinatorMessage || '¡Hola! Soy tu Coordinador Maestro. Voy a ayudarte a crear la tienda digital perfecta usando toda la información que ya tengo de ti.',
            timestamp: new Date()
          };

          setState(prev => ({
            ...prev,
            phase: analysisResult.needsMoreInfo ? 'conversing' : 'creating',
            userProfile: analysisResult.userContext,
            shopData: analysisResult.shopData || {},
            missingInfo: analysisResult.missingInfo || [],
            conversation: [initialMessage],
            currentQuestion: analysisResult.nextQuestion
          }));

          // If no missing info, proceed directly to creation
          if (!analysisResult.needsMoreInfo) {
            setTimeout(() => createShopAutomatically(analysisResult.shopData), 2000);
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error analyzing profile:', error);
        // Fallback to basic conversation
        setState(prev => ({
          ...prev,
          phase: 'conversing',
          conversation: [{
            id: Date.now().toString(),
            type: 'coordinator',
            content: '¡Hola! Soy tu Coordinador Maestro. Vamos a crear tu tienda digital juntos. Para empezar, ¿cuál es el nombre de tu negocio?',
            timestamp: new Date()
          }],
          currentQuestion: 'business_name'
        }));
      } finally {
        isAnalyzing = false;
      }
    };

    if (state.phase === 'analyzing' && !isAnalyzing) {
      analyzeUserProfile();
    }

    return () => {
      clearTimeout(timeoutId);
      isAnalyzing = false;
    };
  }, [user, state.phase]);

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
      const { error } = await supabase.from('artisan_shops').insert({
        user_id: user!.id,
        shop_name: shopData.shop_name,
        shop_slug: shopData.shop_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: shopData.description,
        story: shopData.story,
        craft_type: shopData.craft_type,
        region: shopData.region,
        contact_info: shopData.contact_info,
        social_links: shopData.social_links,
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        phase: 'complete',
        conversation: [...prev.conversation, {
          id: Date.now().toString(),
          type: 'coordinator',
          content: '🎉 ¡Listo! Tu tienda digital ha sido creada exitosamente. Ahora te voy a ayudar a cargar tus primeros productos con IA.',
          timestamp: new Date()
        }]
      }));

      toast({
        title: "¡Tienda creada!",
        description: "Tu tienda digital está lista. Ahora puedes agregar productos.",
      });

      // Redirect to product upload after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/artisan?flow=ai-product-upload');
      }, 3000);

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

  // Enhanced typing animation with realistic pauses
  const simulateTyping = async (text: string, callback: () => void) => {
    setState(prev => ({ ...prev, isCoordinatorThinking: true }));
    
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Type each character of the word
      for (let j = 0; j <= word.length; j++) {
        const partialWord = word.slice(0, j);
        const displayText = currentText + partialWord;
        setTypingText(displayText);
        
        // Variable speed: slower for punctuation, faster for letters
        const char = word[j];
        const delay = char && /[.,!?]/.test(char) ? 150 : 
                     char && /[áéíóúñü]/.test(char) ? 40 : 25;
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      currentText += word;
      if (i < words.length - 1) {
        currentText += ' ';
        setTypingText(currentText);
        
        // Pause between words (longer for punctuation)
        const lastChar = word[word.length - 1];
        const wordPause = /[.,!?]/.test(lastChar) ? 300 : 80;
        await new Promise(resolve => setTimeout(resolve, wordPause));
      }
    }
    
    // Final pause before showing complete message
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setState(prev => ({ ...prev, isCoordinatorThinking: false }));
    setTypingText('');
    callback();
  };

  // Generate contextual quick replies
  const generateQuickReplies = (currentQuestion?: string) => {
    const suggestions: Record<string, string[]> = {
      business_name: [
        'Artesanías [Tu Apellido]',
        '[Tu Nombre] Handmade',
        'Taller [Tu Especialidad]'
      ],
      business_description: [
        'Trabajo con cerámica tradicional',
        'Creo joyería artesanal en plata',
        'Tejo productos en lana virgen',
        'Trabajo cuero y marroquinería'
      ],
      business_location: [
        'Bogotá',
        'Medellín', 
        'Cartagena',
        'Cali',
        'Bucaramanga'
      ]
    };

    return suggestions[currentQuestion || ''] || [];
  };

  const handleUserResponse = async (response: string) => {
    if (!response.trim()) return;

    setIsProcessing(true);
    
    // Add user message to conversation with animation
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

    try {
      // Process response with Master Coordinator
      const { data: coordinatorResponse } = await supabase.functions.invoke('create-intelligent-shop', {
        body: {
          userId: user!.id,
          language: 'es',
          action: 'process_conversation',
          userResponse: response,
          currentQuestion: state.currentQuestion,
          conversationHistory: state.conversation,
          shopData: state.shopData
        }
      });

      if (coordinatorResponse) {
        // Generate contextual suggestions
        const suggestions = generateQuickReplies(coordinatorResponse.nextQuestion);
        setQuickReplies(suggestions);
        
        // Simulate typing with realistic delay and detect vague responses
        await simulateTyping(coordinatorResponse.message, () => {
          const coordinatorMessage: ConversationalMessage = {
            id: (Date.now() + 1).toString(),
            type: 'coordinator',
            content: coordinatorResponse.message,
            timestamp: new Date()
          };

          setState(prev => ({
            ...prev,
            conversation: [...prev.conversation, coordinatorMessage],
            shopData: { ...prev.shopData, ...coordinatorResponse.updatedShopData },
            currentQuestion: coordinatorResponse.nextQuestion
          }));
          
          // Show suggestions for next input if not ready to create
          if (!coordinatorResponse.readyToCreate) {
            setShowSuggestions(true);
          }
        });

        // If ready to create shop
        if (coordinatorResponse.readyToCreate) {
          setTimeout(() => createShopAutomatically(coordinatorResponse.finalShopData), 1500);
        }
      }
    } catch (error) {
      console.error('Error processing conversation:', error);
      const errorMessage: ConversationalMessage = {
        id: (Date.now() + 1).toString(),
        type: 'coordinator',
        content: 'Perdón, tuve un problema procesando tu respuesta. ¿Puedes intentar de nuevo?',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        conversation: [...prev.conversation, errorMessage]
      }));
    }

    setIsProcessing(false);
    setUserInput('');
  };

  const renderAnalyzingPhase = () => (
    <div className="text-center py-12">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="mx-auto w-20 h-20 mb-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 animate-pulse" />
        <Wand2 className="w-20 h-20 text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text" style={{
          filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))'
        }} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Analizando tu perfil
        </h3>
        <p className="text-muted-foreground text-lg">
          El Coordinador Maestro está revisando toda tu información para crear la tienda perfecta...
        </p>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 0.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + i * 5}%`,
            }}
          />
        ))}
      </div>
    </div>
  );

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
        Redirigiendo al asistente de carga de productos con IA...
      </p>
      <Button
        onClick={() => navigate('/dashboard/artisan?flow=ai-product-upload')}
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        <ArrowRight className="w-4 h-4 mr-2" />
        Continuar con Productos
      </Button>
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
            {state.phase === 'analyzing' && 'Analizando tu Perfil'}
            {state.phase === 'conversing' && 'Conversación Inteligente'}
            {state.phase === 'creating' && 'Creando tu Tienda'}
            {state.phase === 'complete' && '¡Tienda Creada!'}
          </CardTitle>
          <CardDescription>
            {state.phase === 'analyzing' && 'Revisando toda tu información para una configuración óptima'}
            {state.phase === 'conversing' && 'El Coordinador Maestro está recopilando la información necesaria'}
            {state.phase === 'creating' && 'Configurando automáticamente tu tienda digital'}
            {state.phase === 'complete' && 'Tu tienda está lista. Sigamos con los productos.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.phase === 'analyzing' && renderAnalyzingPhase()}
          {state.phase === 'conversing' && renderConversationPhase()}
          {state.phase === 'creating' && renderCreatingPhase()}
          {state.phase === 'complete' && renderCompletePhase()}
        </CardContent>
      </Card>
    </div>
  );
};