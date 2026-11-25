import { expect, test, vi } from 'vitest';
import { getJson } from '../../src/api/client';
import { parseStatus } from '../../src/api/status';
import { nodeCatalog } from '../../src/api/nodes';
import { status, definitions } from './fixtures';
import { app } from '../host';
test.each([401, 403, 404, 500])('preserves HTTP %s', async code => {
  app.api.fetchApi.mockResolvedValue({ ok: false, status: code });
  await expect(getJson('/astrophoto/v1/status')).rejects.toMatchObject({ code: 'http', status: code });
});
test('bad JSON and disconnection differ', async () => {
  app.api.fetchApi.mockResolvedValue({ ok: true, json: () => { throw new Error(); } });
  await expect(getJson('/status')).rejects.toMatchObject({ code: 'json' });
  app.api.fetchApi.mockRejectedValue(new TypeError());
  await expect(getJson('/status')).rejects.toMatchObject({ code: 'network' });
});
test('timeout and caller abort cancel the host request', async () => {
  vi.useFakeTimers();
  app.api.fetchApi.mockImplementation((_path, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))));
  const timed = expect(getJson('/status')).rejects.toMatchObject({ code: 'timeout' });
  vi.advanceTimersByTime(10000); await timed;
  const controller = new AbortController();
  const aborted = expect(getJson('/status', controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  controller.abort(); await aborted;
  expect(vi.getTimerCount()).toBe(0); vi.useRealTimers();
});
test('status and node response guards reject invalid contracts', () => {
  expect(parseStatus(status)).toEqual(status);
  for (const value of [null, [], { ...status, api_version: 'v2' }, { ...status, runtime: {} }, { ...status, capabilities: { assets: { available: 'yes' } } }]) expect(() => parseStatus(value)).toThrow();
  expect(nodeCatalog(definitions, 'custom_nodes.ComfyUI_AstroPhoto')).toEqual([]);
  expect(nodeCatalog({}, 'custom_nodes.ComfyUI_AstroPhoto')).toEqual([]);
  expect(() => nodeCatalog([], 'custom_nodes.ComfyUI_AstroPhoto')).toThrow();
});

test('CASE-02: a renamed installation keeps valid ports and skips invalid and foreign definitions', () => {
  const owned = 'custom_nodes.Renamed-AstroPhoto';
  const result = nodeCatalog({
    ...definitions,
    AstroPhotoImagePath: {
      name: 'AstroPhotoImagePath', python_module: owned, display_name: '',
      input: { required: { path: ['STRING'], invalid: false } },
      output: [false, 'IMAGE_PATH'], output_name: ['ignored', 'image_path'],
    },
    Incomplete: { name: null, python_module: owned },
    Example: { name: 'Example', python_module: owned, category: 'examples/science' },
    OtherPackage: { name: 'OtherPackage', python_module: 'custom_nodes.other' },
  }, owned);
  expect(result).toEqual([{
    id: 'AstroPhotoImagePath', title: 'AstroPhotoImagePath', category: '', description: '', aliases: [],
    inputs: [['path', 'STRING']], outputs: [['image_path', 'IMAGE_PATH']],
  }]);
});
