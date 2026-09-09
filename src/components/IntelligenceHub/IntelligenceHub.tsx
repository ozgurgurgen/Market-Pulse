import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IntelligenceHeader } from './IntelligenceHeader';
import { IntelligenceSearchBar } from './IntelligenceSearchBar';
import { SourceHealthBanner } from './SourceHealthBanner';
import { NewsFeedPanel } from './NewsFeedPanel';
import { SentimentPanel } from './SentimentPanel';
import { TechnicalPanel } from './TechnicalPanel';
import { OrchestratorSummaryPanel } from './OrchestratorSummaryPanel';
import { TelegramStatusPanel } from './TelegramStatusPanel';
import { IntelligenceReportData } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

interface IntelligenceHubProps {
  initialTicker?: string;
  onSelectStock?: (symbol: string) => void;
}

export const IntelligenceHub: React.FC<IntelligenceHubProps> = ({
  initialTicker = 'THYAO',
  onSelectStock,
}) => {
  const [ticker, setTicker] = useState<string>(initialTicker);
  const [report, setReport] = useState<IntelligenceReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 900-Saniye Canlı Geri Sayım
  const [countdown, setCountdown] = useState<number>(900);
  const timerRef = useRef<any>(null);

  // Telegram Durumu ve Testi
  const [telegramStatus, setTelegramStatus] = useState<{
    configured: boolean;
    threshold: number;
    history: any[];
  }>({
    configured: false,
    threshold: 7.0,
    history: [],
  });
  const [isTestingTelegram, setIsTestingTelegram] = useState<boolean>(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{
    success: boolean;
    mode: 'LIVE' | 'SIMULATED';
    message: string;
  } | null>(null);

  // 1. İstihbarat Raporunu API'den Çek
  const fetchReport = useCallback(
    async (targetTicker: string, forceRefresh = false) => {
      try {
        if (!report) setIsLoading(true);
        else setIsRefreshing(true);
        setError(null);

        const url = `/api/intelligence/search?ticker=${encodeURIComponent(targetTicker)}${
          forceRefresh ? '&refresh=true' : ''
        }`;
        const { data, error: fetchErr } = await safeFetchJson<IntelligenceReportData>(url);

        if (data && data.ticker) {
          setReport(data);
          setCountdown(900); // Sayacı sıfırla
        } else {
          setError(fetchErr || 'İstihbarat verisi alınamadı.');
        }
      } catch (err: any) {
        console.error('Failed to fetch intelligence report:', err);
        setError((err as any)?.message || err || 'İstihbarat verisi yüklenirken hata oluştu.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [report]
  );

  // 2. Telegram Durumunu Çek
  const fetchTelegramStatus = useCallback(async () => {
    try {
      const { data } = await safeFetchJson<{ configured: boolean; threshold: number; history: any[] }>(
        '/api/intelligence/telegram/status'
      );
      if (data) {
        setTelegramStatus(data);
      }
    } catch (e) {
      console.warn('Telegram status check error:', e);
    }
  }, []);

  // 3. Telegram Test Alarmı Gönder
  const handleTestTelegram = async () => {
    try {
      setIsTestingTelegram(true);
      const { data } = await safeFetchJson<{ success: boolean; mode: 'LIVE' | 'SIMULATED'; message: string }>(
        '/api/intelligence/telegram/test',
        { method: 'POST' }
      );
      if (data) {
        setTelegramTestResult(data);
        fetchTelegramStatus();
        setTimeout(() => setTelegramTestResult(null), 8000);
      }
    } catch (err: any) {
      setTelegramTestResult({
        success: false,
        mode: 'SIMULATED',
        message: 'Telegram test isteği gönderilemedi.',
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // İlk yükleme ve sembol değişimi
  useEffect(() => {
    fetchReport(ticker);
    fetchTelegramStatus();
  }, [ticker]);

  // 900 Saniyelik Otomatik Yenileme Döngüsü
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchReport(ticker, true);
          return 900;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [ticker, fetchReport]);

  const handleSearchTicker = (newTicker: string) => {
    setTicker(newTicker);
    if (onSelectStock) onSelectStock(newTicker);
  };

  const handleManualRefresh = () => {
    fetchReport(ticker, true);
    fetchTelegramStatus();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* 1. Header Bar: Canlı Durum, Sayaç, Yenile ve Telegram */}
      <IntelligenceHeader
        ticker={report?.ticker || ticker}
        assetName={report?.assetName}
        price={report?.price}
        lastUpdated={report?.timestamp ? new Date(report.timestamp).toLocaleTimeString('tr-TR') : 'Şimdi'}
        countdown={countdown}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
        telegramConfigured={telegramStatus.configured}
        onTestTelegram={handleTestTelegram}
        isTestingTelegram={isTestingTelegram}
        telegramTestResult={telegramTestResult}
      />

      {/* 2. Kaynak Sağlık Durumu & Rate Limit Bilgilendirme Bannerı */}
      <SourceHealthBanner />

      {/* 3. Arama ve Hızlı Filtre Barı */}
      <IntelligenceSearchBar
        currentTicker={ticker}
        onSearchTicker={handleSearchTicker}
        isLoading={isLoading || isRefreshing}
      />

      {/* Hata Durumu */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 text-xs text-rose-300 flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="font-bold underline hover:text-white cursor-pointer"
          >
            Yeniden Dene
          </button>
        </div>
      )}

      {/* 3. Ana Grid Panelleri (5 Panel) */}
      {isLoading && !report ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-96"></div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-96"></div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-96"></div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-96"></div>
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Üst İkili Bölüm: Haberler & Yorumlar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel 1: Haber Akışı & NLP Duygu Analizi */}
            <NewsFeedPanel news={report.news} isLoading={isRefreshing} />

            {/* Panel 2: Yatırımcı Duygusu & Yorumlar */}
            <SentimentPanel
              comments={report.top_comments}
              distribution={report.sentiment_distribution}
              isLoading={isRefreshing}
            />
          </div>

          {/* Orta İkili Bölüm: Teknik İndikatörler & Organizatör Sentezi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel 3: Teknik İndikatör & Momentum Radarı */}
            <TechnicalPanel technical={report.technical} isLoading={isRefreshing} />

            {/* Panel 4: Organizatör & Çapraz Analiz Sentezi */}
            <OrchestratorSummaryPanel
              summary={report.summary}
              crossSignals={report.analysis.cross_signals}
              keyDevelopments={report.key_developments}
              disclaimer={report.disclaimer}
              isLoading={isRefreshing}
            />
          </div>

          {/* Panel 5: Telegram Alarm Merkezi & Bildirim Geçmişi */}
          <TelegramStatusPanel
            configured={telegramStatus.configured}
            onTestTelegram={handleTestTelegram}
            isTesting={isTestingTelegram}
            history={telegramStatus.history}
          />
        </div>
      ) : null}
    </div>
  );
};
