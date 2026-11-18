import { useId, useRef, useState, type FormEvent } from 'react';
import { app } from '../../host/comfy';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../api/client';
import { mutate, startOperation, type Mode, type Operation, type Storage, type Workspace } from '../../api/storage';
import type { Resource } from '../../shared/useResource';
import { bytes, OperationProgress, StorageError, useStorageAction } from '../storage/shared';

function ImportModeField({ mode, disabled, save }: { mode: Mode; disabled: boolean; save: (mode: Mode) => void }) {
  const { t } = useTranslation();
  return <section className="ap-storage-group"><fieldset className="ap-storage-radio-group" disabled={disabled}>
    <legend>{t('storage.importMode')}</legend>
    {(['reference', 'copy'] as const).map(value => <label key={value}>
      <input type="radio" name="astrophoto-import-mode" checked={mode === value} onChange={() => save(value)} />
      <span>{t('storage.' + value)}<small>{t('storage.' + value + 'Help')}</small></span>
    </label>)}
  </fieldset></section>;
}

function WorkspaceActions({ workspace: ws, busy, settingsRevision, onChange, onMigration }: {
  workspace: Workspace; busy: boolean; settingsRevision: number;
  onChange: (path: string, body: Record<string, unknown>, method?: string) => void;
  onMigration: (id: string, path: string, key: string) => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const actionsId = useId();
  const more = useRef<HTMLButtonElement>(null);
  const migrationKey = useRef<{ path: string; key: string }>();
  const base = '/storage/locations/' + encodeURIComponent(ws.id);
  const revision = { expected_revision: ws.revision };
  const migrating = ws.status === 'migrating';

  async function edit(action: 'rename' | 'relocate' | 'migrate') {
    const value = (await app.extensionManager.dialog.prompt({
      title: t('storage.' + action),
      message: t(action === 'rename' ? 'storage.name' : 'storage.path'),
      defaultValue: action === 'rename' ? ws.name : undefined,
    }))?.trim();
    if (!value) return;
    if (action === 'rename') onChange(base, { ...revision, name: value }, 'PATCH');
    if (action === 'relocate') onChange(base + '/relocate', { new_path: value });
    if (action === 'migrate') {
      if (migrationKey.current?.path !== value) {
        migrationKey.current = { path: value, key: crypto.randomUUID() };
      }
      onMigration(ws.id, value, migrationKey.current.key);
    }
  }

  async function remove() {
    const confirmed = await app.extensionManager.dialog.confirm({
      key: 'astrophoto.remove-workspace', type: 'delete', title: t('storage.remove'),
      message: t('storage.removeHelp'), itemList: [ws.name],
    });
    if (confirmed === true) onChange(base, revision, 'DELETE');
  }

  const actionButton = (label: string, disabled: boolean, handler: () => void) =>
    <button type="button" className="ap-storage-button" disabled={busy || disabled} onClick={handler}>{t('storage.' + label)}</button>;
  return <li className="ap-workspace-row" onKeyDown={event => {
    if (event.key === 'Escape' && expanded) {
      event.stopPropagation();
      setExpanded(false);
      more.current?.focus();
    }
  }}>
    <div className="ap-workspace-summary">
      <div className="ap-workspace-info">
        <div className="ap-storage-meta"><strong>{ws.name}</strong>
          {ws.is_default && <span className="ap-storage-badge">{t('storage.default')}</span>}
        </div>
        <p className="ap-storage-path">{ws.root_path}</p>
        <p className="ap-storage-meta"><span className="ap-storage-badge" data-state={ws.status}>{t('storage.states.' + ws.status)}</span>
          <small>{t('storage.free')} {bytes(ws.free_bytes)}</small>
        </p>
      </div>
      <button ref={more} type="button" className="ap-workspace-more" aria-expanded={expanded} aria-controls={actionsId}
        aria-label={t('storage.workspaceActions', { name: ws.name })} title={t('storage.workspaceActions', { name: ws.name })}
        onClick={() => setExpanded(!expanded)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
    </div>
    <div id={actionsId} className="ap-storage-actions" hidden={!expanded}>
      {actionButton('validate', migrating, () => onChange(base + '/validate', {}))}
      {actionButton('setDefault', ws.is_default || ws.status !== 'online', () => onChange(base, { expected_revision: settingsRevision, default: true }, 'PATCH'))}
      {actionButton(ws.enabled ? 'disable' : 'enable', (ws.enabled && ws.is_default) || migrating,
        () => onChange(base, { ...revision, enabled: !ws.enabled }, 'PATCH'))}
      {actionButton('rename', migrating, () => void edit('rename'))}
      {actionButton('relocate', !['offline', 'identity_mismatch', 'disabled'].includes(ws.status), () => void edit('relocate'))}
      {actionButton('migrate', ws.status !== 'online', () => void edit('migrate'))}
      {actionButton('remove', ws.is_default || migrating, () => void remove())}
    </div>
  </li>;
}

function CacheSettings({ storage, disabled, change, clear }: {
  storage: Storage; disabled: boolean;
  change: (path: string, body: Record<string, unknown>) => void; clear: () => void;
}) {
  const { t } = useTranslation();
  const [path, setPath] = useState(storage.cache.path);
  const [limit, setLimit] = useState(String(storage.cache.max_size_gb));
  const dirty = path.trim() !== storage.cache.path || Number(limit) !== storage.cache.max_size_gb;
  async function confirmClear() {
    const confirmed = await app.extensionManager.dialog.confirm({
      key: 'astrophoto.clear-cache', type: 'delete', title: t('storage.clear'),
      message: t('storage.confirmClear'), itemList: [storage.cache.path],
    });
    if (confirmed === true) clear();
  }
  return <section className="ap-storage-group">
    <div className="ap-storage-group-heading">
      <h3>{t('storage.cache')}</h3>
      <span className="ap-storage-badge" data-state={storage.cache.status}>{t('storage.states.' + storage.cache.status)}</span>
      <small>{t('storage.used')} {bytes(storage.cache.used_bytes)}</small>
    </div>
    <form onSubmit={event => {
      event.preventDefault();
      change('/storage/cache/configure', { path: path.trim(), max_size_gb: Number(limit), expected_revision: storage.imports.revision });
    }}>
      <fieldset className="ap-storage-fields" disabled={disabled}>
        <label>{t('storage.path')}<input required value={path} onChange={event => setPath(event.target.value)} /></label>
        <label>{t('storage.limit')}<input required type="number" step="any" min="0.001" max="100000" value={limit}
          onChange={event => setLimit(event.target.value)} /></label>
        <div className="ap-storage-actions">
          <button type="submit" className="ap-storage-button" data-variant="primary" disabled={!dirty}>{t('storage.save')}</button>
          <button type="button" className="ap-storage-button" disabled={storage.cache.status !== 'online'}
            onClick={() => void confirmClear()}>{t('storage.clear')}</button>
        </div>
      </fieldset>
    </form>
  </section>;
}

export function StoragePage({ resource, refresh }: { resource: Resource<Storage>; refresh: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [adding, setAdding] = useState(false);
  const addId = useId();
  const [job, setJob] = useState<Operation>();
  const [cleared, setCleared] = useState('');
  const [validated, setValidated] = useState('');
  const { pending, error, run } = useStorageAction();
  if (resource.state === 'error') return <><StorageError code={resource.error instanceof ApiError ? resource.error.code : 'network'} />
    <button type="button" className="ap-storage-button" onClick={refresh}>{t('actions.refresh')}</button></>;
  if (resource.state !== 'ready') return <p role="status">{t('states.loading')}</p>;
  const storage = resource.data;
  const disabled = pending || !storage.capabilities.write;
  const migration = job ?? storage.operations.find(op => op.kind === 'migration');
  const change = (path: string, body: Record<string, unknown>, method?: string) => void run(async signal => {
    const result = await mutate(path, body, signal, method);
    if (path.endsWith('/validate')) {
      if (typeof result.status !== 'string' || typeof result.name !== 'string') throw new ApiError('schema');
      setValidated(result.name + ' · ' + t('storage.states.' + result.status));
    }
    refresh();
  });
  function add(event: FormEvent) {
    event.preventDefault();
    void run(async signal => {
      await mutate('/storage/locations', { path: path.trim(), name: name.trim() }, signal);
      setName('');
      setPath('');
      setAdding(false);
      refresh();
    });
  }
  return <div className="ap-storage">
    <section className="ap-storage-group">
      <h3>{t('storage.dataRoot')}</h3>
      <p className="ap-storage-path">{storage.data_root.path}</p>
      <small>{t('storage.source.' + storage.data_root.source)} · {t('storage.db')} {storage.database.assets}</small>
    </section>
    {!storage.capabilities.write && <StorageError code="UNAUTHORIZED_STORAGE_OPERATION" />}
    {error && <StorageError code={error} />}
    <ImportModeField mode={storage.imports.default_mode} disabled={disabled} save={mode => change('/storage/settings',
      { expected_revision: storage.imports.revision, imports: { default_mode: mode } }, 'PATCH')} />
    <section className="ap-storage-group">
      <div className="ap-storage-group-heading">
        <h3>{t('storage.workspaces')}</h3>
        <button type="button" className="ap-storage-button ap-workspace-add" aria-expanded={adding} aria-controls={addId}
          disabled={disabled} onClick={() => setAdding(!adding)}>
          <span aria-hidden="true">{adding ? '−' : '+'}</span> {t('storage.add')}
        </button>
      </div>
      <form id={addId} onSubmit={add} hidden={!adding}>
        <fieldset className="ap-storage-fields" disabled={disabled}>
          <label>{t('storage.name')}<input required value={name} onChange={event => setName(event.target.value)} /></label>
          <label>{t('storage.path')}<input required value={path} onChange={event => setPath(event.target.value)} /></label>
          <div className="ap-storage-actions">
            <button type="submit" className="ap-storage-button" data-variant="primary">{t('storage.save')}</button>
          </div>
        </fieldset>
      </form>
      <ul className="ap-workspace-list">{storage.workspaces.map(ws => <WorkspaceActions key={ws.id} workspace={ws} busy={disabled}
        settingsRevision={storage.imports.revision} onChange={change} onMigration={(id, destination, key) => void run(async signal => {
          setJob(await startOperation('migration', { workspace_id: id, target_path: destination, idempotency_key: key }, signal));
        })} />)}</ul>
      {validated && <p role="status" className="ap-storage-result">{validated}</p>}
      {migration && <OperationProgress key={migration.operation_id} job={migration} onTerminal={job ? refresh : stableNoop} />}
    </section>
    <CacheSettings key={storage.cache.path + storage.cache.max_size_gb} storage={storage} disabled={disabled} change={change}
      clear={() => void run(async signal => {
        const result = await mutate('/storage/cache/clear', { scope: 'all' }, signal);
        if (typeof result.removed_bytes !== 'number' || typeof result.removed !== 'number' ||
            typeof result.skipped !== 'number' || typeof result.failed !== 'number') throw new ApiError('schema');
        setCleared(t('storage.clearResult', { size: bytes(result.removed_bytes), count: result.removed,
          skipped: result.skipped, failed: result.failed }));
        refresh();
      })} />
    {cleared && <p role="status" className="ap-storage-result">{cleared}</p>}
  </div>;
}

function stableNoop() {}

