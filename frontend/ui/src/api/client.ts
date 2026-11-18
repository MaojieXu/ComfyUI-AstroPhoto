import { app } from '../host/comfy';
export class ApiError extends Error {
  constructor(public code: string, public status?: number, public fields?: Record<string, unknown>, public requestId?: string,
    public details?: Record<string, unknown>) { super(code); }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  return requestJson(path, "GET", undefined, signal);
}
export async function requestJson(path: string, method: string, body?: Record<string, unknown>, signal?: AbortSignal, timeoutMs = 10000): Promise<unknown> {
  const controller = new AbortController();
  let timeout = false;
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => { timeout = true; controller.abort(); }, timeoutMs);
  try {
    const response = await app.api.fetchApi(path, { method, signal: controller.signal,
      headers: path.startsWith('/astrophoto/v1/') ? { 'X-AstroPhoto-Local': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) } : undefined,
      body: body ? JSON.stringify(body) : undefined });
    if (!response.ok) {
      const result = await response.json?.().catch(() => null);
      const error = isRecord(result) && isRecord(result.error) ? result.error.code : isRecord(result) ? result.reason : null;
      const details = isRecord(result) && isRecord(result.error) && isRecord(result.error.details) ? result.error.details : null;
      throw new ApiError(typeof error === 'string' ? error : 'http', response.status,
        isRecord(details?.fields) ? details.fields : undefined, isRecord(result) && typeof result.request_id === 'string' ? result.request_id : undefined,
        details ?? undefined);
    }
    if (response.status === 204) return null;
    try { return await response.json(); }
    catch (error) { if (controller.signal.aborted) throw error; throw new ApiError('json'); }
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (timeout) throw new ApiError('timeout');
    if (error instanceof ApiError) throw error;
    throw new ApiError('network');
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
