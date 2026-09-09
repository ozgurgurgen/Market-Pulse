import React, { useState, useEffect } from 'react';
import { Calendar, Globe, AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, CalendarDays, Filter } from 'lucide-react';


interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  country: 'TR' | 'US' | 'EU' | 'DE' | 'GB' | 'JP' | 'CN';
  title: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  actual?: number | string;
  forecast?: number | string;
  previous?: number | string;
  unit: string;
}

export function EconomicCalendarTab() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCountry, setFilterCountry] = useState<string>('ALL');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/macro/calendar');
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      console.error('Error fetching calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFlagEmoji = (country: string) => {
    switch(country) {
      case 'TR': return '🇹🇷';
      case 'US': return '🇺🇸';
      case 'EU': return '🇪🇺';
      case 'DE': return '🇩🇪';
      case 'GB': return '🇬🇧';
      case 'JP': return '🇯🇵';
      case 'CN': return '🇨🇳';
      default: return '🌐';
    }
  };

  const getImportanceStars = (imp: string) => {
    if (imp === 'HIGH') return <span className="text-red-500 font-bold">★★★ Yüksek</span>;
    if (imp === 'MEDIUM') return <span className="text-orange-500 font-bold">★★☆ Orta</span>;
    return <span className="text-gray-400 font-bold">★☆☆ Düşük</span>;
  };

  const filteredEvents = filterCountry === 'ALL' 
    ? events 
    : events.filter(e => e.country === filterCountry);

  const countries = ['ALL', ...Array.from(new Set(events.map(e => e.country)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-400" />
            Global Ekonomik Takvim
          </h2>
          <p className="text-sm text-gray-400">Piyasalara yön veren kritik veriler ve merkez bankası kararları</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={filterCountry} 
            onChange={(e) => setFilterCountry(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors"
          >
            {countries.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'Tüm Ülkeler' : `${getFlagEmoji(c)} ${c}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800/50 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Tarih/Saat</th>
                <th className="px-4 py-3 font-medium">Ülke</th>
                <th className="px-4 py-3 font-medium">Olay</th>
                <th className="px-4 py-3 font-medium">Önem</th>
                <th className="px-4 py-3 font-medium text-right">Gerçekleşen</th>
                <th className="px-4 py-3 font-medium text-right">Beklenti</th>
                <th className="px-4 py-3 font-medium text-right">Önceki</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <Calendar className="w-8 h-8 text-blue-500/50" />
                      <span>Takvim verileri yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Belirtilen kriterlere uygun olay bulunamadı.</td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  let actualColor = "text-white";
                  if (evt.actual !== undefined && evt.forecast !== undefined) {
                    if (Number(evt.actual) > Number(evt.forecast)) actualColor = "text-green-400";
                    else if (Number(evt.actual) < Number(evt.forecast)) actualColor = "text-red-400";
                  }

                  return (
                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{evt.date}</span>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {evt.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xl" title={evt.country}>
                        {getFlagEmoji(evt.country)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{evt.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        {getImportanceStars(evt.importance)}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${actualColor}`}>
                        {evt.actual !== undefined ? `${evt.actual}${evt.unit}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        {evt.forecast !== undefined ? `${evt.forecast}${evt.unit}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        {evt.previous !== undefined ? `${evt.previous}${evt.unit}` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
