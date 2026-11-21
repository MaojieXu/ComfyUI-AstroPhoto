import { afterEach, beforeEach, vi } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'
import { app, settings, tabs } from './host'

beforeEach(() => {
  vi.clearAllMocks()
  settings.clear()
  settings.set('Comfy.Locale', 'en')
  vi.stubGlobal('app', app)
  app.api.fetchApi.mockImplementation(async () => new Response(JSON.stringify({ name: 'drawing.png', subfolder: 'threed', type: 'temp' })))
})
afterEach(() => {
  for (const tab of tabs.splice(0)) tab.destroy?.()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})
enableAutoUnmount(afterEach)
