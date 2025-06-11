
import { useState, useCallback } from 'react';
import { CategoryScore } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';

interface AIRecommendation {
  title: string;
  description: string;
  priority: string;
  timeframe: string;
}

export const useRobustAIRecommendations = () => {
  const [loading, setLoading] = useState(false);

  const generateIntelligentFallbacks = useCallback((scores: CategoryScore): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];
    
    // Analizar cada área y generar recomendaciones específicas
    const areas = [
      { key: 'monetization', value: scores.monetization, name: 'Monetización' },
      { key: 'ideaValidation', value: scores.ideaValidation, name: 'Validación de Idea' },
      { key: 'userExperience', value: scores.userExperience, name: 'Experiencia de Usuario' },
      { key: 'marketFit', value: scores.marketFit, name: 'Ajuste al Mercado' }
    ].sort((a, b) => a.value - b.value); // Ordenar por puntuación más baja

    // Generar recomendaciones para las 2-3 áreas más débiles
    areas.slice(0, 3).forEach((area, index) => {
      let title = '';
      let description = '';
      let priority = area.value < 40 ? 'Alta' : area.value < 60 ? 'Media' : 'Baja';

      switch (area.key) {
        case 'monetization':
          title = 'Desarrollar Estrategia de Monetización';
          description = `Tu puntuación en monetización es ${area.value}%. Enfócate en definir modelos de ingresos claros, calcular costos de producción y establecer precios competitivos para tus productos o servicios creativos.`;
          break;
        case 'ideaValidation':
          title = 'Validar tu Propuesta de Valor';
          description = `Con ${area.value}% en validación de idea, necesitas confirmar que tu concepto resuelve problemas reales. Realiza entrevistas con clientes potenciales y prueba tu idea con audiencias pequeñas.`;
          break;
        case 'userExperience':
          title = 'Optimizar la Experiencia del Usuario';
          description = `Tu puntuación de ${area.value}% en experiencia de usuario indica oportunidades de mejora. Simplifica procesos, mejora la usabilidad y recolecta feedback directo de tus usuarios.`;
          break;
        case 'marketFit':
          title = 'Analizar el Ajuste al Mercado';
          description = `Con ${area.value}% en ajuste al mercado, debes investigar más tu competencia, definir mejor tu nicho y ajustar tu propuesta para destacar en el mercado.`;
          break;
      }

      recommendations.push({
        title,
        description,
        priority,
        timeframe: priority === 'Alta' ? '1-2 semanas' : '2-4 semanas'
      });
    });

    // Siempre incluir una recomendación general
    recommendations.push({
      title: 'Continuar Desarrollo Progresivo',
      description: 'Mantén un enfoque constante en mejorar todos los aspectos de tu proyecto creativo. Establece metas semanales pequeñas y medibles para avanzar consistentemente.',
      priority: 'Media',
      timeframe: 'Continuo'
    });

    return recommendations;
  }, []);

  const fetchRecommendationsWithFallback = useCallback(async (scores: CategoryScore): Promise<AIRecommendation[]> => {
    if (!scores) {
      return generateIntelligentFallbacks({
        ideaValidation: 50,
        userExperience: 50,
        marketFit: 50,
        monetization: 40
      });
    }

    setLoading(true);
    
    try {
      // Intentar obtener recomendaciones de IA
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: { 
          scores, 
          profileData: {}, 
          language: 'es' 
        }
      });

      if (error || !data?.recommendations) {
        console.log('AI recommendations failed, using intelligent fallbacks');
        return generateIntelligentFallbacks(scores);
      }

      return data.recommendations;
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      return generateIntelligentFallbacks(scores);
    } finally {
      setLoading(false);
    }
  }, [generateIntelligentFallbacks]);

  return {
    fetchRecommendationsWithFallback,
    loading
  };
};
