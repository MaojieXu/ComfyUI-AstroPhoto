import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { previewImport, startOperation, type Operation, type Preview, type Storage } from '../../api/storage';
import { bytes, StorageError, useStorageAction } from '../storage/shared';

export function ImportDialog({ storage, close, accepted }: {
  storage: Storage; close: () => void; accepted: (job: Operation) => void;
}) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const [sources, setSources] = useState('');
  const [override, setOverride] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [session, setSession] = useState('');
  const [preview, setPreview] = useState<Preview>();
  const [key, setKey] = useState('');
  const { pending, error, run } = useStorageAction();
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  const mode = override || storage.imports.default_mode;
  const input = {
    sources: sources.split(/\r?\n/).map(path => path.trim()).filter(Boolean),
    import_mode_override: mode,
    ...(mode === 'copy' ? { workspace_id: workspace || storage.default_workspace_id } : {}),
    ...(session.trim() ? { session_id: session.trim() } : {}),
  };
  function reset() {
    setPreview(undefined);
    setKey('');
  }
  return <dialog className="ap-storage ap-import-dialog" ref={dialog} aria-labelledby="ap-import-title"
    onCancel={event => { event.preventDefault(); close(); }}>
    <h2 id="ap-import-title">{t('assets.import')}</h2>
    <form onSubmit={event => {
      event.preventDefault();
      void run(async signal => {
        if (!preview) {
          setPreview(await previewImport(input, signal));
          setKey(crypto.randomUUID());
        } else {
          accepted(await startOperation('import', { ...input, idempotency_key: key }, signal));
          close();
        }
      });
    }}>
      <fieldset disabled={pending}>
        <label>{t('storage.sources')}<textarea required rows={4} value={sources}
          onChange={event => { setSources(event.target.value); reset(); }} /></label>
        <label>{t('storage.importMode')}<select value={override} onChange={event => { setOverride(event.target.value); reset(); }}>
          <option value="">{t('storage.useDefault')} · {t('storage.' + storage.imports.default_mode)}</option>
          <option value="reference">{t('storage.reference')}</option>
          <option value="copy">{t('storage.copy')}</option>
        </select></label>
        <label>{t('storage.session')}<input maxLength={120} value={session}
          onChange={event => { setSession(event.target.value); reset(); }} /></label>
        <p>{t('storage.' + mode + 'Help')}</p>
        {mode === 'copy' && <label>{t('storage.target')}<select value={workspace || storage.default_workspace_id}
          onChange={event => { setWorkspace(event.target.value); reset(); }}>
          {storage.workspaces.map(ws => <option key={ws.id} value={ws.id} disabled={ws.status !== 'online'}>{ws.name}</option>)}
        </select></label>}
      </fieldset>
      {preview && <p role="status">{t('storage.previewResult', { count: preview.file_count, failed: preview.failed })}
        {preview.effective_import_mode === 'copy' && <> · {t('storage.copySize')} {bytes(preview.size_bytes)} · {t('storage.free')} {bytes(preview.free_bytes)}</>}
      </p>}
      <button disabled={pending}>{t(preview ? 'storage.startImport' : 'storage.preview')}</button>
      <button type="button" onClick={close}>{t('storage.close')}</button>
    </form>
    {error && <StorageError code={error} />}
  </dialog>;
}

