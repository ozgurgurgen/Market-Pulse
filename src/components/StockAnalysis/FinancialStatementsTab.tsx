import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Layers, 
  Info,
  Download,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { FinancialStatementsData, FinancialLineItem } from '../../types';
import { exportFinancialStatementToCSV } from '../../utils/exportUtils';

interface FinancialStatementsTabProps {
  symbol: string;
}

export const FinancialStatementsTab: React.FC<FinancialStatementsTabProps> = ({ symbol }) => {
  const [data, setData] = useState<FinancialStatementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statementType, setStatementType] = useState<'income' | 'balance' | 'cashflow'>('income');
  const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  const [periodCount, setPeriodCount] = useState<number>(5);
  const [viewMode, setViewMode] = useState<'cumulative' | 'quarterly'>('cumulative');
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: FinancialStatementsData }>(`/api/stock/${symbol}/financials`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setData(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Finansal tablolar alınamadı.');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Bağlantı hatası.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  const CURRENCY_RATES: Record<'TRY' | 'USD' | 'EUR', { rate: number; symbol: string; label: string }> = {
    TRY: { rate: 1, symbol: '₺', label: 'TRY (₺)' },
    USD: { rate: 38.65, symbol: '$', label: 'USD ($)' },
    EUR: { rate: 40.80, symbol: '€', label: 'EUR (€)' }
  };

  const formatMoney = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '-';
    const rateConfig = CURRENCY_RATES[currency];
    const adjusted = val / rateConfig.rate;
    const sign = adjusted < 0 ? '-' : '';
    const abs = Math.abs(adjusted);

    if (abs >= 1000) {
      return `${sign}${(abs / 1000).toFixed(2)} Mr ${rateConfig.symbol}`;
    }
    return `${sign}${abs.toFixed(1)} Mn ${rateConfig.symbol}`;
  };

  const handleExport = () => {
    if (!data) return;
    const title = statementType === 'income' ? 'Gelir_Tablosu' : statementType === 'balance' ? 'Bilanco' : 'Nakit_Akim';
    const periodsToExport = data.periods.slice(0, periodCount);
    const items = statementType === 'income' ? data.incomeStatement : statementType === 'balance' ? data.balanceSheet : data.cashFlowStatement;
    
    // Scale items to selected currency for export
    const rate = CURRENCY_RATES[currency].rate;
    const scaledItems = items.map(item => ({
      label: item.label,
      isHeader: item.isHeader,
      yoyChanges: item.yoyChanges,
      values: Object.fromEntries(
        Object.entries(item.values).map(([k, v]) => [k, Number((v / rate).toFixed(2))])
      )
    }));

    exportFinancialStatementToCSV(symbol, `${title}_${viewMode}`, currency, periodsToExport, scaledItems);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Bilanço ve gelir tabloları yükleniyor...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için finansal veri bulunamadı.'}</p>
      </div>
    );
  }

  const currentItems: FinancialLineItem[] = 
    statementType === 'income' ? data.incomeStatement :
    statementType === 'balance' ? data.balanceSheet :
    data.cashFlowStatement;

  const displayPeriods = data.periods.slice(0, periodCount);

  return (
    <div className="space-y-5">
      {/* 1. Kontroller ve Tab Seçimi */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        
        {/* Tab Türü Seçimi */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setStatementType('income')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statementType === 'income'
                ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Özet Gelir Tablosu
          </button>
          <button
            onClick={() => setStatementType('balance')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statementType === 'balance'
                ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Özet Bilanço (Varlık/Borç)
          </button>
          <button
            onClick={() => setStatementType('cashflow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statementType === 'cashflow'
                ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Nakit Akım Tablosu
          </button>
        </div>

        {/* Çoklu Para Birimi (TL / USD / EUR), Çeyreklik ve Excel İndir */}
        <div className="flex items-center gap-3 flex-wrap justify-between lg:justify-end">
          
          {/* Dönem Sayısı */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[11px] hidden sm:inline">Dönem:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setPeriodCount(5)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  periodCount === 5 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                5 Çeyrek
              </button>
              <button
                onClick={() => setPeriodCount(data.periods.length)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  periodCount > 5 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tümü ({data.periods.length})
              </button>
            </div>
          </div>

          {/* Para Birimi (TRY, USD, EUR) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Para:</span>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setCurrency('TRY')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'TRY' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Türk Lirası (Baz)"
              >
                ₺ TRY
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Amerikan Doları (TCMB Kuruna Çevrilmiş)"
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currency === 'EUR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Euro (TCMB Kuruna Çevrilmiş)"
              >
                € EUR
              </button>
            </div>
          </div>

          {/* Excel / CSV İndir Butonu */}
          <button
            onClick={handleExport}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              exportSuccess 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Tabloyu Excel & CSV formatında indir"
          >
            {exportSuccess ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>İndirildi!</span>
              </>
            ) : (
              <>
                <Download size={13} className="text-emerald-400" />
                <span>Excel İndir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Finansal Tablo Grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold">
              <th className="py-3 px-4 min-w-[240px]">
                Finansal Kalem ({statementType === 'income' ? 'Gelir Tablosu' : statementType === 'balance' ? 'Bilanço' : 'Nakit Akımı'})
              </th>
              {displayPeriods.map((p) => (
                <th key={p} className="py-3 px-3 text-right font-mono text-slate-300">
                  {p}
                </th>
              ))}
              <th className="py-3 px-3 text-right font-mono text-emerald-400">YoY Değişim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {currentItems.map((item) => {
              const latestPeriod = displayPeriods[0];
              const yoy = item.yoyChanges?.[latestPeriod];

              return (
                <tr 
                  key={item.key}
                  className={`hover:bg-slate-800/40 transition ${
                    item.isHeader ? 'bg-emerald-950/20 font-bold text-slate-100' : 'text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-4 flex items-center gap-2">
                    {item.isHeader && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    <span className={item.isHeader ? 'font-bold text-slate-100' : 'text-slate-300'}>{item.label}</span>
                  </td>
                  {displayPeriods.map((p) => (
                    <td key={p} className={`py-2.5 px-3 text-right font-mono ${item.isHeader ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                      {formatMoney(item.values[p])}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right font-mono">
                    {yoy !== undefined ? (
                      <span className={`inline-flex items-center gap-0.5 font-bold ${yoy >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {yoy >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        %{Math.abs(yoy)}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
        <div>
          💡 <span className="font-semibold text-slate-300">SPK Uyumlu Veri:</span> SPK ve KAP mevzuatına uygun konsolide çeyreklik raporlar. TMS 29 Enflasyon Muhasebesi etkileri yansıtılmıştır.
        </div>
        <div className="text-[11px] text-slate-500 shrink-0">
          Döviz Kurları: $ 38.65 ₺ | € 40.80 ₺
        </div>
      </div>
    </div>
  );
};
