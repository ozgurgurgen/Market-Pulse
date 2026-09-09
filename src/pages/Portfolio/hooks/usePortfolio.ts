import { useState, useEffect, useCallback } from 'react';
import {
  PortfolioItem,
  PortfolioHolding,
  PortfolioPerformanceSnapshot,
  PortfolioRiskMetrics,
  PortfolioAlertItem,
  PortfolioTWRPoint,
  BenchmarkResult,
  PortfolioTransaction,
} from '../../../types';
import { safeFetchJson } from '../../../utils/apiClient';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';

export function usePortfolio(portfolioId?: string) {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>(portfolioId || '');
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [selectedRange, setSelectedRange] = useState<'1M' | '3M' | '1Y' | 'ALL'>('ALL');

  const [performanceData, setPerformanceData] = useState<{
    summary: {
      totalValue: number;
      totalCost: number;
      pnl: number;
      pnlPercentage: number;
      dailyPnl: number;
      dailyPnlPercentage: number;
      holdingsCount: number;
      twrPercentage?: number;
    } | null;
    portfolioTWR: PortfolioTWRPoint[];
    benchmarks: BenchmarkResult[];
    snapshots: PortfolioPerformanceSnapshot[];
    holdings: any[];
  } | null>(null);

  const [riskMetrics, setRiskMetrics] = useState<PortfolioRiskMetrics | null>(null);
  const [alerts, setAlerts] = useState<PortfolioAlertItem[]>([]);
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Tüm Portföyleri Çek (Firebase + Backend Model Portföyler)
  const fetchPortfolios = useCallback(async () => {
    try {
      let fetchedPortfolios: PortfolioItem[] = [];

      if (user) {
        try {
          const snapshot = await getDocs(collection(db, `users/${user?.uid}/portfolios`));
          fetchedPortfolios = snapshot.docs.map(d => d.data() as PortfolioItem);
        } catch (e) {
          console.warn('Firestore portfolios read failed, falling back to backend API', e);
        }
      }

      if (fetchedPortfolios.length === 0) {
        const { data: apiData } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/api/portfolio');
        if (apiData?.portfolios) {
          fetchedPortfolios = apiData.portfolios;
        }
      }

      setPortfolios(fetchedPortfolios);

      if (!selectedPortfolioId && fetchedPortfolios.length > 0) {
        setSelectedPortfolioId(fetchedPortfolios[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Portföyler yüklenirken hata oluştu.');
    }
  }, [selectedPortfolioId, user]);

  // 2. Seçili Portföy Detay, Performans (TWR + Benchmark), Risk ve İşlemler Verisini Çek
  const fetchSelectedPortfolioDetails = useCallback(async (id: string, range: '1M' | '3M' | '1Y' | 'ALL' = selectedRange) => {
    if (!id) return;
    setIsRefreshing(true);
    setError(null);
    try {
      // Portföy Detay
      const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(`/api/portfolio/${id}`);
      if (pData?.portfolio) {
        setSelectedPortfolio(pData.portfolio);
      } else {
        const localP = portfolios.find(p => p.id === id);
        if (localP) setSelectedPortfolio(localP);
      }

      // Performans Zaman Serisi (TWR & Benchmarks)
      const { data: perfData } = await safeFetchJson<{
        success: boolean;
        summary: any;
        portfolioTWR: PortfolioTWRPoint[];
        benchmarks: BenchmarkResult[];
        snapshots: PortfolioPerformanceSnapshot[];
        holdings: any[];
      }>(`/api/portfolio/${id}/performance?range=${range}`);

      if (perfData) {
        setPerformanceData({
          summary: perfData.summary,
          portfolioTWR: perfData.portfolioTWR || [],
          benchmarks: perfData.benchmarks || [],
          snapshots: perfData.snapshots || [],
          holdings: perfData.holdings || [],
        });
      }

      // İşlem Geçmişi (Transactions)
      const { data: txData } = await safeFetchJson<{
        success: boolean;
        transactions: PortfolioTransaction[];
      }>(`/api/portfolio/${id}/transactions`);

      if (txData?.transactions) {
        setTransactions(txData.transactions);
      }

      // Risk Analizi
      const { data: riskData } = await safeFetchJson<{
        success: boolean;
        riskMetrics: PortfolioRiskMetrics;
      }>(`/api/portfolio/${id}/risk`);

      if (riskData?.riskMetrics) {
        setRiskMetrics(riskData.riskMetrics);
      }

      // Bildirimler
      const { data: alertData } = await safeFetchJson<{
        success: boolean;
        alerts: PortfolioAlertItem[];
      }>(`/api/portfolio/${id}/alerts`);

      if (alertData?.alerts) {
        setAlerts(alertData.alerts);
      }
    } catch (err: any) {
      setError(err.message || 'Portföy detayları yüklenemedi.');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [portfolios, selectedRange]);

  // Portföy Listesini İlk Yükle
  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Seçili Portföy veya Range Değiştiğinde Verileri Getir
  useEffect(() => {
    if (selectedPortfolioId) {
      fetchSelectedPortfolioDetails(selectedPortfolioId, selectedRange);
    }
  }, [selectedPortfolioId, selectedRange, fetchSelectedPortfolioDetails]);

  // Yeni İşlem (Nakit Yatırma/Çekme/Alım/Satım) Ekle
  const addTransaction = async (tx: {
    type: 'deposit' | 'withdrawal' | 'buy' | 'sell';
    amount: number;
    symbol?: string;
    quantity?: number;
    price?: number;
    date?: string;
    notes?: string;
  }) => {
    if (!selectedPortfolioId) return;
    try {
      const { data: res } = await safeFetchJson<{ success: boolean; transaction: PortfolioTransaction }>(
        `/api/portfolio/${selectedPortfolioId}/transactions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx),
        }
      );

      if (res?.success) {
        fetchSelectedPortfolioDetails(selectedPortfolioId, selectedRange);
      }
    } catch (err: any) {
      setError(err.message || 'İşlem eklenirken hata oluştu');
    }
  };

  // Yeni Portföy Oluştur
  const createNewPortfolio = async (portfolioData: Partial<PortfolioItem>) => {
    try {
      const newId = `portfolio-${Date.now()}`;
      const newPortfolio: PortfolioItem = {
        id: newId,
        userId: user?.uid || 'user-default',
        name: portfolioData.name || 'Yeni Portföy',
        createdAt: portfolioData.createdAt || new Date().toISOString().split('T')[0],
        baseCurrency: portfolioData.baseCurrency || 'TRY',
        initialCapital: portfolioData.initialCapital || 10000,
        holdings: portfolioData.holdings || [],
        isActive: true,
        notes: portfolioData.notes || '',
        riskTolerance: portfolioData.riskTolerance || 'MODERATE',
        targetReturn: portfolioData.targetReturn || 35.0,
        benchmark: portfolioData.benchmark || 'XU100',
      };

      if (user) {
        try {
          await setDoc(doc(db, `users/${user?.uid}/portfolios/${newId}`), newPortfolio);
        } catch (e) {
          console.warn('Firestore write failed, using backend portfolio store', e);
        }
      }

      await safeFetchJson('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPortfolio),
      });

      await fetchPortfolios();
      setSelectedPortfolioId(newId);
      return newPortfolio;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Varlık Ekle veya Güncelle
  const addOrUpdateHolding = async (holding: PortfolioHolding) => {
    if (!selectedPortfolio) return;
    const existingHoldings = selectedPortfolio.holdings || [];
    const index = existingHoldings.findIndex(h => h.ticker.toUpperCase() === holding.ticker.toUpperCase());

    let updatedHoldings = [...existingHoldings];
    if (index >= 0) {
      updatedHoldings[index] = { ...updatedHoldings[index], ...holding };
    } else {
      updatedHoldings.push(holding);
    }

    try {
      const updatedPortfolio = { ...selectedPortfolio, holdings: updatedHoldings };

      if (user) {
        try {
          await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);
        } catch (e) {
          console.warn('Firestore update failed, fallback to local', e);
        }
      }

      await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPortfolio),
      });

      setPortfolios(prev => prev.map(p => p.id === selectedPortfolio.id ? updatedPortfolio : p));
      setSelectedPortfolio(updatedPortfolio);
      fetchSelectedPortfolioDetails(selectedPortfolio.id, selectedRange);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Varlık Sil
  const removeHolding = async (ticker: string) => {
    if (!selectedPortfolio) return;
    const updatedHoldings = selectedPortfolio.holdings.filter(h => h.ticker.toUpperCase() !== ticker.toUpperCase());

    try {
      const updatedPortfolio = { ...selectedPortfolio, holdings: updatedHoldings };

      if (user) {
        try {
          await setDoc(doc(db, `users/${user?.uid}/portfolios/${selectedPortfolio.id}`), updatedPortfolio);
        } catch (e) {
          console.warn('Firestore update failed, fallback to local', e);
        }
      }

      await safeFetchJson(`/api/portfolio/${selectedPortfolio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPortfolio),
      });

      setPortfolios(prev => prev.map(p => p.id === selectedPortfolio.id ? updatedPortfolio : p));
      setSelectedPortfolio(updatedPortfolio);
      fetchSelectedPortfolioDetails(selectedPortfolio.id, selectedRange);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Portföy Sil
  const deleteCurrentPortfolio = async (id: string) => {
    try {
      if (user) {
        try {
          await deleteDoc(doc(db, `users/${user?.uid}/portfolios/${id}`));
        } catch (e) {
          console.warn('Firestore delete failed, fallback to API', e);
        }
      }

      await safeFetchJson(`/api/portfolio/${id}`, { method: 'DELETE' });

      const remaining = portfolios.filter(p => p.id !== id);
      setPortfolios(remaining);
      if (remaining.length > 0) {
        setSelectedPortfolioId(remaining[0].id);
      } else {
        setSelectedPortfolioId('');
        setSelectedPortfolio(null);
        setPerformanceData(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    portfolios,
    selectedPortfolioId,
    setSelectedPortfolioId,
    selectedPortfolio,
    selectedRange,
    setSelectedRange,
    performanceData,
    riskMetrics,
    alerts,
    transactions,
    isLoading,
    isRefreshing,
    error,
    refreshPortfolio: () => selectedPortfolioId && fetchSelectedPortfolioDetails(selectedPortfolioId, selectedRange),
    addTransaction,
    createNewPortfolio,
    addOrUpdateHolding,
    removeHolding,
    deleteCurrentPortfolio,
  };
}
