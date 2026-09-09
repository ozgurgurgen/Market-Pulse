import { auth } from '../lib/firebase';

export interface SafeFetchOptions extends RequestInit {
  timeout?: number;
}

export async function safeFetchJson<T>(
  url: string,
  options?: SafeFetchOptions,
  fallbackValue?: any,
  retries = 2
): Promise<{ data: T | null; ok: boolean; status: number; error?: string }> {
  const timeoutMs = options?.timeout ?? 45000; // 45 saniye varsayılan zaman aşımı süresi

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    let timedOut = false;

    const timeoutId = setTimeout(() => {
      timedOut = true;
      try {
        controller.abort('TimeoutError');
      } catch {
        controller.abort();
      }
    }, timeoutMs);

    const externalSignal = options?.signal;
    const onExternalAbort = () => {
      try {
        controller.abort(externalSignal?.reason || 'AbortError');
      } catch {
        controller.abort();
      }
    };

    if (externalSignal) {
      if (externalSignal.aborted) {
        onExternalAbort();
      } else {
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }
    }

    try {
      const headers = new Headers(options?.headers);
      
      // Auto-set Content-Type for JSON payloads if not already set
      if (options?.body && !headers.has('Content-Type') && typeof options.body === 'string') {
        headers.set('Content-Type', 'application/json');
      }

      // Auto-inject Firebase Auth token if user is signed in
      if (auth?.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
        } catch {
          // Fallback without token
        }
      }

      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }
      
      if (!res.ok) {
        let errorMsg = res.statusText;
        let errorData = null;
        try {
          errorData = await res.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          }
        } catch {}
        return { data: errorData || fallbackValue || null, ok: false, status: res.status, error: errorMsg };
      }
      
      const data = await res.json();
      return { data, ok: true, status: res.status };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort);
      }

      // Hata mesajını kullanıcı dostu hale getir
      let friendlyError = error?.message || 'Ağ isteği başarısız oldu';
      if (
        timedOut || 
        error?.name === 'TimeoutError' || 
        error?.name === 'AbortError' || 
        friendlyError.toLowerCase().includes('aborted') ||
        friendlyError.toLowerCase().includes('abort')
      ) {
        friendlyError = timedOut 
          ? `Sunucu yanıt süresi aşıldı (${Math.round(timeoutMs / 1000)} sn). Lütfen tekrar deneyin.`
          : 'İstek zaman aşımına uğradı veya bağlantı kesildi. Lütfen tekrar deneyin.';
      }

      if (attempt < retries && !externalSignal?.aborted) {
        // Kısa bir bekleme sonrasında tekrar dene
        await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
        continue;
      }

      console.warn(`[apiClient] Network request to ${url} recovered with fallback:`, friendlyError);
      return { data: fallbackValue || null, ok: false, status: 500, error: friendlyError };
    }
  }

  return { data: fallbackValue || null, ok: false, status: 500, error: 'İstek tamamlanamadı' };
}


