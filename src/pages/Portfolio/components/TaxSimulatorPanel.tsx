import React, { useState, useMemo } from 'react';
import {
  Receipt,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  FileText,
  Sparkles,
  Info,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { PortfolioHoldingSnapshot } from '../../../types';
import { calculatePortfolioTax, PortfolioTaxSummary } from '../utils/taxCalculator';

interface TaxSimulatorPanelProps {
  holdings: PortfolioHoldingSnapshot[];
  baseCurrency?: string;
  portfolioName?: string;
}

export const TaxSimulatorPanel: React.FC<TaxSimulatorPanelProps> = ({
  holdings,
  baseCurrency = 'TRY',
  portfolioName = 'Portföy',
}) => {
  // Scenario controls
  const [liquidationPct, setLiquidationPct] = useState<number>(100);
  const [incomeTaxBracketPct, setIncomeTaxBracketPct] = useState<number>(20);
  const [fundWithholdingRatePct, setFundWithholdingRatePct] = useState<number>(10);
  const [showLegalGuide, setShowLegalGuide] = useState<boolean>(false);

  // Compute tax metrics
  const taxSummary: PortfolioTaxSummary = useMemo(() => {
    return calculatePortfolioTax(holdings, {
      liquidationPct,
      incomeTaxBracketPct,
      fundWithholdingRatePct,
    });
  }, [holdings, liquidationPct, incomeTaxBracketPct, fundWithholdingRatePct]);

  const currencySymbol = baseCurrency === 'USD' ? '$' : '₺';

  return (
    <div className="space-y-6">
      {/* 1. Üst Başlık & Senaryo Ayarları */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-purple-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md shadow-rose-950/30">
              <Receipt size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">Detaylı Vergi Simülatörü & Net Nakit Projeksiyonu</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-extrabold uppercase">
                  GVK & Stopaj v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mevcut portföyünüzün tasfiyesinde doğacak stopaj, değer artış kazancı vergisi ve ele geçecek net nakit tutarını simüle edin.
              </p>
            </div>
          </div>

          {/* Senaryo Seçiciler */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tasfiye Oranı */}
            <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Tasfiye:</span>
              {[25, 50, 75, 100].map(pct => (
                <button
                  key={pct}
                  onClick={() => setLiquidationPct(pct)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    liquidationPct === pct
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  %{pct}
                </button>
              ))}
            </div>

            {/* Gelir Vergisi Dilimi (Yurt Dışı Hisseler İçin) */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">GVK Dilimi:</span>
              <select
                value={incomeTaxBracketPct}
                onChange={(e) => setIncomeTaxBracketPct(Number(e.target.value))}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value={15}>%15 (1. Dilim)</option>
                <option value={20}>%20 (2. Dilim)</option>
                <option value={27}>%27 (3. Dilim)</option>
                <option value={35}>%35 (4. Dilim)</option>
                <option value={40}>%40 (5. Dilim)</option>
              </select>
            </div>

            {/* Fon Stopaj Oranı */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Fon Stopajı:</span>
              <select
                value={fundWithholdingRatePct}
                onChange={(e) => setFundWithholdingRatePct(Number(e.target.value))}
                className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value={10}>%10 (Güncel Oran)</option>
                <option value={15}>%15 (Mevzuat Üst Sınır)</option>
                <option value={7.5}>%7.5 (İndirimli)</option>
              </select>
            </div>

            <button
              onClick={() => setShowLegalGuide(!showLegalGuide)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText size={14} className="text-rose-400" />
              Mevzuat Rehberi
            </button>
          </div>
        </div>

        {/* 2. Özet Metrik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tasfiye Değeri</span>
            <div className="text-xl font-black text-white mt-1">
              {currencySymbol}{Math.round(taxSummary.totalPortfolioValue).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Portföyün %{liquidationPct}'lik kısmı</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Brüt Kâr / Kazanç</span>
            <div
              className={`text-xl font-black mt-1 ${
                taxSummary.totalGrossGain >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {taxSummary.totalGrossGain >= 0 ? '+' : ''}{currencySymbol}{Math.round(taxSummary.totalGrossGain).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Toplam Maliyet: {currencySymbol}{Math.round(taxSummary.totalCostValue).toLocaleString('tr-TR')}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tahmini Toplam Vergi</span>
            <div className="text-xl font-black text-rose-400 mt-1">
              {currencySymbol}{Math.round(taxSummary.totalEstimatedTax).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Stopaj & Gelir Vergisi Yükü</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Ele Geçecek Nakit</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {currencySymbol}{Math.round(taxSummary.totalNetRealizedCash).toLocaleString('tr-TR')}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Net Kâr: {currencySymbol}{Math.round(taxSummary.totalNetGain).toLocaleString('tr-TR')}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Efektif Vergi Oranı</span>
            <div className="text-xl font-black text-amber-400 mt-1">
              %{taxSummary.portfolioEffectiveTaxRate}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] text-slate-400">Verimlilik Skoru:</span>
              <span className="text-xs font-extrabold text-emerald-400">{taxSummary.taxEfficiencyScore}/100</span>
            </div>
          </div>
        </div>

        {/* Danışman Tavsiyeleri & Notlar */}
        {taxSummary.advisoryNotes.length > 0 && (
          <div className="mt-5 space-y-2">
            {taxSummary.advisoryNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <div className="text-base leading-none shrink-0 mt-0.5">{note.slice(0, 2)}</div>
                <div>{note.slice(2).trim()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Mevzuat & Vergi Rehberi Açılır Kutusu */}
      {showLegalGuide && (
        <div className="bg-slate-900/95 border border-slate-800 p-6 rounded-3xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Building2 size={16} className="text-rose-400" />
              Türkiye Bireysel Yatırımcı Vergi Mevzuatı Özeti (2026)
            </h3>
            <button
              onClick={() => setShowLegalGuide(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Kapat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> BIST Pay Senetleri (%0 Stopaj)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Gelir Vergisi Kanunu Geçici 67. Madde uyarınca Borsa İstanbul hisse senedi alım-satım kazançları <strong>%0 nihai tevkifata (stopaj)</strong> tabidir. Kazanç tutarı ne olursa olsun yıllık gelir vergisi beyannamesi verilmez.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> TEFAS Hisse Yoğun Fonlar (%0 Stopaj)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Portföyünün en az %80'i sürekli olarak BIST pay senetlerinden oluşan yerli yatırım fonları (hisse senedi şemsiye fonları) katılma paylarının elden çıkarılmasından doğan kazançlar <strong>%0 stopaja</strong> tabidir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle size={14} /> Diğer TEFAS Fonları (%10 Stopaj)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Para Piyasası, Borçlanma Araçları, Değişken ve Fon Sepeti fonlarında satış anında kaynakta <strong>%10 stopaj</strong> kesilir. Nihai vergidir, ek beyan gerekmez.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle size={14} /> Yurt Dışı Hisseler (GVK Değer Artışı)
              </div>
              <p className="text-slate-400 leading-relaxed">
                ABD (NASDAQ/NYSE) hisseleri alım-satım kazançları TL bazında hesaplanır. Alış-satış arasındaki Yİ-ÜFE artışı %10'u geçerse endeksleme yapılır. Kalan kâr, yıllık gelir vergisi tarifesine (%15-%40) göre beyan edilir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="font-bold text-sky-400 flex items-center gap-1.5">
                <Info size={14} /> ABD Temettü Stopajı (W-8BEN)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Türkiye-ABD Çifte Vergilendirmeyi Önleme Anlaşması kapsamında W-8BEN formu ile ABD'de <strong>%20 stopaj</strong> kesilir. Bu tutar Türkiye'de yıllık beyannamede ödenecek vergiden mahsup edilebilir.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Vergi Kaybı Hasadı (Tax-Loss Harvesting)
              </div>
              <p className="text-slate-400 leading-relaxed">
                Aynı takvim yılı içinde yurt dışı hisselerdeki zararlar, kâr edilen pozisyonların kârından mahsup edilerek toplam vergi matrahını düşürür.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Vergi Kaybı Hasadı Fırsatları (Tax-Loss Harvesting) */}
      {taxSummary.taxHarvestingOpportunities.length > 0 && (
        <div className="bg-slate-900/90 border border-amber-500/30 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">
                Vergi Kaybı Hasadı Fırsatları (Tax-Loss Harvesting)
              </h3>
              <p className="text-xs text-slate-400">
                Zarardaki bu pozisyonları realize ederek diğer kârlı işlemlerinizdeki vergi matrahını doğrudan düşürebilirsiniz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {taxSummary.taxHarvestingOpportunities.map(opp => (
              <div
                key={opp.ticker}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-black text-white text-sm">{opp.ticker}</span>
                    <span className="text-slate-400 block text-[11px]">{opp.name || 'Varlık'}</span>
                  </div>
                  <span className="text-rose-400 font-bold">
                    -{currencySymbol}{Math.round(opp.unrealizedLoss).toLocaleString('tr-TR')} Zarar
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Potansiyel Vergi Tasarrufu:</span>
                  <strong className="text-sm font-black">+{currencySymbol}{Math.round(opp.potentialTaxOffset).toLocaleString('tr-TR')}</strong>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {opp.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Varlık Bazında Vergi ve Likidasyon Tablosu */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
              <Receipt size={16} className="text-rose-400" />
              Varlık Bazında Vergi Yükü & Net Realizasyon Tablosu
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Her bir varlığın alış maliyeti, vergi rejimi, stopaj oranı ve satışta ele geçecek net nakit tutarı.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Tasfiye Senaryosu: %{liquidationPct} Satış
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Varlık</th>
                <th className="pb-3">Vergi Rejimi</th>
                <th className="pb-3 text-right">Alış Maliyeti</th>
                <th className="pb-3 text-right">Güncel Değer</th>
                <th className="pb-3 text-right">Brüt Kâr/Zarar</th>
                <th className="pb-3 text-right">Vergi Oranı</th>
                <th className="pb-3 text-right">Tahmini Vergi</th>
                <th className="pb-3 text-right pr-2">Net Ele Geçecek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {taxSummary.holdingsTax.map(h => (
                <tr key={h.ticker} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="font-black text-white text-xs">{h.ticker}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{h.name || h.assetClass}</div>
                  </td>

                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block whitespace-nowrap ${
                        h.appliedTaxRate === 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : h.appliedTaxRate >= 20
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {h.taxRegimeLabel}
                    </span>
                  </td>

                  <td className="py-3 text-right text-slate-400">
                    {currencySymbol}{Math.round(h.costValue).toLocaleString('tr-TR')}
                  </td>

                  <td className="py-3 text-right font-bold text-white">
                    {currencySymbol}{Math.round(h.currentValue).toLocaleString('tr-TR')}
                  </td>

                  <td className="py-3 text-right font-bold">
                    <span className={h.grossGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {h.grossGain >= 0 ? '+' : ''}{currencySymbol}{Math.round(h.grossGain).toLocaleString('tr-TR')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      %{h.grossGainPct > 0 ? `+${h.grossGainPct}` : h.grossGainPct}
                    </span>
                  </td>

                  <td className="py-3 text-right font-black text-slate-300">
                    %{h.appliedTaxRate}
                  </td>

                  <td className="py-3 text-right font-bold text-rose-400">
                    {h.estimatedTaxLiability > 0 ? (
                      `-${currencySymbol}${Math.round(h.estimatedTaxLiability).toLocaleString('tr-TR')}`
                    ) : (
                      <span className="text-emerald-400 font-semibold">₺0 (Muaf)</span>
                    )}
                  </td>

                  <td className="py-3 text-right pr-2 font-black text-emerald-400">
                    {currencySymbol}{Math.round(h.netRealizedCash).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700 font-black text-white text-xs">
                <td className="pt-3 pl-2" colSpan={2}>Toplam Tasfiye Özeti</td>
                <td className="pt-3 text-right text-slate-400">
                  {currencySymbol}{Math.round(taxSummary.totalCostValue).toLocaleString('tr-TR')}
                </td>
                <td className="pt-3 text-right">
                  {currencySymbol}{Math.round(taxSummary.totalPortfolioValue).toLocaleString('tr-TR')}
                </td>
                <td className={`pt-3 text-right ${taxSummary.totalGrossGain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currencySymbol}{Math.round(taxSummary.totalGrossGain).toLocaleString('tr-TR')}
                </td>
                <td className="pt-3 text-right text-amber-400">
                  %{taxSummary.portfolioEffectiveTaxRate}
                </td>
                <td className="pt-3 text-right text-rose-400">
                  -{currencySymbol}{Math.round(taxSummary.totalEstimatedTax).toLocaleString('tr-TR')}
                </td>
                <td className="pt-3 text-right pr-2 text-emerald-400 text-sm">
                  {currencySymbol}{Math.round(taxSummary.totalNetRealizedCash).toLocaleString('tr-TR')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
