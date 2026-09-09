import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Maximize2,
  Sparkles,
  Layers,
  Flag
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { TimeSeriesResponse, TimeSeriesRange, EventMarker, TimeSeriesIndicator } from '../../types';

export interface IndicatorConfig {
  code: string;
  name: string;
  color: string;
  yAxisId?: 'left' | 'right';
  unit?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface MultiIndicatorChartCardProps {
  id: string;
  title: string;
  subtitle: string;
  rationale: string;
  indicators: IndicatorConfig[];
  defaultRange?: TimeSeriesRange;
  showEvents?: boolean;
}

export const MultiIndicatorChartCard: React.FC<MultiIndicatorChartCardProps> = ({
  id,
  title,
  subtitle,
  rationale,
  indicators,
  defaultRange = '1y',
  showEvents = true
}) => {
  const [range, setRange] = useState<TimeSeriesRange>(defaultRange);
  const [data, setData] = useState<TimeSeriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [showEventMarkers, setShowEventMarkers] = useState<boolean>(showEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventMarker | null>(null);

  const rangeButtons: { label: string; value: TimeSeriesRange }[] = [
    { label: '3A', value: '3m' },
    { label: '6A', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' },
    { label: 'Tümü', value: 'max' }
  ];

  // Verileri çek
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const codesParam = indicators.map(i => i.code).join(',');
    const url = `/api/macro/timeseries?indicator_codes=${encodeURIComponent(codesParam)}&range=${range}`;

    safeFetchJson<TimeSeriesResponse>(url)
      .then(({ data: resData, ok, error: fetchErr }) => {
        if (!isMounted) return;
        if (ok && resData?.series) {
          setData(resData);
        } else {
          setError(fetchErr || 'Zaman serisi verisi alınamadı.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError((err as any)?.message || err || 'Veri çekilirken bir sorun oluştu.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [indicators, range]);

  // Recharts formatına dönüştür
  const { chartData, leftUnit, rightUnit, hasRightAxis, seriesStats } = useMemo(() => {
    if (!data || !data.series || data.series.length === 0) {
      return { 
        chartData: [], 
        leftUnit: '%', 
        rightUnit: '', 
        hasRightAxis: false, 
        seriesStats: {} 
      };
    }

    // Tarih bazında verileri birleştir
    const dateMap = new Map<string, any>();
    const stats: Record<string, { latest: number; min: number; max: number; change: number; unit: string }> = {};

    let detectedLeftUnit = '';
    let detectedRightUnit = '';
    let foundRight = false;

    data.series.forEach((s) => {
      const cfg = indicators.find(i => i.code === s.indicator_code);
      const axis = cfg?.yAxisId || 'left';
      const u = cfg?.unit || s.unit || '';

      if (axis === 'right') {
        foundRight = true;
        if (!detectedRightUnit) detectedRightUnit = u;
      } else {
        if (!detectedLeftUnit) detectedLeftUnit = u;
      }

      if (s.points && s.points.length > 0) {
        const values = s.points.map(p => p.value).filter(v => typeof v === 'number' && !isNaN(v));
        if (values.length > 0) {
          const firstVal = values[0];
          const lastVal = values[values.length - 1];
          stats[s.indicator_code] = {
            latest: lastVal,
            min: Math.min(...values),
            max: Math.max(...values),
            change: Number((lastVal - firstVal).toFixed(2)),
            unit: u
          };
        }

        s.points.forEach((pt) => {
          if (!dateMap.has(pt.date)) {
            dateMap.set(pt.date, { date: pt.date });
          }
          const row = dateMap.get(pt.date);
          row[s.indicator_code] = pt.value;
        });
      }
    });

    const sortedData = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return {
      chartData: sortedData,
      leftUnit: detectedLeftUnit || '%',
      rightUnit: detectedRightUnit,
      hasRightAxis: foundRight,
      seriesStats: stats
    };
  }, [data, indicators]);

  const toggleSeries = (code: string) => {
    setHiddenSeries(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  // Tarih formatlama
  const formatDateTick = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length >= 2) {
        if (range === '5y' || range === 'max') {
          return `${parts[1]}/${parts[0].slice(2)}`; // MM/YY
        }
        return `${parts[2]}/${parts[1]}`; // DD/MM
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div id={id} className="p-5 md:p-6 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-sm space-y-4 hover:border-slate-700/80 transition shadow-lg shadow-black/20">
      {/* 1. Başlık & Kontrol Çubuğu */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
              {title}
            </h3>
            {hasRightAxis && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Çift Eksenli (Dual Axis)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Zaman Aralığı Butonları & Olay Aç/Kapa */}
        <div className="flex flex-wrap items-center gap-2">
          {data?.event_markers && data.event_markers.length > 0 && (
            <button
              onClick={() => setShowEventMarkers(!showEventMarkers)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition ${
                showEventMarkers
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Önemli Faiz/Politika Kararı Olay Çizgileri"
            >
              <Flag size={12} />
              <span className="hidden sm:inline">Olay İşaretleri</span>
            </button>
          )}

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {rangeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setRange(btn.value)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  range === btn.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Neden Birlikte Açıklaması (Rationale Bar) */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
        <Sparkles size={15} className="text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Makro Korelasyon Mantığı: </span>
          <span className="text-slate-400">{rationale}</span>
        </div>
      </div>

      {/* 3. Grafik Alanı */}
      <div className="relative min-h-[320px] w-full pt-2">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-[2px] rounded-xl">
            <RefreshCw size={24} className="animate-spin text-indigo-400 mb-2" />
            <span className="text-xs font-medium text-slate-300">Zaman serisi derleniyor...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-[320px] text-center p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl">
            <Info size={24} className="text-rose-400 mb-2" />
            <p className="text-xs font-bold text-rose-300 mb-1">{error}</p>
            <p className="text-[11px] text-slate-400">Lütfen yeniden deneyin veya farklı bir zaman aralığı seçin.</p>
          </div>
        )}

        {!isLoading && !error && chartData.length > 0 && (
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: hasRightAxis ? 20 : 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDateTick}
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  dy={8}
                />
                
                {/* Sol Y Ekseni */}
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  stroke="#94a3b8" 
                  fontSize={11}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `${val}${leftUnit ? ` ${leftUnit}` : ''}`}
                />

                {/* Sağ Y Ekseni (Gerekirse) */}
                {hasRightAxis && (
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#cbd5e1" 
                    fontSize={11}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `${val}${rightUnit ? ` ${rightUnit}` : ''}`}
                  />
                )}

                {/* Tooltip */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const fullDateStr = label ? new Date(label).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
                    
                    return (
                      <div className="p-3.5 bg-slate-950/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[200px]">
                        <div className="font-bold text-slate-300 pb-1.5 border-b border-slate-800 flex items-center justify-between">
                          <span>{fullDateStr}</span>
                          <Calendar size={12} className="text-slate-400" />
                        </div>
                        <div className="space-y-1.5">
                          {payload.map((entry: any) => {
                            const cfg = indicators.find(i => i.code === entry.dataKey);
                            const name = cfg?.name || entry.name;
                            const unit = cfg?.unit || '';
                            return (
                              <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                  <span className="text-slate-300 font-medium">{name}:</span>
                                </div>
                                <span className="font-mono font-black text-white">
                                  {typeof entry.value === 'number' ? entry.value.toLocaleString('tr-TR') : entry.value} {unit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />

                {/* Olay Referans Çizgileri (Event Markers) */}
                {showEventMarkers && data?.event_markers?.map((evt, idx) => (
                  <ReferenceLine
                    key={idx}
                    x={evt.date}
                    yAxisId="left"
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: evt.label.length > 20 ? `${evt.label.slice(0, 18)}...` : evt.label,
                      position: 'top',
                      fill: '#fbbf24',
                      fontSize: 9,
                      fontWeight: 'bold',
                      offset: 6
                    }}
                  />
                ))}

                {/* Çizgiler */}
                {indicators.map((ind) => {
                  if (hiddenSeries[ind.code]) return null;
                  return (
                    <Line
                      key={ind.code}
                      yAxisId={ind.yAxisId || 'left'}
                      type="monotone"
                      dataKey={ind.code}
                      name={ind.name}
                      stroke={ind.color}
                      strokeWidth={ind.strokeWidth || 2.5}
                      strokeDasharray={ind.strokeDasharray}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                      isAnimationActive={true}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 4. Tıklanabilir Seri Legend & İstatistik Kutucukları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
        {indicators.map((ind) => {
          const isHidden = !!hiddenSeries[ind.code];
          const stat = seriesStats[ind.code];
          const isPos = stat && stat.change > 0;
          const isNeg = stat && stat.change < 0;

          return (
            <div
              key={ind.code}
              onClick={() => toggleSeries(ind.code)}
              className={`p-3 rounded-xl border transition cursor-pointer select-none flex flex-col justify-between ${
                isHidden 
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-50' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
              title="Seriyi gizlemek veya göstermek için tıklayın"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: ind.color }} 
                  />
                  <span className={`text-xs font-bold truncate ${isHidden ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {ind.name}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-200">
                  {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              {stat && !isHidden && (
                <div className="flex items-baseline justify-between text-[11px] pt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400">Son:</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {stat.latest.toLocaleString('tr-TR')} {stat.unit}
                    </span>
                  </div>

                  <div className={`flex items-center gap-0.5 font-semibold text-[10px] ${
                    isPos ? 'text-emerald-400' : isNeg ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {isPos ? <TrendingUp size={11} /> : isNeg ? <TrendingDown size={11} /> : null}
                    <span>{isPos ? '+' : ''}{stat.change}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
