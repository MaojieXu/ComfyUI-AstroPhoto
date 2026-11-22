import { app } from './comfy';
import { createCanvasNode } from './canvas';
export const DRAG_MIME = 'application/x-astrophoto-resource+json';
export function writeNodeDrag(data: DataTransfer, id: string, token?: string) {
  data.effectAllowed = 'copy';
  data.setData(DRAG_MIME, JSON.stringify({ v: 1, kind: 'node', nodeId: id, token }));
}
export function readNodeDrag(text: string, allows: ReadonlySet<string> | ((id: string) => boolean), token?: string): string {
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== 'object' || !('v' in value) || value.v !== 1 ||
    !('kind' in value) || value.kind !== 'node' || !('nodeId' in value) || typeof value.nodeId !== 'string' ||
    (token !== undefined && (!('token' in value) || value.token !== token)) ||
    !(typeof allows === 'function' ? allows(value.nodeId) : allows.has(value.nodeId)))
    throw new Error('INVALID_DRAG');
  return value.nodeId;
}

let graphGeneration = 0;
export function invalidateCanvasDrop() { graphGeneration += 1; }

export function attachCanvasDrop(allows: (id: string) => boolean, report: (error: unknown | null) => void,
    create: (id: string, point: [number, number]) => void = createCanvasNode) {
  const snapshot = () => {
    const canvas = app.canvas;
    return { canvas, graph: canvas?.graph, surface: canvas?.canvas, generation: graphGeneration };
  };
  const settings = app.ui?.settings;
  let session: ReturnType<typeof snapshot> & { token: string; id: string } | undefined;

  function cancel() {
    session?.surface?.removeEventListener('litegraph:set-graph', cancel);
    session = undefined;
  }
  function start(data: DataTransfer, id: string) {
    cancel();
    const target = snapshot();
    if (!allows(id) || !target.graph || !target.surface || !app.isGraphReady) return false;
    const token = crypto.getRandomValues(new Uint32Array(4)).join('-');
    writeNodeDrag(data, id, token);
    session = { ...target, id, token };
    target.surface.addEventListener('litegraph:set-graph', cancel);
    return true;
  }
  function matches(event: DragEvent) {
    if (!session || !event.dataTransfer?.types.includes(DRAG_MIME)) return false;
    const { canvas, graph, surface, generation } = snapshot();
    if (!surface || canvas !== session.canvas || graph !== session.graph ||
        surface !== session.surface || generation !== session.generation || !allows(session.id)) {
      cancel();
      return false;
    }
    const target = event.target;
    // Frontend 1.59.6 GraphCanvas registers both its canvas and sibling TransformPane.
    if (target !== surface) {
      if (!(target instanceof Element) || target.closest('button, input, select, textarea, [contenteditable], [role="button"]'))
        return false;
      const pane = target.closest('[data-testid="transform-pane"]');
      if (!pane || pane.parentElement !== surface.parentElement) return false;
    }
    const rect = surface.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
  }
  const over = (event: DragEvent) => {
    if (!matches(event)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };
  const drop = (event: DragEvent) => {
    if (!matches(event) || !session || !event.dataTransfer) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const token = session.token;
    const expected = session.id;
    cancel();
    try {
      const id = readNodeDrag(event.dataTransfer.getData(DRAG_MIME), allows, token);
      if (id !== expected) throw new Error('INVALID_DRAG');
      create(id, [event.clientX, event.clientY]);
      report(null);
    } catch (error) { report(error); }
  };
  document.addEventListener('dragover', over, true);
  document.addEventListener('drop', drop, true);
  document.addEventListener('dragend', cancel, true);
  settings?.addEventListener('Comfy.VueNodes.Enabled.change', cancel);
  const dispose = () => {
    cancel();
    document.removeEventListener('dragover', over, true);
    document.removeEventListener('drop', drop, true);
    document.removeEventListener('dragend', cancel, true);
    settings?.removeEventListener('Comfy.VueNodes.Enabled.change', cancel);
  };
  return { start, cancel, dispose };
}
