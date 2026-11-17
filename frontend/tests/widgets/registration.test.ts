import { expect, test, vi } from 'vitest'
import { app, drawStroke } from '../host'

test('built widget mounts its own Vue, PrimeVue and i18n on a native DOM widget', async () => {
  await import('../../../js/main.js')
  const extension = app.registerExtension.mock.calls[0][0]
  expect(extension.name).toBe('vue-basic')
  const removed = vi.fn()
  const node = {
    comfyClass: 'vue-basic', size: [100, 100], widgets: [] as any[],
    setSize(size: number[]) { this.size = size },
    addDOMWidget(name: string, type: string, element: HTMLElement, options: object) {
      document.body.append(element)
      const widget = { node: this, name, type, element, options, onRemove: removed }
      this.widgets.push(widget)
      return widget
    },
  }
  const { widget } = extension.getCustomWidgets(app).CUSTOM_VUE_COMPONENT_BASIC(node)
  extension.nodeCreated(node)
  expect(node.size).toEqual([300, 520])
  expect(node.widgets).toEqual([widget])
  expect(widget.name).toBe('custom_vue_component_basic')
  expect(widget.element.querySelector('h1').textContent).toBe('Vue Basic Example')
  await expect.poll(() => getComputedStyle(widget.element.querySelector('.toolbar')).display).toBe('flex')
  expect(getComputedStyle(document.documentElement).getPropertyValue('--astrophoto-primary-500').trim()).not.toBe('')
  const canvas = widget.element.querySelector('canvas')
  drawStroke(canvas)
  expect(await widget.serializeValue(node, 0)).toEqual({ image: 'threed/drawing.png [temp]' })
  expect(app.api.fetchApi).toHaveBeenCalledTimes(1)
  widget.onRemove()
  expect(removed).toHaveBeenCalledTimes(1)
  expect(widget.element.querySelector('canvas')).toBeNull()
})
