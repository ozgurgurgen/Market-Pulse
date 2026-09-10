import React from 'react';

/**
 * Robust React.lazy wrapper with automatic retry on chunk loading failure.
 * Solves "Failed to fetch dynamically imported module" errors in Vite/React.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<any>,
  namedExport?: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      const module = await componentImport();
      if (namedExport && module[namedExport]) {
        return { default: module[namedExport] };
      }
      if (module.default) {
        return module;
      }
      const firstExport = Object.values(module).find(v => typeof v === 'function' || (typeof v === 'object' && v !== null));
      if (firstExport) {
        return { default: firstExport as T };
      }
      return module;
    } catch (error: any) {
      console.warn(`[LazyRetry] Dynamic module import failed. Retrying...`, error?.message || error);
      
      // Wait 400ms before retrying
      await new Promise(resolve => setTimeout(resolve, 400));
      
      try {
        const module = await componentImport();
        if (namedExport && module[namedExport]) {
          return { default: module[namedExport] };
        }
        if (module.default) {
          return module;
        }
        return module;
      } catch (retryError) {
        console.error(`[LazyRetry] Failed after retry:`, retryError);
        throw retryError;
      }
    }
  });
}
