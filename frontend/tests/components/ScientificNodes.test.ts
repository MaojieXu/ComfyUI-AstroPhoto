import { nextTick } from 'vue';
import { afterEach, expect, test, vi } from 'vitest';
import { sirilBundle } from '../../../extension/siril/frontend';
import { defaults } from '../../../extension/siril/frontend/api';
import type { ComfyApp } from '../../src/host/comfy';
import { app } from '../host';

type Extension = Parameters<ComfyApp['registerExtension']>[0];
type HostNode = Parameters<NonNullable<Extension['nodeCreated']>>[0];
const source = 'C:/observations with spaces/source.fit';
const jobId = '00000000-0000-4000-8000-000000000001';
let dispose: (() => void) | undefined;
afterEach(() => { dispose?.(); dispose = undefined; });

function mountStretch(channels: number, deferCandidate = false, staleFormal = false) {
  vi.useFakeTimers();
  const requests: unknown[] = [];
  const signals: AbortSignal[] = [];
  let formalRequested = false;
  app.api.fetchApi.mockImplementation(async (path: string, request: RequestInit) => {
    if (path.endsWith('/autostretch') && request.method === 'POST') {
      const body = JSON.parse(String(request.body));
      requests.push(body);
      formalRequested = Boolean(body.formal_id);
      return Response.json({ job_id: jobId });
    }
    if (path.endsWith('/' + jobId) && request.method === 'GET') {
      if (!deferCandidate) return Response.json(staleFormal && formalRequested
        ? { state: 'failed', error: 'PREVIEW_STALE' }
        : { state: 'ready', channels });
      const signal = request.signal!;
      signals.push(signal);
      return new Promise((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }));
    }
    if (path.endsWith('/cancel') && request.method === 'POST') return Response.json({});
    throw new Error(`Unexpected preview request ${path}`);
  });

  const container = document.createElement('div');
  document.body.append(container);
  const graph = { beforeChange: vi.fn(), afterChange: vi.fn(), change: vi.fn() };
  const canvas = { read_only: false, selectOnly: false, emitBeforeChange: vi.fn(), emitAfterChange: vi.fn() };
  const widget = { margin: 0, onRemove: vi.fn() as () => void };
  const previousExecuted = vi.fn();
  const node = {
    comfyClass: 'AstroPhotoSirilAutoStretch', title: 'AutoStretch', size: [300, 350], graph,
    widgets: Object.entries(defaults).map(([name, value]) => ({ name, value, disabled: false })),
    onExecuted: previousExecuted, onWidgetChanged: vi.fn(), setSize: vi.fn(), computeSize: () => [300, 395], setDirtyCanvas: vi.fn(),
    isInputConnected: () => true,
    getInputNode: () => ({ comfyClass: 'AstroPhotoImagePath', widgets: [{ name: 'image_path', value: source }] }),
    addDOMWidget: (name: string, _type: string, element: HTMLElement) => {
      container.append(element);
      return Object.assign(widget, { name, node, element });
    },
  };
  const registerExtension = vi.fn<(extension: Extension) => void>();
  const host = { ...app, canvas, registerExtension } as unknown as ComfyApp;
  sirilBundle.registerNodes(host, [sirilBundle]);
  registerExtension.mock.calls[0][0].nodeCreated?.(node as unknown as HostNode, host);
  dispose = () => { widget.onRemove(); container.remove(); };
  container.querySelector<HTMLButtonElement>('.ap-node-compare')!.click();
  return { node, canvas, graph, requests, signals, previousExecuted };
}

const dialog = () => document.querySelector<HTMLDialogElement>('.ap-inspector')!;
const values = () => dialog().querySelectorAll<HTMLInputElement>('input[type=number]');
const input = (field: HTMLInputElement, value: string) => {
  field.value = value;
  field.dispatchEvent(new InputEvent('input', { bubbles: true }));
};
const reset = () => [...dialog().querySelectorAll('button')].find(button => button.getAttribute('aria-label') === 'Reset parameters')!.click();

test('Inspector preserves host change boundaries and stale candidate cancellation', async () => {
  const { node, graph, canvas, requests, signals, previousExecuted } = mountStretch(3, true);
  await vi.advanceTimersByTimeAsync(600);
  expect(requests).toEqual([{ image_path: source, owner: expect.any(String), parameters: defaults }]);
  input(values()[1], '1.1');
  expect(graph.change).not.toHaveBeenCalled();
  input(values()[0], '-2.3');
  input(values()[1], '0.32');
  expect(node.widgets.map(widget => widget.value)).toEqual([-2.3, 0.32, true]);
  await vi.advanceTimersByTimeAsync(600);
  expect(requests).toHaveLength(2);
  expect(signals[0].aborted).toBe(true);
  reset();
  expect(node.widgets.map(widget => widget.value)).toEqual(Object.values(defaults));
  for (const change of [graph.beforeChange, graph.afterChange, graph.change, canvas.emitBeforeChange, canvas.emitAfterChange]) {
    expect(change).toHaveBeenCalledTimes(3);
  }
  dispose?.();
  dispose = undefined;
  expect(node.onExecuted).toBe(previousExecuted);
  expect(signals.every(signal => signal.aborted)).toBe(true);
  expect(document.querySelector('.ap-inspector')).toBeNull();
});

test.each(['read_only', 'selectOnly'] as const)('Inspector cannot update the %s host canvas', async mode => {
  const { node, canvas, graph } = mountStretch(3);
  node.widgets[0].value = -2.2;
  canvas[mode] = true;
  await nextTick();
  input(values()[0], '-1.5');
  reset();
  expect(node.widgets[0].value).toBe(-2.2);
  expect(graph.change).not.toHaveBeenCalled();
});

test('mono candidates disable linking in the Inspector and native Widget', async () => {
  const { node } = mountStretch(1);
  await vi.advanceTimersByTimeAsync(600);
  const linked = dialog().querySelector<HTMLInputElement>('input[role=switch]');
  expect(linked?.disabled).toBe(true);
  expect(linked?.checked).toBe(false);
  expect(node.widgets[2].disabled).toBe(true);
});

test('a late formal receipt reverts to the current candidate when the server reports it stale', async () => {
  const { node, requests } = mountStretch(3, false, true);
  await vi.advanceTimersByTimeAsync(600);
  const oldAsset = '00000000-0000-4000-8000-000000000099';
  node.onExecuted({ astrophoto_asset: [oldAsset], astrophoto_source: ['C:/older.fit'], astrophoto_parameters: [defaults] });
  await vi.advanceTimersByTimeAsync(1000);
  expect(requests).toEqual([
    { image_path: source, owner: expect.any(String), parameters: defaults },
    { image_path: source, owner: expect.any(String), parameters: defaults, formal_id: oldAsset },
    { image_path: source, owner: expect.any(String), parameters: defaults },
  ]);
  expect(document.querySelector('.ap-siril-widget')?.textContent).toContain('Candidate preview');
});
