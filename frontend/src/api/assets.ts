import { ApiError, getJson, isRecord, requestJson } from './client';

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
  import_group_id?: string | null;
  import_index?: number | null;
  catalog_resource?: string;
  warnings?: { collection_id: string; conflicts: string[]; unknown?: string[] }[];
};
export type Project = Document & { name: string; target?: string | null; notes?: string | null };
export type ImportGroup = Document & { name: string; frame_type?: string; available?: boolean | null; count: number; workspaces: { id: string; name: string; count: number }[] };
type Documents = { assets: Asset; 'import-groups': ImportGroup };
export type DocumentKind = keyof Documents;
type Query = Record<string, string | undefined>;
type Page<T> = { items: T[]; next: string | null };
const path = (kind: DocumentKind, id?: string) =>
  `${base}/library/${kind}${id === undefined ? '' : '/' + encodeURIComponent(id)}`;

const nullableString = (value: unknown) => value == null || typeof value === 'string';
const ids = (value: unknown) => Array.isArray(value) && value.every(id => typeof id === 'string');
const attributes = (value: unknown) => isRecord(value) && Object.values(value).every(entry =>
  nullableString(entry) || ids(entry) || (typeof entry === 'number' && Number.isFinite(entry)));
const validators: Record<DocumentKind, (value: Record<string, unknown>) => boolean> = {
  assets: row => typeof row.name === 'string' && typeof row.size_bytes === 'number' &&
    (row.storage_mode === 'external_reference' || row.storage_mode === 'managed') &&
    nullableString(row.workspace_id) && typeof row.available === 'boolean' && attributes(row.attributes),
  'import-groups': row => typeof row.name === 'string' && Number.isSafeInteger(row.count) &&
    Array.isArray(row.workspaces) && row.workspaces.every(entry => isRecord(entry) &&
      typeof entry.id === 'string' && typeof entry.name === 'string' && Number.isSafeInteger(entry.count)),

};

function parse<K extends DocumentKind>(kind: K, value: unknown): Documents[K] {
  if (!isRecord(value) || typeof value.id !== 'string' || !Number.isSafeInteger(value.revision) ||
    !validators[kind](value)) throw new ApiError('schema');
  return value as Documents[K];
}

export async function listDocuments<K extends DocumentKind>(kind: K, query: Query, signal: AbortSignal): Promise<Page<Documents[K]>> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
  return readPage(kind, path(kind) + '?' + params, signal);
}

export function listCollectionAssets(id: string, after: string | undefined, signal: AbortSignal) {
  const params = new URLSearchParams({ view: 'assets' });
  if (after) params.set('after', after);
  return readPage('assets', base + '/catalog/subframe_collection/' + encodeURIComponent(id) + '/files?' + params, signal);
}

async function readPage<K extends DocumentKind>(kind: K, url: string, signal: AbortSignal): Promise<Page<Documents[K]>> {
  const data = await getJson(url, signal, 'no-store');
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
    row && kind !== 'assets' ? { ...fields, revision: row.revision } : fields, signal));
}

export type CalibrationComparison = {
  id: string; name: string;
  fields: Record<string, { status: 'match' | 'difference' | 'unknown'; actual: unknown; expected: unknown }>;
};
export type ImportPreview = {
  calibration?: CalibrationComparison[];
  file_count: number; failed: number; size_bytes: number; preview_id: string;
  workspace_id?: string | null;
  skipped?: number; errors?: { entry: number; code: string }[];
};
export async function previewImport(fields: Record<string, unknown>, signal: AbortSignal): Promise<ImportPreview> {
  const data = await requestJson(base + '/assets/import/preview', 'POST', fields, signal, 60000);
  if (!isRecord(data) || typeof data.file_count !== 'number' || typeof data.failed !== 'number' ||
    typeof data.size_bytes !== 'number' || typeof data.preview_id !== 'string') throw new ApiError('schema');
  return data as ImportPreview;
}

export async function relocateReference(id: string, newPath: string, signal: AbortSignal) {
  await requestJson(`${base}/assets/${encodeURIComponent(id)}/relocate`, 'POST', { new_path: newPath }, signal);
}
