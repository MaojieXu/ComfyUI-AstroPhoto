import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['vue', '@vue/test-utils', 'vue-i18n', 'primevue/config', 'primevue/tooltip', 'primevue/button'],
  },
  resolve: {
    alias: [
      { find: 'comfy:app', replacement: fileURLToPath(new URL('./tests/host.ts', import.meta.url)) },
      { find: 'comfy:api', replacement: fileURLToPath(new URL('./tests/host.ts', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '../../scripts/app.js', replacement: fileURLToPath(new URL('./tests/host.ts', import.meta.url)) },
      { find: '../../scripts/api.js', replacement: fileURLToPath(new URL('./tests/host.ts', import.meta.url)) },
      { find: '../../../scripts/domWidget.js', replacement: fileURLToPath(new URL('./tests/host.ts', import.meta.url)) },
    ],
    dedupe: ['vue', 'vue-i18n', 'primevue'],
  },
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  test: {
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
})
