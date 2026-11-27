import { vi } from 'vitest'
import { createFrontendI18n, normalizeLocale } from '../src/i18n'

// Only the ComfyUI boundary is mocked. Vue components and Canvas remain real.
export class ComponentWidgetImpl {
  constructor(options: object) { Object.assign(this, options) }
}
export function addWidget(node: any, widget: any) { node.widgets.push(widget) }
export const settings = new Map<string, unknown>()
export const tabs: Array<{ id: string; render: (container: HTMLElement) => void; destroy?: () => void }> = []
const apiEvents = new EventTarget()
export const app = {
  api: { fetchApi: vi.fn(), getSetting: vi.fn(async (id: string) => settings.get(id)),
    addEventListener: apiEvents.addEventListener.bind(apiEvents), removeEventListener: apiEvents.removeEventListener.bind(apiEvents),
    dispatchEvent: apiEvents.dispatchEvent.bind(apiEvents) },
  ui: { settings: new EventTarget() },
  registerExtension: vi.fn(),
  extensionManager: {
    dialog: { confirm: vi.fn(), prompt: vi.fn() },
    setting: {
      get: vi.fn((id: string) => settings.get(id)),
      set: vi.fn((id: string, value: unknown) => { settings.set(id, value); app.ui.settings.dispatchEvent(new Event(`${id}.change`)) }),
    },
    getSidebarTabs: vi.fn(() => tabs),
    registerSidebarTab: vi.fn((tab: typeof tabs[number]) => { tabs.push(tab) }),
  },
}
export const api = app.api

export function mountOptions(locale = 'en') {
  const i18n = createFrontendI18n()
  i18n.global.locale.value = normalizeLocale(locale)
  return {
    attachTo: document.body,
    global: {
      plugins: [i18n],
    },
  }
}

export function drawStroke(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  for (const [type, offset] of [['mousedown', 30], ['mousemove', 60], ['mousemove', 100], ['mouseup', 100]] as const) {
    canvas.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: rect.left + offset, clientY: rect.top + offset }))
  }
}

