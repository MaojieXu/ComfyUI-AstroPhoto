import { ApiError, isRecord, requestJson } from './client';

export type Mode = 'reference' | 'copy';
export type Workspace = {
  id: string; name: string; root_path: string; status: string; enabled: boolean;
  revision: number; is_default: boolean; free_bytes: number | null;
};
export type Operation = { operation_id: string; kind: 'import' | 'migration'; phase: string };
export type Storage = {
  status: 'ready' | 'degraded'; data_root: { path: string; source: string }; database: { assets: string };
  imports: { default_mode: Mode; revision: number }; default_workspace_id: string; workspaces: Workspace[];
  cache: { path: string; status: string; max_size_gb: number; used_bytes: number | null };
  capabilities: { write: boolean; import: boolean }; operations: Operation[];
};
export type Preview = {
  effective_import_mode: Mode; file_count: number; size_bytes: number; free_bytes: number | null;
  failed: number; workspace_id: string | null;
};
export type Receipt = Operation & {
  error: { code: string } | null;
  effective_import_mode: Mode | null;
  receipt: Record<string, unknown>;
};
export type Asset = { id: string; name: string; size_bytes: number; storage_mode: string; mtime_ns: string; session_ids: string[] };
const prefix = '/astrophoto/v1';
const mode = (value: unknown): value is Mode => value === 'reference' || value === 'copy';
const count = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const bytes = (value: unknown) => value === null || count(value);
const strings = (object: Record<string, unknown>, keys: string[]) => keys.every(key => typeof object[key] === 'string');

function operation(value: unknown): value is Operation {
  return isRecord(value) && strings(value, ['operation_id', 'phase']) &&
    (value.kind === 'migration' || value.kind === 'import');
}

export async function fetchStorage(signal?: AbortSignal): Promise<Storage> {
  const data = await requestJson(prefix + '/storage', 'GET', undefined, signal);
  if (isRecord(data) && typeof data.reason === 'string') throw new ApiError(data.reason);
  if (!isRecord(data) || !['ready', 'degraded'].includes(String(data.status)) ||
    !isRecord(data.data_root) || !strings(data.data_root, ['path', 'source']) ||
    !isRecord(data.database) || !strings(data.database, ['assets']) ||
    !isRecord(data.imports) || !mode(data.imports.default_mode) || !count(data.imports.revision) ||
    typeof data.default_workspace_id !== 'string' || !Array.isArray(data.workspaces) ||
    !data.workspaces.every(ws => isRecord(ws) && strings(ws, ['id', 'name', 'root_path', 'status']) &&
      typeof ws.enabled === 'boolean' && typeof ws.is_default === 'boolean' && count(ws.revision) && bytes(ws.free_bytes)) ||
    !isRecord(data.cache) || !strings(data.cache, ['path', 'status']) || !count(data.cache.max_size_gb) || !bytes(data.cache.used_bytes) ||
    !isRecord(data.capabilities) || typeof data.capabilities.write !== 'boolean' || typeof data.capabilities.import !== 'boolean' ||
    !Array.isArray(data.operations) || !data.operations.every(operation)) throw new ApiError('schema');
  return data as Storage;
}

export async function mutate(path: string, body: Record<string, unknown>, signal: AbortSignal, method = 'POST') {
  const data = await requestJson(prefix + path, method, body, signal);
  if (!isRecord(data) || typeof data.request_id !== 'string') throw new ApiError('schema');
  return data;
}

export async function startOperation(kind: Operation['kind'], body: Record<string, unknown>, signal: AbortSignal): Promise<Operation> {
  const path = kind === 'import' ? '/assets/import' : '/storage/migrations';
  const data = await mutate(path, body, signal);
  if (typeof data.operation_id !== 'string') throw new ApiError('schema');
  return { operation_id: data.operation_id, kind, phase: 'queued' };
}

export function operationPath(job: Operation) {
  const path = job.kind === 'import' ? '/assets/imports' : '/storage/migrations';
  return path + '/' + encodeURIComponent(job.operation_id);
}

function validReceipt(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  if (!['processed', 'total', 'registered', 'copied', 'failed', 'skipped'].every(key => !(key in value) || count(value[key]))) return false;
  return value.errors === undefined || Array.isArray(value.errors) &&
    value.errors.every(error => isRecord(error) && count(error.entry) && typeof error.code === 'string');
}

export async function fetchReceipt(job: Operation, signal: AbortSignal): Promise<Receipt> {
  const data = await requestJson(prefix + operationPath(job), 'GET', undefined, signal);
  if (!isRecord(data) || data.operation_id !== job.operation_id || data.kind !== job.kind ||
    !validReceipt(data.receipt) || (data.error !== null && (!isRecord(data.error) || typeof data.error.code !== 'string')) ||
    (data.effective_import_mode !== null && !mode(data.effective_import_mode)) || !operation(data)) throw new ApiError('schema');
  return data as Receipt;
}

export async function previewImport(body: Record<string, unknown>, signal: AbortSignal): Promise<Preview> {
  const data = await mutate('/assets/import/preview', body, signal);
  if (!mode(data.effective_import_mode) || !count(data.file_count) || !count(data.size_bytes) ||
    !bytes(data.free_bytes) || !count(data.failed) || (typeof data.workspace_id !== 'string' && data.workspace_id !== null)) {
    throw new ApiError('schema');
  }
  return data as Preview;
}

export async function fetchAssets(signal?: AbortSignal) {
  const assets: Asset[] = [];
  let next: string | null = null;
  do {
    const data = await requestJson(prefix + '/assets' + (next ? '?after=' + encodeURIComponent(next) : ''), 'GET', undefined, signal);
    if (!isRecord(data) || !Array.isArray(data.assets) || !data.assets.every(
      asset => isRecord(asset) && strings(asset, ['id', 'name', 'storage_mode', 'mtime_ns']) && /^-?\d+$/.test(String(asset.mtime_ns)) && count(asset.size_bytes) &&
        (Array.isArray(asset.session_ids) && asset.session_ids.every(id => typeof id === 'string'))
    ) || (data.next !== null && (typeof data.next !== 'string' || data.next === next))) throw new ApiError('schema');
    assets.push(...data.assets);
    next = data.next;
  } while (next);
  return assets;
}

