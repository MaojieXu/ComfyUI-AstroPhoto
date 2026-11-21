import { ApiError, getJson, isRecord } from './client';

const uuid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
export async function fitsAssets(signal: AbortSignal) {
  const assets: { id: string; name: string }[] = [];
  let after = '';
  do {
    const value = await getJson('/astrophoto/v1/fits/assets?after=' + after, signal);
    if (!isRecord(value) || !Array.isArray(value.assets) ||
        value.assets.some(row => !isRecord(row) || typeof row.id !== 'string' || !uuid.test(row.id) || typeof row.name !== 'string') ||
        value.next !== null && (typeof value.next !== 'string' || !uuid.test(value.next) || value.next <= after)) throw new ApiError('schema');
    assets.push(...value.assets);
    after = value.next ?? '';
  } while (after);
  return assets;
}
