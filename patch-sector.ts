import fs from 'fs';

const content = `
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, ArrowRight, Activity, Percent } from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';

interface PeerComparisonTabProps {
  symbol: string;
}

export const PeerComparisonTab: React.FC<PeerComparisonTabProps> = ({ symbol }) => {
  const [sectorData, setSectorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // In a real app we would know the sector of the symbol. 
  // Here we'll just mock request 'Teknoloji' or 'Havacılık' based on symbol for demo purposes
  let sectorName = 'Teknoloji';
  if (['THYAO.IS', 'PGSUS.IS', 'TAVHL.IS'].includes(symbol)) sectorName = 'Havacılık';
  if (['FROTO.IS', 'TOASO.IS', 'TSLA'].includes(symbol)) sectorName = 'Otomotiv';

  useEffect(() => {
    const fetchSector = async () => {
      setLoading(true);
      try {
        const res = await safeFetchJson<any>(\`/api/sector/\${encodeURIComponent(sectorName)}\`);
        if (res.ok && res.data) {
          setSectorData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSector();
  }, [symbol]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Sektör verileri yükleniyor...</div>;
  }

  if (!sectorData) {
    return <div className="text-center py-12 text-slate-400">Sektör verisi bulunamadı.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Sektörel Karşılaştırma</h3>
            <p className="text-slate-400 text-sm">{sectorData.sector} ({sectorData.industry})</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">Sektör Ort. F/K</div>
            <div className="text-2xl font-bold text-white">{sectorData.averagePE.toFixed(1)}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">Sektör Ort. PD/DD</div>
            <div className="text-2xl font-bold text-white">{sectorData.averagePB.toFixed(1)}</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center">
            <div className="text-slate-400 text-sm mb-1">Sektör Ort. ROE</div>
            <div className="text-2xl font-bold text-white">{(sectorData.averageROE * 100).toFixed(1)}%</div>
          </div>
        </div>

        <h4 className="text-lg font-bold text-white mb-4">Sektördeki Liderler</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Sıra</th>
                <th className="px-4 py-3 font-medium">Sembol</th>
                <th className="px-4 py-3 font-medium">Şirket</th>
                <th className="px-4 py-3 font-medium text-right">F/K</th>
                <th className="px-4 py-3 font-medium text-right">PD/DD</th>
                <th className="px-4 py-3 font-medium text-right rounded-r-lg">ROE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sectorData.topCompanies.map((comp: any) => (
                <tr key={comp.symbol} className={comp.symbol === symbol ? 'bg-indigo-900/20' : ''}>
                  <td className="px-4 py-3 font-bold text-slate-300">#{comp.rank}</td>
                  <td className="px-4 py-3 font-bold text-indigo-400">{comp.symbol}</td>
                  <td className="px-4 py-3 text-white">{comp.name}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{comp.pe.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{comp.pb.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{(comp.roe * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/StockAnalysis/PeerComparisonTab.tsx', content);
console.log('PeerComparisonTab patched for sector api');
