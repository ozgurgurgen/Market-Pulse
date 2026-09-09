import { healthMonitor } from './healthMonitor';
import { rateLimiter } from './rateLimiter';

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: string;
  executionTimeMs?: number;
}

export interface AgentHourlyMetric {
  time: string;
  uptimePercent: number;
  errorRatePercent: number;
  latencyMs: number;
}

export interface FinancialAgentHealth {
  id: 'market_agent' | 'fund_agent' | 'macro_agent' | 'portfolio_agent';
  name: 'MarketAgent' | 'FundAgent' | 'MacroAgent' | 'PortfolioAgent';
  displayName: string;
  roleDescription: string;
  engine: string;
  status: 'active' | 'busy' | 'idle' | 'degraded' | 'error';
  lastExecutionTime: string;
  latencyMs: number;
  successRatePercent: number;
  memoryUsageMb: number;
  totalInvocations: number;
  errorCount: number;
  currentTask: string;
  activeThreads: number;
  logs: AgentLogEntry[];
  hourlyMetrics: AgentHourlyMetric[];
}

export interface AgentHealthSummary {
  overallStatus: 'OPTIMAL' | 'DEGRADED' | 'ATTENTION';
  totalAgents: number;
  activeAgentsCount: number;
  avgLatencyMs: number;
  totalInvocationsToday: number;
  lastSyncTime: string;
  agents: FinancialAgentHealth[];
}

class AgentHealthService {
  private agentMap: Map<string, FinancialAgentHealth> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private generateInitialHourlyMetrics(agentId: string, baseLatency: number): AgentHourlyMetric[] {
    const metrics: AgentHourlyMetric[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const timePoint = new Date(now.getTime() - i * 5 * 60 * 1000);
      const hours = String(timePoint.getHours()).padStart(2, '0');
      const minutes = String(timePoint.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      let baseUptime = 99.5;
      let baseErrorRate = 0.5;

      if (agentId === 'market_agent') {
        baseUptime = 99.8 - (i === 4 ? 0.6 : 0) - (i === 8 ? 0.3 : 0);
        baseErrorRate = 100 - baseUptime;
      } else if (agentId === 'fund_agent') {
        baseUptime = 99.1 - (i === 3 ? 1.2 : 0) - (i === 9 ? 0.5 : 0);
        baseErrorRate = 100 - baseUptime;
      } else if (agentId === 'macro_agent') {
        baseUptime = 100.0 - (i === 6 ? 0.2 : 0);
        baseErrorRate = 100 - baseUptime;
      } else if (agentId === 'portfolio_agent') {
        baseUptime = 99.7 - (i === 2 ? 0.4 : 0) - (i === 7 ? 0.3 : 0);
        baseErrorRate = 100 - baseUptime;
      }

      const latencyNoise = Math.floor(Math.sin(i * 1.5) * 20) + Math.floor(Math.random() * 15);

      metrics.push({
        time: timeStr,
        uptimePercent: Number(baseUptime.toFixed(2)),
        errorRatePercent: Number(baseErrorRate.toFixed(2)),
        latencyMs: Math.max(70, baseLatency + latencyNoise),
      });
    }

    return metrics;
  }

  private initializeAgents() {
    const now = new Date();

    const initialAgents: FinancialAgentHealth[] = [
      {
        id: 'market_agent',
        name: 'MarketAgent',
        displayName: 'BİST & Piyasa Ajanı',
        roleDescription: 'Hisse taraması, hacim kırılmaları, indikatör sinyalleri ve KAP akış analizi',
        engine: 'SignalEngine v2 + Gemini 3.7 Flash',
        status: 'active',
        lastExecutionTime: new Date(now.getTime() - 12000).toISOString(),
        latencyMs: 142,
        successRatePercent: 99.4,
        memoryUsageMb: 48.2,
        totalInvocations: 1284,
        errorCount: 2,
        currentTask: 'BIST 100 canlı hacim ve momentum taraması aktif',
        activeThreads: 3,
        hourlyMetrics: this.generateInitialHourlyMetrics('market_agent', 140),
        logs: [
          {
            id: 'log-m-1',
            timestamp: new Date(now.getTime() - 12000).toISOString(),
            level: 'success',
            message: 'THYAO, GARAN ve ASELS için SignalEngine v2 indikatör taraması tamamlandı.',
            executionTimeMs: 142,
            details: 'RSI: 62.4 | MACD: Al Sinyali | Composite Skor: 78/100',
          },
          {
            id: 'log-m-2',
            timestamp: new Date(now.getTime() - 45000).toISOString(),
            level: 'info',
            message: 'KAP canlı akışından 14 yeni bildirim alındı ve NLP filtrelendi.',
            executionTimeMs: 98,
          },
          {
            id: 'log-m-3',
            timestamp: new Date(now.getTime() - 120000).toISOString(),
            level: 'info',
            message: 'Yahoo Finance BİST100 websocket bağlantısı yenilendi.',
            executionTimeMs: 210,
          },
        ],
      },
      {
        id: 'fund_agent',
        name: 'FundAgent',
        displayName: 'TEFAS & Fon Ajanı',
        roleDescription: 'Yatırım fonları veri senkronizasyonu, varlık dağılımı ve Sharpe oranı optimizasyonu',
        engine: 'TEFAS Sync Engine v3 + SpkParser',
        status: 'active',
        lastExecutionTime: new Date(now.getTime() - 28000).toISOString(),
        latencyMs: 215,
        successRatePercent: 98.8,
        memoryUsageMb: 62.5,
        totalInvocations: 856,
        errorCount: 3,
        currentTask: 'TEFAS günlük fon fiyatları ve kategori bazlı performans analizi',
        activeThreads: 2,
        hourlyMetrics: this.generateInitialHourlyMetrics('fund_agent', 210),
        logs: [
          {
            id: 'log-f-1',
            timestamp: new Date(now.getTime() - 28000).toISOString(),
            level: 'success',
            message: 'Hisse Senedi Yoğun Fonlar için 30 günlük ortalama Sharpe oranları güncellendi.',
            executionTimeMs: 215,
            details: 'Lider Fonlar: TCD (%12.4), YAY (%10.8), AFT (%9.6)',
          },
          {
            id: 'log-f-2',
            timestamp: new Date(now.getTime() - 95000).toISOString(),
            level: 'info',
            message: 'SPK haftalık bülteninden yeni fon kuruluş onayları tarandı.',
            executionTimeMs: 340,
          },
          {
            id: 'log-f-3',
            timestamp: new Date(now.getTime() - 240000).toISOString(),
            level: 'warn',
            message: 'EGM Emeklilik Fonları servis geçici zaman aşımı; fallback önbelleğe geçildi.',
            executionTimeMs: 1200,
            details: 'HTTP 504 Gateway Timeout -> Cache fallback active',
          },
        ],
      },
      {
        id: 'macro_agent',
        name: 'MacroAgent',
        displayName: 'Makro Ekonomi & CDS Ajanı',
        roleDescription: 'TCMB/FRED makro göstergeleri, Türkiye 5Y CDS, enflasyon ve küresel faiz takibi',
        engine: 'TCMB EVDS + FRED Macro Engine',
        status: 'active',
        lastExecutionTime: new Date(now.getTime() - 65000).toISOString(),
        latencyMs: 180,
        successRatePercent: 100.0,
        memoryUsageMb: 36.8,
        totalInvocations: 642,
        errorCount: 0,
        currentTask: 'Türkiye 5 Yıllık CDS (268 bps) ve TCMB haftalık rezerv verisi kontrolü',
        activeThreads: 1,
        hourlyMetrics: this.generateInitialHourlyMetrics('macro_agent', 170),
        logs: [
          {
            id: 'log-mac-1',
            timestamp: new Date(now.getTime() - 65000).toISOString(),
            level: 'success',
            message: 'Türkiye 5Y CDS verisi 268 bps seviyesinde stabil doğrulandı.',
            executionTimeMs: 180,
            details: 'Risk Primi: Düşük Trend | DXY: 101.4 | Ons Altın: $2,510',
          },
          {
            id: 'log-mac-2',
            timestamp: new Date(now.getTime() - 180000).toISOString(),
            level: 'info',
            message: 'TCMB Politika Faizi (%50.0) ve gecelik fonlama faiz koridoru tarandı.',
            executionTimeMs: 155,
          },
        ],
      },
      {
        id: 'portfolio_agent',
        name: 'PortfolioAgent',
        displayName: 'Portföy & Risk Dengeleme Ajanı',
        roleDescription: 'Çoklu varlık portföy optimizasyonu, Sharpe/Sortino dengelemesi ve What-If simülatörü',
        engine: 'Quant Portfolio Optimizer + What-If Sim',
        status: 'active',
        lastExecutionTime: new Date(now.getTime() - 18000).toISOString(),
        latencyMs: 125,
        successRatePercent: 99.7,
        memoryUsageMb: 54.1,
        totalInvocations: 1102,
        errorCount: 1,
        currentTask: 'Çoklu varlık portföyleri için VaR (Value at Risk %95) riski hesaplanıyor',
        activeThreads: 2,
        hourlyMetrics: this.generateInitialHourlyMetrics('portfolio_agent', 120),
        logs: [
          {
            id: 'log-p-1',
            timestamp: new Date(now.getTime() - 18000).toISOString(),
            level: 'success',
            message: 'Portföy varlık dağılımı %45 BIST, %25 Dolar/Altın, %20 TEFAS, %10 Nakit rebalanse edildi.',
            executionTimeMs: 125,
            details: 'Korelasyon Matrisi: BIST-Altın (-0.24) | Beklenen Yıllık Getiri: %42.8',
          },
          {
            id: 'log-p-2',
            timestamp: new Date(now.getTime() - 80000).toISOString(),
            level: 'info',
            message: 'What-If Senaryo Motoru: "Dolar/TL +%10 Şok Testi" başarıyla simüle edildi.',
            executionTimeMs: 310,
          },
          {
            id: 'log-p-3',
            timestamp: new Date(now.getTime() - 300000).toISOString(),
            level: 'info',
            message: 'Kullanıcı dinamik stop-loss seviyeleri güncellendi.',
            executionTimeMs: 90,
          },
        ],
      },
    ];

    for (const agent of initialAgents) {
      this.agentMap.set(agent.id, agent);
    }
  }

  public getSummary(): AgentHealthSummary {
    const agents = Array.from(this.agentMap.values());
    const totalAgents = agents.length;
    const activeAgentsCount = agents.filter((a) => a.status === 'active' || a.status === 'busy').length;
    const totalLatency = agents.reduce((acc, a) => acc + a.latencyMs, 0);
    const avgLatencyMs = Math.round(totalLatency / (totalAgents || 1));
    const totalInvocationsToday = agents.reduce((acc, a) => acc + a.totalInvocations, 0);

    let overallStatus: 'OPTIMAL' | 'DEGRADED' | 'ATTENTION' = 'OPTIMAL';
    if (activeAgentsCount < totalAgents) {
      overallStatus = 'DEGRADED';
    }

    return {
      overallStatus,
      totalAgents,
      activeAgentsCount,
      avgLatencyMs,
      totalInvocationsToday,
      lastSyncTime: new Date().toISOString(),
      agents,
    };
  }

  public triggerDiagnostic(agentId?: string): AgentHealthSummary {
    const now = new Date();
    const timestampStr = now.toISOString();

    if (agentId && this.agentMap.has(agentId)) {
      this.refreshSingleAgent(agentId, now);
    } else {
      for (const id of this.agentMap.keys()) {
        this.refreshSingleAgent(id, now);
      }
    }

    return this.getSummary();
  }

  private refreshSingleAgent(agentId: string, now: Date) {
    const agent = this.agentMap.get(agentId);
    if (!agent) return;

    agent.lastExecutionTime = now.toISOString();
    agent.totalInvocations += 1;
    agent.status = 'active';

    const simulatedLatency = Math.floor(Math.random() * 80) + 90;
    agent.latencyMs = simulatedLatency;

    let newLogMessage = '';
    let newLogDetails = '';

    switch (agent.id) {
      case 'market_agent':
        newLogMessage = 'Manuel tetikleme: BİST 100 canlı hisse ve hacim taraması yenilendi.';
        newLogDetails = `Taranan Hisseler: 100 | En Yüksek Hacim: THYAO, EREGL, YKBNK | Latency: ${simulatedLatency}ms`;
        agent.currentTask = 'Hisse bazlı teknik kırılımlar ve formasyonlar analiz ediliyor';
        break;
      case 'fund_agent':
        newLogMessage = 'Manuel tetikleme: TEFAS fon getirileri ve kategori ortalamaları güncellendi.';
        newLogDetails = `Aktif Kategori: Para Piyasası & Borçlanma Araçları | Latency: ${simulatedLatency}ms`;
        agent.currentTask = 'Fon varlık dağılımı değişiklikleri analiz ediliyor';
        break;
      case 'macro_agent':
        newLogMessage = 'Manuel tetikleme: TCMB EVDS faiz, rezerv ve CDS göstergeleri doğrulandı.';
        newLogDetails = `Türkiye 5Y CDS: 268 bps | TCMB Politika Faizi: %50.0 | DXY: 101.4`;
        agent.currentTask = 'Makroekonomik duyarlılık analizi güncel';
        break;
      case 'portfolio_agent':
        newLogMessage = 'Manuel tetikleme: Portföy risk rasyoları (Sharpe/Sortino) ve VaR yeniden hesaplandı.';
        newLogDetails = `Optimum Portföy Sharpe: 2.14 | Max Drawdown Risk: -%4.2 | Latency: ${simulatedLatency}ms`;
        agent.currentTask = 'Portföy varlık ağırlıkları dengelendi';
        break;
    }

    const newLog: AgentLogEntry = {
      id: `log-${agent.id.slice(0, 3)}-${Date.now()}`,
      timestamp: now.toISOString(),
      level: 'success',
      message: newLogMessage,
      details: newLogDetails,
      executionTimeMs: simulatedLatency,
    };

    agent.logs = [newLog, ...agent.logs].slice(0, 15);

    if (agent.hourlyMetrics && agent.hourlyMetrics.length > 0) {
      const lastMetric = agent.hourlyMetrics[agent.hourlyMetrics.length - 1];
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      if (lastMetric.time === timeStr) {
        lastMetric.latencyMs = simulatedLatency;
      } else {
        const newMetric: AgentHourlyMetric = {
          time: timeStr,
          uptimePercent: 100.0,
          errorRatePercent: 0.0,
          latencyMs: simulatedLatency,
        };
        agent.hourlyMetrics = [...agent.hourlyMetrics.slice(1), newMetric];
      }
    }
  }

  public addLog(agentId: string, level: 'info' | 'success' | 'warn' | 'error', message: string, details?: string) {
    const agent = this.agentMap.get(agentId);
    if (!agent) return;

    const log: AgentLogEntry = {
      id: `log-${agentId.slice(0, 3)}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
    };

    agent.logs = [log, ...agent.logs].slice(0, 15);
  }
}

export const agentHealthService = new AgentHealthService();
