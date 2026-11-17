import type { DOMWidget } from '@comfyorg/comfyui-frontend-types';

// Workflow state embeds PNG pixels; execution serialization still returns only image.
export interface DrawingValue { image: string | null; canvasDataURL?: string }
export type DrawingWidget = DOMWidget<HTMLElement, DrawingValue>;
