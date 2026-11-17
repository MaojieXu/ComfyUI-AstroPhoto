import { vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import en from '../../locales/en/main.json'
import zh from '../../locales/zh/main.json'

// Only the ComfyUI boundary is mocked. Vue components and Canvas remain real.
export class ComponentWidgetImpl {
  constructor(options: object) { Object.assign(this, options) }
}
export function addWidget(node: any, widget: any) { node.widgets.push(widget) }
export const app = {
  api: { fetchApi: vi.fn() },
  registerExtension: vi.fn(),
  extensionManager: { setting: { get: () => 'en' } },
}
export const api = app.api

export function mountOptions(locale = 'en') {
  return {
    attachTo: document.body,
    global: {
      plugins: [createI18n({ legacy: false, locale, fallbackLocale: 'en', messages: { en, zh } }), PrimeVue],
      directives: { tooltip: Tooltip },
    },
  }
}

export function drawStroke(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  for (const [type, offset] of [['mousedown', 30], ['mousemove', 60], ['mousemove', 100], ['mouseup', 100]] as const) {
    canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: rect.left + offset, clientY: rect.top + offset }))
  }
}

