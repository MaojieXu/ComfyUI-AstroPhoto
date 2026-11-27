import { expect, test, vi } from 'vitest';
import { nextTick } from 'vue';
import { registerFitsSource } from '../../src/host/fitsSource';
import type { ComfyApp } from '../../src/host/comfy';
import { app, settings } from '../host';

test('a selected group refreshes and reports deletion without changing its value or draft', async () => {
  settings.set('Comfy.Locale', 'zh');
  const id = '00000000-0000-4000-8000-000000000001';
  let exists = true;
  app.api.fetchApi.mockImplementation(async (path: string) => {
    if (path.includes('/library/import-groups')) return Response.json({ items: exists
      ? [{ id, name: 'M86 Blue', revision: 1, count: 3, workspaces: [] }] : [], next: null });
    if (path.includes('/catalog/subframe_collection/')) return exists
      ? Response.json({ id, name: 'M86 Blue' }) : Response.json({ error: { code: 'LIBRARY_RECORD_NOT_FOUND' } }, { status: 404 });
    throw new Error(`Unexpected request: ${path}`);
  });
  const registerExtension = vi.fn<(extension: Parameters<ComfyApp['registerExtension']>[0]) => void>();
  const host = { ...app, canvas: { read_only: false, selectOnly: false }, registerExtension } as unknown as ComfyApp;
  let element: HTMLElement;
  let options: { getValue: () => string; setValue: (value: string) => void };
  const node = {
    graph: { change: vi.fn() }, size: [300, 200], setSize: vi.fn(), computeSize: () => [300, 200],
    addDOMWidget(name: string, _type: string, el: HTMLElement, opts: typeof options) {
      element = el; options = opts; document.body.append(el);
      return { name, element: el, node: this, onRemove: vi.fn(), get value() { return opts.getValue(); },
        set value(value: string) { opts.setValue(value); } };
    },
  };
  registerFitsSource(host);
  const widget = registerExtension.mock.calls[0][0].getCustomWidgets!(host).ASTRO_FOLDER_SOURCE(node as never, 'source', {} as never, host).widget;
  options!.setValue(id);
  await vi.waitFor(() => expect(element!.querySelector('select')?.value).toBe(id));
  const manual = [...element!.querySelectorAll('button')].find(button => button.textContent === '手动输入路径')!;
  manual.click();
  await nextTick();
  const input = element!.querySelector<HTMLInputElement>('input:not([readonly])')!;
  input.value = 'draft'; input.dispatchEvent(new Event('input', { bubbles: true }));
  exists = false;
  app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  await vi.waitFor(() => expect(element!.textContent).toContain('素材已移除，请重新选择。'));
  expect(options!.getValue()).toBe(id);
  expect(element!.querySelector<HTMLInputElement>('input:not([readonly])')?.value).toBe('draft');
  widget.onRemove?.(); element!.remove();
  settings.delete('Comfy.Locale');
});

test('a missing file clears its old displayed path while a network error is not called removal', async () => {
  settings.set('Comfy.Locale', 'zh');
  const id = '00000000-0000-4000-8000-000000000002';
  let state: 'ready' | 'offline' | 'removed' = 'ready';
  app.api.fetchApi.mockImplementation(async (path: string) => {
    if (state === 'offline') throw new Error('network');
    if (path.includes('/library/assets?')) return Response.json({ items: [], next: null });
    if (state === 'removed') return Response.json({ error: { code: 'ASSET_NOT_FOUND' } }, { status: 404 });
    if (path.includes('/library/assets/')) return Response.json({ id, name: 'image.fit' });
    if (path.includes('/assets/')) return Response.json({ path: 'C:/image.fit' });
    throw new Error(`Unexpected request: ${path}`);
  });
  const registerExtension = vi.fn<(extension: Parameters<ComfyApp['registerExtension']>[0]) => void>();
  const host = { ...app, canvas: { read_only: false, selectOnly: false }, registerExtension } as unknown as ComfyApp;
  let element: HTMLElement;
  let options: { getValue: () => string; setValue: (value: string) => void };
  const node = {
    graph: { change: vi.fn() }, size: [300, 200], setSize: vi.fn(), computeSize: () => [300, 200],
    addDOMWidget(name: string, _type: string, el: HTMLElement, opts: typeof options) {
      element = el; options = opts; document.body.append(el);
      return { name, element: el, node: this, onRemove: vi.fn(), get value() { return opts.getValue(); },
        set value(value: string) { opts.setValue(value); } };
    },
  };
  registerFitsSource(host);
  const widget = registerExtension.mock.calls[0][0].getCustomWidgets!(host).ASTRO_FILE_SOURCE(node as never, 'source', {} as never, host).widget;
  options!.setValue(id);
  await vi.waitFor(() => expect(element!.querySelector<HTMLInputElement>('input[readonly]')?.value).toBe('C:/image.fit'));
  state = 'offline'; app.api.dispatchEvent(new Event('astrophoto.library_changed'));
  await vi.waitFor(() => expect(element!.textContent).toContain('素材加载失败，请重试。'));
  expect(element!.textContent).not.toContain('素材已移除，请重新选择。');
  expect(element!.querySelector<HTMLInputElement>('input[readonly]')?.value).toBe('C:/image.fit');
  state = 'removed'; app.api.dispatchEvent(new Event('reconnected'));
  await vi.waitFor(() => expect(element!.textContent).toContain('素材已移除，请重新选择。'));
  expect(element!.querySelector<HTMLInputElement>('input[readonly]')?.value).toBe('');
  expect(options!.getValue()).toBe(id);
  widget.onRemove?.(); element!.remove(); settings.delete('Comfy.Locale');
});
