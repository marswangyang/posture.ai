import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// GitHub Pages 專案頁：build 時設 VITE_BASE=/repo-name/（例：/landing-page/）
// Vercel / 根網域：不設或 VITE_BASE=/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild'
  },
  server: {
    proxy: {
      // 本機開發時轉發到 Google Script，避免 CORS；.env 需設定 VITE_GOOGLE_SCRIPT_URL
      '/api/proxy': (() => {
        const url = process.env.VITE_GOOGLE_SCRIPT_URL
        if (!url) return { target: 'https://script.google.com', changeOrigin: true }
        try {
          const u = new URL(url)
          return {
            target: u.origin,
            changeOrigin: true,
            secure: true,
            rewrite: () => u.pathname + u.search
          }
        } catch (_) {
          return { target: 'https://script.google.com', changeOrigin: true }
        }
      })()
    }
  }
})
