import { useState } from 'react';
import { PortfolioBacktestRequest, PortfolioBacktestResponse } from '../../../types';
import { safeFetchJson } from '../../../utils/apiClient';

export function usePortfolioBacktest() {
  const [backtestResult, setBacktestResult] = useState<PortfolioBacktestResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runBacktest = async (request: PortfolioBacktestRequest) => {
    setIsRunning(true);
    setError(null);
    try {
      const { data, ok, error: fetchErr } = await safeFetchJson<{ success: boolean; error?: string } & PortfolioBacktestResponse>(
        '/api/portfolio/backtest',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        }
      );

      if (ok && data && data.success) {
        setBacktestResult(data);
        return data;
      } else {
        const errMsg = data?.error || fetchErr || 'Backtest çalıştırılamadı.';
        setError(errMsg);
        throw new Error(errMsg);
      }
    } catch (err: any) {
      setError(err.message || 'Backtest sırasında beklenmeyen bir hata oluştu.');
      throw err;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    backtestResult,
    isRunning,
    error,
    runBacktest,
    clearResult: () => setBacktestResult(null),
  };
}
