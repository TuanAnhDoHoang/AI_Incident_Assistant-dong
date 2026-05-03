import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Port của Vite dev server
    port: 3000, 
    proxy: {
      // Khi frontend gọi /api, Vite sẽ chuyển tiếp sang backend
      '/api': {
        target: 'http://localhost:8000', // Địa chỉ Backend của bạn
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Dùng nếu muốn xóa tiền tố /api
      },
    },
  },
})
