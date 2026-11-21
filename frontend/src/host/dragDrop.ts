import { app } from './comfy';
import { createCanvasNode } from './canvas';
export const DRAG_MIME = 'application/x-astrophoto-resource+json';
export function writeNodeDrag(data: DataTransfer, id: string) {
  data.effectAllowed = 'copy';
  data.setData(DRAG_MIME, JSON.stringify({ v: 1, kind: 'node', nodeId: id }));
}
export function readNodeDrag(text: string, allowed: ReadonlySet<string>): string {
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== 'object' || !('v' in value) || value.v !== 1 ||
    !('kind' in value) || value.kind !== 'node' || !('nodeId' in value) || typeof value.nodeId !== 'string' || !allowed.has(value.nodeId))
    throw new Error('INVALID_DRAG');
  return value.nodeId;
}
export function attachCanvasDrop(allowed: ReadonlySet<string>, report: (error: unknown | null) => void) {
  // The host can replace the canvas while the node catalog stays mounted.
  const matches = (event: DragEvent) =>
    event.target === app.canvas?.canvas && event.dataTransfer?.types.includes(DRAG_MIME);
  const over = (event: DragEvent) => {
    if (!matches(event)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };
  const drop = (event: DragEvent) => {
    if (!matches(event)) return;
    event.preventDefault(); event.stopImmediatePropagation();
    try {
      createCanvasNode(readNodeDrag(event.dataTransfer!.getData(DRAG_MIME), allowed), [event.clientX, event.clientY]);
      report(null);
    } catch (error) { report(error); }
  };
  document.addEventListener('dragover', over, true);
  document.addEventListener('drop', drop, true);
  return () => {
    document.removeEventListener('dragover', over, true);
    document.removeEventListener('drop', drop, true);
  };
}
