import { ApiError, getJson, isRecord, requestJson } from './client';
import { app } from '../host/comfy';

const base = '/astrophoto/v1';
export type AssetAttribute = string | number | string[] | null;
export type Attributes = Record<string, AssetAttribute>;
export type Document = { id: string; revision: number };
export type Asset = Document & {
  name: string;
  size_bytes: number;
  storage_mode: 'external_reference' | 'managed';
  workspace_id: string | null;
  available: boolean;
  attributes: Attributes;
  warnings?: { collection_id: string; conflicts: string[]; unknown?: string[] }[];
};
export type Project = Document & { name: string; target?: string | null; notes?: string | null };
export type Collection = Document & {
  name: string; asset_ids: string[]; calibration_folder_id?: string | null; calibration_eligible?: boolean;
};
export type Folder = Document & { name: string; project_id: string | null; parent_id: string | null };
export type Session = Document & { name: string; asset_ids: string[]; notes?: string | null };
export type Master = Document & {
  asset_id: string; folder_id: string | null; method: string | null; source_asset_id: string | null; usage?: string;
};
export type Assignment = Document & { asset_id?: string; collection_id?: string; master_id: string; usage?: string };
export type Placement = Document & {
  project_id: string; folder_id: string | null; asset_id?: string; collection_id?: string; position?: number;
};
type Documents = {
  assets: Asset; projects: Project; collections: Collection; folders: Folder; sessions: Session;
  masters: Master; assignments: Assignment; placements: Placement;
};
export type DocumentKind = keyof Documents;
type Query = Record<string, string | undefined>;
type Page<T> = { items: T[]; next: string | null };
const path = (kind: DocumentKind, id?: string) =>
  `${base}/library/${kind}${id === undefined ? '' : '/' + encodeURIComponent(id)}`;

const nullableString = (value: unknown) => value == null || typeof value === 'string';
const ids = (value: unknown) => Array.isArray(value) && value.every(id => typeof id === 'string');
const attributes = (value: unknown) => isRecord(value) && Object.values(value).every(entry =>
  nullableString(entry) || ids(entry) || (typeof entry === 'number' && Number.isFinite(entry)));
const target = (row: Record<string, unknown>) => typeof row.asset_id === 'string' || typeof row.collection_id === 'string';
const validators: Record<DocumentKind, (value: Record<string, unknown>) => boolean> = {
  assets: row => typeof row.name === 'string' && typeof row.size_bytes === 'number' &&
    (row.storage_mode === 'external_reference' || row.storage_mode === 'managed') &&
    nullableString(row.workspace_id) && typeof row.available === 'boolean' && attributes(row.attributes),
  projects: row => typeof row.name === 'string' && nullableString(row.target) && nullableString(row.notes),
  collections: row => typeof row.name === 'string' && ids(row.asset_ids) &&
    nullableString(row.calibration_folder_id) && (row.calibration_eligible === undefined || typeof row.calibration_eligible === 'boolean'),
  folders: row => typeof row.name === 'string' && nullableString(row.project_id) && nullableString(row.parent_id),
  sessions: row => typeof row.name === 'string' && ids(row.asset_ids) && nullableString(row.notes),
  masters: row => typeof row.asset_id === 'string' && nullableString(row.folder_id) &&
    nullableString(row.method) && nullableString(row.source_asset_id),
  assignments: row => target(row) && typeof row.master_id === 'string',
  placements: row => target(row) && typeof row.project_id === 'string' && nullableString(row.folder_id),
};

function parse<K extends DocumentKind>(kind: K, value: unknown): Documents[K] {
  if (!isRecord(value) || typeof value.id !== 'string' || !Number.isSafeInteger(value.revision) ||
    !validators[kind](value)) throw new ApiError('schema');
  return value as Documents[K];
}

export async function listDocuments<K extends DocumentKind>(kind: K, query: Query, signal: AbortSignal): Promise<Page<Documents[K]>> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
  const data = await getJson(path(kind) + '?' + params, signal, 'no-store');
  if (!isRecord(data) || !Array.isArray(data.items) || !(data.next === null || typeof data.next === 'string'))
    throw new ApiError('schema');
  return { items: data.items.map(row => parse(kind, row)), next: data.next };
}

export async function allDocuments<K extends DocumentKind>(kind: K, query: Query, signal: AbortSignal) {
  const rows: Documents[K][] = [];
  const cursors = new Set<string>();
  let after: string | null = null;
  do {
    const page: Page<Documents[K]> = await listDocuments(kind, { ...query, after: after ?? undefined }, signal);
    rows.push(...page.items);
    after = page.next;
    if (after) {
      if (cursors.has(after)) throw new ApiError('schema');
      cursors.add(after);
    }
  } while (after);
  return rows;
}

export async function readDocument<K extends DocumentKind>(kind: K, id: string, signal: AbortSignal) {
  return parse(kind, await getJson(path(kind, id), signal, 'no-store'));
}

export async function writeDocument<K extends DocumentKind>(kind: K, fields: Record<string, unknown>,
    signal: AbortSignal, row?: Document) {
  return parse(kind, await requestJson(path(kind, row?.id), row ? 'PATCH' : 'POST',
    row ? { ...fields, revision: row.revision } : fields, signal));
}

export async function removeDocument(kind: DocumentKind, row: Document, signal: AbortSignal, fields: Record<string, unknown> = {}) {
  await requestJson(path(kind, row.id), 'DELETE', { ...fields, revision: row.revision }, signal);
}

export async function assignCalibrationMasters(fields: Record<string, unknown>, signal: AbortSignal) {
  await requestJson(path('assignments', 'batch'), 'POST', fields, signal);
}

export type ImportPreview = {
  file_count: number; failed: number; size_bytes: number; preview_id: string;
  skipped?: number; errors?: { entry: number; code: string }[];
};
export async function previewImport(fields: Record<string, unknown>, signal: AbortSignal): Promise<ImportPreview> {
  const data = await requestJson(base + '/assets/import/preview', 'POST', fields, signal, 60000);
  if (!isRecord(data) || typeof data.file_count !== 'number' || typeof data.failed !== 'number' ||
    typeof data.size_bytes !== 'number' || typeof data.preview_id !== 'string') throw new ApiError('schema');
  return data as ImportPreview;
}

export async function uploadAsset(id: string, file: File, signal: AbortSignal) {
  let response: Response;
  try {
    response = await app.api.fetchApi(base + '/library/uploads/' + id, {
      method: 'PUT', signal, body: file,
      headers: { 'X-AstroPhoto-Local': '1', 'X-AstroPhoto-Filename': encodeURIComponent(file.name) },
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new ApiError('network');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(isRecord(data?.error) && typeof data.error.code === 'string' ? data.error.code : 'http', response.status);
  if (!isRecord(data) || data.upload_id !== id) throw new ApiError('schema');
  return id;
}

export function discardStagedAsset(id: string) {
  return requestJson(base + '/library/uploads/' + encodeURIComponent(id), 'DELETE');
}

export async function relocateReference(id: string, newPath: string, signal: AbortSignal) {
  await requestJson(`${base}/assets/${encodeURIComponent(id)}/relocate`, 'POST', { new_path: newPath }, signal);
}

export async function deleteManagedFile(row: Asset, signal: AbortSignal) {
  await requestJson(path('assets', row.id) + '/delete-file', 'POST', { revision: row.revision, confirmed: true }, signal);
}

export type Approval = Document & {
  status: string; method: string; kind: string; record_id: string | null; payload: Record<string, unknown>;
};
export async function fetchApprovals(signal: AbortSignal) {
  const data = await getJson(base + '/library/approvals', signal, 'no-store');
  if (!isRecord(data) || !Array.isArray(data.items) || !data.items.every(row => isRecord(row) &&
    typeof row.id === 'string' && typeof row.status === 'string' && typeof row.method === 'string' &&
    typeof row.kind === 'string' && nullableString(row.record_id) && isRecord(row.payload))) throw new ApiError('schema');
  return data.items as Approval[];
}
export async function resolveApproval(id: string, approved: boolean, signal: AbortSignal) {
  await requestJson(base + '/library/approvals/' + encodeURIComponent(id), 'POST', { approved }, signal);
}
