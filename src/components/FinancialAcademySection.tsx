import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ChevronDown, ChevronUp, Calculator, Sparkles, ShieldAlert, CheckCircle2, GraduationCap, PlayCircle, BarChart3, Bot, Bell, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AcademyTopic {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  shortDescription: string;
  formula: string;
  interpretationGuide: string;
  idealRange: string;
  practicalExample: string;
  commonMistakes: string[];
  proTip: string;
  iconName: string;
}

const APP_GUIDE_STEPS = [
  {
    id: 'ai-analysis',
    title: 'Yapay Zeka Analiz Motoru',
    icon: Bot,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    content: 'Piyasalardaki karmaşık verileri saniyeler içinde yorumlayın. "Piyasa Fırsatları" ekranından veya arama çubuğundan bir hisse seçerek, temel analiz, teknik göstergeler ve haber duyarlılıklarını birleştiren kapsamlı yapay zeka raporlarına erişebilirsiniz.'
  },
  {
    id: 'screener',
    title: '18 Kriterli Filtreleme (Radar)',
    icon: BarChart3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    content: 'Türkiye\'nin en gelişmiş temel analiz filtrelemesi. Kârlılık, Büyüme ve Borçluluk olmak üzere 3 ana kategoride 18 farklı kriterle şirketlerin mali sağlık durumunu puanlıyoruz. 14/18 ve üzeri puan alan şirketler "Güçlü" olarak işaretlenir.'
  },
  {
    id: 'backtest',
    title: 'Algoritmik Backtest',
    icon: PlayCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    content: 'Seçtiğiniz yatırım araçlarının geçmiş performanslarını simüle edin. BIST hisseleri ve TEFAS fonlarını aynı sepete koyarak, örneğin "2 yıl önce 100.000 TL yatırsaydım ne olurdu?" sorusunun yanıtını enflasyon ve dolar bazında görün.'
  },
  {
    id: 'portfolio',
    title: 'Akıllı Portföy Yönetimi',
    icon: Briefcase,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    content: 'Gerçek zamanlı portföy takibi. Hisselerinizi ve fonlarınızı portföyünüze ekleyerek günlük kâr/zarar durumunuzu izleyin. Portföy AI asistanı, sepetinizdeki risk dağılımını analiz ederek sektörel çeşitlendirme tavsiyeleri verir.'
  },
  {
    id: 'telegram',
    title: 'Telegram Komuta Merkezi',
    icon: Bell,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
    content: 'Ayarlar menüsünden hesabınızı Telegram botumuzla eşleştirin. Takip listenizdeki hisselerin bilanço açıklamaları, KAP haberleri ve teknik sinyalleri anında cebinize gelsin. Ayrıca bot üzerinden /rapor komutuyla anlık analiz isteyebilirsiniz.'
  }
];

export const FinancialAcademySection: React.FC = () => {
  const [topics, setTopics] = useState<AcademyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TÜMÜ');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [activeGuideStep, setActiveGuideStep] = useState(0);
  useEffect(() => {
    const handleNavigate = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.topicId) {
        setExpandedTopicId(detail.topicId);
        setTimeout(() => {
          const el = document.getElementById('academy-topic-' + detail.topicId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    };
    window.addEventListener('navigate-to-academy', handleNavigate);
    return () => window.removeEventListener('navigate-to-academy', handleNavigate);
  }, []);


  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch('/api/academy/topics')
      .then(res => res.json())
      .then(({ data, success }) => {
        if (!isMounted) return;
        if (success && data) {
          setTopics(data);
        }
      })
      .catch(err => console.error("Academy error:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryMap: Record<string, string> = {
    'TÜMÜ': 'TÜMÜ',
    'TEMEL ORANLAR': 'temel_oranlar',
    'BİLANÇO & KARNE': 'bilanco_okuma',
    'DEĞERLEME': 'degerleme_modelleri',
    'LİKİDİTE': 'likidite_oranlari',
    'BORÇLULUK': 'borcluluk',
    'KÂRLILIK': 'karlilik'
  };

  const uiCategories = Object.keys(categoryMap);

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
                          t.interpretationGuide.toLowerCase().includes(search.toLowerCase());
    
    const mappedCat = categoryMap[selectedCategory];
    const matchesCat = mappedCat === 'TÜMÜ' || t.category === mappedCat;
    
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* APP USAGE GUIDE ANIMATED SECTION */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <GraduationCap size={200} />
        </div>
        
        <div className="flex flex-col gap-6 relative z-10">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <PlayCircle className="text-emerald-400" size={24} />
              Platform Kullanım Rehberi
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              MarketPulse AI özelliklerini nasıl tam kapasiteyle kullanabileceğinizi öğrenin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step Navigation */}
            <div className="col-span-1 flex flex-col gap-2">
              {APP_GUIDE_STEPS.map((step, idx) => {
                const isActive = activeGuideStep === idx;
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveGuideStep(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isActive 
                        ? 'bg-slate-800 border-l-4 border-indigo-500 shadow-md' 
                        : 'hover:bg-slate-800/50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? step.bg : 'bg-slate-800'}`}>
                      <Icon size={16} className={`${isActive ? step.color : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Content Content */}
            <div className="col-span-1 lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex items-center relative overflow-hidden min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGuideStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${APP_GUIDE_STEPS[activeGuideStep].bg}`}>
                      {React.createElement(APP_GUIDE_STEPS[activeGuideStep].icon, { 
                        size: 24, 
                        className: APP_GUIDE_STEPS[activeGuideStep].color 
                      })}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-white">
                        {APP_GUIDE_STEPS[activeGuideStep].title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {APP_GUIDE_STEPS[activeGuideStep].content}
                      </p>
                      <div className="pt-2">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-bold rounded-lg border border-indigo-500/20">
                           <Sparkles size={14} /> İpucu: Bu özelliği hemen menüden test edebilirsiniz.
                         </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Header Banner */}
      <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Finansal Rasyolar Ansiklopedisi</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Fiyat/Kazanç, Cari Oran, DuPont, Enflasyon Muhasebesi ve daha fazlası için detaylı rehber.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800 pb-1">
          {uiCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Arama Çubuğu */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rasyo veya terim ara (örn: Cari Oran, ROE, Net Borç, PEG)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-lg"
        />
      </div>

      {/* 3. Konular Akordeon & Kart Listesi */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Akademi rehberi yükleniyor...
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
            Aramanıza uygun bir terim bulunamadı.
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div 
                key={topic.id}
                id={`academy-topic-${topic.id}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? 'bg-slate-950 border-indigo-500/40 shadow-xl' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{topic.title}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-900 text-indigo-300 border border-indigo-800/60">
                          {topic.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{topic.shortDescription}</p>
                    </div>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4">
                        
                        {/* Formül & Tanım */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                            <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 uppercase">
                              <Calculator size={13} /> Matematiksel Formül
                            </div>
                            <div className="font-mono font-bold text-xs text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              {topic.formula}
                            </div>
                          </div>
                          
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                            <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 uppercase">
                              <Sparkles size={13} /> İdeal Eşik &amp; Karşılaştırma
                            </div>
                            <div className="text-xs text-slate-200 leading-relaxed pt-0.5">
                              {topic.interpretationGuide} <br/>
                              <span className="text-indigo-300 font-medium">Önerilen: </span> {topic.idealRange}
                            </div>
                          </div>
                        </div>

                        {/* Dikkat Edilecekler & Tuzaklar */}
                        {topic.commonMistakes && topic.commonMistakes.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                              <ShieldAlert size={13} /> Sık Yapılan Hatalar &amp; Tuzaklar
                            </div>
                            <ul className="text-xs text-amber-200/90 leading-relaxed list-disc list-inside space-y-1">
                              {topic.commonMistakes.map((mistake, i) => (
                                <li key={i}>{mistake}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Örnek Senaryo */}
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                            <CheckCircle2 size={13} /> Pratik Borsa Örneği
                          </div>
                          <p className="text-xs text-emerald-200/90 leading-relaxed">
                            {topic.practicalExample}
                          </p>
                        </div>
                        
                        {/* Pro Tip */}
                        {topic.proTip && (
                          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-1">
                            <div className="text-[11px] font-bold text-blue-400 flex items-center gap-1.5 uppercase">
                              <GraduationCap size={13} /> Profesyonel İpucu
                            </div>
                            <p className="text-xs text-blue-200/90 leading-relaxed font-medium">
                              {topic.proTip}
                            </p>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default FinancialAcademySection;
