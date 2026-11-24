import { ApiError, isRecord, requestJson } from './client';

export async function nativePicker(kind: 'file' | 'files' | 'folder', signal?: AbortSignal, language?: 'zh' | 'en') {
  const result = await requestJson('/astrophoto/v1/storage/native-picker', 'POST', { kind, ...(language ? { language } : {}) }, signal, 190000);
  if (!isRecord(result) || !['selected', 'cancelled', 'unavailable', 'busy'].includes(String(result.status)) ||
      (kind !== 'files' && !(result.path === null || typeof result.path === 'string')) ||
      (kind === 'files' && (!Array.isArray(result.paths) || !result.paths.every(path => typeof path === 'string')))) throw new ApiError('schema');
  return result as { status: 'selected' | 'cancelled' | 'unavailable' | 'busy'; path: string | null; paths?: string[] };
}
