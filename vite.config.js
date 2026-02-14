import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 如果部署到项目页面 (https://username.github.io/repo-name/)
  // 请将 base 设置为 '/repo-name/'
  // 如果部署到用户页面 (https://username.github.io/) 或自定义域名，设置为 '/'
  base: '/posture.ai/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild'
  }
})
