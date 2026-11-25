import { app } from './comfy';
import type { ComfyApp } from './comfy';
import type { LGraphNode, LiteGraphGlobal } from '@comfyorg/comfyui-frontend-types';

type Factory = Pick<LiteGraphGlobal, 'createNode' | 'registered_node_types'>;
function runtime(): Factory | undefined {
  return (window as unknown as { LiteGraph?: Factory }).LiteGraph;
}
// Validate the host graph and history capabilities.
// Always use the active canvas.graph, including when it is a Subgraph.
export function createCanvasNode(id: string, point?: [number, number], host: ComfyApp = app, factory = runtime(),
    configure?: (node: LGraphNode) => void): LGraphNode {
  const canvas = host.canvas;
  const graph = canvas?.graph;
  if (!host.isGraphReady || !graph || canvas.read_only || canvas.selectOnly || !canvas.allow_interaction)
    throw new Error('CANVAS_UNAVAILABLE');
  if (!factory?.registered_node_types || typeof factory.createNode !== 'function')
    throw new Error('CANVAS_UNSUPPORTED');
  if (!Object.hasOwn(factory.registered_node_types, id)) throw new Error('NODE_NOT_REGISTERED');
  const visible = canvas.ds?.visible_area;
  if (!point && !visible) throw new Error('CANVAS_UNSUPPORTED');
  if (point && typeof host.clientPosToCanvasPos !== 'function')
    throw new Error('CANVAS_UNSUPPORTED');
  const position = point
    ? host.clientPosToCanvasPos(point)
    : [visible[0] + visible[2] / 2, visible[1] + visible[3] / 2] as [number, number];
  // The default Node Library on 1.59.6 uses the converted pointer directly.
  if (!position.every(Number.isFinite)) throw new Error('INVALID_POSITION');
  if (typeof graph.beforeChange !== 'function' || typeof graph.afterChange !== 'function' ||
      typeof canvas.emitBeforeChange !== 'function' || typeof canvas.emitAfterChange !== 'function')
    throw new Error('CANVAS_UNSUPPORTED');
  let node: LGraphNode | null | undefined;
  let notify = false;
  let previousNodeId: number | undefined;
  try {
    graph.beforeChange();
    notify = true;
    canvas.emitBeforeChange();
    node = factory.createNode(id);
    if (!node) throw new Error('NODE_NOT_REGISTERED');
    configure?.(node);
    node.pos = position;
    previousNodeId = graph.state?.lastNodeId;
    if (!graph.add(node) || node.graph !== graph) throw new Error('GRAPH_ADD_FAILED');
    graph.change();
    return node;
  } catch (error) {
    if (node?.graph === graph) graph.remove(node);
    else node?.onRemoved?.();
    // Subgraph serialization includes this counter. Returning our allocation
    // keeps the native change tracker from recording a failed insertion.
    const allocatedNodeId = Number(node?.id);
    if (node && node.graph !== graph && previousNodeId !== undefined &&
        graph.state?.lastNodeId === allocatedNodeId && allocatedNodeId > previousNodeId) {
      graph.state.lastNodeId = previousNodeId;
    }
    throw error;
  } finally {
    if (notify) {
      try { graph.afterChange(); } finally { canvas.emitAfterChange(); }
    }
  }
}
