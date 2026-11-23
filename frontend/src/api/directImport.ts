import { app } from '../host/comfy';
import { ApiError, getJson, isRecord, requestJson } from './client';
import type { ImportPreview } from './assets';

const base = '/astrophoto/v1/library/direct-imports';
export type DirectPreview = ImportPreview & { workspaces: { workspace_id: string; lane: string; file_count: number; size_bytes: number }[] };
export type ImportTicket = { preview_id: string; idempotency_key: string };
export type DirectEntry = {
  id: string; index: number; name: string; size_bytes: number; last_modified_ms?: number;
  workspace_id: string; lane: string; status: 'pending' | 'failed' | 'copied'; error: string | null;
};
export type DirectJob = {
  id: string; phase: 'paused' | 'importing' | 'completed' | 'cancelled'; group_id: string | null; entries: DirectEntry[];
};
const count = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;
const path = (id: string) => base + '/' + encodeURIComponent(id);

export async function previewDirectImport(fields: Record<string, unknown>, signal: AbortSignal): Promise<DirectPreview> {
  const data = await requestJson(base + '/preview', 'POST', fields, signal, 60000);
  if (!isRecord(data) || typeof data.preview_id !== 'string' || !count(data.file_count) || !count(data.failed) ||
      !count(data.size_bytes) || !Array.isArray(data.workspaces) || !data.workspaces.every(row =>
        isRecord(row) && typeof row.workspace_id === 'string' && typeof row.lane === 'string' && count(row.file_count) && count(row.size_bytes)))
    throw new ApiError('schema');
  return data as DirectPreview;
}

function job(data: unknown): DirectJob {
  if (!isRecord(data) || typeof data.id !== 'string' || !['paused', 'importing', 'completed', 'cancelled'].includes(String(data.phase)) ||
      !Array.isArray(data.entries) || !data.entries.every(entry => isRecord(entry) &&
        typeof entry.id === 'string' && count(entry.index) && typeof entry.name === 'string' && count(entry.size_bytes) &&
        typeof entry.workspace_id === 'string' && typeof entry.lane === 'string' &&
        ['copied', 'failed', 'pending'].includes(String(entry.status))))
    throw new ApiError('schema');
  return data as DirectJob;
}
export async function startDirectImport(ticket: ImportTicket, signal: AbortSignal) {
  return job(await requestJson(base, 'POST', ticket, signal, 60000));
}
export async function readDirectImport(id: string, signal: AbortSignal) {
  return job(await getJson(path(id), signal, 'no-store'));
}
export async function cancelDirectImport(id: string, signal: AbortSignal) {
  return job(await requestJson(path(id), 'DELETE', undefined, signal, null));
}
export async function writeDirectFile(id: string, entry: DirectEntry, file: File, workspace: string, signal: AbortSignal) {
  const query = workspace === entry.workspace_id ? '' : '?workspace_id=' + encodeURIComponent(workspace);
  const dest = path(id) + '/files/' + encodeURIComponent(entry.id) + query;
  let response: Response;
  try {
    response = await app.api.fetchApi(dest, { method: 'PUT', body: file, signal,
      headers: { 'X-AstroPhoto-Local': '1', 'Content-Type': 'application/octet-stream' } });
  } catch (reason) {
    if (signal.aborted) throw reason;
    throw new ApiError('network');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(isRecord(data?.error) && typeof data.error.code === 'string' ? data.error.code : 'http', response.status);
  if (!isRecord(data) || data.id !== entry.id || data.status !== 'copied' || typeof data.workspace_id !== 'string')
    throw new ApiError('schema');
  return data.workspace_id;
}
