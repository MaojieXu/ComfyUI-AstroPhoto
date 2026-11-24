import { computed, defineComponent, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchEquipmentList, fetchOpticalTrains, kinds, type Device, type Kind, type Train } from '../../../api/equipment';
import { SearchField } from '../../../shared/SearchField';
import { SearchOptions } from '../../../shared/SearchOptions';
import { useResource } from '../../../shared/useResource';
import { ResourceContent } from '../components/ResourceContent';
import { RecordRows } from '../components/RecordRows';
import { EquipmentError, renderEquipmentError } from '../components/equipmentFields';
import { useMutation } from '../components/useMutation';

export type Search = { q: string; filter: string };
type EquipmentRecord = Device | Train;
type Listing = { items: EquipmentRecord[]; next: string | null; total?: number };
type ListRequest = (signal: AbortSignal, after?: string) => Promise<Listing>;

export const EquipmentList = defineComponent((props: {
  search: Search;
  setSearch: (value: Search) => void;
  mode: 'devices' | 'trains';
  open: (id: string) => void;
  add: () => void;
  epoch: number;
}) => {
  const { t } = useI18n();
  const query = ref(props.search.q.trim());
  const handleSearch = (value: string) => { query.value = value.trim(); };
  const more = shallowRef<{ request: ListRequest; items: EquipmentRecord[]; next: string | null }>();
  const append = useMutation();
  const requestParameters = computed(() => ({
    mode: props.mode,
    filter: props.search.filter,
    q: query.value,
    epoch: props.epoch,
  }));
  const load = computed<ListRequest>(() => {
    const { mode, filter, q } = requestParameters.value;
    return (signal, after = '') => {
      const options = { q, after, archived: filter === 'archived' ? 'true' : 'false' };
      return mode === 'devices'
        ? fetchEquipmentList({ ...options, type: kinds.includes(filter as Kind) ? filter : undefined }, signal)
        : fetchOpticalTrains(options, signal);
    };
  });
  const { resource, refresh } = useResource(load);

  return () => {
    const { search, setSearch, mode, open, add } = props;
    const filters = ['', ...kinds, 'archived'];
    const result = resource.value;
    return <>
      <div class="ap-equipment-actions">
        <h2>{mode === 'trains' && search.filter === 'archived' ? t('equipment.archivedTrains') : t('equipment.' + mode)}{result.state === 'ready' && result.data.total !== undefined && <> · {result.data.total}</>}</h2>
        <button type="button" class="ap-equipment-primary" onClick={add}>{t('equipment.' + (mode === 'devices' ? 'addDevice' : 'addTrain'))}</button>
      </div>
      <div class="ap-search-toolbar ap-equipment-search">
        <SearchField label={t('equipment.' + (mode === 'devices' ? 'searchDevice' : 'searchTrain'))} clearLabel={t('browse.clear')}
          value={search.q} onValueChange={q => setSearch({ ...search, q })} onSearch={handleSearch} />
        {mode === 'devices' ? <SearchOptions icon="filter" label={t('equipment.filterList')} options={filters.map(filter => ({
          id: filter || 'active',
          label: filter === 'published' ? t('equipment.configured') : t(filter ? 'equipment.values.' + filter : 'equipment.active'),
          checked: search.filter === filter, select: () => setSearch({ ...search, filter }),
        }))} /> : <SearchOptions icon="more" label={t('equipment.trainListOptions')} closeOnSelect options={[
          { id: 'archive-toggle', label: t(search.filter === 'archived' ? 'equipment.showActiveTrains' : 'equipment.showArchivedTrains'), checked: false,
            select: () => setSearch({ ...search, filter: search.filter === 'archived' ? '' : 'archived' }) },
        ]} />}
      </div>
      <ResourceContent resource={result} loadingLabel={t('states.loading')} retry={() => { more.value = undefined; refresh(); }} renderError={renderEquipmentError} renderContent={data => {
        const request = load.value;
        const extra = more.value?.request === request ? more.value : undefined;
        const items = data.items.concat(extra?.items ?? []);
        const next = extra ? extra.next : data.next;
        return <>
          <RecordRows<EquipmentRecord> records={items} recordKey={item => item.id} renderRecord={item =>
            <button type="button" onClick={() => open(item.id)} class="ap-equipment-row">
              <strong title={item.name}>{item.name}</strong>
              {'equipment_type' in item ? <DeviceSummary device={item} /> : <TrainSummary train={item} />}
            </button>} renderEmpty={() => <>
              <p>{t('equipment.' + (query.value || search.filter ? 'noMatches' : mode === 'devices' ? 'emptyDevices' : 'emptyTrains'))}</p>
              {(search.q || search.filter) && <button type="button" onClick={() => setSearch({ q: '', filter: '' })}>{t('equipment.resetSearch')}</button>}
            </>} />
          <EquipmentError error={append.error.value} />
          {next && <button type="button" disabled={append.pending.value} onClick={() => void append.run(async signal => {
            const page = await request(signal, next);
            if (!signal.aborted && load.value === request) {
              more.value = { request, items: (extra?.items ?? []).concat(page.items), next: page.next };
            }
          })}>{t('equipment.more')}</button>}
        </>;
      }} />
    </>;
  };
}, { props: ['search', 'setSearch', 'mode', 'open', 'add', 'epoch'] });

const DeviceSummary = defineComponent((props: { device: Device }) => {
  const { t } = useI18n();
  return () => {
    const { device } = props;
    return <small>{[t('equipment.values.' + device.equipment_type), device.product_name,
      device.archived_at_utc && t('equipment.values.archived')].filter(Boolean).join(' · ')}</small>;
  };
}, { props: ['device'] });

const TrainSummary = defineComponent((props: { train: Train }) => {
  const { t } = useI18n();
  return () => {
    const { train } = props;
    const { camera, primary_optics, accessories, filters, others } = train.summary;
    return <>
      {train.status === 'draft' && <small>{[!train.camera_id && t('equipment.missingCamera'), !train.primary_optics_id && t('equipment.missingOptics')].filter(Boolean).join(' · ')}</small>}
      <small>{[camera, primary_optics, ...accessories].filter(Boolean).join(' + ')}</small>
      {filters.length > 0 && <small>{t('equipment.fields.filter_ids')} · {filters.join(', ')}</small>}
      {others.length > 0 && <small>{t('equipment.fields.other_ids')} · {others.join(', ')}</small>}
    </>;
  };
}, { props: ['train'] });
