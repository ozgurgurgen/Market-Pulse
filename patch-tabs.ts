import fs from 'fs';

let content = fs.readFileSync('src/components/EconomicIndicators/EconomicIndicatorsPage.tsx', 'utf8');

const tabHtml = `
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50 w-fit">
        <button
          onClick={() => setActiveMainTab('overview')}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer \${
            activeMainTab === 'overview'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }\`}
        >
          <Activity size={16} />
          <span>Genel Bakış</span>
        </button>
        <button
          onClick={() => setActiveMainTab('charts')}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer \${
            activeMainTab === 'charts'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }\`}
        >
          <BarChart3 size={16} />
          <span>Grafikler & Zaman Serileri</span>
        </button>
        <button
          onClick={() => setActiveMainTab('calendar')}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer \${
            activeMainTab === 'calendar'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }\`}
        >
          <Clock size={16} />
          <span>Ekonomik Takvim</span>
          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Yeni
          </span>
        </button>
      </div>

      {/* 3. SEKME İÇERİKLERİ */}
      {activeMainTab === 'charts' ? (
        <MacroChartsSection />
      ) : activeMainTab === 'calendar' ? (
        <EconomicCalendarTab />
      ) : (
        <div className="space-y-6">
`;

// we need to find exactly where to replace it.
// Let's just do a regex replace.
const regex = /<div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-900\/60 p-1\.5 rounded-2xl border border-slate-700\/50 w-fit">[\s\S]*?<div className="space-y-6">/;

content = content.replace(regex, tabHtml);
fs.writeFileSync('src/components/EconomicIndicators/EconomicIndicatorsPage.tsx', content);

console.log('Tabs patched');
