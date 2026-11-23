import { app } from './comfy';

// Coalesce simultaneous render paths reporting the same event.
const delivered = new Set<string>();

// ComfyUI Frontend v1.58+ and its legacy extension toast API.
export function notifyHost(kind: 'success' | 'error' | 'warning' | 'info', message: string): boolean {
  try {
    const toast = app.extensionManager?.toast;
    if (!toast) return false;
    const key = kind + ':' + message;
    if (delivered.has(key)) return true;
    const remember = () => { delivered.add(key); queueMicrotask(() => delivered.delete(key)); };
    const send = toast[kind];
    if (typeof send === 'function') {
      send.call(toast, message, { duration: kind === 'error' ? 8000 : 4000, closable: true });
      remember();
      return true;
    }
    if (typeof toast.add === 'function') {
      toast.add({ severity: kind === 'warning' ? 'warn' : kind, summary: message, life: kind === 'error' ? 8000 : 4000, closable: true });
      remember();
      return true;
    }
  } catch { /* Keep the contextual fallback when the host notification is unavailable. */ }
  return false;
}
