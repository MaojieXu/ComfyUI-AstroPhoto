import { app } from './comfy';
import type { ComfyApp } from './comfy';
import type { LGraphNode, LiteGraphGlobal } from '@comfyorg/comfyui-frontend-types';

type Factory = Pick<LiteGraphGlobal, 'createNode' | 'registered_node_types'>;
function runtime(): Factory | undefined {
  return (window as unknown as { LiteGraph?: Factory }).LiteGraph;
}
// Version adapter, NOT a stable public create-node API. Verified on Frontend 1.59.1.
// Always use the active canvas.graph, including when it is a Subgraph.
export function createCanvasNode(id: string, point?: [number, number], host: ComfyApp = app, factory = runtime()): LGraphNode {
  const canvas = host.canvas;
  const graph = canvas?.graph;
  if (!host.isGraphReady || !graph || canvas.read_only || canvas.selectOnly || !canvas.allow_interaction)
    throw new Error('CANVAS_UNAVAILABLE');
  if (!factory?.registered_node_types[id]) throw new Error('NODE_NOT_REGISTERED');
  const rect = canvas.canvas.getBoundingClientRect();
  const position = host.clientPosToCanvasPos(point ?? [rect.left + rect.width / 2, rect.top + rect.height / 2]);
  if (!position.every(Number.isFinite)) throw new Error('INVALID_POSITION');
  graph.beforeChange();
  canvas.emitBeforeChange();
  let node: LGraphNode | null | undefined;
  try {
    node = factory.createNode(id);
    if (!node) throw new Error('NODE_NOT_REGISTERED');
    node.pos = position;
    if (!graph.add(node)) throw new Error('GRAPH_ADD_FAILED');
    graph.change();
    return node;
  } catch (error) {
    if (node?.graph === graph) graph.remove(node);
    else node?.onRemoved?.();
    throw error;
  } finally {
    try { graph.afterChange(); } finally { canvas.emitAfterChange(); }
  }
}
