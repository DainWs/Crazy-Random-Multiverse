import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/fakes\/(.*)$/, replacement: path.resolve(__dirname, './test/fakes/$1') },
      { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  },
  test: {
    include: ['test/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    silent: 'passed-only',
    setupFiles: ['./vitest.setup.ts']
  },
})
