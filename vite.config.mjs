import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/auto-expo/' : '/',
  plugins: [react()],
  build: { rollupOptions: { input: { en: resolve(import.meta.dirname, 'index.html'), zh: resolve(import.meta.dirname, 'zh/index.html'), es: resolve(import.meta.dirname, 'es/index.html'), pt: resolve(import.meta.dirname, 'pt/index.html'), fr: resolve(import.meta.dirname, 'fr/index.html'), de: resolve(import.meta.dirname, 'de/index.html'), ja: resolve(import.meta.dirname, 'ja/index.html'), ko: resolve(import.meta.dirname, 'ko/index.html'), ar: resolve(import.meta.dirname, 'ar/index.html'), hi: resolve(import.meta.dirname, 'hi/index.html'), id: resolve(import.meta.dirname, 'id/index.html'), ru: resolve(import.meta.dirname, 'ru/index.html') } } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  }
});
