import fs from 'fs';

let content = fs.readFileSync('server/routes/stockDetailRouter.ts', 'utf8');

// Patch /financials
const newFinancials = `
stockDetailRouter.get('/:symbol/financials', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  
  if (localFinanceApi.isConfigured()) {
    const localData = await localFinanceApi.getCompanyAllData(symbol);
    if (localData && localData.financials) {
      // Transform local data to FinancialStatementsData
      // Just returning it for the UI to consume directly or adapting it
      const periods = localData.financials.map((f: any) => \`\${f.year}/\${f.period.toString().padStart(2, '0')}\`).slice(0, 6);
      
      const getValue = (key: string) => {
        const values: any = {};
        const yoyChanges: any = {};
        localData.financials.slice(0, 6).forEach((f: any, i: number) => {
          const p = \`\${f.year}/\${f.period.toString().padStart(2, '0')}\`;
          values[p] = f[key] / 1000000; // millions
        });
        return { values, yoyChanges };
      };

      const financials: FinancialStatementsData = {
        ticker: symbol,
        periods,
        periodType: 'quarterly',
        incomeStatement: [
          { key: 'revenue', label: 'Net Satışlar (Hasılat)', ...getValue('revenue') },
          { key: 'gross_profit', label: 'Brüt Kar', isHeader: true, ...getValue('gross_profit') },
          { key: 'ebitda', label: 'FAVÖK (EBITDA)', isHeader: true, ...getValue('ebitda') },
          { key: 'net_income', label: 'Net Dönem Karı', isHeader: true, ...getValue('net_profit') }
        ],
        balanceSheet: [
          { key: 'total_assets', label: 'Toplam Varlıklar (Aktifler)', isHeader: true, ...getValue('total_assets') },
          { key: 'short_term_liab', label: 'Kısa Vadeli Yükümlülükler', ...getValue('total_debts') },
          { key: 'equity', label: 'Toplam Özkaynaklar', isHeader: true, ...getValue('equity') }
        ],
        cashFlow: []
      };
      return res.json(financials);
    }
  }

  const periods = ['2026/06', '2026/03', '2025/12', '2025/09', '2025/06', '2024/12'];
`;
content = content.replace(
  /stockDetailRouter\.get\('\/:symbol\/financials', \(req, res\) => \{\n  const symbol = req\.params\.symbol\.toUpperCase\(\);\n  const periods = \['2026\/06', '2026\/03', '2025\/12', '2025\/09', '2025\/06', '2024\/12'\];/,
  newFinancials
);

// Patch /subsidiaries
const newSubs = `
stockDetailRouter.get('/:symbol/subsidiaries', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  if (localFinanceApi.isConfigured()) {
    const localData = await localFinanceApi.getCompanyAllData(symbol);
    if (localData) {
      return res.json({
        ticker: symbol,
        subsidiaries: (localData.subsidiaries || []).map((s: any) => ({
          name: s.name,
          sharePercent: s.share_percent,
          description: s.type,
          isPublic: false
        })),
        shareholders: (localData.shareholders || []).map((s: any) => ({
          name: s.name,
          sharePercent: s.share_percent,
          votingRights: s.vote_right_percent,
          isPubliclyTraded: false
        })),
        management: (localData.management || []).map((m: any) => ({
          name: m.name,
          role: m.title,
          since: m.since,
          background: ''
        }))
      });
    }
  }

  const asset = findAssetBySymbol(symbol);
`;

content = content.replace(
  /stockDetailRouter\.get\('\/:symbol\/subsidiaries', \(req, res\) => \{\n  const symbol = req\.params\.symbol\.toUpperCase\(\);\n  const asset = findAssetBySymbol\(symbol\);/,
  newSubs
);

// Patch /events
const newEvents = `
stockDetailRouter.get('/:symbol/events', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  if (localFinanceApi.isConfigured()) {
    const localData = await localFinanceApi.getCompanyAllData(symbol);
    if (localData && localData.disclosures) {
      return res.json(localData.disclosures.map((d: any) => ({
        id: d.id.toString(),
        date: d.publish_date.split('T')[0],
        type: d.category === 'Finansal_Rapor' ? 'EARNINGS' : 
              d.category === 'Temettu' ? 'DIVIDEND' : 'M&A',
        title: d.title,
        description: '',
        impact: d.is_catalyst ? 'HIGH' : 'MEDIUM'
      })));
    }
  }

  const mockEvents: CorporateEvent\[\] = \[
`;

content = content.replace(
  /stockDetailRouter\.get\('\/:symbol\/events', \(req, res\) => \{\n  const symbol = req\.params\.symbol\.toUpperCase\(\);\n  const mockEvents: CorporateEvent\[\] = \[/,
  newEvents
);

fs.writeFileSync('server/routes/stockDetailRouter.ts', content);
console.log('stockDetailRouter patched.');
