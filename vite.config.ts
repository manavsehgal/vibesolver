import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  define: {
    // Ensure Node.js modules are not included in browser bundle
    global: 'globalThis',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'safari-pinned-tab.svg',
      ],
      manifest: {
        name: 'VibeSolver - AI AWS Solutions Architect',
        short_name: 'VibeSolver',
        description:
          'AI twin of an AWS Solutions Architect that generates AWS solutions using natural language',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'anthropic-api-cache',
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Redirect database imports to browser-compatible mock
      '@/db$': path.resolve(__dirname, './src/db/browser-mock.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['better-sqlite3'],
  },
});
