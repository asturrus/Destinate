import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test-setup.ts'],
    globals: true,
    include: ['client/src/**/*.test.{js,jsx,ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      'tests/**',
      '**/tests/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'test-setup.ts',
        '**/e2e/**',
        'tests/e2e/**',
        '**/tests/e2e/**',
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src')
    }
  }
})