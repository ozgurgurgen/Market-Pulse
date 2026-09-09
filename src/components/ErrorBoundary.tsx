import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logClientError } from '../utils/clientErrorLogger';

interface Props {
  children: ReactNode;
  inline?: boolean;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MarketPulse ErrorBoundary caught an error:', error, errorInfo);
    logClientError(error, 'REACT_COMPONENT_CRASH', { componentStack: errorInfo.componentStack });
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (!this.props.inline) {
      window.location.reload();
    }
  };

  public render() {
    console.log('MARKETPULSE_DEBUG: ErrorBoundary render. hasError:', this.state.hasError);
    if (this.state.hasError) {
      if (this.props.inline) {
        return (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {this.props.fallbackTitle || 'Bu Bölüm Yüklenirken Bir Hata Oluştu'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {this.props.fallbackMessage || 'Veri işlenirken beklenmeyen bir durum oluştu. Lütfen tekrar deneyin.'}
            </p>
            {this.state.error && (
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-left text-[11px] font-mono text-rose-300 max-h-24 overflow-y-auto break-words">
                {this.state.error.message || this.state.error.toString()}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw size={13} />
              Tekrar Dene
            </button>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle size={24} />
            </div>
            
            <h1 className="text-xl font-bold text-slate-100">
              Uygulamada Bir Aksaklık Oluştu
            </h1>
            
            <p className="text-sm text-slate-400">
              Sayfa yüklenirken beklenmeyen bir durum meydana geldi. Lütfen sayfayı yenilemeyi deneyin.
            </p>

            {this.state.error && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-left text-xs font-mono text-rose-300 max-h-32 overflow-y-auto break-words">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
              >
                <RefreshCw size={16} />
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
