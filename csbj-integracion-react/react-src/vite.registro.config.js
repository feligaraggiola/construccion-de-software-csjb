import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Compila src/entry-registro.jsx a un único archivo JS (formato IIFE)
// que se incluye directamente con <script> en registro.html.
export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [react()],
  build: {
    outDir: '../csbj/js/react',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/entry-registro.jsx',
      name: 'CSBJRegistro',
      formats: ['iife'],
      fileName: () => 'registro.bundle.js',
    },
    rollupOptions: {
      output: { extend: true },
    },
  },
});
