import { act, fireEvent, screen, within } from '@testing-library/react';
import { defaults } from '../api/siril';
import type { ComfyApp } from '../host/comfy';
import { registerScientific } from '../host/scientific';
import { app } from './hostMock';

const inputPath = 'C:\\observations with spaces\\source.fit';
const previewRoute = '/astrophoto/v1/previews';
const jobId = '00000000-0000-4000-8000-000000000001';
const jobRoute = previewRoute + '/jobs/' + jobId;
type Extension = Parameters<ComfyApp['registerExtension']>[0];
type HostNode = Parameters<NonNullable<Extension['nodeCreated']>>[0];

const originalResizeObserver = globalThis.ResizeObserver;
let removeNode: (() => void) | undefined;

beforeEach(() => {
  jest.useFakeTimers();
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  act(() => removeNode?.());
  removeNode = undefined;
  globalThis.ResizeObserver = originalResizeObserver;
  jest.useRealTimers();
});

function mountAutoStretch(channels = 3) {
  const requests: unknown[] = [];
  app.api.fetchApi.mockImplementation(async (url: string, options: RequestInit) => {
    if (url === previewRoute + '/autostretch' && options.method === 'POST' && typeof options.body === 'string') {
      requests.push(JSON.parse(options.body));
      return { ok: true, json: async () => ({ job_id: jobId }) };
    }
    if (url === jobRoute && options.method === 'GET') {
      return { ok: true, json: async () => ({ state: 'ready', channels }) };
    }
    throw new Error('Unexpected preview request');
  });

  const container = document.createElement('div');
  const widget = { margin: 0, serialize: true, onRemove() {} };
  const graph = { beforeChange: jest.fn(), afterChange: jest.fn(), change: jest.fn() };
  const canvas = { read_only: false, selectOnly: false, emitBeforeChange: jest.fn(), emitAfterChange: jest.fn() };
  const node = {
    comfyClass: 'AstroPhotoSirilAutoStretch',
    size: [300, 350],
    title: 'Siril · AutoStretch',
    graph,
    widgets: Object.entries(defaults).map(([name, value]) => ({ name, value, disabled: false })),
    onWidgetChanged: jest.fn(),
    setSize: jest.fn(),
    setDirtyCanvas: jest.fn(),
    isInputConnected: () => true,
    getInputNode: () => ({ comfyClass: 'AstroPhotoImagePath', widgets: [{ name: 'image_path', value: inputPath }] }),
    addDOMWidget: (_name: string, _type: string, element: HTMLElement) => {
      container.append(element);
      return widget;
    }
  };
  document.body.append(container);
  removeNode = () => { widget.onRemove(); container.remove(); };
  const registerExtension = jest.fn<void, [Extension]>();
  const host = { canvas, registerExtension } as unknown as ComfyApp;
  registerScientific(host);
  const [extension] = registerExtension.mock.calls[0];
  act(() => extension.nodeCreated?.(node as unknown as HostNode, host));
  const view = within(container);
  fireEvent.click(view.getByRole('button', { name: 'Open image' }));
  return { node, canvas, graph, requests, inspector: within(screen.getByRole('dialog', { name: 'Image comparison' })) };
}

async function updatePreview() {
  await act(async () => { jest.advanceTimersByTime(200); });
  await act(async () => { jest.advanceTimersByTime(400); });
}

test('Inspector edits and resets the host widget values and requests the latest path preview', async () => {
  const { node, canvas, graph, inspector, requests } = mountAutoStretch();
  const [shadows, target, linked] = node.widgets;
  const shadowInput = inspector.getByRole('spinbutton', { name: /Shadows clip/ });
  const targetInput = inspector.getByRole('spinbutton', { name: /Target background/ });
  await updatePreview();
  expect(requests).toEqual([{ image_path: inputPath, owner: expect.any(String), parameters: defaults }]);

  fireEvent.change(targetInput, { target: { value: '1.1' } });
  expect(target.value).toBe(defaults.targetbg);
  expect(graph.change).not.toHaveBeenCalled();

  fireEvent.change(shadowInput, { target: { value: '-2.3' } });
  fireEvent.change(targetInput, { target: { value: '0.32' } });
  fireEvent.click(inspector.getByRole('switch', { name: /Link RGB channels/ }));
  expect(node.onWidgetChanged.mock.calls).toEqual([
    ['shadowsclip', -2.3, defaults.shadowsclip, shadows],
    ['targetbg', 0.32, defaults.targetbg, target],
    ['linked', false, defaults.linked, linked]
  ]);
  expect(node.widgets.map(entry => entry.value)).toEqual([-2.3, 0.32, false]);
  await updatePreview();
  expect(requests).toHaveLength(2);
  expect(requests[1]).toEqual({
    image_path: inputPath, owner: expect.any(String),
    parameters: { shadowsclip: -2.3, targetbg: 0.32, linked: false }
  });

  fireEvent.blur(shadowInput);
  fireEvent.blur(targetInput);
  fireEvent.click(inspector.getByRole('button', { name: 'Reset parameters' }));
  expect(node.widgets.map(entry => entry.value)).toEqual(Object.values(defaults));
  expect(node.onWidgetChanged).toHaveBeenCalledTimes(6);
  for (const change of [graph.beforeChange, graph.afterChange, graph.change, canvas.emitBeforeChange, canvas.emitAfterChange]) {
    expect(change).toHaveBeenCalledTimes(4);
  }
  await updatePreview();
  expect(requests).toHaveLength(3);
  expect(requests[2]).toEqual(requests[0]);

  target.value = 0.41;
  await updatePreview();
  expect(targetInput).toHaveValue(0.41);
  expect(requests[3]).toEqual({ image_path: inputPath, owner: expect.any(String), parameters: { ...defaults, targetbg: 0.41 } });
});

test.each(['read_only', 'selectOnly'] as const)('Inspector cannot change or reset widgets when the host is %s', async mode => {
  const { node, canvas, graph, inspector, requests } = mountAutoStretch();
  node.widgets[0].value = -2.2;
  canvas[mode] = true;
  await updatePreview();
  fireEvent.change(inspector.getByRole('spinbutton', { name: /Shadows clip/ }), { target: { value: '-1.5' } });
  fireEvent.click(inspector.getByRole('button', { name: 'Reset parameters' }));
  await updatePreview();
  expect(node.widgets[0].value).toBe(-2.2);
  expect(node.onWidgetChanged).not.toHaveBeenCalled();
  expect(graph.change).not.toHaveBeenCalled();
  expect(requests).toHaveLength(1);
});

test('monochrome preview disables RGB linking in both the widget and Inspector', async () => {
  const { node, inspector } = mountAutoStretch(1);
  await updatePreview();
  const link = inspector.getByRole('switch', { name: /Link RGB channels/ });
  expect(link).toBeDisabled();
  expect(link).not.toBeChecked();
  expect(node.widgets[2].disabled).toBe(true);
  fireEvent.click(link);
  expect(node.onWidgetChanged).not.toHaveBeenCalled();
});
