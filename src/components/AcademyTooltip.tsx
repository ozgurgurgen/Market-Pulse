import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ExternalLink, HelpCircle, Sparkles, Calculator, CheckCircle2 } from 'lucide-react';

export interface AcademyDefinition {
  topicId: string;
  title: string;
  categoryLabel: string;
  formula: string;
  shortExplanation: string;
  idealRange: string;
  proTip?: string;
}

export const ACADEMY_DICTIONARY: Record<string, AcademyDefinition> = {
  'pe': {
    topicId: 'pe-ratio',
    title: 'Fiyat / Kazanç (F/K) Oranı',
    categoryLabel: 'Temel Değerleme Oranları',
    formula: 'F/K = Hisse Fiyatı / Hisse Başına Kâr (EPS)',
    shortExplanation: 'Yatırımcının şirketin 1 TL kârı için kaç TL ödemeye razı olduğunu gösterir. Düşük F/K ucuzluğu, yüksek F/K ise büyüme beklentisini veya aşırı fiyatlamayı gösterebilir.',
    idealRange: 'BIST Sanayi ortalaması 6x - 12x arasındadır. Sektör akranlarıyla kıyaslanmalıdır.',
    proTip: 'Döngüsel şirketlerde zirve kârda F/K çok düşük görünerek değer tuzağı oluşturabilir.'
  },
  'pb': {
    topicId: 'pb-ratio',
    title: 'Piyasa Değeri / Defter Değeri (PD/DD)',
    categoryLabel: 'Temel Değerleme Oranları',
    formula: 'PD/DD = Piyasa Değeri / Özkaynaklar',
    shortExplanation: 'Şirketin borsadaki değerinin, muhasebesel net varlıklarına oranını ölçer. 1 altındaki değerler şirketin defter değerinin altında işlem gördüğünü belirtir.',
    idealRange: 'Bankalarda 0.8x - 1.5x, yüksek kârlı sanayide 2.0x - 5.0x normaldir.',
    proTip: 'Enflasyon muhasebesi (TMS 29) sonrası duran varlıklar güncellendiği için PD/DD daha gerçekçi hale gelir.'
  },
  'evebitda': {
    topicId: 'ev-ebitda',
    title: 'Firma Değeri / FAVÖK (FD/FAVÖK)',
    categoryLabel: 'Temel Değerleme Oranları',
    formula: 'FD/FAVÖK = (Piyasa Değeri + Net Borç) / Yıllık FAVÖK',
    shortExplanation: 'Sermaye yapısından ve vergiden bağımsız olarak şirketin ana operasyonel gücünü ölçen en güvenilir çarpanlardan biridir.',
    idealRange: '5.0x - 9.0x arası cazip kabul edilir. 15.0x üzeri pahalı olabilir.',
    proTip: 'Borçlu şirketleri incelerken F/K yerine mutlaka FD/FAVÖK kullanılmalıdır.'
  },
  'roe': {
    topicId: 'dupont-analysis',
    title: 'Özsermaye Kârlılığı (ROE & DuPont)',
    categoryLabel: 'Kârlılık ve Verimlilik',
    formula: 'ROE = Net Kâr / Özkaynaklar = Net Marj × Varlık Devri × Kaldıraç',
    shortExplanation: 'Hissedarların koyduğu sermayenin ne hızla kâra dönüştüğünü gösterir. Enflasyonun üzerindeki ROE, şirketin reel büyüme sağladığını kanıtlar.',
    idealRange: 'Enflasyon oranı + %10 veya en az %30-40 üzeri.',
    proTip: 'ROE artışının sadece borçlanmadan (kaldıraçtan) değil, kâr marjından gelip gelmediği DuPont ile ayrıştırılır.'
  },
  'current_ratio': {
    topicId: 'current-ratio',
    title: 'Cari Oran (Current Ratio)',
    categoryLabel: 'Likidite ve Borç Ödeme Gücü',
    formula: 'Cari Oran = Dönen Varlıklar / Kısa Vadeli Borçlar',
    shortExplanation: 'Şirketin 1 yıl içinde vadesi gelecek borçlarını, nakit ve dönen varlıklarıyla karşılama kabiliyetidir.',
    idealRange: '1.5x - 2.0x arası güvenlidir. 1.0x altı likidite riski taşır.',
    proTip: 'Perakendede (BİM vb.) peşin tahsilat nedeniyle 1.0x normal iken, sanayide 1.5x aranır.'
  },
  'acid_test': {
    topicId: 'acid-test',
    title: 'Asit-Test (Likidite) Oranı',
    categoryLabel: 'Likidite ve Borç Ödeme Gücü',
    formula: 'Asit-Test = (Dönen Varlıklar - Stoklar) / Kısa Vadeli Borçlar',
    shortExplanation: 'Stoklar paraya çevrilemese bile şirketin en acil borçlarını ödeyebilme gücüdür.',
    idealRange: '1.0x ve üzeri ideal kabul edilir.',
    proTip: 'Stokları yavaş eriyen gayrimenkul ve otomotiv sektöründe Cari Orandan daha kritiktir.'
  },
  'net_debt_ebitda': {
    topicId: 'net-debt-ebitda',
    title: 'Net Borç / FAVÖK',
    categoryLabel: 'Borçluluk ve Risk',
    shortExplanation: 'Şirketin operasyonel nakit kârıyla (FAVÖK) net borcunu kaç yılda sıfırlayabileceğini ölçer.',
    formula: 'Net Borç / FAVÖK = (Finansal Borçlar - Nakit) / FAVÖK',
    idealRange: '2.5x altı güvenli, 3.5x üzeri riskli, 5.0x üzeri çok tehlikelidir.',
    proTip: 'Oran 3x üzerine çıktığında yükselen faizler net kârı tamamen eritebilir.'
  },
  'peg': {
    topicId: 'peg-ratio',
    title: 'PEG Rasyosu (Peter Lynch)',
    categoryLabel: 'Temel Değerleme Oranları',
    formula: 'PEG = F/K Oranı / Beklenen Yıllık Kâr Büyümesi (%)',
    shortExplanation: 'F/K çarpanını kâr büyümesiyle ilişkilendirir. Yüksek F/K lı hızlı büyüyen şirketlerin ucuz olup olmadığını saptar.',
    idealRange: '1.0 altı ucuz (kelepir), 1.0 adil, 1.5 üzeri pahalı.',
    proTip: 'Peter Lynch in en sevdiği rasyodur. Büyüme reel ve sürdürülebilir olmalıdır.'
  },
  'fcf': {
    topicId: 'free-cash-flow',
    title: 'Serbest Nakit Akımı (FCF)',
    categoryLabel: 'Değerleme ve Nakit Akışı',
    formula: 'FCF = Faaliyet Nakit Akışı - Yatırım Harcamaları (CAPEX)',
    shortExplanation: 'Zorunlu fabrika ve teknoloji yatırımları sonrası kasada kalan gerçek, dağıtılabilir nakittir.',
    idealRange: 'FCF / Net Kâr > %80 olmalıdır.',
    proTip: 'Net kâr muhasebeseldir, Serbest Nakit ise gerçektir ve temettünün ana kaynağıdır.'
  },
  'tms29': {
    topicId: 'tms29-inflation',
    title: 'TMS 29 Enflasyon Muhasebesi',
    categoryLabel: 'Bilanço ve Karne Okuma',
    formula: 'Parasal Kazanç/Kayıp + Duran Varlık Yeniden Değerlemesi',
    shortExplanation: 'Yüksek enflasyon ortamında bilançoların satın alma gücüne göre reel olarak düzeltilmesidir.',
    idealRange: 'Parasal borçlu (net borçlu) şirketler enflasyon kazancı yazar.',
    proTip: 'Kasasında aşırı nakit tutan şirketler enflasyon muhasebesinde parasal kayıp yazar.'
  },
  'sharpe': {
    topicId: 'sharpe-ratio',
    title: 'Sharpe Oranı (Risk-Getiri Verimi)',
    categoryLabel: 'Fon & Portföy Verimliliği',
    formula: 'Sharpe = (Fon Getirisi - Risksiz Faiz) / Fon Volatilitesi',
    shortExplanation: 'Alınan 1 birim riske karşılık fonun ne kadar ek getiri ürettiğini ölçer.',
    idealRange: '1.5 üzeri iyi, 2.0 üzeri çok başarılıdır.',
    proTip: 'İki fon aynı getiriyi sağlasa bile Sharpe oranı yüksek olan daha az stresli ve disiplinlidir.'
  },
  'standard_deviation': {
    topicId: 'volatility',
    title: 'Standart Sapma (Volatilite)',
    categoryLabel: 'Fon & Portföy Verimliliği',
    formula: 'Standart Sapma = Getirilerin Ortalamadan Ayrışma Derecesi',
    shortExplanation: 'Fonun veya hissenin fiyat dalgalanma şiddetidir. Yüksek oran ani sert iniş ve çıkışları gösterir.',
    idealRange: 'Para piyasası fonlarında %1-3, hisse yoğun fonlarda %15-28 normaldir.',
    proTip: 'Yüksek volatilite, uzun vadeli kademeli alım yapanlar için fırsat penceresi yaratır.'
  },
  'max_drawdown': {
    topicId: 'max-drawdown',
    title: 'Maksimum Kayıp (Max Drawdown)',
    categoryLabel: 'Fon & Portföy Verimliliği',
    formula: 'Max DD = (Dip Fiyat - Önceki Zirve Fiyat) / Önceki Zirve Fiyat',
    shortExplanation: 'Fonun tarihindeki en tepe noktadan en dip noktaya yaşadığı en sert sermaye kaybıdır.',
    idealRange: 'Hisse fonlarında -%15 ile -%30 arası tolere edilir.',
    proTip: 'Kriz anlarında fon yöneticisinin savunma gücünü en net gösteren metriktir.'
  },
  'golden_cross': {
    topicId: 'golden-cross',
    title: 'Altın Kesişme (Golden Cross)',
    categoryLabel: 'Teknik Analiz & Trendler',
    formula: '50 Günlük SMA > 200 Günlük SMA (Yukarı Kesişme)',
    shortExplanation: 'Kısa vadeli hareketli ortalamanın uzun vadeli ortalamayı yukarı kırmasıyla oluşan güçlü boğa trendi sinyalidir.',
    idealRange: 'Hacim artışıyla teyit edildiğinde güçlü yükseliş dalgası başlatır.',
    proTip: 'Haftalık grafiklerdeki Altın Kesişmeler aylarca sürecek mega trendlerin habercisidir.'
  },
  'death_cross': {
    topicId: 'death-cross',
    title: 'Ölüm Kesişmesi (Death Cross)',
    categoryLabel: 'Teknik Analiz & Trendler',
    formula: '50 Günlük SMA < 200 Günlük SMA (Aşağı Kesişme)',
    shortExplanation: 'Kısa vadeli ortalamanın uzun vadeli ortalamayı aşağı kırmasıyla oluşan ayı piyasası sinyalidir.',
    idealRange: 'Riskleri azaltmak ve stop-loss seviyelerini sıkılaştırmak için kullanılır.',
    proTip: 'Gecikmeli bir göstergedir; ancak majör düşüş trendlerinden korunmada hayati önem taşır.'
  }
};

// Aliases lookup map
const ALIAS_MAP: Record<string, string> = {
  'f/k': 'pe',
  'fk': 'pe',
  'p/e': 'pe',
  'fiyat/kazanç': 'pe',
  'pd/dd': 'pb',
  'p/b': 'pb',
  'fd/favök': 'evebitda',
  'fd/favok': 'evebitda',
  'ev/ebitda': 'evebitda',
  'roe': 'roe',
  'dupont': 'roe',
  'özsermaye kârlılığı': 'roe',
  'cari oran': 'current_ratio',
  'current ratio': 'current_ratio',
  'asit test': 'acid_test',
  'asit-test': 'acid_test',
  'likidite oranı': 'acid_test',
  'net borç / favök': 'net_debt_ebitda',
  'net borc/favok': 'net_debt_ebitda',
  'peg': 'peg',
  'peg rasyosu': 'peg',
  'serbest nakit akımı': 'fcf',
  'fcf': 'fcf',
  'free cash flow': 'fcf',
  'tms 29': 'tms29',
  'tms29': 'tms29',
  'enflasyon muhasebesi': 'tms29',
  'sharpe': 'sharpe',
  'sharpe oranı': 'sharpe',
  'sharpe rasyosu': 'sharpe',
  'standart sapma': 'standard_deviation',
  'volatilite': 'standard_deviation',
  'max drawdown': 'max_drawdown',
  'maksimum kayıp': 'max_drawdown',
  'golden cross': 'golden_cross',
  'altın kesişme': 'golden_cross',
  'death cross': 'death_cross',
  'ölüm kesişmesi': 'death_cross'
};

export function getAcademyInfo(term: string): AcademyDefinition | null {
  const normalized = term.toLowerCase().trim();
  if (ACADEMY_DICTIONARY[normalized]) return ACADEMY_DICTIONARY[normalized];
  const mappedKey = ALIAS_MAP[normalized];
  if (mappedKey && ACADEMY_DICTIONARY[mappedKey]) return ACADEMY_DICTIONARY[mappedKey];
  return null;
}

interface AcademyTooltipProps {
  term: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

export const AcademyTooltip: React.FC<AcademyTooltipProps> = ({
  term,
  children,
  showIcon = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const info = getAcademyInfo(term);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!info) {
    return <span className={className}>{children || term}</span>;
  }

  const handleNavigateToAcademy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
    window.dispatchEvent(
      new CustomEvent('navigate-to-academy', {
        detail: { topicId: info.topicId, title: info.title }
      })
    );
  };

  return (
    <span 
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 cursor-help group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="border-b border-dotted border-indigo-400/70 group-hover:border-indigo-400 text-inherit">
        {children || term}
      </span>
      {showIcon && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-indigo-400/80 hover:text-indigo-300 transition-colors p-0.5"
          title="Akademi Bilgisi"
        >
          <HelpCircle size={12} />
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div 
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-slate-950/95 border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-md text-left cursor-default animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <BookOpen size={11} />
              </div>
              <h5 className="font-bold text-white text-xs leading-none">{info.title}</h5>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-indigo-800/60">
              {info.categoryLabel}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
            {info.shortExplanation}
          </p>

          <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
              <Calculator size={10} /> Formül:
            </div>
            <div className="font-mono text-[10px] text-emerald-400 break-words">
              {info.formula}
            </div>
          </div>

          <div className="mt-2 flex items-start gap-1 text-[11px] text-slate-300">
            <span className="text-emerald-400 font-bold shrink-0">İdeal:</span>
            <span>{info.idealRange}</span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">MarketPulse Akademi</span>
            <button
              type="button"
              onClick={handleNavigateToAcademy}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
            >
              <span>Akademi'de İncele</span>
              <ExternalLink size={10} />
            </button>
          </div>
        </div>
      )}
    </span>
  );
};
export default AcademyTooltip;
