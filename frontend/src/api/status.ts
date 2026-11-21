import { ApiError, getJson, isRecord } from './client';
export interface AstroStatus {
  extension: { id: string; version: string };
  api_version: 'v1'; status: 'ok' | 'degraded';
  runtime: { node_registered: boolean; routes_registered: boolean };
  capabilities: Record<string, { available: boolean; reason: string | null }>;
}
export function parseStatus(value: unknown): AstroStatus {
  if (!isRecord(value) || !isRecord(value.extension) ||
    value.extension.id !== 'ComfyUI_AstroPhoto' || typeof value.extension.version !== 'string' ||
    value.api_version !== 'v1' || !['ok', 'degraded'].includes(String(value.status)) ||
    !isRecord(value.runtime) || typeof value.runtime.node_registered !== 'boolean' ||
    typeof value.runtime.routes_registered !== 'boolean' || !isRecord(value.capabilities) ||
    !Object.values(value.capabilities).every(c => isRecord(c) && typeof c.available === 'boolean' && (c.reason === null || typeof c.reason === 'string')))
    throw new ApiError('schema');
  return value as unknown as AstroStatus;
}
export async function fetchStatus(signal?: AbortSignal) { return parseStatus(await getJson('/astrophoto/v1/status', signal)); }
