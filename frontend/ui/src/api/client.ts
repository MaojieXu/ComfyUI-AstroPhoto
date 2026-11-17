import { app } from '../host/comfy';
export class ApiError extends Error {
  constructor(public code: string, public status?: number) { super(code); }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  let timeout = false;
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => { timeout = true; controller.abort(); }, 10000);
  try {
    const response = await app.api.fetchApi(path, { signal: controller.signal });
    if (!response.ok) throw new ApiError('http', response.status);
    try { return await response.json(); }
    catch (error) { if (controller.signal.aborted) throw error; throw new ApiError('json'); }
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (timeout) throw new ApiError('timeout');
    if (error instanceof ApiError) throw error;
    throw new ApiError('network');
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
