
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CategoryScore } from '@/types/dashboard';

interface MaturityScoreRecord {
  id: string;
  user_id: string;
  idea_validation: number;
  user_experience: number;
  market_fit: number;
  monetization: number;
  profile_data: any;
  created_at: string;
}

export const useMaturityScores = () => {
  const { user } = useAuth();
  const [currentScores, setCurrentScores] = useState<CategoryScore | null>(null);
  const [scoreHistory, setScoreHistory] = useState<MaturityScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestScores = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_latest_maturity_scores', {
        user_uuid: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const latest = data[0];
        setCurrentScores({
          ideaValidation: latest.idea_validation,
          userExperience: latest.user_experience,
          marketFit: latest.market_fit,
          monetization: latest.monetization
        });
      } else {
        setCurrentScores(null);
      }
    } catch (err) {
      console.error('Error fetching latest maturity scores:', err);
      setError('Error al cargar las puntuaciones de madurez');
    }
  };

  const fetchScoreHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_maturity_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScoreHistory(data || []);
    } catch (err) {
      console.error('Error fetching score history:', err);
    }
  };

  const saveMaturityScores = async (scores: CategoryScore, profileData?: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_maturity_scores')
        .insert({
          user_id: user.id,
          idea_validation: scores.ideaValidation,
          user_experience: scores.userExperience,
          market_fit: scores.marketFit,
          monetization: scores.monetization,
          profile_data: profileData
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentScores(scores);
      setScoreHistory(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error('Error saving maturity scores:', err);
      throw err;
    }
  };

  const getScoreComparison = () => {
    if (scoreHistory.length < 2) return null;

    const latest = scoreHistory[0];
    const previous = scoreHistory[1];

    return {
      ideaValidation: latest.idea_validation - previous.idea_validation,
      userExperience: latest.user_experience - previous.user_experience,
      marketFit: latest.market_fit - previous.market_fit,
      monetization: latest.monetization - previous.monetization
    };
  };

  const getOverallProgress = () => {
    if (!currentScores) return 0;
    
    return Math.round(
      (currentScores.ideaValidation + 
       currentScores.userExperience + 
       currentScores.marketFit + 
       currentScores.monetization) / 4
    );
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchLatestScores(),
          fetchScoreHistory()
        ]);
        
        setLoading(false);
      };
      
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    currentScores,
    scoreHistory,
    loading,
    error,
    saveMaturityScores,
    getScoreComparison,
    getOverallProgress,
    refetch: () => {
      if (user) {
        fetchLatestScores();
        fetchScoreHistory();
      }
    }
  };
};
