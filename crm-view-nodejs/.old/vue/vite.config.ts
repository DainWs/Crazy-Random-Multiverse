import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
      outDir: './../dist/public',
      chunkSizeWarningLimit: 1000,
  },
  base: '',
  server: {
    port: 8080
  },
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}))
