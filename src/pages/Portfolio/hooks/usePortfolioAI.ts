import { useState, useEffect, useCallback } from 'react';
import { PortfolioAIRecommendation } from '../../../types';
import { safeFetchJson } from '../../../utils/apiClient';

export function usePortfolioAI(portfolioId?: string) {
  const [recommendations, setRecommendations] = useState<PortfolioAIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, ok } = await safeFetchJson<{
        success: boolean;
        recommendations: PortfolioAIRecommendation[];
      }>(`/api/portfolio/${id}/recommendations`);

      if (ok && data?.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err: any) {
      setError(err.message || 'AI önerileri alınamadı.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (portfolioId) {
      fetchRecommendations(portfolioId);
    }
  }, [portfolioId, fetchRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    refreshRecommendations: () => portfolioId && fetchRecommendations(portfolioId),
  };
}
