import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export type ValidationStatus = 
  | 'verified' 
  | 'unconfirmed' 
  | 'conflicting' 
  | 'single_source' 
  | 'stale' 
  | 'anomaly_flagged'
  | 'pending_human_review'
  | 'ai_verified'
  | 'rejected_market_closed';

interface ValidationBadgeProps {
  status?: ValidationStatus;
  confidence?: number;
  sources?: string[];
  size?: 'sm' | 'md';
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ status, confidence, sources, size = 'sm' }) => {
  if (!status) return null;

  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return { icon: <CheckCircle2 size={12} />, bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Doğrulandı' };
      case 'ai_verified':
        return { icon: <Sparkles size={12} />, bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', label: 'AI Çapraz Kontrol' };
      case 'unconfirmed':
        return { icon: <AlertTriangle size={12} />, bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Farklı Kaynaklar' };
      case 'conflicting':
        return { icon: <XCircle size={12} />, bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Çelişkili' };
      case 'single_source':
        return { icon: <Clock size={12} />, bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Tek Kaynak' };
      case 'stale':
        return { icon: <Clock size={12} />, bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Gecikmeli Veri' };
      case 'anomaly_flagged':
      case 'pending_human_review':
        return { icon: <ShieldAlert size={12} />, bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Onay Bekliyor' };
      default:
        return { icon: <CheckCircle2 size={12} />, bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Bilinmiyor' };
    }
  };

  const config = getBadgeConfig();
  
  const tooltipText = [
    status ? `Durum: ${status}` : null,
    confidence != null ? `Güven Skoru: %${(confidence * 100).toFixed(0)}` : null,
    sources && sources.length > 0 ? `Kaynaklar: ${sources.join(', ')}` : null
  ].filter(Boolean).join(' | ');

  return (
    <div 
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-medium ${config.bg} ${config.text} ${config.border} ${size === 'md' ? 'px-2 py-1 text-xs' : ''}`}
      title={tooltipText}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};
