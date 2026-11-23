import { ApiError, isRecord, requestJson } from './client';

export async function nativePicker(kind: 'file' | 'folder', signal?: AbortSignal) {
  const result = await requestJson('/astrophoto/v1/storage/native-picker', 'POST', { kind }, signal, 190000);
  if (!isRecord(result) || !['selected', 'cancelled', 'unavailable', 'busy'].includes(String(result.status)) ||
      !(result.path === null || typeof result.path === 'string')) throw new ApiError('schema');
  return result as { status: 'selected' | 'cancelled' | 'unavailable' | 'busy'; path: string | null };
}
