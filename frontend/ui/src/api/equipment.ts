import { ApiError, getJson, isRecord, requestJson } from './client';

export const kinds = ['camera', 'primary_optics', 'optical_accessory', 'filter'] as const;
export type Kind = typeof kinds[number];
export type Passband = { id?: string; band_label: string; center_nm: number | null; fwhm_nm: number | null };
export type Mode = { mode_key: string; display_name: string; gain_min: number | null; gain_max: number | null; offset_min: number | null; offset_max: number | null };
type SpecValue = string | boolean | number | null;
export type Specs = Record<string, SpecValue | Passband[] | Mode[]>;
export type DeviceInput = { name: string; manufacturer: string | null; model: string | null; notes: string | null; specs: Specs };
export type Device = DeviceInput & {
  id: string; equipment_type: Kind; row_version: number; archived_at_utc: string | null;
  usage_summary?: { train_id: string; name: string; draft: boolean; revisions: { id: string; revision_number: number }[] }[];
};
export type Draft = {
  name: string; notes: string | null; base_revision_id: string | null; change_summary?: string | null;
  camera_id: string | null; primary_optics_id: string | null; accessory_ids: string[]; filter_ids: string[];
  optical_state: { rotation_deg: number | null; flat_validity_note: string | null; configuration_note: string | null };
};
export type DraftReceipt = { draft: Draft; draft_version: number; updated_at_utc: string };
export type Revision = { id: string; train_id: string; revision_number: number; base_revision_id: string | null;
  change_summary: string | null; published_at_utc: string };
export type Train = {
  id: string; name: string; notes: string | null; row_version: number; status: 'draft' | 'published' | 'archived';
  latest_revision: Revision | null; default_revision: Revision | null; has_draft: boolean;
  summary: { camera: string | null; primary_optics: string | null; accessories: string[]; filters: string[] };
  draft?: DraftReceipt | null;
  configuration?: { draft: Draft; draft_version: number | null } | null;
  components?: Device[];
};

type Page<T> = { items: T[]; next: string | null; total?: number };
const base = '/astrophoto/v1';
const nullable = (value: unknown) => value === null || typeof value === 'string';
const numberOrNull = (value: unknown) => value === null || (typeof value === 'number' && Number.isFinite(value));
const id = (value: unknown) => typeof value === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(value);
const version = (value: unknown) => typeof value === 'number' && value > 0 && Number.isSafeInteger(value);
const ids = (value: unknown) => Array.isArray(value) && value.every(id);
const strings = (value: unknown) => Array.isArray(value) && value.every(entry => typeof entry === 'string');
const kindValue = (value: unknown): value is Kind => kinds.includes(value as Kind);
const specs = (value: unknown) => isRecord(value) && Object.entries(value).every(([key, entry]) => {
  if (key === 'passbands') return Array.isArray(entry) && entry.every(band => isRecord(band) && id(band.id) &&
    typeof band.band_label === 'string' && numberOrNull(band.center_nm) && numberOrNull(band.fwhm_nm));
  if (key === 'readout_modes') return Array.isArray(entry) && entry.every(mode => isRecord(mode) &&
    typeof mode.mode_key === 'string' && typeof mode.display_name === 'string' &&
    ['gain_min', 'gain_max', 'offset_min', 'offset_max'].every(name => numberOrNull(mode[name])));
  return nullable(entry) || typeof entry === 'boolean' || numberOrNull(entry);
});
function assertDevice(value: unknown): Device {
  if (!isRecord(value) || !id(value.id) || !kindValue(value.equipment_type) || typeof value.name !== 'string' ||
    !version(value.row_version) || !nullable(value.archived_at_utc) || !nullable(value.notes) ||
    !nullable(value.manufacturer) || !nullable(value.model) || !specs(value.specs)) throw new ApiError('schema');
  if (value.usage_summary !== undefined && (!Array.isArray(value.usage_summary) || !value.usage_summary.every(
    usage => isRecord(usage) && id(usage.train_id) && typeof usage.name === 'string' && typeof usage.draft === 'boolean' &&
    Array.isArray(usage.revisions) && usage.revisions.every(rev => isRecord(rev) && id(rev.id) && version(rev.revision_number)))))
    throw new ApiError('schema');
  return value as unknown as Device;
}
function state(value: unknown) {
  return isRecord(value) && numberOrNull(value.rotation_deg) && nullable(value.flat_validity_note) && nullable(value.configuration_note);
}
function draft(value: unknown): value is Draft {
  return isRecord(value) && typeof value.name === 'string' && nullable(value.notes) &&
    (value.change_summary === undefined || nullable(value.change_summary)) && ['camera_id', 'primary_optics_id', 'base_revision_id'].every(key => value[key] === null || id(value[key])) &&
    ids(value.accessory_ids) && ids(value.filter_ids) && state(value.optical_state);
}
function draftReceipt(value: unknown): DraftReceipt {
  if (!isRecord(value) || !version(value.draft_version) || !draft(value.draft) || typeof value.updated_at_utc !== 'string')
    throw new ApiError('schema');
  return value as DraftReceipt;
}
function revision(value: unknown): Revision {
  if (!isRecord(value) || !id(value.id) || !id(value.train_id) || !version(value.revision_number) ||
    !nullable(value.change_summary) || typeof value.published_at_utc !== 'string' ||
    !(value.base_revision_id === null || id(value.base_revision_id))) throw new ApiError('schema');
  return value as Revision;
}
function train(value: unknown): Train {
  if (!isRecord(value) || !id(value.id) || typeof value.name !== 'string' || !nullable(value.notes) ||
    !version(value.row_version) || !['draft', 'published', 'archived'].includes(String(value.status)) ||
    typeof value.has_draft !== 'boolean' || !isRecord(value.summary) || !nullable(value.summary.camera) ||
    !nullable(value.summary.primary_optics) || !strings(value.summary.accessories) || !strings(value.summary.filters)) throw new ApiError('schema');
  if (value.latest_revision !== null) revision(value.latest_revision);
  if (value.default_revision !== null) revision(value.default_revision);
  if (value.draft !== null && value.draft !== undefined) draftReceipt(value.draft);
  if (value.configuration != null && (!isRecord(value.configuration) || !draft(value.configuration.draft) ||
    (value.configuration.draft_version !== null && !version(value.configuration.draft_version)))) throw new ApiError('schema');
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
  const result = train(await requestJson(`${base}/optical-trains`, 'POST', { name: draft.name, notes: draft.notes, draft }, signal));
  if (!result.draft) throw new ApiError('schema');
  return { train: result, receipt: result.draft };
}
export async function saveTrainDraft(key: string, draft: Draft, expected: number | null, signal: AbortSignal) {
  return draftReceipt(await requestJson(trainPath(key) + '/draft', 'PUT', { draft, expected_draft_version: expected }, signal));
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

