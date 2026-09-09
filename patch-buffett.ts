import fs from 'fs';

const content = `
import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Info, 
  Layers, 
  CheckCircle2,
  DollarSign,
  PieChart,
  Star,
  Activity,
  Briefcase
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';

interface FundamentalValuationTabProps {
  symbol: string;
}

export const FundamentalValuationTab: React.FC<FundamentalValuationTabProps> = ({ symbol }) => {
  const [buffettData, setBuffettData] = useState<any>(null);
  const [analystData, setAnalystData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [buffettRes, analystRes] = await Promise.all([
          safeFetchJson<any>(\`/api/stock/\${symbol}/buffett\`),
          safeFetchJson<any>(\`/api/stock/\${symbol}/analyst\`)
        ]);
        
        if (buffettRes.ok && buffettRes.data?.data) {
          setBuffettData(buffettRes.data.data);
        }
        if (analystRes.ok && analystRes.data?.data) {
          setAnalystData(analystRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Değerleme modelleri çalıştırılıyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 1. Buffett Valuation */}
      {buffettData && (
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Buffett Değerleme Modeli</h3>
              <p className="text-slate-400 text-sm">Owner Earnings & İndirgenmiş Nakit Akışı (DCF)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">İçsel Değer (Hisse Başı)</div>
              <div className="text-2xl font-bold text-white">
                {buffettData.results.intrinsicValuePerShare.toFixed(2)} ₺
              </div>
              <div className="text-xs text-slate-500 mt-1">Güncel: {buffettData.inputs.currentPrice} ₺</div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Güvenlik Marjı (MoS)</div>
              <div className={\`text-2xl font-bold \${buffettData.results.marginOfSafety > 20 ? 'text-green-400' : buffettData.results.marginOfSafety > 0 ? 'text-yellow-400' : 'text-red-400'}\`}>
                %{buffettData.results.marginOfSafety.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Buffett Skoru</div>
              <div className="text-2xl font-bold text-amber-400">
                {buffettData.results.buffettScore} / 100
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-slate-400 text-sm mb-1">Rating</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                {buffettData.results.rating === 'GÜÇLÜ AL' ? <Sparkles className="w-5 h-5 text-green-400" /> : null}
                {buffettData.results.rating}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
            <h4 className="text-sm font-bold text-white mb-3">Model Girdileri (Temel Oranlar)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><span className="text-slate-400">ROE:</span> <span className="text-white">{(buffettData.inputs.roe * 100).toFixed(1)}%</span></div>
              <div><span className="text-slate-400">Net Marj:</span> <span className="text-white">{(buffettData.inputs.netMargin * 100).toFixed(1)}%</span></div>
              <div><span className="text-slate-400">Borç/Özkaynak:</span> <span className="text-white">{buffettData.inputs.debtToEquity.toFixed(2)}</span></div>
              <div><span className="text-slate-400">OE Yield:</span> <span className="text-white">{buffettData.results.oeYield.toFixed(2)}%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Analyst Ratings */}
      {analystData && (
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Analist Derecelendirmeleri</h3>
              <p className="text-slate-400 text-sm">Wall Street & Yerel Aracı Kurum Hedefleri</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 text-center flex flex-col items-center justify-center">
              <div className="text-slate-400 text-sm mb-2">Konsensüs Tavsiyesi</div>
              <div className="text-3xl font-bold text-green-400 mb-2">{analystData.rating}</div>
              <div className="text-xs text-slate-500">{analystData.analystCount} Analist Görüşü</div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
              <div className="text-slate-400 text-sm mb-4">Hedef Fiyat Beklentileri</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-400">En Yüksek</span>
                  <span className="text-white font-bold">{analystData.targetPriceHigh} ₺</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-400 font-medium">Ortalama</span>
                  <span className="text-white font-bold">{analystData.targetPriceMean} ₺</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-red-400">En Düşük</span>
                  <span className="text-white font-bold">{analystData.targetPriceLow} ₺</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center">
              <div className="text-slate-400 text-sm mb-2">Potansiyel Getiri (Upside)</div>
              <div className="text-4xl font-bold text-blue-400">
                +{analystData.upsidePotential.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500 mt-2">Güncel fiyata göre ({analystData.currentPrice} ₺)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('src/components/StockAnalysis/FundamentalValuationTab.tsx', content);
console.log('FundamentalValuationTab patched for Buffett and Analyst ratings');
