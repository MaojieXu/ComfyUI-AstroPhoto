export type FacetRecord = { id: string; name: string; asset_type: string; frame_type?: string; master_type?: string | null;
  calibration_state?: string; equipment_train_id?: string | null; equipment_snapshot?: { name?: string } | null;
  filter_id?: string | null; filter_state?: string; filter_snapshot?: { name?: string } | null;
  extensions?: string[]; workspace_ids?: string[] };
export type FacetFilters = Record<string, string[]>;
export type FacetOption = { value: string; label: string; count: number };
export type FacetGroup = { key: string; options: FacetOption[] };
export const facetKeys = ['asset_type', 'frame_type', 'master_type', 'equipment', 'filter', 'calibration_state', 'extension', 'workspace'] as const;
type Translate = (key: string, fallback?: string) => string;
type Workspace = { id: string; name: string };

export function facetValues(row: FacetRecord, key: string, t: Translate, workspaces: Workspace[]) {
  let values: string[] = [];
  if (key === 'asset_type') values = [row.asset_type];
  if (key === 'frame_type' && row.asset_type === 'subframe_collection') values = [row.frame_type || 'unknown'];
  if (key === 'master_type' && row.asset_type === 'master_frame') values = [row.master_type || 'unknown'];
  if (key === 'equipment') values = [row.equipment_train_id || 'unspecified'];
  if (key === 'filter') values = [row.filter_state === 'selected' ? row.filter_id || 'unknown' : row.filter_state || 'unknown'];
  if (key === 'calibration_state' && row.asset_type === 'subframe_collection') values = [row.calibration_state || 'unknown'];
  if (key === 'extension') values = row.extensions || [];
  if (key === 'workspace') values = row.workspace_ids || [];
  return values.map(value => ({ value, label: key === 'asset_type' ? t('assetLibrary.importTypes.' + value, value)
    : key === 'equipment' && value !== 'unspecified' ? row.equipment_snapshot?.name || value
    : key === 'filter' && value !== 'none' && value !== 'unknown' ? row.filter_snapshot?.name || value
    : key === 'workspace' ? (value === 'external' ? t('assetLibrary.projectUi.externalLocation') : workspaces.find(ws => ws.id === value)?.name || value)
    : key === 'extension' ? value.toUpperCase() : key === 'filter' && value === 'none' ? t('assetLibrary.noFilter') : key === 'master_type' && value === 'light' ? t('assetLibrary.masterPurpose.light') : t('assetLibrary.values.' + value, value) }));
}

export function matchesFacet(row: FacetRecord, query: string, filters: FacetFilters, t: Translate, workspaces: Workspace[], excluded?: string) {
  return row.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) && facetKeys.every(key => key === excluded || !filters[key]?.length || facetValues(row, key, t, workspaces).some(item => filters[key].includes(item.value)));
}

export function facetGroups(rows: FacetRecord[], query: string, filters: FacetFilters, t: Translate, workspaces: Workspace[]): FacetGroup[] {
  return facetKeys.map(key => {
    const options = new Map<string, FacetOption>();
    for (const row of rows) for (const item of facetValues(row, key, t, workspaces)) {
      const option = options.get(item.value) || { ...item, count: 0 };
      if (matchesFacet(row, query, filters, t, workspaces, key)) option.count++;
      options.set(item.value, option);
    }
    for (const value of filters[key] || []) if (!options.has(value)) options.set(value, { value, label: value, count: 0 });
    return { key, options: [...options.values()].filter(option => option.count || filters[key]?.includes(option.value)).sort((a, b) => a.label.localeCompare(b.label)) };
  }).filter(group => group.options.length);
}
