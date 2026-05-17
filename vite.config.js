import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  

// https://vite.dev/config/
export default defineConfig({
  base: '/business_map/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: true,
    port: 5173
  }
})
