import { expect, test, vi } from 'vitest';
import { registerFitsSource } from '../../src/host/fitsSource';
import type { ComfyApp } from '../../src/host/comfy';
import { app, settings } from '../host';

test('collection input labels follow newly added inputs and language without changing their keys', () => {
  settings.set('Comfy.Locale', 'zh');
  const registerExtension = vi.fn<(extension: Parameters<ComfyApp['registerExtension']>[0]) => void>();
  const host = { ...app, registerExtension } as unknown as ComfyApp;
  const first = { name: 'item0', label: '' };
  const widget = { onRemove: vi.fn(), serialize: true };
  const node = {
    comfyClass: 'AstroPhotoAggregate', inputs: [first], graph: null,
    setDirtyCanvas: vi.fn(), addDOMWidget: (_name: string, _type: string, element: HTMLElement) => {
      document.body.append(element);
      return Object.assign(widget, { node, element, name: _name });
    },
  };
  registerFitsSource(host);
  const extension = registerExtension.mock.calls[0][0];
  extension.nodeCreated?.(node as never, host);
  expect(first).toEqual({ name: 'item0', label: '来源 1' });
  const second = { name: 'item1', label: '' };
  node.inputs.push(second);
  (node as typeof node & { onInputAdded: (input: typeof second) => void }).onInputAdded(second);
  expect(second).toEqual({ name: 'item1', label: '来源 2' });
  settings.set('Comfy.Locale', 'en');
  app.ui.settings.dispatchEvent(new Event('Comfy.Locale.change'));
  expect(node.inputs.map(input => input.label)).toEqual(['Source 1', 'Source 2']);
  widget.onRemove();
  document.querySelector('.ap-aggregate-note')?.remove();
  settings.delete('Comfy.Locale');
});
