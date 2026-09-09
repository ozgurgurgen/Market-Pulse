import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Bell, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';
import { LatestBalanceSheetItem } from '../types';
import { exportToCSV } from '../utils/exportUtils';

interface LatestBalanceSheetsSectionProps {
  onSelectStock: (symbol: string) => void;
}

export const LatestBalanceSheetsSection: React.FC<LatestBalanceSheetsSectionProps> = ({ onSelectStock }) => {
  const [items, setItems] = useState<LatestBalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('TÜMÜ');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [emailForAlert, setEmailForAlert] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    safeFetchJson<{ success: boolean; data: LatestBalanceSheetItem[] }>('/api/financials/latest')
      .then(({ data, ok }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setItems(data.data);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)} Mr ₺`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} Mn ₺`;
    return `${val.toLocaleString('tr-TR')} ₺`;
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.symbol.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesVerdict = selectedVerdict === 'TÜMÜ' || item.quarterlyChangeVerdict === selectedVerdict;
    return matchesSearch && matchesVerdict;
  });

  const handleExport = () => {
    const headers = ['Sembol', 'Şirket', 'Dönem', 'Açıklanma Zamanı', 'Satışlar (Hasılat)', 'Satış YoY (%)', 'Net Dönem Kârı', 'Net Kâr YoY (%)', 'FAVÖK', 'FAVÖK YoY (%)', 'Karne Skoru (/18)', 'Bilanço Değerlendirmesi'];
    const rows = filteredItems.map(i => [
      i.symbol,
      i.name,
      i.period,
      i.announcedAt,
      formatCurrency(i.revenueTRY),
      `%${i.revenueYoYPct}`,
      formatCurrency(i.netIncomeTRY),
      `%${i.netIncomeYoYPct}`,
      formatCurrency(i.ebitdaTRY),
      `%${i.ebitdaYoYPct}`,
      `${i.scorecardScore}/18`,
      i.quarterlyChangeVerdict
    ]);

    exportToCSV('Son_Aciklanan_Bilancolar_Akisi', headers, rows);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleRegisterGlobalAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForAlert.includes('@')) return;
    try {
      await safeFetchJson('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailForAlert,
          symbols: ['THYAO', 'FROTO', 'AKBNK', 'ASELS', 'GARAN', 'TUPRS'],
          notifyOnKap: true,
          notifyOnScorecard: true
        })
      });
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 4000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Başlık & Açıklama */}
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Son Açıklanan Bilanço ve Finansal Tablolar</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles size={12} /> Canlı KAP Akışı
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                KAP'a bildirilen resmi çeyreklik gelir tabloları, satış/kâr büyümeleri ve 18 kriterli karne skorları
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                exportSuccess ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Download size={14} className="text-emerald-400" />
              <span>Excel İndir</span>
            </button>
          </div>
        </div>

        {/* E-Posta Alarmı Tanımlama Barı */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Bell size={16} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Bilanço Alarmı:</strong> Yeni bir bilanço veya karne yayınlandığında anında e-posta ile haberdar olun.
            </span>
          </div>

          {alertSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
              <CheckCircle2 size={14} /> Alarm Başarıyla Kaydedildi!
            </div>
          ) : (
            <form onSubmit={handleRegisterGlobalAlert} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                value={emailForAlert}
                onChange={(e) => setEmailForAlert(e.target.value)}
                placeholder="E-posta adresiniz..."
                className="bg-slate-950 px-3 py-1.5 rounded-xl text-xs text-white border border-slate-700 focus:outline-none focus:border-emerald-500 w-full md:w-56"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition whitespace-nowrap cursor-pointer"
              >
                Abone Ol
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2. Arama & Filtreleme */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hisse kodu veya şirket adı..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-500 font-semibold mr-1">Karar:</span>
          {['TÜMÜ', 'BEKLENTİ ÜSTÜ', 'BEKLENTİLERE PARALEL', 'ZAYIF / DÜŞÜŞ'].map((verdict) => (
            <button
              key={verdict}
              onClick={() => setSelectedVerdict(verdict)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                selectedVerdict === verdict
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {verdict}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bilanço Tablosu */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold">
              <th className="py-3 px-4">Hisse & Dönem</th>
              <th className="py-3 px-3 text-right">Satışlar (Hasılat)</th>
              <th className="py-3 px-3 text-right">Satış Büyümesi</th>
              <th className="py-3 px-3 text-right">Net Dönem Kârı</th>
              <th className="py-3 px-3 text-right">Kâr Büyümesi</th>
              <th className="py-3 px-3 text-right">FAVÖK</th>
              <th className="py-3 px-3 text-center">Karne Notu</th>
              <th className="py-3 px-3 text-center">Değerlendirme</th>
              <th className="py-3 px-4 text-center">İncele</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Son açıklanan finansal tablolar alınıyor...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  Filtreye uygun bilanço kaydı bulunamadı.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-900/60 transition cursor-pointer group"
                  onClick={() => onSelectStock(item.symbol)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-emerald-400 font-mono group-hover:border-emerald-500/50 transition">
                        {item.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-emerald-400 transition">{item.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> {item.period} • {item.announcedAt}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                    {formatCurrency(item.revenueTRY)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${item.revenueYoYPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.revenueYoYPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      %{item.revenueYoYPct}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                    {formatCurrency(item.netIncomeTRY)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${item.netIncomeYoYPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.netIncomeYoYPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      %{item.netIncomeYoYPct}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-cyan-400">
                    {formatCurrency(item.ebitdaTRY)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.scorecardScore}/18
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                      item.quarterlyChangeVerdict === 'BEKLENTİ ÜSTÜ' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      item.quarterlyChangeVerdict === 'BEKLENTİLERE PARALEL' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {item.quarterlyChangeVerdict}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(item.symbol);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white font-bold text-xs transition flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <span>Analiz</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
