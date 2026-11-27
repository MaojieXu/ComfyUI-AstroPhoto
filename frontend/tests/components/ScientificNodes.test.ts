import { nextTick } from 'vue';
import { afterEach, expect, test, vi } from 'vitest';
import { sirilBundle } from '../../../extension/siril/frontend';
import { inspectSirilInput } from '../../../extension/siril/frontend/SirilNodes';
import type { SirilCommand } from '../../../extension/siril/frontend/api';
import type { ComfyApp } from '../../src/host/comfy';
import { app } from '../host';

type Extension = Parameters<ComfyApp['registerExtension']>[0];
type HostNode = Parameters<NonNullable<Extension['nodeCreated']>>[0];
const source = 'C:/observations with spaces/source.fit';
const jobId = '00000000-0000-4000-8000-000000000001';
const stretch: SirilCommand = {
  id: 'autostretch', node_id: 'AstroPhotoSirilAutoStretch', title: 'AutoStretch',
  usage: 'autostretch', description: 'Reveal faint signal.', description_zh: '呈现暗弱信号。', preview: true, requires: [], scriptable: true, build_feature: null,
  parameters: [
    { name: 'shadowsclip', label: 'Shadows clip (σ)', default: -2.8, help: '', min: null, max: null, rgb_only: false },
    { name: 'targetbg', label: 'Target background', default: 0.25, help: '', min: 0, max: 1, rgb_only: false },
    { name: 'linked', label: 'Link RGB channels', default: true, help: '', min: null, max: null, rgb_only: true },
  ],
};
const defaults = Object.fromEntries(stretch.parameters.map(parameter => [parameter.name, parameter.default]));
const gauss: SirilCommand = {
  ...stretch, id: 'gauss', node_id: 'AstroPhotoSirilGaussianBlur', title: 'Gaussian Blur', usage: 'gauss sigma',
  parameters: [{ name: 'sigma', label: 'Sigma', default: 1, help: '', min: 0, max: null, rgb_only: false }],
};
const crop: SirilCommand = {
  ...stretch, id: 'crop', node_id: 'AstroPhotoSiril_crop', title: 'Crop',
  usage: 'crop x y width height', preview: false, parameters: [],
};
let dispose: (() => void) | undefined;
afterEach(() => { dispose?.(); dispose = undefined; });

async function mountStretch(channels: number, deferCandidate = false, staleFormal = false, command = stretch, upstream?: object) {
  vi.useFakeTimers();
  const requests: unknown[] = [];
  const signals: AbortSignal[] = [];
  let formalRequested = false;
  app.api.fetchApi.mockImplementation(async (path: string, request: RequestInit) => {
    if (path.endsWith('/commands')) return Response.json({ version: '1.4.5', commands: [stretch, gauss, crop] });
    if (path.endsWith('/siril/' + command.id) && request.method === 'POST') {
      const body = JSON.parse(String(request.body));
      requests.push(body);
      formalRequested = Boolean(body.formal_id);
      return Response.json({ job_id: jobId });
    }
    if (path.endsWith('/' + jobId) && request.method === 'GET') {
      if (!deferCandidate) return Response.json(staleFormal && formalRequested
        ? { state: 'failed', error: 'PREVIEW_STALE' }
        : { state: 'ready', channels, formal: formalRequested });
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
    comfyClass: command.node_id, title: command.title, size: [300, 350], graph,
    widgets: command.parameters.map(field => ({ name: field.name, value: field.default, disabled: false })),
    onExecuted: previousExecuted, onWidgetChanged: vi.fn(), setSize: vi.fn(), computeSize: () => [300, 395], setDirtyCanvas: vi.fn(),
    isInputConnected: () => true,
    getInputLink: () => ({ origin_slot: 0 }),
    getInputNode: () => upstream ?? { comfyClass: 'AstroPhotoFileSource', widgets: [{ name: 'source', value: source }] },
    addDOMWidget: (name: string, _type: string, element: HTMLElement) => {
      container.append(element);
      return Object.assign(widget, { name, node, element });
    },
  };
  const registerExtension = vi.fn<(extension: Extension) => void>();
  const host = { ...app, canvas, registerExtension } as unknown as ComfyApp;
  sirilBundle.registerNodes(host, [sirilBundle]);
  await registerExtension.mock.calls[0][0].nodeCreated?.(node as unknown as HostNode, host);
  const disposePrevious = dispose;
  dispose = () => { widget.onRemove(); container.remove(); disposePrevious?.(); };
  expect(container.querySelector('.ap-siril-description')?.textContent).toBe(command.description);
  const disclosure = container.querySelector<HTMLDetailsElement>('.ap-siril-command-usage')!;
  expect(disclosure.open).toBe(false);
  disclosure.querySelector('summary')!.click();
  expect(disclosure.open).toBe(true);
  expect(disclosure.querySelector('pre')?.textContent).toBe(command.usage);
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
  const { node, graph, canvas, requests, signals, previousExecuted } = await mountStretch(3, true);
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
  const { node, canvas, graph } = await mountStretch(3);
  node.widgets[0].value = -2.2;
  canvas[mode] = true;
  await nextTick();
  input(values()[0], '-1.5');
  reset();
  expect(node.widgets[0].value).toBe(-2.2);
  expect(graph.change).not.toHaveBeenCalled();
});

test('mono candidates disable linking in the Inspector and native Widget', async () => {
  const { node } = await mountStretch(1);
  await vi.advanceTimersByTimeAsync(600);
  const linked = dialog().querySelector<HTMLInputElement>('input[role=switch]');
  expect(linked?.disabled).toBe(true);
  expect(linked?.checked).toBe(false);
  expect(node.widgets[2].disabled).toBe(true);
});

test('a late formal receipt reverts to the current candidate when the server reports it stale', async () => {
  const { node, requests } = await mountStretch(3, false, true);
  await vi.advanceTimersByTimeAsync(600);
  const oldAsset = '00000000-0000-4000-8000-000000000099';
  node.onExecuted({ astrophoto_asset: [oldAsset], astrophoto_source: ['C:/older.fit'], astrophoto_parameters: [defaults] });
  await vi.advanceTimersByTimeAsync(1000);
  expect(requests).toHaveLength(1);
  node.onExecuted({ astrophoto_output: [oldAsset], astrophoto_source: ['C:/older.fit'], astrophoto_parameters: [defaults] });
  await vi.advanceTimersByTimeAsync(1000);
  expect(requests).toEqual([
    { image_path: source, owner: expect.any(String), parameters: defaults },
    { image_path: source, owner: expect.any(String), parameters: defaults, formal_id: oldAsset },
    { image_path: source, owner: expect.any(String), parameters: defaults },
  ]);
  expect(document.querySelector('.ap-siril-widget')?.textContent).toContain('Candidate preview');
});

test('Gaussian Blur uses the shared Inspector and sends its own command ID', async () => {
  const { node, requests } = await mountStretch(3, false, false, gauss);
  await vi.advanceTimersByTimeAsync(600);
  expect(values()).toHaveLength(1);
  expect(values()[0].value).toBe('1');
  input(values()[0], '2.3');
  expect(node.widgets[0].value).toBe(2.3);
  await vi.advanceTimersByTimeAsync(600);
  expect(requests.map(row => (row as { parameters: unknown }).parameters)).toEqual([{ sigma: 1 }, { sigma: 2.3 }]);
});

test('a verified upstream output feeds the downstream preview through its image path', async () => {
  const { node: upstream } = await mountStretch(3);
  await vi.advanceTimersByTimeAsync(600);
  const outputPath = 'C:/workspace/outputs/uncollected/stretched.fit';
  upstream.onExecuted({
    astrophoto_output: [jobId], astrophoto_source: [source],
    astrophoto_image_path: [outputPath], astrophoto_parameters: [defaults],
  });
  await vi.advanceTimersByTimeAsync(600);
  const { node, requests } = await mountStretch(3, false, false, stretch, upstream);
  await vi.advanceTimersByTimeAsync(600);
  expect(requests).toContainEqual({ image_path: outputPath, owner: expect.any(String), parameters: defaults });
  node.onExecuted({
    astrophoto_output: [jobId], astrophoto_source: [outputPath],
    astrophoto_image_path: ['C:/workspace/outputs/downstream/stretched.fit'], astrophoto_parameters: [defaults],
  });
  await vi.advanceTimersByTimeAsync(600);
  expect(requests).toContainEqual({
    image_path: outputPath, owner: expect.any(String), parameters: defaults, formal_id: jobId,
  });
});

test('a CLI result becomes unavailable when its upstream file selection changes', async () => {
  await mountStretch(3);
  const sourceNode = { id: 1, comfyClass: 'AstroPhotoFileSource', inputs: [],
    widgets: [{ name: 'source', value: 'C:/first.fit' }] };
  const elements: HTMLElement[] = [];
  const cli = {
    id: 2, comfyClass: 'AstroPhotoSiril_crop', title: 'Crop', size: [300, 200], graph: {},
    inputs: [{ name: 'image_path' }], widgets: [{ name: 'arguments', value: '[0,0,32,32]' }],
    getInputNode: () => sourceNode, getInputLink: () => ({ origin_slot: 0 }),
    setSize: vi.fn(), computeSize: () => [300, 200], setDirtyCanvas: vi.fn(),
    addDOMWidget: (name: string, _type: string, element: HTMLElement) => {
      document.body.append(element);
      elements.push(element);
      return { name, node: cli, element, margin: 0, onRemove: vi.fn() };
    },
    onExecuted: undefined as undefined | ((output: object) => void),
  };
  const registerExtension = vi.fn<(extension: Extension) => void>();
  const host = { ...app, registerExtension } as unknown as ComfyApp;
  sirilBundle.registerNodes(host, [sirilBundle]);
  await registerExtension.mock.calls[0][0].nodeCreated?.(cli as unknown as HostNode, host);
  cli.onExecuted?.({ astrophoto_siril_path: ['C:/output.fit'],
    astrophoto_siril_sources: [{ 'C:/first.fit': [1, 2, 3, 4, 5] }] });
  const stretchNode = { comfyClass: 'AstroPhotoSirilAutoStretch', inputs: [{ name: 'image_path' }], widgets: [],
    getInputNode: () => cli, getInputLink: () => ({ origin_slot: 0 }) };
  const initial = inspectSirilInput(stretchNode as unknown as HostNode);
  expect(initial.source).toBe('C:/output.fit');
  expect(initial.provenance[0].sourceRefs).toEqual(['C:/first.fit']);
  sourceNode.widgets[0].value = 'C:/second.fit';
  expect(inspectSirilInput(stretchNode as unknown as HostNode).source).toBe('');
  // A late result can arrive after selection changed. Its staged sources remain
  // available to the backend so it can reject the mismatched current reference.
  cli.onExecuted?.({ astrophoto_siril_path: ['C:/late-output.fit'],
    astrophoto_siril_sources: [{ 'C:/first.fit': [1, 2, 3, 4, 5] }] });
  const late = inspectSirilInput(stretchNode as unknown as HostNode);
  expect(late.provenance[0]).toEqual({ sources: { 'C:/first.fit': [1, 2, 3, 4, 5] }, sourceRefs: ['C:/second.fit'] });
  sourceNode.widgets[0].value = 'C:/first.fit';
  const staged = { id: 3, comfyClass: 'AstroPhotoSiril_load', inputs: [{ name: 'file_path' }],
    widgets: [{ name: 'stage_only', value: true }], getInputNode: () => sourceNode,
    getInputLink: () => ({ origin_slot: 0 }) };
  cli.getInputNode = () => staged as unknown as typeof sourceNode;
  cli.onExecuted?.({ astrophoto_siril_path: ['C:/output.fit'],
    astrophoto_siril_sources: [{ 'C:/first.fit': [1, 2, 3, 4, 5] }] });
  expect(inspectSirilInput(stretchNode as unknown as HostNode).provenance[0].sourceRefs).toEqual(['C:/first.fit']);
  sourceNode.widgets[0].value = 'C:/second.fit';
  expect(inspectSirilInput(stretchNode as unknown as HostNode).source).toBe('');
  for (const element of elements) element.remove();
});
