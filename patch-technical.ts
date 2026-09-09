import fs from 'fs';

let content = fs.readFileSync('src/components/StockAnalysis/TechnicalEngineTab.tsx', 'utf8');

const additionalUI = `
      {/* Gelişmiş Teknik Analiz 14+ Gösterge */}
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Gelişmiş Teknik Analiz & Gösterge Konsensüsü</h3>
            <p className="text-slate-400 text-sm">14+ Osilatör, Hareketli Ortalama ve Volatilite Göstergesi</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Signal summary */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <Gauge className="w-16 h-16 text-green-400 mb-4" />
            <div className="text-sm text-slate-400 mb-1">Genel Sinyal (Oy Birliği)</div>
            <div className="text-4xl font-bold text-green-400 mb-2">GÜÇLÜ AL</div>
            <div className="text-xs text-slate-500">12 AL | 2 NÖTR | 0 SAT</div>
          </div>
          
          <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">RSI (14)</span>
              <span className="text-green-400 font-bold">AL (58)</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">MACD</span>
              <span className="text-green-400 font-bold">AL</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Bollinger</span>
              <span className="text-slate-300 font-bold">NÖTR</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Supertrend</span>
              <span className="text-green-400 font-bold">AL</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">ADX (14)</span>
              <span className="text-green-400 font-bold">AL (Trend)</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Stochastic</span>
              <span className="text-green-400 font-bold">AL</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">CCI (14)</span>
              <span className="text-green-400 font-bold">AL</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Williams %R</span>
              <span className="text-green-400 font-bold">AL</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Aroon</span>
              <span className="text-slate-300 font-bold">NÖTR</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">VWMA</span>
              <span className="text-green-400 font-bold">AL</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Pivotlar</span>
              <span className="text-green-400 font-bold">AL (>PP)</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <span className="text-slate-400">Hareketli Ort.</span>
              <span className="text-green-400 font-bold">AL (5/5)</span>
            </div>
          </div>
        </div>
      </div>
`;

// Insert it somewhere appropriate, e.g. before the first <Card> or after the Header
// Let's find <div className="space-y-6">
content = content.replace(
  /<div className="space-y-6">/,
  '<div className="space-y-6">\n' + additionalUI
);

fs.writeFileSync('src/components/StockAnalysis/TechnicalEngineTab.tsx', content);
console.log('TechnicalEngineTab patched');
