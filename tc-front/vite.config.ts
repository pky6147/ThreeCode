// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "localhost",
//     proxy: {
//       '/api': {
//         target: "http://localhost:8080",
//         rewrite:(path) => path.replace(/^\/api/,""),
//         changeOrigin: true
//       },
//       '/images': {               // ✅ 이미지 요청도 프록시
//         target: "http://localhost:8080",
//         changeOrigin: true
//       }
//     }
//   }
// })




import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: "0.0.0.0",
    port: 80,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://172.20.20.4:8080',
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true
      },
      '/images': {               // ✅ 이미지 요청도 프록시
        target: "http://172.20.20.4:8080",
        changeOrigin: true
      }
    }
  }
  })

