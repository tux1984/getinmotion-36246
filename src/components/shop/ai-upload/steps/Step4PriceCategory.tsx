import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, DollarSign, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAIRefinement } from '../hooks/useAIRefinement';
import { toast } from 'sonner';

interface Step4PriceCategoryProps {
  name: string;
  description: string;
  price: number | null;
  category: string;
  tags: string[];
  onDataChange: (data: {
    price?: number | null;
    category?: string;
    tags?: string[];
  }) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CATEGORIES = [
  'Joyería',
  'Textiles',
  'Cerámica',
  'Madera',
  'Cuero',
  'Decoración',
  'Arte',
  'Accesorios',
  'Juguetes',
  'Otros'
];

export const Step4PriceCategory: React.FC<Step4PriceCategoryProps> = ({
  name,
  description,
  price,
  category,
  tags,
  onDataChange,
  onNext,
  onPrevious,
}) => {
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const { refineContent } = useAIRefinement();

  useEffect(() => {
    if (name && description && !suggestedPrice) {
      generateSuggestions();
    }
  }, [name, description]);

  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      // Simulate AI suggestions based on product data
      const mockSuggestions = {
        price: Math.floor(Math.random() * 200000) + 50000, // Between 50k and 250k COP
        category: 'Artesanías',
        tags: ['artesanal', 'hecho a mano', 'único', 'calidad premium']
      };

      setSuggestedPrice(mockSuggestions.price);
      setSuggestedTags(mockSuggestions.tags);
      
      if (!price) {
        onDataChange({ price: mockSuggestions.price });
      }
      
      if (!category) {
        onDataChange({ category: mockSuggestions.category });
      }
      
      if (tags.length === 0) {
        onDataChange({ tags: mockSuggestions.tags });
      }

      toast.success('Sugerencias generadas con IA');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Error generando sugerencias');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      onDataChange({ tags: updatedTags });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onDataChange({ tags: updatedTags });
  };

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      onDataChange({ tags: updatedTags });
      setSuggestedTags(prev => prev.filter(t => t !== tag));
    }
  };

  const handleNext = () => {
    if (!price || price <= 0) {
      toast.error('Ingresa un precio válido');
      return;
    }
    if (!category) {
      toast.error('Selecciona una categoría');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Precio y categorización</h2>
        <p className="text-muted-foreground">
          Define el precio y ayuda a los clientes a encontrar tu producto
        </p>
      </div>

      {/* AI Price Suggestion */}
      {isGeneratingSuggestions ? (
        <div className="bg-primary/5 rounded-lg p-4 text-center">
          <Sparkles className="w-6 h-6 animate-pulse mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Analizando producto para sugerir precio...</p>
        </div>
      ) : suggestedPrice && (
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">Precio sugerido por IA</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-primary">
              ${suggestedPrice.toLocaleString()} COP
            </p>
            {price !== suggestedPrice && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDataChange({ price: suggestedPrice })}
              >
                Usar sugerencia
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Basado en productos similares y características del artículo
          </p>
        </div>
      )}

      {/* Price Input */}
      <div className="space-y-2">
        <Label htmlFor="price" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Precio (COP)
        </Label>
        <Input
          id="price"
          type="number"
          value={price || ''}
          onChange={(e) => onDataChange({ price: e.target.value ? Number(e.target.value) : null })}
          placeholder="50000"
          className="text-lg"
        />
        {price && (
          <p className="text-sm text-muted-foreground">
            ${price.toLocaleString()} COP
          </p>
        )}
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label>Categoría</Label>
        <Select value={category} onValueChange={(value) => onDataChange({ category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Etiquetas
        </Label>

        {/* Suggested Tags */}
        {suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Etiquetas sugeridas por IA:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => addSuggestedTag(tag)}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  + {tag}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Current Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Agregar etiqueta..."
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addTag}
            disabled={!newTag.trim()}
          >
            Agregar
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Las etiquetas ayudan a los clientes a encontrar tu producto. Usa palabras descriptivas como "artesanal", "hecho a mano", materiales, etc.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium">Consejos de precios</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Considera el tiempo de elaboración y materiales</li>
          <li>• Investiga precios de productos similares</li>
          <li>• No subestimes el valor de tu trabajo artesanal</li>
          <li>• Incluye un margen que permita descuentos ocasionales</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!price || !category}
          className="flex items-center gap-2"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};