import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'module/index.ts'),
      name: 'VowelTracker',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@mediapipe/tasks-vision'],
      output: {
        globals: {
          '@mediapipe/tasks-vision': 'MediaPipeTasksVision',
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './module'),
    },
  },
  server: {
    port: 3000,
    open: '/demo/index.html',
  },
});

