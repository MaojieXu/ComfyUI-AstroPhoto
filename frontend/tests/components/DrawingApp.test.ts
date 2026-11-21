import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import DrawingApp from '../../src/features/drawing/DrawingApp.vue'
import { drawStroke, mountOptions } from '../host'

test('real Canvas drawing emits and saves changed PNG data, then clears', async () => {
  const wrapper = mount(DrawingApp, { ...mountOptions(), props: { width: 300, height: 300 } })
  const canvas = wrapper.get('canvas').element as HTMLCanvasElement
  const before = canvas.toDataURL('image/png')
  expect(await wrapper.vm.getCanvasData()).toBe(before)
  drawStroke(canvas)
  const after = canvas.toDataURL('image/png')
  expect(after).not.toBe(before)
  expect(wrapper.emitted('drawing-start')).toHaveLength(1)
  expect(wrapper.emitted('drawing-end')).toHaveLength(1)
  expect(wrapper.emitted('state-save')!.at(-1)).toEqual([after, true])
  expect(await wrapper.vm.getCanvasData()).toBe(after)
  // Verify actual raster pixels, not just event emission or a mocked data URL.
  expect([...canvas.getContext('2d')!.getImageData(60, 60, 1, 1).data]).toEqual([0, 0, 0, 255])
  const clear = wrapper.findAll('button').find(button => button.text() === 'Clear Canvas')!
  await clear.trigger('click')
  expect(canvas.toDataURL('image/png')).toBe(before)
  expect(await wrapper.vm.getCanvasData()).toBe(before)
})

test('toolbar updates brush color and size and renders Chinese text', async () => {
  const wrapper = mount(DrawingApp, { ...mountOptions('zh'), props: { width: 300, height: 300 } })
  expect(wrapper.text()).toContain('清除画布')
  await wrapper.get('button[title="#ff0000"]').trigger('click')
  await wrapper.get('input[type="range"]').setValue('12')
  expect(wrapper.emitted('color-change')!.at(-1)).toEqual(['#ff0000'])
  expect(wrapper.emitted('brush-size-change')!.at(-1)).toEqual([12])
  const canvas = wrapper.get('canvas').element as HTMLCanvasElement
  drawStroke(canvas)
  expect([...canvas.getContext('2d')!.getImageData(60, 60, 1, 1).data]).toEqual([255, 0, 0, 255])
})

test('touch drawing uses real TouchEvents and saves Canvas pixels', () => {
  const wrapper = mount(DrawingApp, { ...mountOptions(), props: { width: 300, height: 300 } })
  const canvas = wrapper.get('canvas').element as HTMLCanvasElement
  const before = canvas.toDataURL()
  const rect = canvas.getBoundingClientRect()
  for (const [type, offset] of [['touchstart', 30], ['touchmove', 100]] as const) {
    const touch = new Touch({ identifier: 1, target: canvas, clientX: rect.left + offset, clientY: rect.top + offset })
    canvas.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: [touch] }))
  }
  canvas.dispatchEvent(new TouchEvent('touchend', { bubbles: true }))
  expect(canvas.toDataURL()).not.toBe(before)
  expect(wrapper.emitted('drawing-end')).toHaveLength(1)
})
