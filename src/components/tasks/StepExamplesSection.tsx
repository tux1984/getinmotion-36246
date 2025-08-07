import React from 'react';
import { Lightbulb, Star, DollarSign, Target } from 'lucide-react';

interface StepExamplesSectionProps {
  stepTitle: string;
  stepDescription: string;
}

export const StepExamplesSection: React.FC<StepExamplesSectionProps> = ({ 
  stepTitle, 
  stepDescription 
}) => {
  const getExamplesForStep = (title: string) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('características') || titleLower.includes('features')) {
      return {
        icon: <Star className="h-4 w-4 text-amber-500" />,
        title: "Ejemplos de características:",
        examples: [
          "Productos hechos a mano con materiales naturales",
          "Diseños únicos y personalizables",
          "Técnica artesanal tradicional transmitida por generaciones",
          "Disponible en múltiples colores y tamaños"
        ]
      };
    }
    
    if (titleLower.includes('beneficios') || titleLower.includes('benefits')) {
      return {
        icon: <Target className="h-4 w-4 text-emerald-500" />,
        title: "Ejemplos de beneficios:",
        examples: [
          "Expresas tu personalidad única con productos exclusivos",
          "Materiales duraderos que dan valor por años",
          "Apoyas a artesanos locales y comercio justo",
          "Recibes atención personalizada y servicio excepcional"
        ]
      };
    }
    
    if (titleLower.includes('precio') || titleLower.includes('pricing')) {
      return {
        icon: <DollarSign className="h-4 w-4 text-blue-500" />,
        title: "Ejemplos de precios:",
        examples: [
          "Productos básicos: $50 - $100",
          "Piezas personalizadas: $150 - $300",
          "Ediciones limitadas: $300 - $500",
          "Incluye envío gratuito en pedidos +$200"
        ]
      };
    }
    
    return {
      icon: <Lightbulb className="h-4 w-4 text-primary" />,
      title: "Consejos:",
      examples: [
        "Sé específico y usa ejemplos concretos",
        "Piensa en los detalles que importan a tus clientes",
        "Incluye números y datos cuando sea posible",
        "Explica el 'por qué' detrás de tu respuesta"
      ]
    };
  };

  const exampleData = getExamplesForStep(stepTitle);

  return (
    <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg p-4 border border-muted/40">
      <div className="flex items-center gap-2 mb-3">
        {exampleData.icon}
        <h4 className="text-sm font-semibold text-foreground">{exampleData.title}</h4>
      </div>
      
      <div className="space-y-2">
        {exampleData.examples.map((example, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <span className="text-muted-foreground leading-relaxed">{example}</span>
          </div>
        ))}
      </div>
    </div>
  );
};