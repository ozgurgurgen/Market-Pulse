import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Globe, 
  ShieldCheck, 
  Filter, 
  Calendar,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { MultiIndicatorChartCard, IndicatorConfig } from './MultiIndicatorChartCard';
import { TimeSeriesRange } from '../../types';

export const MacroChartsSection: React.FC = () => {
  const [globalRange, setGlobalRange] = useState<TimeSeriesRange>('1y');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');

  // Grafik Grupları Konfigürasyonu
  const chartGroups = [
    {
      id: 'chart-rates',
      category: 'faiz',
      title: 'Faiz Karşılaştırması & Politika Makası',
      subtitle: 'TCMB, Federal Reserve (Fed) ve Avrupa Merkez Bankası (ECB) politika faiz oranları',
      rationale: 'Faiz farkı (Spread) küresel sermaye ve Carry Trade akışlarının yönünü, TL varlıkların getiri avantajını ve döviz talebini doğrudan belirler.',
      indicators: [
        { code: 'TR_POLICY_RATE', name: 'TCMB Politika Faizi', color: '#f43f5e', unit: '%', strokeWidth: 3 },
        { code: 'US_FED_RATE', name: 'Fed Politika Faizi', color: '#3b82f6', unit: '%', strokeWidth: 2.5 },
        { code: 'EU_ECB_RATE', name: 'ECB Mevduat Faizi', color: '#f59e0b', unit: '%', strokeWidth: 2.5 }
      ] as IndicatorConfig[]
    },
    {
      id: 'chart-inflation',
      category: 'enflasyon',
      title: 'Enflasyon Trendi & Dezenflasyon Süreci',
      subtitle: 'Türkiye, ABD ve Euro Bölgesi yıllık tüketici fiyat endeksleri (TÜFE / CPI)',
      rationale: 'Fiyat istikrarının öncü göstergesidir. Reel faiz oranlarını, tüketim eğilimlerini ve merkez bankalarının gelecekteki faiz adımlarını şekillendirir.',
      indicators: [
        { code: 'TR_CPI_YOY', name: 'Türkiye TÜFE Yıllık', color: '#f97316', unit: '%', strokeWidth: 3 },
        { code: 'US_CPI_YOY', name: 'ABD CPI Yıllık', color: '#06b6d4', unit: '%', strokeWidth: 2.5 },
        { code: 'EU_CPI_YOY', name: 'Euro Bölgesi HICP Yıllık', color: '#10b981', unit: '%', strokeWidth: 2.5 }
      ] as IndicatorConfig[]
    },
    {
      id: 'chart-fx-risk',
      category: 'doviz',
      title: 'Döviz Kurları & Küresel Dolar Gücü (DXY)',
      subtitle: 'USD/TRY, EUR/TRY kurları ve DXY ABD Dolar Endeksi (Çift Eksenli)',
      rationale: 'Dolar Endeksi (DXY) küresel likidite sıkılığını temsil ederken, USD/TRY ve EUR/TRY gelişen piyasalardaki risk primi ve kur baskısını yansıtır.',
      indicators: [
        { code: 'TR_USDTRY', name: 'Dolar / TL (USD/TRY)', color: '#10b981', unit: '₺', yAxisId: 'left', strokeWidth: 3 },
        { code: 'TR_EURTRY', name: 'Euro / TL (EUR/TRY)', color: '#6366f1', unit: '₺', yAxisId: 'left', strokeWidth: 2.5 },
        { code: 'DX_Y', name: 'ABD Dolar Endeksi (DXY)', color: '#a855f7', unit: 'Puan', yAxisId: 'right', strokeWidth: 2.5, strokeDasharray: '5 5' }
      ] as IndicatorConfig[]
    },
    {
      id: 'chart-global-risk',
      category: 'risk',
      title: 'Küresel Risk Barometresi & Güvenli Limanlar',
      subtitle: 'CBOE VIX Korku Endeksi, ABD 10 Yıllık Tahvil Faizi ve Ons Altın',
      rationale: 'Piyasa stresi ve jeopolitik belirsizliklerde VIX ve Altın yükselirken, ABD 10Y tahvil getirileri küresel risksiz iskonto oranını belirler.',
      indicators: [
        { code: 'VIX', name: 'VIX Volatilite Endeksi', color: '#ef4444', unit: 'Puan', yAxisId: 'left', strokeWidth: 2.5 },
        { code: 'US_10Y_YIELD', name: 'ABD 10Y Tahvil Getirisi', color: '#eab308', unit: '%', yAxisId: 'left', strokeWidth: 2.5 },
        { code: 'GC_FUT', name: 'Ons Altın ($)', color: '#f59e0b', unit: '$', yAxisId: 'right', strokeWidth: 3 }
      ] as IndicatorConfig[]
    },
    {
      id: 'chart-growth-reserves',
      category: 'buyume',
      title: 'Makro Tamponlar, İmalat Talebi & Enerji',
      subtitle: 'TCMB Brüt Rezervleri, Brent Ham Petrol ve Sanayi Barometresi Doktor Bakır',
      rationale: 'Rezerv büyüklüğü finansal şoklara karşı dayanıklılığı, Brent petrol cari dengeyi, Bakır ise dünya sanayi üretiminin hızını temsil eder.',
      indicators: [
        { code: 'TR_GROSS_RESERVES', name: 'TCMB Brüt Rezervleri', color: '#14b8a6', unit: 'Milyar $', yAxisId: 'left', strokeWidth: 3 },
        { code: 'BZ_FUT', name: 'Brent Ham Petrol', color: '#e11d48', unit: '$/V', yAxisId: 'left', strokeWidth: 2.5 },
        { code: 'HG_FUT', name: 'Doktor Bakır', color: '#ea580c', unit: '$/Lbs', yAxisId: 'right', strokeWidth: 2.5, strokeDasharray: '4 4' }
      ] as IndicatorConfig[]
    }
  ];

  const filteredGroups = selectedGroupFilter === 'ALL'
    ? chartGroups
    : chartGroups.filter(g => g.category === selectedGroupFilter);

  return (
    <div className="space-y-6">
      {/* 1. Üst Açıklama ve Kategori Filtresi */}
      <div className="p-5 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-indigo-950/40 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-indigo-400" size={20} />
            <h2 className="text-base md:text-lg font-black text-white">Çoklu Gösterge Korelasyon Grafikleri</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {chartGroups.length} Tematik Grafik Grubu
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Ekonomik göstergeler tek başına değil, birbiriyle etkileşim halinde yorumlanır. 
            Aşağıdaki grafiklerde faiz makasları, enflasyon eğrileri ve risk göstergeleri üst üste bindirilmiştir.
          </p>
        </div>

        {/* Kategori Filtresi */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setSelectedGroupFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedGroupFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Gruplar
          </button>
          <button
            onClick={() => setSelectedGroupFilter('faiz')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedGroupFilter === 'faiz'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Faiz
          </button>
          <button
            onClick={() => setSelectedGroupFilter('enflasyon')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedGroupFilter === 'enflasyon'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enflasyon
          </button>
          <button
            onClick={() => setSelectedGroupFilter('doviz')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedGroupFilter === 'doviz'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kur & DXY
          </button>
          <button
            onClick={() => setSelectedGroupFilter('risk')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedGroupFilter === 'risk'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk & Altın
          </button>
          <button
            onClick={() => setSelectedGroupFilter('buyume')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedGroupFilter === 'buyume'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rezerv & Emtia
          </button>
        </div>
      </div>

      {/* 2. Grafik Kartları Listesi */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <MultiIndicatorChartCard
            key={group.id}
            id={group.id}
            title={group.title}
            subtitle={group.subtitle}
            rationale={group.rationale}
            indicators={group.indicators}
            defaultRange="1y"
            showEvents={true}
          />
        ))}
      </div>
    </div>
  );
};
