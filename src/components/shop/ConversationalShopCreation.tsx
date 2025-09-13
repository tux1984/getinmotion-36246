import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
// Master Coordinator integration will be added here
import { Loader2, Store, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationalMessage {
  id: string;
  type: 'coordinator' | 'user';
  content: string;
  data?: any;
  timestamp: Date;
}

interface ShopCreationState {
  phase: 'analyzing' | 'conversing' | 'creating' | 'complete';
  userProfile: any;
  shopData: any;
  missingInfo: string[];
  conversation: ConversationalMessage[];
  currentQuestion?: string;
}

export const ConversationalShopCreation: React.FC = () => {
  const [state, setState] = useState<ShopCreationState>({
    phase: 'analyzing',
    userProfile: null,
    shopData: {},
    missingInfo: [],
    conversation: [],
    currentQuestion: undefined,
  });
  
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initial analysis and profile loading
  useEffect(() => {
    const analyzeUserProfile = async () => {
      if (!user) return;

      try {
        // Call intelligent shop creation for analysis
        const { data: analysisResult } = await supabase.functions.invoke('create-intelligent-shop', {
          body: {
            userId: user.id,
            language: 'es',
            action: 'analyze_profile'
          }
        });

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
      }
    };

    if (state.phase === 'analyzing') {
      analyzeUserProfile();
    }
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
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mx-auto w-16 h-16 mb-6"
      >
        <Sparkles className="w-16 h-16 text-emerald-500" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">Analizando tu perfil</h3>
      <p className="text-muted-foreground">El Coordinador Maestro está revisando toda tu información para crear la tienda perfecta...</p>
    </div>
  );

  const renderConversationPhase = () => (
    <div className="space-y-6">
      {/* Conversation Display */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {state.conversation.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-lg ${
                message.type === 'coordinator' 
                  ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 ml-auto'
              }`}>
                <div className="flex items-start gap-2">
                  {message.type === 'coordinator' && (
                    <MessageCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium text-sm ${
                      message.type === 'coordinator' ? 'text-emerald-800 dark:text-emerald-200' : 'text-blue-800 dark:text-blue-200'
                    }`}>
                      {message.type === 'coordinator' ? 'Coordinador Maestro' : 'Tú'}
                    </p>
                    <p className={`mt-1 ${
                      message.type === 'coordinator' ? 'text-emerald-700 dark:text-emerald-300' : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* User Input */}
      <div className="flex gap-2">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          className="flex-1"
          rows={2}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleUserResponse(userInput);
            }
          }}
        />
        <Button
          onClick={() => handleUserResponse(userInput)}
          disabled={!userInput.trim() || isProcessing}
          size="lg"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );

  const renderCreatingPhase = () => (
    <div className="text-center py-12">
      <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6" />
      <h3 className="text-xl font-semibold mb-2">Creando tu tienda digital</h3>
      <p className="text-muted-foreground">Configurando todo automáticamente...</p>
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