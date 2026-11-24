import { ApiError, getJson, isRecord, requestJson } from './client';

export const kinds = ['camera', 'primary_optics', 'optical_accessory', 'filter', 'other'] as const;
export type Kind = typeof kinds[number];
export type DeviceInput = { name: string; product_name: string; notes: string | null };
export type Device = DeviceInput & {
  id: string; equipment_type: Kind; row_version: number; archived_at_utc: string | null;
  usage_summary?: { train_id: string; name: string; draft: boolean; revisions: { id: string; revision_number: number }[] }[];
};
export type Draft = {
  name: string; notes: string | null; camera_id: string | null; primary_optics_id: string | null;
  accessory_id: string | null; filter_ids: string[]; other_ids: string[];
};
export type Train = Draft & {
  id: string; row_version: number; status: 'draft' | 'published' | 'archived' | 'deleted';
  summary: { camera: string | null; primary_optics: string | null; accessories: string[]; filters: string[]; others: string[] };
  components?: Device[];
};

type Page<T> = { items: T[]; next: string | null; total?: number };
const base = '/astrophoto/v1';
const nullable = (value: unknown) => value === null || typeof value === 'string';
const id = (value: unknown) => typeof value === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(value);
const version = (value: unknown) => typeof value === 'number' && value > 0 && Number.isSafeInteger(value);
const ids = (value: unknown) => Array.isArray(value) && value.every(id);
const strings = (value: unknown) => Array.isArray(value) && value.every(entry => typeof entry === 'string');
const kindValue = (value: unknown): value is Kind => kinds.includes(value as Kind);
function assertDevice(value: unknown): Device {
  if (!isRecord(value) || !id(value.id) || !kindValue(value.equipment_type) || typeof value.name !== 'string' ||
    !version(value.row_version) || !nullable(value.archived_at_utc) || !nullable(value.notes) ||
    typeof value.product_name !== 'string') throw new ApiError('schema');
  if (value.usage_summary !== undefined && (!Array.isArray(value.usage_summary) || !value.usage_summary.every(
    usage => isRecord(usage) && id(usage.train_id) && typeof usage.name === 'string' && typeof usage.draft === 'boolean' &&
    Array.isArray(usage.revisions) && usage.revisions.every(rev => isRecord(rev) && id(rev.id) && version(rev.revision_number)))))
    throw new ApiError('schema');
  return value as unknown as Device;
}
function train(value: unknown): Train {
  if (!isRecord(value) || !id(value.id) || typeof value.name !== 'string' || !nullable(value.notes) ||
    !version(value.row_version) || !['draft', 'published', 'archived', 'deleted'].includes(String(value.status)) ||
    !['camera_id', 'primary_optics_id', 'accessory_id'].every(key => value[key] === null || id(value[key])) ||
    !ids(value.filter_ids) || !ids(value.other_ids) || !isRecord(value.summary) || !nullable(value.summary.camera) ||
    !nullable(value.summary.primary_optics) || !strings(value.summary.accessories) || !strings(value.summary.filters) ||
    !strings(value.summary.others)) throw new ApiError('schema');
  if (value.components !== undefined) {
    if (!Array.isArray(value.components)) throw new ApiError('schema');
    value.components.forEach(assertDevice);
  }
  return value as unknown as Train;
}

type Options = Partial<Record<'q' | 'type' | 'status' | 'archived' | 'after' | 'limit', string>>;
function query(options: Options) { return new URLSearchParams(Object.entries(options).filter(([, value]) => value)).toString(); }
function page<T>(value: unknown, parse: (entry: unknown) => T): Page<T> {
  if (!isRecord(value) || !Array.isArray(value.items) || !(value.next === null || id(value.next))) throw new ApiError('schema');
  if (value.total !== undefined && (!Number.isSafeInteger(value.total) || Number(value.total) < 0)) throw new ApiError('schema');
  return { items: value.items.map(parse), next: value.next as string | null, total: value.total as number | undefined };
}
const devicePath = (key: string) => `${base}/equipment/${encodeURIComponent(key)}`;
const trainPath = (key: string) => `${base}/optical-trains/${encodeURIComponent(key)}`;
export async function fetchEquipmentList(options: Options, signal: AbortSignal) {
  return page(await getJson(`${base}/equipment?${query(options)}`, signal), assertDevice);
}
export async function fetchEquipment(key: string, signal: AbortSignal) { return assertDevice(await getJson(devicePath(key), signal)); }
export async function saveEquipment(kind: Kind, input: DeviceInput, device: Device | null, signal: AbortSignal) {
  return assertDevice(await requestJson(device ? devicePath(device.id) : `${base}/equipment`, device ? 'PATCH' : 'POST',
    device ? { ...input, expected_version: device.row_version } : { ...input, equipment_type: kind }, signal));
}
export async function setEquipmentArchived(device: Device, signal: AbortSignal) {
  return assertDevice(await requestJson(devicePath(device.id) + (device.archived_at_utc ? '/restore' : '/archive'),
    'POST', { expected_version: device.row_version }, signal));
}
export async function deleteEquipment(device: Device, signal: AbortSignal) {
  await requestJson(devicePath(device.id), 'DELETE', { expected_version: device.row_version }, signal);
}
export async function fetchOpticalTrains(options: Options, signal: AbortSignal) {
  return page(await getJson(`${base}/optical-trains?${query(options)}`, signal), train);
}
export async function fetchTrain(key: string, signal: AbortSignal) { return train(await getJson(trainPath(key), signal)); }
export async function deleteTrain(current: Train, signal: AbortSignal) {
  await requestJson(trainPath(current.id), 'DELETE', { expected_version: current.row_version }, signal);
}
export async function createTrain(draft: Draft, signal: AbortSignal) {
  return train(await requestJson(`${base}/optical-trains`, 'POST', draft, signal));
}
export async function saveTrainDraft(key: string, draft: Draft, expected: number | null, signal: AbortSignal) {
  return train(await requestJson(trainPath(key), 'PATCH', { ...draft, expected_version: expected }, signal));
}
export async function setTrainArchived(current: Train, signal: AbortSignal) {
  return train(await requestJson(trainPath(current.id) + (current.status === 'archived' ? '/restore' : '/archive'), 'POST',
    { expected_version: current.row_version }, signal));
}
export async function fetchSelectable(signal: AbortSignal) {
  const result: Device[] = [];
  let after = '';
  do {
    const page = await fetchEquipmentList({ archived: 'all', after, limit: '100' }, signal);
    result.push(...page.items);
    if (page.next && page.next <= after) throw new ApiError('schema');
    after = page.next ?? '';
  } while (after);
  return result;
}

