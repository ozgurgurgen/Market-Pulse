const fs = require('fs');
let text = fs.readFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', 'utf8');

text = text.replace(
  "import { safeFetchJson } from '../../../utils/apiClient';",
  "import { safeFetchJson } from '../../../utils/apiClient';\nimport { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';\nimport { db, auth } from '../../../lib/firebase';"
);

// We need to rewrite the entire fetch logic.
const fetchAllOriginal = `  // 1. Tüm Portföyleri Çek
  const fetchPortfolios = useCallback(async () => {
    try {
      const { data, ok } = await safeFetchJson<{ success: boolean; portfolios: PortfolioItem[] }>('/api/portfolio');
      if (ok && data?.portfolios) {
        setPortfolios(data.portfolios);
        if (!selectedPortfolioId && data.portfolios.length > 0) {
          setSelectedPortfolioId(data.portfolios[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Portföyler yüklenirken hata oluştu.');
    }
  }, [selectedPortfolioId]);`;

const fetchAllNew = `  // 1. Tüm Portföyleri Çek (Firebase)
  const fetchPortfolios = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const snapshot = await getDocs(collection(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios\`));
      const fetchedPortfolios = snapshot.docs.map(d => d.data() as PortfolioItem);
      setPortfolios(fetchedPortfolios);
      
      if (!selectedPortfolioId && fetchedPortfolios.length > 0) {
        setSelectedPortfolioId(fetchedPortfolios[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Portföyler yüklenirken hata oluştu.');
    }
  }, [selectedPortfolioId]);`;
text = text.replace(fetchAllOriginal, fetchAllNew);

const fetchDetailsOriginal = `      // Portföy Detay
      const { data: pData } = await safeFetchJson<{ success: boolean; portfolio: PortfolioItem }>(\`/api/portfolio/\${id}\`);
      if (pData?.portfolio) {
        setSelectedPortfolio(pData.portfolio);
      }

      // Performans Zaman Serisi
      const { data: perfData } = await safeFetchJson<{
        success: boolean;
        summary: any;
        snapshots: PortfolioPerformanceSnapshot[];
        holdings: any[];
      }>(\`/api/portfolio/\${id}/performance\`);
      if (perfData?.snapshots) {
        setPerformanceData({
          summary: perfData.summary,
          snapshots: perfData.snapshots,
          holdings: perfData.holdings,
        });
      }

      // Risk Analizi
      const { data: riskData } = await safeFetchJson<{
        success: boolean;
        riskMetrics: PortfolioRiskMetrics;
      }>(\`/api/portfolio/\${id}/risk\`);
      if (riskData?.riskMetrics) {
        setRiskMetrics(riskData.riskMetrics);
      }

      // Bildirimler
      const { data: alertData } = await safeFetchJson<{
        success: boolean;
        alerts: PortfolioAlertItem[];
      }>(\`/api/portfolio/\${id}/alerts\`);
      if (alertData?.alerts) {
        setAlerts(alertData.alerts);
      }`;

const fetchDetailsNew = `      const portfolio = portfolios.find(p => p.id === id);
      if (portfolio) {
        setSelectedPortfolio(portfolio);
      } else {
        throw new Error('Portföy bulunamadı.');
      }
      
      const pToUse = portfolio;

      // Performans Zaman Serisi
      const { data: perfData } = await safeFetchJson<{
        success: boolean;
        summary: any;
        snapshots: PortfolioPerformanceSnapshot[];
        holdings: any[];
      }>(\`/api/portfolio/performance\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio: pToUse }),
      });
      if (perfData?.snapshots) {
        setPerformanceData({
          summary: perfData.summary,
          snapshots: perfData.snapshots,
          holdings: perfData.holdings,
        });
      }

      // Risk Analizi
      const { data: riskData } = await safeFetchJson<{
        success: boolean;
        riskMetrics: PortfolioRiskMetrics;
      }>(\`/api/portfolio/risk\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio: pToUse }),
      });
      if (riskData?.riskMetrics) {
        setRiskMetrics(riskData.riskMetrics);
      }
`;
text = text.replace(fetchDetailsOriginal, fetchDetailsNew);

// createNewPortfolio
const createOriginal = `  // Yeni Portföy Oluştur
  const createNewPortfolio = async (portfolioData: Partial<PortfolioItem>) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData),
      });
      const data = await response.json();
      if (data.success && data.portfolio) {
        await fetchPortfolios();
        setSelectedPortfolioId(data.portfolio.id);
        return data.portfolio;
      }
      throw new Error(data.error || 'Portföy oluşturulamadı.');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };`;
const createNew = `  // Yeni Portföy Oluştur (Firebase)
  const createNewPortfolio = async (portfolioData: Partial<PortfolioItem>) => {
    if (!auth.currentUser) throw new Error('Giriş yapmalısınız.');
    try {
      const newId = \`portfolio-\${Date.now()}\`;
      const newPortfolio: PortfolioItem = {
        id: newId,
        userId: auth.currentUser.uid,
        name: portfolioData.name || 'Yeni Portföy',
        createdAt: portfolioData.createdAt || new Date().toISOString().split('T')[0],
        baseCurrency: portfolioData.baseCurrency || 'TRY',
        initialCapital: portfolioData.initialCapital || 10000,
        holdings: portfolioData.holdings || [],
        isActive: true,
        notes: portfolioData.notes || '',
        riskTolerance: portfolioData.riskTolerance || 'MODERATE',
        targetReturn: portfolioData.targetReturn || 35.0,
        benchmark: portfolioData.benchmark || 'XU100',
      };
      
      await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${newId}\`), newPortfolio);
      await fetchPortfolios();
      setSelectedPortfolioId(newId);
      return newPortfolio;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };`;
text = text.replace(createOriginal, createNew);

// update holding
const addHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holdings: updatedHoldings }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchSelectedPortfolioDetails(selectedPortfolio.id);
      }`;
const addHoldingNew = `      if (!auth.currentUser) return;
      const updatedPortfolio = { ...selectedPortfolio, holdings: updatedHoldings };
      await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\`), updatedPortfolio);
      
      setPortfolios(prev => prev.map(p => p.id === selectedPortfolio.id ? updatedPortfolio : p));
      setSelectedPortfolio(updatedPortfolio);`;
text = text.replace(addHoldingOriginal, addHoldingNew);

const removeHoldingOriginal = `      const response = await fetch(\`/api/portfolio/\${selectedPortfolio.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holdings: updatedHoldings }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchSelectedPortfolioDetails(selectedPortfolio.id);
      }`;
const removeHoldingNew = `      if (!auth.currentUser) return;
      const updatedPortfolio = { ...selectedPortfolio, holdings: updatedHoldings };
      await setDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${selectedPortfolio.id}\`), updatedPortfolio);
      
      setPortfolios(prev => prev.map(p => p.id === selectedPortfolio.id ? updatedPortfolio : p));
      setSelectedPortfolio(updatedPortfolio);`;
text = text.replace(removeHoldingOriginal, removeHoldingNew);

const deleteOriginal = `  // Portföy Sil
  const deleteCurrentPortfolio = async (id: string) => {
    try {
      const response = await fetch(\`/api/portfolio/\${id}\`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        const remaining = portfolios.filter(p => p.id !== id);
        setPortfolios(remaining);
        if (remaining.length > 0) {
          setSelectedPortfolioId(remaining[0].id);
        } else {
          setSelectedPortfolioId('');
          setSelectedPortfolio(null);
          setPerformanceData(null);
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };`;
const deleteNew = `  // Portföy Sil (Firebase)
  const deleteCurrentPortfolio = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, \`user_portfolios/\${auth.currentUser.uid}/portfolios/\${id}\`));
      
      const remaining = portfolios.filter(p => p.id !== id);
      setPortfolios(remaining);
      if (remaining.length > 0) {
        setSelectedPortfolioId(remaining[0].id);
      } else {
        setSelectedPortfolioId('');
        setSelectedPortfolio(null);
        setPerformanceData(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };`;
text = text.replace(deleteOriginal, deleteNew);

fs.writeFileSync('src/pages/Portfolio/hooks/usePortfolio.ts', text);
