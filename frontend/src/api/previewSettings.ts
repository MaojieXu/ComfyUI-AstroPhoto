import { ApiError, getJson, isRecord, requestJson } from './client';

const route = '/astrophoto/v1/previews/settings';
type CanvasPreview = { width: number; max_height: number };
type PreviewSettings = {
  longest_edge: number;
  options: number[];
  canvas: CanvasPreview;
  canvas_min: number;
  canvas_max: number;
  revision: number;
};

export const previewResolutionEvents = new EventTarget();
let current: PreviewSettings | undefined;

export function canvasPreviewWidth() {
  return current?.canvas.width ?? 480;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function applySettings(value: unknown): PreviewSettings {
  if (!isRecord(value) || typeof value.revision !== 'number' || !Number.isSafeInteger(value.revision) ||
      value.revision < 0 || typeof value.longest_edge !== 'number' || !Number.isSafeInteger(value.longest_edge) ||
      value.longest_edge < 0 || !Array.isArray(value.options) ||
      !value.options.every(option => option === 0 || isPositiveInteger(option)) || !value.options.includes(value.longest_edge) ||
      !isRecord(value.canvas) || !isPositiveInteger(value.canvas.width) || !isPositiveInteger(value.canvas.max_height) ||
      !isPositiveInteger(value.canvas_min) || !isPositiveInteger(value.canvas_max) ||
      value.canvas_min > value.canvas_max || value.canvas.width < value.canvas_min || value.canvas.width > value.canvas_max ||
      value.canvas.max_height < value.canvas_min || value.canvas.max_height > value.canvas_max) throw new ApiError('schema');
  const settings: PreviewSettings = {
    longest_edge: value.longest_edge, options: value.options, revision: value.revision,
    canvas: { width: value.canvas.width, max_height: value.canvas.max_height },
    canvas_min: value.canvas_min, canvas_max: value.canvas_max,
  };
  if (current && current.revision > settings.revision) return current;
  const resolutionChanged = current && current.longest_edge !== settings.longest_edge;
  current = settings;
  document.documentElement.style.setProperty('--astrophoto-canvas-preview-width', settings.canvas.width + 'px');
  document.documentElement.style.setProperty('--astrophoto-canvas-preview-max-height', settings.canvas.max_height + 'px');
  if (resolutionChanged) previewResolutionEvents.dispatchEvent(new Event('change'));
  return settings;
}

export async function getPreviewSettings(signal?: AbortSignal) {
  return applySettings(await getJson(route, signal));
}

export async function savePreviewSettings(longestEdge: number, canvas: CanvasPreview, revision: number) {
  return applySettings(await requestJson(route, 'PUT', {
    longest_edge: longestEdge, canvas, expected_revision: revision,
  }));
}
