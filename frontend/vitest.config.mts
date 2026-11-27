import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  optimizeDeps: {
    include: ['@comfyorg/design-system/button.variants', 'vue', '@vue/test-utils', 'vue-i18n', 'reka-ui', '@comfyorg/design-system/multi-select/MultiSelect', '@comfyorg/design-system/search-input/SearchInput', '@comfyorg/design-system/menu/Menu', '@comfyorg/design-system/menu/MenuItems', '@comfyorg/design-system/menu/MenuRadioGroup', '@comfyorg/design-system/lib/menu/usePointMenu', '@comfyorg/design-system/input/Input', '@comfyorg/design-system/textarea/Textarea', '@comfyorg/design-system/radio-group/RadioGroup', '@comfyorg/design-system/radio-group/RadioGroupItem', '@comfyorg/design-system/dialog/Dialog', '@comfyorg/design-system/dialog/DialogContent', '@comfyorg/design-system/dialog/DialogDescription', '@comfyorg/design-system/dialog/DialogHeader', '@comfyorg/design-system/dialog/DialogOverlay', '@comfyorg/design-system/dialog/DialogPortal', '@comfyorg/design-system/dialog/DialogTitle'],
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
    dedupe: ['vue', 'vue-i18n'],
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
