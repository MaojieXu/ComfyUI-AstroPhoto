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
  expect(nodeCatalog(definitions).map(n => n.id)).toEqual(['vue-basic']);
  expect(nodeCatalog(definitions)[0].outputs).toEqual([['image', 'IMAGE']]);
  expect(nodeCatalog({})).toEqual([]);
  expect(() => nodeCatalog([])).toThrow();
  expect(() => nodeCatalog({ 'vue-basic': { ...definitions['vue-basic'], output: null } })).toThrow();
});
