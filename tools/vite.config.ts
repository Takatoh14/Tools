import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tools/',
  server: {
    host: true,        // 0.0.0.0 で待ち受け
    port: 5173,
    strictPort: true,
    // WSL/コンテナでの監視が不安定な場合:
    // watch: { usePolling: true }
  },
})
