import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({

        registerType: 'autoUpdate',
        injectRegister: null, // Geliştirme ortamı iframe içinde otomatik SW kaydının kilitlenmesini önler
        devOptions: {
          enabled: false // Dev modunda Service Worker çalıştırmaz, çökme yaşanmaz
        },
        includeAssets: ['favicon.ico', 'icons/*.png', 'icons/*.svg'],
        manifest: {
          name: 'MarketPulse AI - Finansal İstihbarat & Portföy Radar',
          short_name: 'MarketPulse',
          description: 'Borsa İstanbul, TEFAS fonları, ABD hisseleri, yapay zeka analizleri ve portföy backtest platformu',
          start_url: '/',
          display: 'standalone',
          background_color: '#0b0f19',
          theme_color: '#0f172a',
          orientation: 'portrait',
          categories: ['finance', 'productivity', 'utilities'],
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              // Canlı fiyat, piyasa ve rasyo verisi - ASLA CACHE'LENMEZ (NetworkOnly)
              urlPattern: /^https?:\/\/[^\/]+\/api\/(market|stock|tefas|indicators|ai\/opportunities|ai\/tefas-opportunities).*/i,
              handler: 'NetworkOnly'
            },
            {
              // Kullanıcıya özel portföy, işlem ve sohbet verisi - ASLA CACHE'LENMEZ (NetworkOnly)
              urlPattern: /^https?:\/\/[^\/]+\/api\/(portfolio|user|database|ai\/chat|signals\/v2).*/i,
              handler: 'NetworkOnly'
            },
            {
              // Bilanço, akademi ve backtest verisi - NetworkFirst (çevrimdışı olunca kısa TTL fallback)
              urlPattern: /^https?:\/\/[^\/]+\/api\/(backtest|academy|macro).*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'financial-analytics-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 3600 // 1 saat
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Statik medya ve ikonlar - CacheFirst
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 3600 // 30 gün
                }
              }
            },
            {
              // Web fontları ve stiller - StaleWhileRevalidate
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-cache'
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
