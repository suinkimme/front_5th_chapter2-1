import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default mergeConfig(
  defineConfig({
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          basic: resolve(__dirname, 'index.basic.html'),
          advanced: resolve(__dirname, 'index.advanced.html'),
        },
      },
    },
    base:
      process.env.NODE_ENV === 'production' ? '/front_5th_chapter2-1/' : '/',
    plugins: [react()],
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests.js',
    },
  })
);
