import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    proxy: {
      '/api': {
        target: "http://localhost:8080",
        rewrite:(path) => path.replace(/^\/api/,""),
        changeOrigin: true
      },
      '/images': {               // ✅ 이미지 요청도 프록시
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
})

