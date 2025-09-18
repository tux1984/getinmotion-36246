import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductReview, ReviewStats } from '@/types/reviews';

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      setReviews(reviewsData || []);

      // Calculate stats
      if (reviewsData && reviewsData.length > 0) {
        const totalReviews = reviewsData.length;
        const averageRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        const ratingDistribution = reviewsData.reduce((acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        }, {} as { [key: number]: number });

        setStats({
          average_rating: parseFloat(averageRating.toFixed(1)),
          total_reviews: totalReviews,
          rating_distribution: ratingDistribution
        });
      } else {
        setStats({
          average_rating: 0,
          total_reviews: 0,
          rating_distribution: {}
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reviews');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (reviewData: Omit<ProductReview, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>) => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert([{
          ...reviewData,
          helpful_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Refresh reviews
      await fetchReviews();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding review');
      throw err;
    }
  };

  const markHelpful = async (reviewId: string) => {
    try {
      // First get current helpful count
      const { data: currentReview, error: fetchError } = await supabase
        .from('product_reviews')
        .select('helpful_count')
        .eq('id', reviewId)
        .single();

      if (fetchError) throw fetchError;

      // Then update with incremented value
      const { error } = await supabase
        .from('product_reviews')
        .update({ helpful_count: (currentReview?.helpful_count || 0) + 1 })
        .eq('id', reviewId);

      if (error) throw error;

      // Refresh reviews
      await fetchReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking review as helpful');
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return {
    reviews,
    stats,
    loading,
    error,
    addReview,
    markHelpful,
    refetch: fetchReviews
  };
};