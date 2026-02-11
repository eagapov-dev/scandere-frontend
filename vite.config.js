import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function cssFirstPlugin() {
  return {
    name: 'css-first',
    enforce: 'post',
    transformIndexHtml(html) {
      const cssTags = [];
      html = html.replace(/<link rel="stylesheet"[^>]*>/g, (match) => {
        cssTags.push(match);
        return '';
      });
      return html.replace('</title>', '</title>\n    ' + cssTags.join('\n    '));
    }
  };
}

export default defineConfig({
  plugins: [react(), cssFirstPlugin()],
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          swiper: ['swiper'],
          icons: ['react-icons'],
        },
      },
    },
  },
});
