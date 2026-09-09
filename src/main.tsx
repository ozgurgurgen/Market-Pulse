import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext';
import { AdminConfigProvider } from './contexts/AdminConfigContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initClientErrorLogger } from './utils/clientErrorLogger';
import './index.css';

// Safely initialize client-side error tracking
try {
  initClientErrorLogger();
} catch (e) {
  console.warn('initClientErrorLogger warning:', e);
}

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <AuthProvider>
            <AdminConfigProvider>
              <App />
            </AdminConfigProvider>
          </AuthProvider>
        </ErrorBoundary>
      </StrictMode>,
    );
  } catch (renderError: any) {
    console.error('Fatal createRoot error:', renderError);
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0b0f17; color: #f8fafc; font-family: sans-serif; padding: 24px; text-align: center;">
        <div style="max-width: 440px; background: #0f172a; border: 1px solid #ef4444; border-radius: 16px; padding: 24px;">
          <h2 style="color: #ef4444; font-size: 18px; margin: 0 0 8px 0; font-weight: 700;">Uygulama Başlatılamadı</h2>
          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 16px 0;">${renderError?.message || 'Beklenmeyen render hatası'}</p>
          <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload(true);" style="background: #10b981; color: #022c22; font-weight: 700; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 13px;">
            Önbelleği Temizle ve Yenile
          </button>
        </div>
      </div>
    `;
  }
}

