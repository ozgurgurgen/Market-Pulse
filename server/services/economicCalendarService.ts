export interface EconomicEvent {
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

const mockEvents: EconomicEvent[] = [
  {
    id: 'evt-tr-cpi-01',
    date: '2026-08-31',
    time: '10:00',
    country: 'TR',
    title: 'TÜFE (Yıllık)',
    importance: 'HIGH',
    actual: 36.8,
    forecast: 37.5,
    previous: 38.2,
    unit: '%'
  },
  {
    id: 'evt-tr-rate-01',
    date: '2026-08-25',
    time: '14:00',
    country: 'TR',
    title: 'TCMB Faiz Kararı',
    importance: 'HIGH',
    actual: 37.0,
    forecast: 37.0,
    previous: 37.0,
    unit: '%'
  },
  {
    id: 'evt-us-nfp-01',
    date: '2026-09-04',
    time: '15:30',
    country: 'US',
    title: 'Tarım Dışı İstihdam (NFP)',
    importance: 'HIGH',
    forecast: 165,
    previous: 142,
    unit: 'K'
  },
  {
    id: 'evt-us-fed-01',
    date: '2026-09-16',
    time: '21:00',
    country: 'US',
    title: 'FED Faiz Kararı',
    importance: 'HIGH',
    forecast: 4.00,
    previous: 4.25,
    unit: '%'
  },
  {
    id: 'evt-eu-cpi-01',
    date: '2026-08-29',
    time: '12:00',
    country: 'EU',
    title: 'Euro Bölgesi TÜFE',
    importance: 'HIGH',
    actual: 2.1,
    forecast: 2.2,
    previous: 2.4,
    unit: '%'
  },
  {
    id: 'evt-gb-gdp-01',
    date: '2026-08-15',
    time: '09:00',
    country: 'GB',
    title: 'GSYH (Çeyreklik)',
    importance: 'HIGH',
    actual: 0.4,
    forecast: 0.3,
    previous: 0.2,
    unit: '%'
  },
  {
    id: 'evt-cn-pmi-01',
    date: '2026-08-31',
    time: '04:30',
    country: 'CN',
    title: 'İmalat PMI',
    importance: 'MEDIUM',
    actual: 49.8,
    forecast: 49.5,
    previous: 49.2,
    unit: ''
  },
  {
    id: 'evt-de-ifo-01',
    date: '2026-08-26',
    time: '11:00',
    country: 'DE',
    title: 'Ifo İş İklimi Endeksi',
    importance: 'MEDIUM',
    actual: 87.5,
    forecast: 87.0,
    previous: 86.8,
    unit: ''
  },
  {
    id: 'evt-us-claims-01',
    date: '2026-08-27',
    time: '15:30',
    country: 'US',
    title: 'İşsizlik Haklarından Yararlanma Başvuruları',
    importance: 'LOW',
    actual: 215,
    forecast: 220,
    previous: 222,
    unit: 'K'
  }
];

export async function getEconomicCalendar(startDate?: string, endDate?: string): Promise<EconomicEvent[]> {
  // In a real app, you would fetch from an API like Investing.com or ForexFactory or TradingEconomics.
  // For the prompt's completeness, we serve the structured robust mock data simulating a full calendar.
  
  let events = [...mockEvents];
  
  if (startDate) {
    events = events.filter(e => e.date >= startDate);
  }
  if (endDate) {
    events = events.filter(e => e.date <= endDate);
  }
  
  return events.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime();
    const timeB = new Date(`${b.date}T${b.time}`).getTime();
    return timeA - timeB;
  });
}
