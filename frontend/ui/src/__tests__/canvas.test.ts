import type { ComfyApp } from '../host/comfy';
import type { LiteGraphGlobal } from '@comfyorg/comfyui-frontend-types';
import { createCanvasNode } from '../host/canvas';
import { readNodeDrag } from '../host/dragDrop';
function fixture() {
  const graph = { beforeChange: jest.fn(), afterChange: jest.fn(), change: jest.fn(), add: jest.fn(), remove: jest.fn() };
  const node = { pos: [0, 0], graph: null as unknown, onRemoved: jest.fn() };
  graph.add.mockImplementation(() => { node.graph = graph; return node; });
  const canvas = { graph, read_only: false, selectOnly: false, allow_interaction: true, canvas: document.createElement('canvas'), emitBeforeChange: jest.fn(), emitAfterChange: jest.fn() };
  const host = { isGraphReady: true, canvas, clientPosToCanvasPos: jest.fn(() => [123, 456]) };
  const factory = { registered_node_types: { 'vue-basic': {} }, createNode: jest.fn(() => node) };
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
test('drag payload only accepts registered owned node IDs', () => {
  const allowed = new Set(['vue-basic']);
  expect(readNodeDrag('{"v":1,"kind":"node","nodeId":"vue-basic"}', allowed)).toBe('vue-basic');
  for (const text of ['oops', '{}', '{"v":1,"kind":"asset","assetId":"x"}', '{"v":1,"kind":"node","nodeId":"Other"}']) expect(() => readNodeDrag(text, allowed)).toThrow();
});
