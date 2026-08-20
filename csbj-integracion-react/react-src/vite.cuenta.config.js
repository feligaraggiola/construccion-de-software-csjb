import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Compila src/entry-cuenta.jsx a un único archivo JS (formato IIFE)
// que se incluye directamente con <script> en mi-cuenta.html.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../csbj/js/react',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/entry-cuenta.jsx',
      name: 'CSBJCuenta',
      formats: ['iife'],
      fileName: () => 'cuenta.bundle.js',
    },
    rollupOptions: {
      output: { extend: true },
    },
  },
});
