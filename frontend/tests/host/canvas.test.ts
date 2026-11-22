import { expect, test, vi } from 'vitest';
import type { ComfyApp } from '../../src/host/comfy';
import type { LiteGraphGlobal } from '@comfyorg/comfyui-frontend-types';
import { createCanvasNode } from '../../src/host/canvas';
import { readNodeDrag } from '../../src/host/dragDrop';
function fixture() {
  const graph = { beforeChange: vi.fn(), afterChange: vi.fn(), change: vi.fn(), add: vi.fn(), remove: vi.fn() };
  const node = { pos: [0, 0], graph: null as unknown, onRemoved: vi.fn() };
  graph.add.mockImplementation(() => { node.graph = graph; return node; });
  const canvas = { graph, read_only: false, selectOnly: false, allow_interaction: true, canvas: document.createElement('canvas'), emitBeforeChange: vi.fn(), emitAfterChange: vi.fn() };
  const host = { isGraphReady: true, canvas, clientPosToCanvasPos: vi.fn(() => [123, 456]) };
  const factory = { registered_node_types: { 'vue-basic': {} }, createNode: vi.fn(() => node) };
  const create = () => createCanvasNode('vue-basic', [10, 20], host as unknown as ComfyApp, factory as unknown as LiteGraphGlobal);
  return { graph, node, canvas, host, factory, create };
}
test('uses current graph, coordinates and native change boundary', () => {
  const f = fixture(); expect(f.create()).toBe(f.node);
  expect(f.host.clientPosToCanvasPos).toHaveBeenCalledWith([10, 20]); expect(f.node.pos).toEqual([123, 456]);
  expect(f.graph.beforeChange).toHaveBeenCalledTimes(1); expect(f.graph.afterChange).toHaveBeenCalledTimes(1);
  expect(f.canvas.emitBeforeChange).toHaveBeenCalledTimes(1); expect(f.canvas.emitAfterChange).toHaveBeenCalledTimes(1);
});
test('read-only/select-only/unregistered actions fail before mutation', () => {
  const f = fixture(); f.canvas.selectOnly = true; expect(f.create).toThrow();
  f.canvas.selectOnly = false; f.canvas.read_only = true; expect(f.create).toThrow();
  f.canvas.read_only = false; f.factory.registered_node_types = {} as typeof f.factory.registered_node_types; expect(f.create).toThrow();
  expect(f.graph.add).not.toHaveBeenCalled();
});
test('failed insertion cleans up and ends transaction', () => {
  const f = fixture(); f.graph.add.mockReturnValue(null); expect(f.create).toThrow();
  expect(f.node.onRemoved).toHaveBeenCalled(); expect(f.graph.afterChange).toHaveBeenCalledTimes(1);
});
test('rejects an incomplete host or coordinates before opening a history boundary', () => {
  const f = fixture();
  f.host.clientPosToCanvasPos.mockReturnValueOnce([NaN, 3]);
  expect(f.create).toThrow('INVALID_POSITION');
  expect(() => createCanvasNode('vue-basic', undefined, f.host as unknown as ComfyApp,
    f.factory as unknown as LiteGraphGlobal)).toThrow('CANVAS_UNSUPPORTED');
  expect(f.graph.beforeChange).not.toHaveBeenCalled();
  expect(f.graph.add).not.toHaveBeenCalled();
});
test('drag payload only accepts registered owned node IDs', () => {
  const allowed = new Set(['vue-basic']);
  expect(readNodeDrag('{"v":1,"kind":"node","nodeId":"vue-basic"}', allowed)).toBe('vue-basic');
  for (const text of ['oops', '{}', '{"v":1,"kind":"asset","assetId":"x"}', '{"v":1,"kind":"node","nodeId":"Other"}']) expect(() => readNodeDrag(text, allowed)).toThrow();
});
