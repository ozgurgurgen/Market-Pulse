import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Coins, 
  Users, 
  FileText, 
  ArrowUpRight, 
  TrendingUp, 
  Info, 
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Building
} from 'lucide-react';
import { safeFetchJson } from '../../utils/apiClient';
import { CorporateEvent } from '../../types';

interface CorporateEventsTabProps {
  symbol: string;
}

export const CorporateEventsTab: React.FC<CorporateEventsTabProps> = ({ symbol }) => {
  const [events, setEvents] = useState<CorporateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    safeFetchJson<{ success: boolean; data: CorporateEvent[] }>(`/api/stock/${symbol}/events`)
      .then(({ data, ok, error }) => {
        if (!isMounted) return;
        if (ok && data?.data) {
          setEvents(data.data);
        } else {
          setError(error ? (typeof error === 'string' ? error : (error as any).message || 'Hata') : 'Şirket olayları alınamadı.');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Bağlantı hatası.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  const getEventBadge = (type: CorporateEvent['type']) => {
    switch (type) {
      case 'TEMETTU':
        return { label: 'Temettü Dağıtımı', icon: Coins, bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'GK':
        return { label: 'Genel Kurul', icon: Users, bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'BEDELSIZ':
        return { label: 'Bedelsiz Artırım', icon: TrendingUp, bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'BEDELLI':
        return { label: 'Bedelli Artırım', icon: Clock, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'INSIDER':
        return { label: 'İçeriden / Patron İşlemi', icon: Building, bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'SUNUM':
        return { label: 'Yatırımcı Sunumu', icon: Sparkles, bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'KAP':
      default:
        return { label: 'KAP Bildirimi', icon: FileText, bg: 'bg-slate-700/40 text-slate-300 border-slate-600/40' };
    }
  };

  const filteredEvents = filterType === 'ALL' ? events : events.filter(e => e.type === filterType);

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Şirket kurumsal olayları ve KAP bildirimleri yükleniyor...</p>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
        <Info className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-sm text-slate-300">{error || 'Bu hisse için kayıtlı kurumsal olay bulunamadı.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filtreleme Çubukları */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 pl-1 pr-2">
          <Filter size={13} />
          Filtre:
        </span>
        {['ALL', 'KAP', 'TEMETTU', 'GK', 'INSIDER', 'BEDELSIZ'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterType === f
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {f === 'ALL' ? 'Tüm Olaylar' : f === 'TEMETTU' ? 'Temettü' : f === 'GK' ? 'Genel Kurul' : f === 'INSIDER' ? 'Patron/Insider' : f}
          </button>
        ))}
      </div>

      {/* Dikey Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {filteredEvents.map((evt) => {
          const badge = getEventBadge(evt.type);
          const Icon = badge.icon;

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Pin */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>

              {/* Event Card */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                      <Icon size={12} />
                      {badge.label}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">{evt.title}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
