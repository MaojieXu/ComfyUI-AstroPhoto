import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchEquipmentList, fetchOpticalTrains, kinds, type Device, type Train } from '../../../api/equipment';
import { SearchField } from '../../../shared/SearchField';
import { SearchOptions } from '../../../shared/SearchOptions';
import { useResource } from '../../../shared/useResource';
import { Content, useMutation, EquipmentError, imagingType } from './shared';

export type Search = { q: string; filter: string };
export function RecordList<T extends Device | Train>({ search, setSearch, mode, open, add, epoch }: {
  search: Search; setSearch: (value: Search) => void; mode: 'devices' | 'trains'; open: (id: string) => void; add: () => void; epoch: number;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState(search.q.trim());
  const handleSearch = useCallback((value: string) => setQuery(value.trim()), []);
  const filters = ['', ...(mode === 'devices' ? kinds : ['draft', 'published']), 'archived'];
  const [more, setMore] = useState<{ key: string; items: T[]; next: string | null }>();
  const append = useMutation();
  const key = JSON.stringify([search.filter, query, epoch]);
  const load = useCallback((signal: AbortSignal, after = '') => {
    const options = { q: query, after, archived: search.filter === 'archived' ? 'true' : 'false' };
    const operation = mode === 'devices' ? fetchEquipmentList({ ...options, type: kinds.includes(search.filter as typeof kinds[number]) ? search.filter : undefined }, signal)
      : fetchOpticalTrains({ ...options, status: search.filter || undefined }, signal);
    return operation as Promise<{ items: T[]; next: string | null; total?: number }>;
  }, [mode, query, search.filter]);
  const { resource, refresh } = useResource(load);
  useEffect(refresh, [epoch, refresh]);
  return <>
    <div className="ap-equipment-actions"><h2>{t('equipment.' + mode)}{resource.state === 'ready' && resource.data.total !== undefined && <> · {resource.data.total}</>}</h2>
      <button type="button" className="ap-equipment-primary" onClick={add}>{t('equipment.' + (mode === 'devices' ? 'addDevice' : 'addTrain'))}</button>
    </div>
    <div className="ap-search-toolbar ap-equipment-search">
      <SearchField label={t('equipment.' + (mode === 'devices' ? 'searchDevice' : 'searchTrain'))} clearLabel={t('browse.clear')}
        value={search.q} onValueChange={q => setSearch({ ...search, q })} onSearch={handleSearch} />
      <SearchOptions icon="filter" label={t('equipment.filterList')} options={filters.map(filter => ({
        id: filter || 'active', label: filter === 'published' ? t('equipment.configured') : t(filter ? 'equipment.values.' + filter : 'equipment.active'),
        checked: search.filter === filter, select: () => setSearch({ ...search, filter })
      }))} />
    </div>
    <Content resource={resource} retry={() => { setMore(undefined); refresh(); }}>{data => {
      const extra = more?.key === key ? more : null;
      const items = data.items.concat(extra?.items ?? []);
      const next = extra ? extra.next : data.next;
      return <>
        {items.length === 0 ? <><p>{t('equipment.' + (query || search.filter ? 'noMatches' : mode === 'devices' ? 'emptyDevices' : 'emptyTrains'))}</p>
          {(search.q || search.filter) && <button type="button" onClick={() => setSearch({ q: '', filter: '' })}>{t('equipment.resetSearch')}</button>}</> :
          <ul className="ap-equipment-list">{items.map(item => <li key={item.id}>
            <button type="button" onClick={() => open(item.id)} className="ap-equipment-row">
              <strong title={item.name}>{item.name}</strong>
              {'equipment_type' in item ? <DeviceSummary device={item} /> : <TrainSummary train={item} />}
            </button>
          </li>)}</ul>}
        <EquipmentError error={append.error} />
        {next && <button type="button" disabled={append.pending} onClick={() => void append.run(async signal => {
          const result = await load(signal, next);
          if (!signal.aborted) setMore({ key, items: (extra?.items ?? []).concat(result.items), next: result.next });
        })}>{t('equipment.more')}</button>}
      </>;
    }}</Content>
  </>;
}

function DeviceSummary({ device }: { device: Device }) {
  const { t } = useTranslation();
  const specs = device.specs;
  const sensor = imagingType(specs.sensor_kind);
  const detail = device.equipment_type === 'camera' ? sensor && t('equipment.values.' + sensor) :
    device.equipment_type === 'primary_optics' ? specs.native_focal_length_mm && specs.native_focal_length_mm + ' mm' :
    device.equipment_type === 'optical_accessory' ? specs.nominal_factor && specs.nominal_factor + '×' :
    specs.filter_kind && t('equipment.values.' + specs.filter_kind);
  return <small>{[t('equipment.values.' + device.equipment_type), device.manufacturer, device.model, detail,
    device.archived_at_utc && t('equipment.values.archived')].filter(Boolean).join(' · ')}</small>;
}

function TrainSummary({ train }: { train: Train }) {
  const { t } = useTranslation();
  const { camera, primary_optics, accessories, filters } = train.summary;
  return <>
    <small>{t(train.status === 'published' ? 'equipment.configured' : 'equipment.values.' + train.status)}</small>
    <small>{[camera, primary_optics, ...accessories].filter(Boolean).join(' + ')}</small>
    {filters.length > 0 && <small>{t('equipment.fields.filter_ids')} · {filters.join(', ')}</small>}
  </>;
}
