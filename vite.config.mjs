import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/auto-expo/' : '/',
  plugins: [react()],
  build: { rollupOptions: { input: { en: resolve(import.meta.dirname, 'index.html'), zh: resolve(import.meta.dirname, 'zh/index.html'), es: resolve(import.meta.dirname, 'es/index.html') } } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  }
});
