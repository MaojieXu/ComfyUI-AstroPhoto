import { afterEach, beforeEach, vi } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'
import { app } from './host'

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('app', app)
  app.api.fetchApi.mockImplementation(async () => new Response(JSON.stringify({ name: 'drawing.png', subfolder: 'threed', type: 'temp' })))
})
enableAutoUnmount(afterEach)
afterEach(() => {
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})
