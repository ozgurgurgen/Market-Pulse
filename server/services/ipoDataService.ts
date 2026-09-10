import { serverLocalDatabase } from './serverLocalDatabase';

export interface IPOListingItem {
  id: string;
  companyName: string;
  ticker: string;
  code?: string;
  offerPrice?: number;
  totalLot?: number;
  bookBuildingStartDate?: string;
  bookBuildingEndDate?: string;
  status: 'active' | 'upcoming' | 'completed';
  notes?: string;
  method?: string;
  sector?: string;
  source?: string;
  leadBroker?: string;
  methodLabel?: string;
  performance?: any;
  qualitative?: any;
  marketCapTRY?: number;
  prospectusUrl?: string;
  useOfProceeds?: any[];
  [key: string]: any;
}

export class IPODataService {
  public async getAllIpos(params: { status?: string; search?: string; sector?: string; limit?: number; offset?: number } = {}) {
    let listings = serverLocalDatabase.getAll<IPOListingItem>('ipoListings') || [];

    if (params.status && params.status !== 'all') {
      listings = listings.filter(i => i.status === params.status);
    }

    if (params.sector && params.sector !== 'ALL') {
      listings = listings.filter(i => i.sector === params.sector);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      listings = listings.filter(i => 
        (i.companyName && i.companyName.toLowerCase().includes(q)) ||
        (i.ticker && i.ticker.toLowerCase().includes(q)) ||
        (i.sector && i.sector.toLowerCase().includes(q))
      );
    }

    // Sort by date (descending)
    listings.sort((a, b) => {
      const dateA = a.bookBuildingStartDate || a.createdAt || '';
      const dateB = b.bookBuildingStartDate || b.createdAt || '';
      return dateB.localeCompare(dateA);
    });

    const total = listings.length;
    const offset = params.offset || 0;
    const limit = params.limit || total;
    const paginated = listings.slice(offset, offset + limit);

    return { data: paginated, total };
  }

  public async getIpoCalendar() {
    const res = await this.getAllIpos();
    return res.data;
  }

  public async getSectorAnalysis() {
    const listings = serverLocalDatabase.getAll<IPOListingItem>('ipoListings') || [];
    const sectorMap = new Map<string, { sector: string; count: number; totalMarketCap: number; totalDay1Return: number; validReturnsCount: number }>();

    for (const ipo of listings) {
      const sector = ipo.sector || 'Diğer';
      if (!sectorMap.has(sector)) {
        sectorMap.set(sector, { sector, count: 0, totalMarketCap: 0, totalDay1Return: 0, validReturnsCount: 0 });
      }
      const entry = sectorMap.get(sector)!;
      entry.count++;
      entry.totalMarketCap += ipo.marketCapTRY || 0;
      if (ipo.performance?.day1ReturnPct != null) {
        entry.totalDay1Return += ipo.performance.day1ReturnPct;
        entry.validReturnsCount++;
      }
    }

    const summaries = Array.from(sectorMap.values()).map(s => ({
      sector: s.sector,
      count: s.count,
      totalMarketCapTRY: s.totalMarketCap,
      avgFirstDayReturnPct: s.validReturnsCount > 0 ? Number((s.totalDay1Return / s.validReturnsCount).toFixed(2)) : 0
    }));

    return summaries.sort((a, b) => b.count - a.count);
  }

  public async getIpoById(id: string) {
    if (!id) return null;
    const direct = serverLocalDatabase.get<IPOListingItem>('ipoListings', id);
    if (direct) return direct;

    const all = serverLocalDatabase.getAll<IPOListingItem>('ipoListings') || [];
    const clean = id.toUpperCase().trim();
    return all.find(i => i.id === id || (i.ticker && i.ticker.toUpperCase() === clean)) || null;
  }

  public async getSimilarIpos(id: string) {
    const current = await this.getIpoById(id);
    if (!current) return [];

    const all = serverLocalDatabase.getAll<IPOListingItem>('ipoListings') || [];
    return all
      .filter(i => i.id !== current.id && i.sector === current.sector)
      .slice(0, 5);
  }

  public async upsertIpo(data: any) {
    if (!data.id) {
      data.id = `ipo-${(data.ticker || 'new').toLowerCase()}-${Date.now()}`;
    }
    serverLocalDatabase.set('ipoListings', data.id, data);
    return data;
  }

  public async deleteIpo(id: string) {
    serverLocalDatabase.delete('ipoListings', id);
    return true;
  }

  public async syncWithOfficialSources() {
    const count = (serverLocalDatabase.getAll('ipoListings') || []).length;
    return { success: true, count, newIpos: [] };
  }
}

export const ipoDataService = new IPODataService();
