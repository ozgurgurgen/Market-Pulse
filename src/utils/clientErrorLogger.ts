import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

let isLoggerInitialized = false;
const recentErrorHashes = new Set<string>();

function getErrorHash(msg: string): string {
  let hash = 0;
  for (let i = 0; i < msg.length; i++) {
    hash = (hash << 5) - hash + msg.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export async function persistErrorToFirestore(
  message: string,
  stack: string = '',
  context: string = 'CLIENT_ERROR',
  extraPath?: string
) {
  try {
    if (!message) return;
    // Suppress ignorable sandbox messages
    if (
      message.includes('[vite]') ||
      message.includes('WebSocket') ||
      message.includes('ResizeObserver') ||
      message.includes('Permission denied') ||
      message.includes('Missing or insufficient permissions')
    ) {
      return;
    }

    const hash = getErrorHash(message + context);
    if (recentErrorHashes.has(hash)) {
      return; // Rate limit duplicate spam
    }
    recentErrorHashes.add(hash);
    setTimeout(() => recentErrorHashes.delete(hash), 10000);

    const logId = 'err_fe_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const path = extraPath || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '');
    const timestamp = new Date().toISOString();

    const errorPayload = {
      id: logId,
      message: message.slice(0, 1000),
      stack: stack ? stack.slice(0, 1500) : '',
      context,
      path,
      method: 'CLIENT_BROWSER',
      userEmail: (typeof localStorage !== 'undefined' && localStorage.getItem('mp_user_email')) || 'client@marketpulse.local',
      timestamp
    };

    // Parallel background reporting without throwing
    try {
      setDoc(doc(db, 'errorLogs', logId), errorPayload).catch(() => {});
    } catch {}

    try {
      fetch('/api/public-log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorPayload)
      }).catch(() => {});
    } catch {}
  } catch {
    // Fail silently
  }
}

export function logClientError(error: any, context = 'MANUAL_CLIENT_ERROR', extraMeta?: any) {
  try {
    const message = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
    const stack = error?.stack || (extraMeta?.componentStack ? String(extraMeta.componentStack) : '');
    persistErrorToFirestore(message, stack, context);
  } catch {}
}

export function initClientErrorLogger() {
  if (isLoggerInitialized || typeof window === 'undefined') return;
  isLoggerInitialized = true;

  // Intercept uncaught JavaScript errors safely
  window.addEventListener('error', (event) => {
    try {
      const message = event.message || 'Uncaught JavaScript Error';
      if (
        message.includes('[vite]') ||
        message.includes('WebSocket') ||
        message.includes('ResizeObserver')
      ) {
        return;
      }
      const stack = event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`;
      persistErrorToFirestore(message, stack, 'UNCAUGHT_WINDOW_ERROR', event.filename);
    } catch {}
  });

  // Intercept unhandled promise rejections safely
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      const message = reason?.message || (typeof reason === 'string' ? reason : 'Unhandled Promise Rejection');
      if (
        message.includes('[vite]') ||
        message.includes('WebSocket') ||
        message.includes('ResizeObserver') ||
        message.includes('Missing or insufficient permissions')
      ) {
        return;
      }
      const stack = reason?.stack || '';
      persistErrorToFirestore(message, stack, 'UNHANDLED_PROMISE_REJECTION');
    } catch {}
  });
}

