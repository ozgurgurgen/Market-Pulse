import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Layers, 
  Flame, 
  Coins, 
  DollarSign, 
  BarChart2, 
  Check, 
  Info 
} from 'lucide-react';
import { TefasFundDetail } from '../../types';

interface TefasFundComparisonChartProps {
  fund: TefasFundDetail;
}

type TimeRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y';

export const TefasFundComparisonChart: React.FC<TefasFundComparisonChartProps> = ({ fund }) => {
  const [range, setRange] = useState<TimeRange>('1Y');
  const [showBist, setShowBist] = useState(true);
  const [showGold, setShowGold] = useState(true);
  const [showInflation, setShowInflation] = useState(true);
  const [showUsd, setShowUsd] = useState(false);

  // Generate smooth normalized relative return curve (% gain from start = 0%)
  const chartData = useMemo(() => {
    let points = 12;
    let fundEnd = fund.return1Y;
    let bistEnd = 52.4;
    let goldEnd = 68.2;
    let infEnd = 45.0;
    let usdEnd = 38.5;

    if (range === '1M') {
      points = 10;
      fundEnd = fund.return1M || 4.2;
      bistEnd = 3.5;
      goldEnd = 4.8;
      infEnd = 2.8;
      usdEnd = 2.1;
    } else if (range === '3M') {
      points = 12;
      fundEnd = fund.return3M || 14.8;
      bistEnd = 12.0;
      goldEnd = 16.5;
      infEnd = 9.2;
      usdEnd = 7.4;
    } else if (range === '6M') {
      points = 14;
      fundEnd = fund.return6M || 34.0;
      bistEnd = 28.5;
      goldEnd = 36.0;
      infEnd = 21.0;
      usdEnd = 17.2;
    } else if (range === '1Y') {
      points = 12;
      fundEnd = fund.return1Y;
      bistEnd = 52.4;
      goldEnd = 68.2;
      infEnd = 45.0;
      usdEnd = 38.5;
    } else if (range === '3Y') {
      points = 12;
      fundEnd = fund.return3Y || fund.return1Y * 2.8;
      bistEnd = 260.0;
      goldEnd = 310.0;
      infEnd = 280.0;
      usdEnd = 220.0;
    } else if (range === '5Y') {
      points = 15;
      fundEnd = fund.return5Y || fund.return1Y * 5.2;
      bistEnd = 620.0;
      goldEnd = 780.0;
      infEnd = 650.0;
      usdEnd = 540.0;
    }

    const data = [];
    const now = new Date();
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const fVal = Number((fundEnd * Math.pow(progress, 1.05)).toFixed(1));
      const bVal = Number((bistEnd * Math.pow(progress, 1.05)).toFixed(1));
      const gVal = Number((goldEnd * Math.pow(progress, 1.05)).toFixed(1));
      const iVal = Number((infEnd * progress).toFixed(1));
      const uVal = Number((usdEnd * Math.pow(progress, 1.02)).toFixed(1));

      // Label
      let label = '';
      if (range === '1M') {
        label = `G-${points - i}`;
      } else if (range === '3M' || range === '6M' || range === '1Y') {
        const d = new Date(now.getFullYear(), now.getMonth() - (points - 1 - i), 1);
        label = d.toLocaleDateString('tr-TR', { month: 'short' });
      } else {
        const d = new Date(now.getFullYear() - Math.round((points - 1 - i) * (range === '5Y' ? 5 : 3) / points), now.getMonth(), 1);
        label = `${d.getFullYear()}/${(d.getMonth() + 1)}`;
      }

      data.push({
        label: i === 0 ? 'Başlangıç' : label,
        [fund.code]: Math.max(0, fVal),
        bist100: Math.max(0, bVal),
        gold: Math.max(0, gVal),
        inflation: Math.max(0, iVal),
        usd: Math.max(0, uVal)
      });
    }

    return data;
  }, [fund, range]);

  const latestReturn = chartData[chartData.length - 1]?.[fund.code] || fund.return1Y;
  const latestBist = chartData[chartData.length - 1]?.bist100 || 52.4;
  const latestInf = chartData[chartData.length - 1]?.inflation || 45.0;
  const alphaVsBist = Number((latestReturn - latestBist).toFixed(1));
  const realGainVsInf = Number((latestReturn - latestInf).toFixed(1));

  return (
    <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp size={16} />
            </span>
            <h4 className="text-sm font-bold text-slate-100">
              Tarihsel Performans & Göreceli Benchmark Kıyaslaması
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {fund.code} fonunun BIST 100, Gram Altın ve Enflasyon (TÜFE) karşısındaki net kümülatif getirisi (%)
          </p>
        </div>

        {/* Time Range Selectors */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['1M', '3M', '6M', '1Y', '3Y', '5Y'] as TimeRange[]).map((t) => (
            <button
              key={t}
              onClick={() => setRange(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                range === t
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.replace('M', 'A').replace('Y', 'Y')}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark Toggle Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 text-[11px] font-medium mr-1">Karşılaştırma Eksenleri:</span>
        
        <button
          onClick={() => setShowBist(!showBist)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer border ${
            showBist 
              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' 
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>BIST 100</span>
          {showBist && <Check size={12} />}
        </button>

        <button
          onClick={() => setShowGold(!showGold)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer border ${
            showGold 
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Gram Altın</span>
          {showGold && <Check size={12} />}
        </button>

        <button
          onClick={() => setShowInflation(!showInflation)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer border ${
            showInflation 
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>TÜFE (Enflasyon)</span>
          {showInflation && <Check size={12} />}
        </button>

        <button
          onClick={() => setShowUsd(!showUsd)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer border ${
            showUsd 
              ? 'bg-blue-950/60 border-blue-500/50 text-blue-300' 
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>USD / TRY</span>
          {showUsd && <Check size={12} />}
        </button>
      </div>

      {/* Chart Area */}
      <div className="h-[280px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 11 }} 
              tickFormatter={(v) => `%${v}`}
              domain={['auto', 'auto']} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#090d16', 
                borderColor: '#334155', 
                borderRadius: '12px', 
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
              }}
              formatter={(value: any, name: any) => [`%${value}`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            {/* Fund Line */}
            <Line 
              type="monotone" 
              dataKey={fund.code} 
              name={`${fund.code} Fon Getirisi`} 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 6 }}
            />

            {/* BIST 100 */}
            {showBist && (
              <Line 
                type="monotone" 
                dataKey="bist100" 
                name="BIST 100 Endeksi" 
                stroke="#06b6d4" 
                strokeWidth={1.8} 
                strokeDasharray="4 4"
                dot={false}
              />
            )}

            {/* Gold */}
            {showGold && (
              <Line 
                type="monotone" 
                dataKey="gold" 
                name="Gram Altın" 
                stroke="#f59e0b" 
                strokeWidth={1.8} 
                dot={false}
              />
            )}

            {/* Inflation */}
            {showInflation && (
              <Line 
                type="monotone" 
                dataKey="inflation" 
                name="Kümülatif TÜFE" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                strokeDasharray="6 3"
                dot={false}
              />
            )}

            {/* USD/TRY */}
            {showUsd && (
              <Line 
                type="monotone" 
                dataKey="usd" 
                name="USD / TRY" 
                stroke="#3b82f6" 
                strokeWidth={1.5} 
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Relative Performance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Dönem Net Getirisi</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
              +{latestReturn}%
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg">
            {range.replace('M', ' Aylık').replace('Y', ' Yıllık')}
          </span>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">BIST 100 Karşısında Alfa</span>
            <div className={`text-base font-bold font-mono mt-0.5 ${alphaVsBist >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {alphaVsBist >= 0 ? `+${alphaVsBist}%` : `${alphaVsBist}%`}
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg">
            {alphaVsBist >= 0 ? 'Piyasa Üstü' : 'Piyasa Altı'}
          </span>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Net Reel Getiri (Enflasyondan Arındırılmış)</span>
            <div className={`text-base font-bold font-mono mt-0.5 ${realGainVsInf >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              {realGainVsInf >= 0 ? `+${realGainVsInf}%` : `${realGainVsInf}%`}
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg">
            {realGainVsInf >= 0 ? 'Alım Gücü Artışı' : 'Negatif Reel'}
          </span>
        </div>
      </div>
    </div>
  );
};
