import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import VueExampleComponent from '../../src/features/drawing/VueExampleComponent.vue'
import { app, drawStroke, mountOptions } from '../host'
import en from '../../../locales/en/main.json'
import zh from '../../../locales/zh/main.json'

test('saved workflow value restores exact PNG pixels and preserves upload contract', async () => {
  const widget: any = { node: {} }
  const first = mount(VueExampleComponent, { ...mountOptions(), props: { widget } })
  const original = first.get('canvas').element as HTMLCanvasElement
  drawStroke(original)
  const png = original.toDataURL('image/png')
  const saved = JSON.parse(JSON.stringify(widget.options.getValue()))
  expect(saved.canvasDataURL).toBe(png)
  expect(app.api.fetchApi).not.toHaveBeenCalled()
  first.unmount()
  const loaded: any = { node: {}, value: saved }
  const second = mount(VueExampleComponent, { ...mountOptions(), props: { widget: loaded } })
  const restored = second.get('canvas').element as HTMLCanvasElement
  await expect.poll(() => restored.toDataURL('image/png')).toBe(png)
  expect(await loaded.serializeValue(loaded.node, 0)).toEqual({ image: 'threed/drawing.png [temp]' })
  // Host configuration can also assign a value after mounting (undo/load).
  const blank = document.createElement('canvas'); blank.width = blank.height = 300
  const context = blank.getContext('2d')!; context.fillStyle = 'white'; context.fillRect(0, 0, 300, 300)
  loaded.options.setValue({ image: null, canvasDataURL: blank.toDataURL() })
  await expect.poll(() => restored.toDataURL()).toBe(blank.toDataURL())
  expect(loaded.options.getValue().canvasDataURL).toBe(blank.toDataURL())
})

test('empty workflow values stay editable and malformed saved pixels report an error', async () => {
  const widget: any = { node: {}, value: '' }
  const wrapper = mount(VueExampleComponent, { ...mountOptions('zh'), props: { widget } })
  const canvas = wrapper.get('canvas').element as HTMLCanvasElement
  widget.options.setValue({ image: null, canvasDataURL: 'data:image/png;base64,invalid' })
  await expect.poll(() => wrapper.find('[role=alert]').exists()).toBe(true)
  expect(wrapper.text()).toContain(zh['vue-basic']['restore-error'])
  drawStroke(canvas)
  await expect.poll(() => wrapper.find('[role=alert]').exists()).toBe(false)
  expect(await widget.serializeValue(widget.node, 0)).toEqual({ image: 'threed/drawing.png [temp]' })
})

test('Chinese drawing translations include every English key and the pen tooltip', () => {
  expect(Object.keys(zh['vue-basic']).sort()).toEqual(Object.keys(en['vue-basic']).sort())
  expect(zh['vue-basic']['pen-tooltip']).toBe('使用画笔绘图')
})

test('serializes current Canvas pixels into the existing upload contract', async () => {
  const widget: any = { node: {} }
  const wrapper = mount(VueExampleComponent, { ...mountOptions(), props: { widget } })
  const canvas = wrapper.get('canvas').element as HTMLCanvasElement
  drawStroke(canvas)
  const expectedPng = await fetch(canvas.toDataURL()).then(response => response.arrayBuffer())
  expect(await widget.serializeValue(widget.node, 0)).toEqual({ image: 'threed/drawing.png [temp]' })
  expect(app.api.fetchApi).toHaveBeenCalledTimes(1)
  const [path, options] = app.api.fetchApi.mock.calls[0]
  expect(path).toBe('/upload/image')
  expect(options.method).toBe('POST')
  const form = options.body as FormData
  expect(form.get('subfolder')).toBe('threed')
  expect(form.get('type')).toBe('temp')
  const file = form.get('image') as File
  expect(file.name).toMatch(/^test_vue_basic_\d+\.png$/)
  expect(new Uint8Array(await file.arrayBuffer())).toEqual(new Uint8Array(expectedPng))
})

test('upload rejection keeps the existing null-image failure contract', async () => {
  const widget: any = { node: {} }
  mount(VueExampleComponent, { ...mountOptions(), props: { widget } })
  app.api.fetchApi.mockRejectedValueOnce(new Error('test: disconnected'))
  expect(await widget.serializeValue(widget.node, 0)).toEqual({ image: null })
})
