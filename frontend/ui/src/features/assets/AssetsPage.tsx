import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchField } from '../../shared/SearchField';
import { SearchOptions } from '../../shared/SearchOptions';
import { useStoredChoice } from '../../shared/useStoredChoice';
import type { AstroStatus } from '../../api/status';
import type { Resource } from '../../shared/useResource';
import { useResource } from '../../shared/useResource';
import { Feedback } from '../../shared/Feedback';
import { fetchAssets, mutate, type Operation, type Storage } from '../../api/storage';
import { ImportDialog } from './ImportDialog';
import { bytes, OperationProgress, StorageError, useStorageAction } from '../storage/shared';

const frameTypes = ['all', 'light', 'dark', 'flat', 'bias', 'darkFlat'] as const;
const sortOrders = ['newest', 'oldest', 'name'] as const;

function AssetLibrary({ storage, refresh, query, order }: {
  storage: Storage; refresh: () => void; query: string; order: typeof sortOrders[number];
}) {
  const { t } = useTranslation();
  const { resource, refresh: reload } = useResource(fetchAssets);
  const [dialog, setDialog] = useState(false);
  const [job, setJob] = useState<Operation>();
  const [relocate, setRelocate] = useState('');
  const [path, setPath] = useState('');
  const { pending, error, run } = useStorageAction();
  const finished = useCallback(() => { reload(); refresh(); }, [reload, refresh]);
  const operation = job ?? storage.operations.find(op => op.kind === 'import');
  const assets = resource.state === 'ready' ? resource.data : [];
  const sessions = [...new Set(assets.flatMap(asset => asset.session_ids))];
  const visible = assets.filter(asset => asset.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  visible.sort((left, right) => {
    if (order === 'name') return left.name.localeCompare(right.name);
    const difference = order === 'newest' ? BigInt(right.mtime_ns) - BigInt(left.mtime_ns) : BigInt(left.mtime_ns) - BigInt(right.mtime_ns);
    return difference < 0n ? -1 : difference > 0n ? 1 : 0;
  });
  return <>
    <button disabled={!storage.capabilities.import} onClick={() => setDialog(true)}>{t('assets.import')}</button>
    {!storage.capabilities.import && <p>{t('storage.errors.SOURCE_NOT_AUTHORIZED')}</p>}
    {dialog && <ImportDialog storage={storage} close={() => setDialog(false)} accepted={setJob} />}
    {operation && <OperationProgress key={operation.operation_id} job={operation} onTerminal={job ? finished : reload} />}
    {resource.state === 'error' && <Feedback error={resource.error} retry={reload} />}
    {resource.state === 'loading' && <p role="status">{t('states.loading')}</p>}
    {resource.state === 'ready' && <>
      <h2>{t('assets.sessions')}</h2>
      {sessions.length ? <ul>{sessions.map(session => <li key={session}>{session}</li>)}</ul> : <p>{t('assets.noSessions')}</p>}
      <h2>{t('assets.library')}</h2>
      {!visible.length && <p>{t('storage.emptyAssets')}</p>}
      <ul>{visible.map(asset => <li className="ap-storage-card" key={asset.id}>
        <strong>{asset.name}</strong>
        <p>{t('storage.' + asset.storage_mode)} · {bytes(asset.size_bytes)}</p>
        {storage.capabilities.import && asset.storage_mode === 'external_reference' && <button
          onClick={() => { setRelocate(asset.id); setPath(''); }}>{t('storage.relocate')}</button>}
        {relocate === asset.id && <form onSubmit={event => {
          event.preventDefault();
          void run(async signal => {
            await mutate('/assets/' + encodeURIComponent(asset.id) + '/relocate', { new_path: path.trim() }, signal);
            setRelocate('');
            reload();
          });
        }}>
          <label>{t('storage.path')}<input required value={path} onChange={event => setPath(event.target.value)} /></label>
          <button disabled={pending}>{t('storage.save')}</button>
          <button type="button" onClick={() => setRelocate('')}>{t('storage.close')}</button>
        </form>}
      </li>)}</ul>
    </>}
    {error && <StorageError code={error} />}
  </>;
}

export function AssetsPage({ status, refresh, storage, refreshStorage }: {
  status: Resource<AstroStatus>; refresh: () => void; storage: Resource<Storage>; refreshStorage: () => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [frame, setFrame] = useState<typeof frameTypes[number]>('all');
  const [order, setOrder] = useStoredChoice('AstroPhoto.Assets.Sort', sortOrders);
  return <>
    <div className="ap-search-toolbar">
      <SearchField label={t('assets.search')} clearLabel={t('browse.clear')} onSearch={setQuery} />
      {storage.state !== 'ready' &&
        <SearchOptions icon="filter" label={t('assets.frameType')} options={frameTypes.map(value => ({
          id: value, label: t(`assets.${value}`), checked: frame === value, select: () => setFrame(value)
        }))} />}
        <SearchOptions icon="sort" label={t('browse.sort')} options={sortOrders.map(value => ({
          id: value, label: t(`browse.${value}`), checked: order === value, select: () => setOrder(value)
        }))} />
    </div>
    <div className="ap-scroll ap-storage">
      {storage.state === 'ready' ? <AssetLibrary storage={storage.data} refresh={refreshStorage} query={query} order={order} /> : <>
        <button disabled aria-describedby="ap-asset-reason">{t('assets.import')}</button>
        {storage.state === 'loading' && <p role="status">{t('states.loading')}</p>}
        {status.state === 'error' && <Feedback error={status.error} retry={refresh} />}
        {status.state === 'ready' && !status.data.capabilities.assets?.available && <p id="ap-asset-reason">{t('assets.serviceMissing')}</p>}
        {storage.state === 'error' && status.state === 'ready' && status.data.capabilities.assets?.available &&
          <Feedback error={storage.error} retry={refreshStorage} />}
      </>}
    </div>
  </>;
}
