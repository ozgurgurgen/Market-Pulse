import fs from 'fs';

let content = fs.readFileSync('src/components/AdvancedScreenerSection.tsx', 'utf8');

// I need to add a UI selector for presets and call the new API if a preset is active, otherwise call the original filter logic.
const presetUI = `
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50">
        <button
          onClick={() => { setActivePreset(null); fetchFilteredStocks(); }}
          className={\`px-4 py-2 rounded-xl text-sm font-medium transition-colors \${
            activePreset === null ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }\`}
        >
          <SlidersHorizontal className="w-4 h-4 inline-block mr-2" />
          Özel Filtreleme
        </button>
        
        {['OVERSOLD', 'OVERBOUGHT', 'BULLISH_MOMENTUM', 'BEARISH_MOMENTUM', 'HIGH_VOLUME', 'TOP_GAINERS', 'TOP_LOSERS', 'MACD_CROSSOVER'].map(p => (
          <button
            key={p}
            onClick={() => fetchPresetStocks(p)}
            className={\`px-4 py-2 rounded-xl text-sm font-medium transition-colors \${
              activePreset === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }\`}
          >
            {p === 'OVERSOLD' ? 'Aşırı Satım' :
             p === 'OVERBOUGHT' ? 'Aşırı Alım' :
             p === 'BULLISH_MOMENTUM' ? 'Yükseliş Momentumu' :
             p === 'BEARISH_MOMENTUM' ? 'Düşüş Momentumu' :
             p === 'HIGH_VOLUME' ? 'Yüksek Hacim' :
             p === 'TOP_GAINERS' ? 'Kazananlar' :
             p === 'TOP_LOSERS' ? 'Kaybedenler' : 'MACD AL'}
          </button>
        ))}
      </div>
`;

// Insert into the UI right after <div className="space-y-6 max-w-7xl mx-auto pb-12">
content = content.replace(
  /<div className="space-y-6 max-w-7xl mx-auto pb-12">/,
  '<div className="space-y-6 max-w-7xl mx-auto pb-12">\n' + presetUI
);

// Now add the fetchPresetStocks function
const fetchFunction = `
  const fetchPresetStocks = async (preset: string) => {
    setActivePreset(preset);
    setLoading(true);
    try {
      const res = await safeFetchJson<{ preset: string, results: ScreenerStockRow[] }>(\`/api/screener/\${preset}\`);
      if (res.ok && res.data) {
        setStocks(res.data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace(
  /const applyPreset = \(presetKey: string\) => {/,
  fetchFunction + '\n  const applyPreset = (presetKey: string) => {'
);

// Since the preset returns some properties not originally in ScreenerStockRow (like rsi14, macd), we should display them if present.
const tableHeaders = `
                <th className="px-6 py-4 font-medium text-right group cursor-pointer" onClick={() => handleSort('volume')}>
                  <div className="flex items-center justify-end gap-1">
                    Hacim
                    {getSortIcon('volume')}
                  </div>
                </th>
                {activePreset && <th className="px-6 py-4 font-medium text-right text-purple-400">Teknik Sinyal</th>}
`;
content = content.replace(
  /<th className="px-6 py-4 font-medium text-right group cursor-pointer" onClick={\(\) => handleSort\('volume'\)}>[\s\S]*?<\/th>/,
  tableHeaders
);

const tableCells = `
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">
                      {stock.volume ? (stock.volume / 1000000).toFixed(1) + 'M' : '-'}
                    </td>
                    {activePreset && (
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-purple-400">
                        {(stock as any).rsi14 ? \`RSI: \${(stock as any).rsi14.toFixed(1)}\` : ''}
                        {(stock as any).macd ? \` \${(stock as any).macd}\` : ''}
                      </td>
                    )}
`;
content = content.replace(
  /<td className="px-6 py-4 whitespace-nowrap text-right text-slate-300">\s*\{stock\.volume \? \(stock\.volume \/ 1000000\)\.toFixed\(1\) \+ 'M' : '-'\}\s*<\/td>/,
  tableCells
);

// We should hide the filter form if activePreset is a custom one, or we can just leave it. Leaving it is fine.
fs.writeFileSync('src/components/AdvancedScreenerSection.tsx', content);
console.log('AdvancedScreenerSection patched');
