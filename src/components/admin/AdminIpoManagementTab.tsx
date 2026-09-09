import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  FileText, 
  Flame, 
  Clock, 
  ShieldCheck,
  X,
  Save,
  Layers
} from 'lucide-react';
import { IPOListing, IPOStatus, IPODistributionMethod, IPOSource } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

export const AdminIpoManagementTab: React.FC = () => {
  const [listings, setListings] = useState<IPOListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IPOStatus>('all');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIpo, setEditingIpo] = useState<Partial<IPOListing> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchIpoListings = async () => {
    setIsLoading(true);
    try {
      const res = await safeFetchJson<{ success: boolean; listings: IPOListing[] }>('/api/ipo/listings?refresh=true');
      if (res.data?.listings) {
        setListings(res.data.listings);
      }
    } catch (err) {
      console.error('Failed to fetch IPOs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIpoListings();
  }, []);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await safeFetchJson<{ success: boolean; message: string; newCount: number }>('/api/admin/ipo/sync', {
        method: 'POST'
      });
      if (res.data?.success) {
        setStatusMessage({ type: 'success', message: res.data.message || 'KAP / SPK bülten senkronizasyonu tamamlandı.' });
        fetchIpoListings();
      } else {
        setStatusMessage({ type: 'error', message: res.data?.message || 'Senkronizasyon sırasında bir hata oluştu.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', message: err.message || 'Senkronizasyon başarısız.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingIpo({
      companyName: '',
      ticker: '',
      sector: 'Sanayi & İmalat',
      method: 'equal',
      methodLabel: 'Bireysele Eşit Dağıtım',
      bookBuildingStartDate: new Date().toISOString().slice(0, 10),
      bookBuildingEndDate: new Date().toISOString().slice(0, 10),
      offerPrice: 50.00,
      marketListingDate: '',
      status: 'upcoming',
      prospectusUrl: 'https://www.kap.org.tr',
      prospectusTitle: 'KAP Onaylı İzahname',
      demandMultiplier: null,
      allocationIndividualRatio: 80,
      allocationInstitutionalRatio: 20,
      totalLot: 20000000,
      marketCapTRY: 1000000000,
      leadBroker: 'İş Yatırım',
      useOfProceeds: [
        { purpose: 'Kapasite Artışı ve Tesis Yatırımı', ratioPct: 60 },
        { purpose: 'İşletme Sermayesi', ratioPct: 40 }
      ],
      performance: {
        day1ReturnPct: null,
        week1ReturnPct: null,
        month1ReturnPct: null,
        currentReturnPct: null,
        currentPrice: null,
        lastUpdated: new Date().toISOString()
      },
      source: 'MANUAL_ADMIN',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ipo: IPOListing) => {
    setEditingIpo({ ...ipo });
    setIsModalOpen(true);
  };

  const handleDeleteIpo = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" adlı halka arz kaydını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await safeFetchJson<{ success: boolean }>(`/api/admin/ipo/${id}`, {
        method: 'DELETE'
      });
      if (res.data?.success) {
        setStatusMessage({ type: 'success', message: `"${name}" başarıyla silindi.` });
        setListings(prev => prev.filter(item => item.id !== id));
      } else {
        setStatusMessage({ type: 'error', message: 'Halka arz kaydı silinemedi.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', message: err.message || 'Silme işlemi başarısız.' });
    }
  };

  const handleSaveIpo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIpo?.companyName || !editingIpo?.ticker) {
      alert('Lütfen şirket adı ve BIST kodunu doldurun.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await safeFetchJson<{ success: boolean; ipo: IPOListing }>('/api/admin/ipo/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingIpo)
      });

      if (res.data?.success && res.data.ipo) {
        setStatusMessage({ type: 'success', message: `${res.data.ipo.companyName} başarıyla kaydedildi.` });
        setIsModalOpen(false);
        setEditingIpo(null);
        fetchIpoListings();
      } else {
        setStatusMessage({ type: 'error', message: 'Halka arz kaydedilemedi.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', message: err.message || 'Kayıt başarısız.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin-ipo-management-tab" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="text-cyan-400" size={20} />
            <h3 className="text-base font-bold text-white tracking-tight">Halka Arz (IPO) Takip & Yönetim Merkezi</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              KAP & BIST Resmi Veri
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Resmi KAP bültenleri, SPK onaylı izahnameler ve geçmiş halka arz performans verilerini yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin text-cyan-400' : ''} />
            {isSyncing ? 'KAP Taranıyor...' : 'KAP/SPK Senkronize Et'}
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-900/30"
          >
            <Plus size={15} />
            Yeni Halka Arz Ekle
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{statusMessage.message}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şirket unvanı, BIST kodu veya sektör ara..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {(['all', 'upcoming', 'active', 'completed'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === tab 
                  ? 'bg-cyan-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' && `Tümü (${listings.length})`}
              {tab === 'upcoming' && `Yaklaşan (${listings.filter(i => i.status === 'upcoming').length})`}
              {tab === 'active' && `Talep Toplamada (${listings.filter(i => i.status === 'active').length})`}
              {tab === 'completed' && `Tamamlanan (${listings.filter(i => i.status === 'completed').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table / Grid */}
      {isLoading ? (
        <div className="min-h-[250px] flex items-center justify-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <RefreshCw size={16} className="animate-spin text-cyan-400" />
            Halka arz veritabanı yükleniyor...
          </div>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-slate-900/30 border border-slate-800 rounded-2xl text-center">
          <Building2 size={32} className="text-slate-600 mb-2" />
          <p className="text-xs font-semibold text-slate-400">Kayıtlı halka arz bulunamadı</p>
          <p className="text-[11px] text-slate-600 mt-1">Arama kriterlerinizi değiştirebilir veya "Yeni Halka Arz Ekle" düğmesine basabilirsiniz.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Şirket / BIST Kodu</th>
                  <th className="py-3.5 px-3">Sektör</th>
                  <th className="py-3.5 px-3">Fiyat (₺)</th>
                  <th className="py-3.5 px-3">Talep Tarihleri</th>
                  <th className="py-3.5 px-3">Karşılama Oranı</th>
                  <th className="py-3.5 px-3">1. Gün / Güncel Getiri</th>
                  <th className="py-3.5 px-3">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredListings.map(ipo => {
                  const isHighDemand = ipo.demandMultiplier != null && ipo.demandMultiplier >= 50;

                  return (
                    <tr key={ipo.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-cyan-400 text-[11px]">
                            {ipo.ticker.slice(0, 4)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{ipo.ticker}</span>
                              <a 
                                href={ipo.prospectusUrl} 
                                target="_blank" 
                                rel="noreferrer noopener"
                                className="text-slate-500 hover:text-cyan-400 transition-colors" 
                                title="Resmi KAP İzahnamesi"
                              >
                                <ExternalLink size={12} />
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-400 max-w-[180px] truncate" title={ipo.companyName}>
                              {ipo.companyName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[11px] text-slate-300 font-medium">{ipo.sector}</span>
                        <div className="text-[10px] text-slate-500">{ipo.methodLabel}</div>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-semibold text-white">
                        ₺{ipo.offerPrice.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <div className="text-slate-200">{ipo.bookBuildingStartDate}</div>
                        <div className="text-slate-500 text-[10px]">{ipo.bookBuildingEndDate}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        {ipo.demandMultiplier != null ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isHighDemand 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {isHighDemand && <Flame size={11} />}
                            {ipo.demandMultiplier}x
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Bekleniyor</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        {ipo.status === 'completed' && ipo.performance ? (
                          <div>
                            <span className={ipo.performance.day1ReturnPct && ipo.performance.day1ReturnPct > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                              {ipo.performance.day1ReturnPct != null ? `%+${ipo.performance.day1ReturnPct}` : '—'}
                            </span>
                            <span className="text-slate-600 mx-1">/</span>
                            <span className={ipo.performance.currentReturnPct && ipo.performance.currentReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {ipo.performance.currentReturnPct != null ? `${ipo.performance.currentReturnPct > 0 ? '+' : ''}${ipo.performance.currentReturnPct}%` : '—'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600">İşlem Görmedi</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          ipo.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                            : ipo.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {ipo.status === 'active' && 'Talepte'}
                          {ipo.status === 'upcoming' && 'Yaklaşan'}
                          {ipo.status === 'completed' && 'Tamamlandı'}
                          {ipo.status === 'draft' && 'Taslak'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(ipo)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteIpo(ipo.id, ipo.companyName)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit IPO Modal */}
      {isModalOpen && editingIpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  {editingIpo.id ? 'Halka Arz Kaydını Düzenle' : 'Yeni Halka Arz Ekle (KAP / SPK)'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveIpo} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Şirket Resmi Unvanı *</label>
                  <input
                    type="text"
                    required
                    value={editingIpo.companyName || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, companyName: e.target.value })}
                    placeholder="Örn: Horoz Lojistik Kargo Hizmetleri A.Ş."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">BIST Kodu / Ticker *</label>
                  <input
                    type="text"
                    required
                    value={editingIpo.ticker || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, ticker: e.target.value.toUpperCase() })}
                    placeholder="Örn: HOROZ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Sektör</label>
                  <input
                    type="text"
                    value={editingIpo.sector || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, sector: e.target.value })}
                    placeholder="Örn: Lojistik & Taşımacılık"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Dağıtım Yöntemi</label>
                  <select
                    value={editingIpo.method || 'equal'}
                    onChange={(e) => {
                      const method = e.target.value as IPODistributionMethod;
                      const methodLabel = method === 'equal' ? 'Tamamı Eşit Dağıtım' : method === 'mixed' ? 'Bireysele Eşit / Kurumsala Oransal' : 'Oransal Dağıtım';
                      setEditingIpo({ ...editingIpo, method, methodLabel });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="equal">Tamamı Eşit Dağıtım</option>
                    <option value="mixed">Bireysele Eşit / Kurumsala Oransal</option>
                    <option value="proportional">Oransal Dağıtım</option>
                    <option value="bist_sale">Borsada Satış - Sabit Fiyat</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Halka Arz Fiyatı (₺) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={editingIpo.offerPrice || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, offerPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Durum</label>
                  <select
                    value={editingIpo.status || 'upcoming'}
                    onChange={(e) => setEditingIpo({ ...editingIpo, status: e.target.value as IPOStatus })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="upcoming">Yaklaşan (Upcoming)</option>
                    <option value="active">Talep Toplamada (Active)</option>
                    <option value="completed">Tamamlandı (Completed)</option>
                    <option value="draft">Taslak (Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Talep Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={editingIpo.bookBuildingStartDate || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, bookBuildingStartDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Talep Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={editingIpo.bookBuildingEndDate || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, bookBuildingEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Borsada İşlem Başlama Tarihi</label>
                  <input
                    type="date"
                    value={editingIpo.marketListingDate || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, marketListingDate: e.target.value || null })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Talep Karşılama Oranı (Kat)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingIpo.demandMultiplier ?? ''}
                    onChange={(e) => setEditingIpo({ 
                      ...editingIpo, 
                      demandMultiplier: e.target.value ? parseFloat(e.target.value) : null,
                      demandMultiplierText: e.target.value ? `${e.target.value} Kat Talep` : null
                    })}
                    placeholder="Örn: 42.8"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Toplam Dağıtılan Lot</label>
                  <input
                    type="number"
                    value={editingIpo.totalLot ?? ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, totalLot: e.target.value ? parseInt(e.target.value, 10) : null })}
                    placeholder="Örn: 24600000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Konsorsiyum Lideri</label>
                  <input
                    type="text"
                    value={editingIpo.leadBroker || ''}
                    onChange={(e) => setEditingIpo({ ...editingIpo, leadBroker: e.target.value })}
                    placeholder="Örn: QNB Finansinvest"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Resmi KAP İzahname Linki</label>
                <input
                  type="url"
                  value={editingIpo.prospectusUrl || ''}
                  onChange={(e) => setEditingIpo({ ...editingIpo, prospectusUrl: e.target.value })}
                  placeholder="https://www.kap.org.tr/tr/Bildirim/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
              </div>

              {/* Performance fields (If completed) */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h5 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-400" />
                  Halka Arz Sonrası Performans Metrikleri (Tamamlananlar İçin)
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">1. Gün Getiri (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingIpo.performance?.day1ReturnPct ?? ''}
                      onChange={(e) => setEditingIpo({
                        ...editingIpo,
                        performance: {
                          ...editingIpo.performance!,
                          day1ReturnPct: e.target.value ? parseFloat(e.target.value) : null,
                          lastUpdated: new Date().toISOString()
                        }
                      })}
                      placeholder="Örn: 9.98"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">1. Hafta Getiri (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingIpo.performance?.week1ReturnPct ?? ''}
                      onChange={(e) => setEditingIpo({
                        ...editingIpo,
                        performance: {
                          ...editingIpo.performance!,
                          week1ReturnPct: e.target.value ? parseFloat(e.target.value) : null,
                          lastUpdated: new Date().toISOString()
                        }
                      })}
                      placeholder="Örn: 46.2"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">1. Ay Getiri (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingIpo.performance?.month1ReturnPct ?? ''}
                      onChange={(e) => setEditingIpo({
                        ...editingIpo,
                        performance: {
                          ...editingIpo.performance!,
                          month1ReturnPct: e.target.value ? parseFloat(e.target.value) : null,
                          lastUpdated: new Date().toISOString()
                        }
                      })}
                      placeholder="Örn: 28.5"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-cyan-900/30"
                >
                  <Save size={14} />
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet ve Yayınla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
