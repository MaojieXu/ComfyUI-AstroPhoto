import { ApiError, getJson, requestJson } from '../../api/client';
import { confirmAction } from '../library/components/useMutation';

type Translate = (key: string, values: Record<string, string | number>) => string;
type Impact = {
  name: string;
  impact_revision: string;
  has_associations: boolean;
  projects: { project: string; name: string }[];
  calibration_bindings: { collection: string; master: string }[];
  sources: { name?: string; id: string }[];
  files: { storage_mode: string; blocked?: string }[];
};

export async function deleteAsset(url: string, t: Translate, revision?: number, signal?: AbortSignal) {
  const impact = await getJson(url + '/deletion-impact', signal) as Impact;
  const blocked = impact.files.find(file => file.blocked);
  if (blocked?.blocked) throw new ApiError(blocked.blocked);
  if (impact.has_associations) {
    const managed = impact.files.filter(file => file.storage_mode === 'managed').length;
    const lines = [
      ...impact.projects.map(row => t('assetLibrary.deletionProject', row)),
      ...impact.calibration_bindings.map(row => t('assetLibrary.deletionCalibration', row)),
      ...impact.sources.map(row => t('assetLibrary.deletionSource', { name: row.name ?? row.id })),
    ];
    const shown = lines.slice(0, 4);
    const message = [
      t('assetLibrary.deletionFiles', { managed, external: impact.files.length - managed }),
      t('assetLibrary.deletionMessage', {
        projects: impact.projects.length, calibration: impact.calibration_bindings.length, sources: impact.sources.length,
      }),
    ].join(' ');
    if (lines.length > shown.length) shown.push(t('assetLibrary.deletionMore', { count: lines.length - shown.length }));
    if (signal?.aborted || !await confirmAction(
      t('assetLibrary.deletionTitle', { name: impact.name }), message, shown, 'delete',
    )) return false;
  }
  if (signal?.aborted) return false;
  await requestJson(url, 'DELETE', { revision, impact_revision: impact.impact_revision }, signal, null);
  return true;
}
