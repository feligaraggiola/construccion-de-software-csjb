import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Compila src/entry-login.jsx a un único archivo JS (formato IIFE)
// que se incluye directamente con <script> en login.html.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../csbj/js/react',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/entry-login.jsx',
      name: 'CSBJLogin',
      formats: ['iife'],
      fileName: () => 'login.bundle.js',
    },
    rollupOptions: {
      output: { extend: true },
    },
  },
});
