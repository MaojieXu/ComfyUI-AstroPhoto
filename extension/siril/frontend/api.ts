import { app } from '../../../frontend/src/host/comfy';
import { ApiError, getJson, isRecord, requestJson } from '../../../frontend/src/api/client';

export const SIRIL = '/astrophoto/v1/software/siril';
const uuid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
const PREVIEW = '/astrophoto/v1/previews';
export type Parameters = Record<string, number | boolean>;
export type CommandParameter = {
  name: string; label: string; default: number | boolean; help: string;
  min: number | null; max: number | null; rgb_only: boolean;
};
export type SirilCommand = {
  id: string; usage: string; scriptable: boolean; requires: string[]; build_feature: string | null;
  category?: string; category_zh?: string; title_zh?: string; description_zh?: string;
  search_aliases?: string[];
  node_id: string | null; title: string; description: string; preview: boolean; parameters: CommandParameter[];
};
let commandsRequest: Promise<SirilCommand[]> | undefined;
export function getCommands(): Promise<SirilCommand[]> {
  commandsRequest ??= getJson(SIRIL + '/commands').then(value => {
    if (!isRecord(value) || value.version !== '1.4.5' || !Array.isArray(value.commands) ||
        value.commands.some(row => !isRecord(row) || typeof row.id !== 'string' ||
          typeof row.title !== 'string' || typeof row.usage !== 'string' || typeof row.description !== 'string' ||
          typeof row.preview !== 'boolean' || typeof row.scriptable !== 'boolean' ||
          ['category', 'category_zh', 'title_zh', 'description_zh'].some(key => row[key] !== undefined && typeof row[key] !== 'string') ||
          (row.search_aliases !== undefined && (!Array.isArray(row.search_aliases) || row.search_aliases.some(alias => typeof alias !== 'string'))) ||
          !(row.node_id === null || typeof row.node_id === 'string') ||
          !(row.build_feature === null || typeof row.build_feature === 'string') ||
          !Array.isArray(row.requires) || row.requires.some(item => typeof item !== 'string') ||
          !Array.isArray(row.parameters) || row.parameters.some(parameter => !isRecord(parameter) ||
            typeof parameter.name !== 'string' || typeof parameter.label !== 'string' ||
            typeof parameter.help !== 'string' || typeof parameter.rgb_only !== 'boolean' ||
            !['number', 'boolean'].includes(typeof parameter.default) ||
            !(parameter.min === null || typeof parameter.min === 'number') ||
            !(parameter.max === null || typeof parameter.max === 'number')))) throw new ApiError('schema');
    return value.commands as SirilCommand[];
  }).catch((error: unknown) => {
    commandsRequest = undefined;
    throw error;
  });
  return commandsRequest;
}
export type SoftwareStatus = { os: string; state: string; target_version: string; enabled: boolean; path?: string; version?: string; verified_at?: string };
export type Candidate = { path: string; origin: string; state: string; version?: string; detected?: string };
export type Preview = { state: string; before?: string; after?: string; version?: string; error?: string; aligned?: boolean;
  width?: number; height?: number; channels?: number; formal?: boolean; jobId?: string };
export const validatePreview = (id: string, signal: AbortSignal) => getJson(PREVIEW + '/jobs/' + id + '/validate', signal);
export async function collectFormalOutput(id: string, signal: AbortSignal) {
  if (!uuid.test(id)) throw new ApiError('schema');
  return requestJson('/astrophoto/v1/library/assets', 'POST', { output_id: id }, signal);
}

function softwareStatus(value: unknown): SoftwareStatus {
  if (!isRecord(value) || typeof value.os !== 'string' || typeof value.state !== 'string' || typeof value.enabled !== 'boolean' || value.target_version !== '1.4.5' ||
      value.state === 'ready' && (typeof value.path !== 'string' || value.version !== '1.4.5' || typeof value.verified_at !== 'string')) {
    throw new ApiError('schema');
  }
  return value as SoftwareStatus;
}
export const getSiril = async (signal: AbortSignal) => softwareStatus(await getJson(SIRIL, signal));
export const saveSiril = async (path: string, signal: AbortSignal) =>
  softwareStatus(await requestJson(SIRIL, 'PUT', { path }, signal, 30000));
export const clearSiril = async (signal: AbortSignal) => softwareStatus(await requestJson(SIRIL, 'DELETE', undefined, signal));
export const setSirilEnabled = async (enabled: boolean, signal: AbortSignal) =>
  softwareStatus(await requestJson(SIRIL + '/enabled', 'PUT', { enabled }, signal));
export async function discoverSiril(signal: AbortSignal): Promise<Candidate[]> {
  const value = await requestJson(SIRIL + '/discover', 'POST', undefined, signal, 195000);
  if (!isRecord(value) || !Array.isArray(value.candidates) || value.candidates.some(row =>
    !isRecord(row) || typeof row.path !== 'string' || typeof row.origin !== 'string' || typeof row.state !== 'string')) throw new ApiError('schema');
  return value.candidates as Candidate[];
}

function wait(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 350);
    if (signal.aborted) abort();
    else signal.addEventListener('abort', abort, { once: true });
  });
}

async function image(root: string, side: string, signal: AbortSignal) {
  const response = await app.api.fetchApi(root + '/' + side, { signal, headers: { 'X-AstroPhoto-Local': '1' } });
  if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== 'image/png') throw new ApiError('PREVIEW_STALE');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function renderCandidate(command: string, asset: string, owner: string, parameters: Parameters, signal: AbortSignal, formal?: string): Promise<Preview> {
  const init = await requestJson(PREVIEW + '/siril/' + encodeURIComponent(command), 'POST',
    { ...(uuid.test(asset) ? { asset_id: asset } : { image_path: asset }), owner, parameters, ...(formal ? { formal_id: formal } : {}) });
  if (!isRecord(init) || typeof init.job_id !== 'string' || !uuid.test(init.job_id)) throw new ApiError('schema');
  const root = PREVIEW + '/jobs/' + init.job_id;
  const cancel = () => { void requestJson(root + '/cancel', 'POST').catch(() => {}); };
  let before: string | undefined;
  let after: string | undefined;
  if (signal.aborted) {
    cancel();
    throw new DOMException('Aborted', 'AbortError');
  }
  signal.addEventListener('abort', cancel, { once: true });
  try {
    while (!signal.aborted) {
      const value = await getJson(root, signal);
      if (!isRecord(value)) throw new ApiError('schema');
      if (value.state === 'queued' || value.state === 'running') {
        await wait(signal);
        continue;
      }
      if (!['ready', 'failed', 'cancelled'].includes(String(value.state))) throw new ApiError('schema');
      if (value.before === true) before = await image(root, 'before', signal);
      if (value.after === true) after = await image(root, 'after', signal);
      if (signal.aborted) break;
      return {
        state: String(value.state), before, after, aligned: value.aligned === true, formal: value.formal === true, jobId: init.job_id,
        width: typeof value.width === 'number' ? value.width : undefined,
        height: typeof value.height === 'number' ? value.height : undefined,
        channels: typeof value.channels === 'number' ? value.channels : undefined,
        version: typeof value.version === 'string' ? value.version : undefined,
        error: typeof value.error === 'string' ? value.error : undefined,
      };
    }
    throw new DOMException('Aborted', 'AbortError');
  } catch (error) {
    if (before) URL.revokeObjectURL(before);
    if (after) URL.revokeObjectURL(after);
    cancel();
    throw error;
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}

