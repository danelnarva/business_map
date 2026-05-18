import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "logo_vg.png",
      ],
      manifest: {
        name: 'V-G Business Map',
        short_name: 'Business Map',
        start_url: mode === 'production' ? '/business_map/' : '/',
        scope: mode === 'production' ? '/business_map/' : '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: mode === 'production' ? '/business_map/logo_vg.png' : '/logo_vg.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: mode === 'production' ? '/business_map/logo_vg.png' : '/logo_vg.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: mode === 'production' ? '/business_map/' : '/',
  server: {
    host: true,
    strictPort: true,
    port: 5173
  }
}))