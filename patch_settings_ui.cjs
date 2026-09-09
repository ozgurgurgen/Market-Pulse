const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsSection.tsx', 'utf8');

// 1. Add 'telegram' to the settingsTab state type
code = code.replace(
  "useState<'ai' | 'view' | 'database' | 'data_report' | 'api_quotas'>('api_quotas');",
  "useState<'ai' | 'view' | 'database' | 'data_report' | 'api_quotas' | 'telegram'>('api_quotas');"
);

// 2. Add Telegram Tab button
const telegramTabButton = `
        <button
          type="button"
          onClick={() => setSettingsTab('telegram')}
          className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap \${
            settingsTab === 'telegram'
              ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }\`}
        >
          <Radio size={15} />
          <span>Telegram & Bildirimler</span>
        </button>
`;
code = code.replace(
  `        <button
          type="button"
          onClick={() => setSettingsTab('data_report')}`,
  telegramTabButton + `        <button
          type="button"
          onClick={() => setSettingsTab('data_report')}`
);

fs.writeFileSync('src/components/SettingsSection.tsx', code);
console.log('patched settings UI buttons');
