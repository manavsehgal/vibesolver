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
        'vite.svg',
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
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
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
      '@/db': path.resolve(__dirname, './src/db/browser-mock.ts'),
      '@/db/index': path.resolve(__dirname, './src/db/browser-mock.ts'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    exclude: ['better-sqlite3'],
    include: ['@ai-sdk/anthropic', 'ai'],
  },
  build: {
    rollupOptions: {
      external: [
        'better-sqlite3',
        'fs',
        'path',
        'util',
        'node:crypto',
        'node:fs',
        'bindings'
      ],
      output: {
        globals: {
          'better-sqlite3': 'Database',
          'fs': 'fs',
          'path': 'path',
          'util': 'util',
          'node:crypto': 'crypto',
          'node:fs': 'fs',
          'bindings': 'bindings'
        }
      }
    }
  },
});
