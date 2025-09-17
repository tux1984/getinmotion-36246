import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAIRefinement } from '../hooks/useAIRefinement';
import { AIChat } from '../components/AIChat';
import { toast } from 'sonner';

interface Step2ProductNameProps {
  images: File[];
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step2ProductName: React.FC<Step2ProductNameProps> = ({
  images,
  name,
  onNameChange,
  onNext,
  onPrevious,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { analyzeImages, refineContent, isRefining } = useAIRefinement();

  // Generate initial suggestions when component mounts
  useEffect(() => {
    if (images.length > 0 && suggestions.length === 0) {
      generateSuggestions();
    }
  }, [images]);

  const generateSuggestions = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    try {
      const analysis = await analyzeImages(images);
      if (analysis) {
        setSuggestions([
          analysis.suggestedName,
          `${analysis.suggestedName} Premium`,
          `${analysis.suggestedName} Artesanal`,
          `${analysis.suggestedName} Original`,
        ]);
        
        if (!name) {
          onNameChange(analysis.suggestedName);
        }
      }
    } catch (error) {
      toast.error('Error generando sugerencias');
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineName = async (prompt: string) => {
    if (!name) {
      toast.error('Ingresa un nombre primero');
      return;
    }

    const refinedName = await refineContent({
      context: 'product_name',
      currentValue: name,
      userPrompt: prompt,
      additionalContext: {
        hasImages: images.length > 0,
        imageCount: images.length,
      }
    });

    if (refinedName) {
      onNameChange(refinedName);
      toast.success('Nombre refinado con IA');
    }
  };

  const handleNext = () => {
    if (!name.trim()) {
      toast.error('Ingresa un nombre para continuar');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Nombre de tu producto</h2>
        <p className="text-muted-foreground">
          La IA ha analizado tus imágenes y sugiere estos nombres
        </p>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
            <img
              src={URL.createObjectURL(images[0])}
              alt="Producto principal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {isGenerating ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">La IA está analizando tus imágenes...</p>
        </div>
      ) : (
        suggestions.length > 0 && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Sugerencias de la IA
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onNameChange(suggestion)}
                  className={`
                    p-3 text-left rounded-lg border transition-all hover:border-primary
                    ${name === suggestion ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                >
                  <span className="font-medium">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )
      )}

      {/* Manual Input */}
      <div className="space-y-2">
        <Label htmlFor="productName">Nombre del producto</Label>
        <Input
          id="productName"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ingresa el nombre de tu producto..."
          className="text-lg"
        />
      </div>

      {/* AI Chat for Refinement */}
      {name && (
        <AIChat
          title="Refina el nombre con IA"
          placeholder="Ej: Hazlo más elegante, más comercial, más creativo..."
          onSubmit={handleRefineName}
          isProcessing={isRefining}
          currentValue={name}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!name.trim()}
          className="flex items-center gap-2"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};