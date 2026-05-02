import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['ikona.svg'],
      manifest: {
        name: 'PotniK — pohodni portal',
        short_name: 'PotniK',
        description: 'Pohodni portal za Slovenijo',
        theme_color: '#003DA5',
        background_color: '#003DA5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        lang: 'sl',
        icons: [
          { src: 'ikona.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        // Offline: predpomni vse JS/CSS/HTML ob prvem obisku
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            // OpenTopoMap tile-i — predpomni za offline
            urlPattern: /^https:\/\/[abc]\.tile\.opentopomap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'topo-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            // ARSO vreme API
            urlPattern: /^https:\/\/vreme\.arso\.gov\.si\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'arso-vreme',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 }
            }
          }
        ]
      }
    })
  ]
})
