import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const backendHost = process.env.BACKEND_HOST ?? 'localhost'
const restTarget = `http://${backendHost}:8080`
const socketTarget = `http://${backendHost}:9092`

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../src', import.meta.url))
        }
    },
    server: {
        port: 80,
        proxy: {
            '/game': restTarget,
            '/party': restTarget,
            '/register': restTarget,
            '/user': restTarget,
            '/resources': restTarget,
            '/socket.io': { target: socketTarget, ws: true }
        }
    }
})
