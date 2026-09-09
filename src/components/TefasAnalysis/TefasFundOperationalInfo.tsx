import React from 'react';
import { 
  Percent, 
  Clock, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Coins 
} from 'lucide-react';
import { TefasFundDetail } from '../../types';
import { AcademyTooltip } from '../AcademyTooltip';

interface TefasFundOperationalInfoProps {
  fund: TefasFundDetail;
}

export const TefasFundOperationalInfo: React.FC<TefasFundOperationalInfoProps> = ({ fund }) => {
  return (
    <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Clock size={16} />
          </span>
          <h4 className="text-sm font-bold text-slate-100">
            Yönetim Ücreti, Valör &amp; Operasyonel İşlem Detayları
          </h4>
        </div>
        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <CheckCircle2 size={13} /> TEFAS'ta İşleme Açık
        </span>
      </div>

      {/* Grid of 4 Operational Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Management Fee */}
        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">
            <AcademyTooltip term="management_fee">Yıllık Yönetim Ücreti</AcademyTooltip>
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            %{fund.managementFee.toFixed(2)} <span className="text-xs font-normal text-slate-400">/yıl</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Günlük fon fiyatına dahildir (kesinti yapılmaz)
          </div>
        </div>

        {/* Settlement Buy & Sell */}
        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">
            <AcademyTooltip term="settlement">Alış &amp; Satış Valörü</AcademyTooltip>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400">
            {fund.settlementBuy} <span className="text-slate-400 text-sm font-normal">/</span> {fund.settlementSell}
          </div>
          <div className="text-[10px] text-slate-500">
            Alış: {fund.settlementBuy} günde • Satış: {fund.settlementSell} günde nakit
          </div>
        </div>

        {/* Withholding Tax */}
        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">
            <AcademyTooltip term="withholding_tax">Stopaj Oranı</AcademyTooltip>
          </div>
          <div className="text-xl font-black font-mono text-cyan-300">
            %{fund.withholdingTax}
          </div>
          <div className="text-[10px] text-slate-400">
            {fund.withholdingTax === 0 ? '🔥 Tam Stopaj Muafiyeti (%0 Vergi)' : 'Kazançtan kaynakta %10 kesinti'}
          </div>
        </div>

        {/* Min Order & Platform */}
        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Minimum İşlem &amp; Saklama</div>
          <div className="text-xl font-black font-mono text-amber-400">
            1 Adet (Pay)
          </div>
          <div className="text-[10px] text-slate-500">
            Takasbank Güvencesinde MKK Kayıtlı
          </div>
        </div>
      </div>

      {/* Founder and Trading Window Details */}
      <div className="p-3.5 bg-slate-900/50 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-500 block">Kurucu &amp; Yönetici PYŞ:</span>
          <span className="font-semibold text-slate-200 mt-0.5 block">{fund.founder}</span>
        </div>

        <div>
          <span className="text-slate-500 block">TEFAS İşlem Saatleri:</span>
          <span className="font-semibold text-slate-200 mt-0.5 block">09:00 – 13:30 (Aynı Gün Fiyatı)</span>
        </div>

        <div>
          <span className="text-slate-500 block">Teminat / Kredi Uygunluğu:</span>
          <span className="font-semibold text-emerald-400 mt-0.5 block">Kredili İşlemlerde %70 Teminat</span>
        </div>
      </div>
    </div>
  );
};
