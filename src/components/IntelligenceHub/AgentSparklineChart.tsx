import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts';
import { AgentHourlyMetric } from './AgentHealthMonitor';
import { Activity, ShieldCheck, AlertOctagon } from 'lucide-react';

interface AgentSparklineChartProps {
  metrics: AgentHourlyMetric[];
  agentName: string;
}

export const AgentSparklineChart: React.FC<AgentSparklineChartProps> = ({ metrics, agentName }) => {
  const [activeMetric, setActiveMetric] = useState<'uptime' | 'error'>('uptime');

  if (!metrics || metrics.length === 0) {
    return (
      <div className="h-14 flex items-center justify-center text-[10px] text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800">
        Sparkline verisi oluşturuluyor...
      </div>
    );
  }

  const avgUptime = (
    metrics.reduce((acc, m) => acc + m.uptimePercent, 0) / metrics.length
  ).toFixed(1);

  const avgErrorRate = (
    metrics.reduce((acc, m) => acc + m.errorRatePercent, 0) / metrics.length
  ).toFixed(1);

  const gradientId = `sparkline-grad-${agentName.replace(/[^a-zA-Z0-9]/g, '-')}-${activeMetric}`;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-2.5 space-y-2">
      {/* Header Bar: Toggle Tabs & Average Badges */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-bold">
          <Activity size={12} className="text-purple-400" />
          <span className="text-slate-300">1 Saatlik Trend</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMetric('uptime')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMetric === 'uptime'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={10} /> Uptime (%{avgUptime})
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('error')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMetric === 'error'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon size={10} /> Hata (%{avgErrorRate})
          </button>
        </div>
      </div>

      {/* Sparkline Chart Canvas */}
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={activeMetric === 'uptime' ? '#10b981' : '#f43f5e'}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={activeMetric === 'uptime' ? '#10b981' : '#f43f5e'}
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis
              domain={activeMetric === 'uptime' ? [97, 100.2] : [0, 5]}
              hide
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload as AgentHourlyMetric;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded shadow-xl text-[10px] font-mono space-y-0.5 z-50">
                      <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">
                        Saat: {dataPoint.time}
                      </div>
                      <div className="text-emerald-400 pt-0.5">
                        Uptime: %{dataPoint.uptimePercent}
                      </div>
                      <div className="text-rose-400">
                        Hata Oranı: %{dataPoint.errorRatePercent}
                      </div>
                      <div className="text-amber-300">
                        Yanıt Süresi: {dataPoint.latencyMs} ms
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric === 'uptime' ? 'uptimePercent' : 'errorRatePercent'}
              stroke={activeMetric === 'uptime' ? '#10b981' : '#f43f5e'}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
