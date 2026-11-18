import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clearSiril, discoverSiril, getSiril, saveSiril, setSirilEnabled, type Candidate, type SoftwareStatus } from '../../api/siril';
import { ApiError } from '../../api/client';
import { useResource } from '../../shared/useResource';

export function SoftwarePage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<'siril' | 'pixinsight'>();
  const { resource, refresh } = useResource(getSiril, true);
  const [status, setStatus] = useState<SoftwareStatus>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const running = useRef<AbortController>();
  useEffect(() => () => running.current?.abort(), []);
  const current = status ?? (resource.state === 'ready' ? resource.data : undefined);
  async function toggle(enabled: boolean) {
    const controller = new AbortController();
    running.current = controller;
    setBusy(true);
    setError(undefined);
    try { setStatus(await setSirilEnabled(enabled, controller.signal)); }
    catch (err) { if (!controller.signal.aborted) setError(err instanceof ApiError ? err.code : 'network'); }
    finally { if (!controller.signal.aborted) { setBusy(false); running.current = undefined; } }
  }
  if (selected) return <div className="ap-software">
    <button type="button" className="ap-settings-back" onClick={() => { setSelected(undefined); setStatus(undefined); refresh(); }}>{t('actions.back')}</button>
    {selected === 'siril' ? <SirilSettings /> : <section className="ap-software-section">
      <h3>PixInsight</h3>
      <p>{t('software.plannedDetails')}</p>
    </section>}
  </div>;
  return <div className="ap-software-list">
    {(['siril', 'pixinsight'] as const).map(id => <div className="ap-software-item" key={id}>
      <button type="button" className="ap-software-open" onClick={() => setSelected(id)}>
      <span className="ap-software-item-icon" aria-hidden="true"><i className="pi pi-desktop" /></span>
      <span className="ap-software-item-copy"><strong>{id === 'siril' ? 'Siril' : 'PixInsight'}</strong>
        <small>{t(id === 'siril' ? 'siril.purpose' : 'software.pixinsightPurpose')}</small>
        <small className="ap-software-status"><span className="ap-software-dot"
          data-state={id === 'pixinsight' ? 'planned' : !current ? 'unknown' : current.state === 'ready' ? 'ready' : 'error'} />
          {id === 'pixinsight' ? t('states.planned') : !current ? t(resource.state === 'error' ? 'siril.states.network' : 'states.loading') :
            current.state === 'ready' ? t('software.ready') : t('siril.states.' + current.state, { defaultValue: current.state })}</small></span>
      </button>
      <label className="ap-software-switch">
        <span className="ap-software-switch-label">{t('software.enabled')}</span>
        <input type="checkbox" role="switch" aria-label={t('software.enableNamed', { name: id === 'siril' ? 'Siril' : 'PixInsight' })}
          checked={id === 'siril' && Boolean(current?.enabled)} disabled={id !== 'siril' || busy || !current || (current.state !== 'ready' && !current.enabled)}
          onChange={event => void toggle(event.currentTarget.checked)} />
        <span className="ap-software-switch-track" aria-hidden="true"><span /></span>
      </label>
    </div>)}
    {error && <p role="alert">{t('siril.states.' + error, { defaultValue: t('errors.unknown') })}</p>}
  </div>;
}

function SirilSettings() {
  const { t } = useTranslation();
  const { resource, refresh } = useResource(getSiril, true);
  const [saved, setSaved] = useState<SoftwareStatus>();
  const [path, setPath] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ code: string; detected?: string }>();
  const running = useRef<AbortController>();
  useEffect(() => () => running.current?.abort(), []);
  const status = saved ?? (resource.state === 'ready' ? resource.data : undefined);
  const stateText = (state: string) => t('siril.states.' + state, { defaultValue: state });
  async function perform(action: (signal: AbortSignal) => Promise<void>) {
    running.current?.abort();
    const controller = new AbortController();
    running.current = controller;
    setError(undefined);
    setBusy(true);
    try { await action(controller.signal); }
    catch (err) {
      if (!controller.signal.aborted) {
        const detected = err instanceof ApiError ? err.details?.detected : undefined;
        setError({ code: err instanceof ApiError ? err.code : 'network', detected: typeof detected === 'string' ? detected : undefined });
      }
    }
    finally { if (running.current === controller) { running.current = undefined; setBusy(false); } }
  }
  return <>
    <div className="ap-software-title"><div><h3>Siril</h3><small>{t('siril.purpose')}</small></div>
      <span className="ap-software-version">1.4.5</span></div>
    <section className="ap-software-section">
    <p className="ap-software-status" role="status"><span className="ap-software-dot" data-ready={status?.state === 'ready'} />
      {status ? stateText(status.state) : t(resource.state === 'error' ? 'siril.states.network' : 'states.loading')}</p>
    {status?.path && <dl className="ap-software-metadata"><dt>{t('siril.activePath')}</dt><dd>{status.path}</dd>
      <dt>{t('siril.version')}</dt><dd>{status.version}</dd>
      <dt>{t('siril.verified')}</dt><dd>{status.verified_at ? new Date(status.verified_at).toLocaleString() : '—'}</dd></dl>}
    </section>
    <section className="ap-software-section ap-software-guide"><h3>{t('siril.install')}</h3>
      <p>{t('siril.install' + (status?.os === 'Windows' ? 'Windows' : status?.os === 'Darwin' ? 'Mac' : 'Linux'))}</p>
      <a href="https://siril.org/download/" target="_blank" rel="noreferrer">{t('siril.download')}</a>{' · '}
      <a href="https://siril.org/download/2026-10-28-siril-1-4-5/" target="_blank" rel="noreferrer">{t('siril.release')}</a>
    </section>
    <section className="ap-software-section">
    <div className="ap-siril-actions">
      <button className="ap-storage-button" type="button" disabled={busy} onClick={() => void perform(async signal => setCandidates(await discoverSiril(signal)))}>{t('siril.detect')}</button>
      <button className="ap-storage-button" type="button" disabled={busy} onClick={() => { setSaved(undefined); setCandidates(undefined); refresh(); }}>{t('actions.refresh')}</button>
    </div>
    {candidates && (candidates.length ? <ul className="ap-software-candidates">{candidates.map(row => <li key={row.path}>
      <button className="ap-storage-button" type="button" disabled={busy || row.state !== 'ready'} onClick={() => setPath(row.path)}>{t('siril.select')}</button>{' '}
      <code>{row.path}</code> · {row.origin} · {row.version ?? row.detected} · {stateText(row.state)}
    </li>)}</ul> : <p className="ap-software-muted">{t('software.noCandidates')}</p>)}
    </section>
    <section className="ap-software-section">
    <form onSubmit={event => { event.preventDefault(); void perform(async signal => setSaved(await saveSiril(path.trim() || status?.path || '', signal))); }}>
      <label>{t('siril.path')}<input value={path} onChange={event => setPath(event.target.value)} placeholder={status?.path} disabled={busy} /></label>
      <small>{t('siril.pathHelp')}</small>
      <div className="ap-siril-actions">
        <button className="ap-storage-button" data-variant="primary" disabled={busy || !(path.trim() || status?.path)}>{t('siril.save')}</button>
        {status?.path && <button className="ap-storage-button" type="button" disabled={busy} onClick={() => void perform(async signal => {
          setSaved(await clearSiril(signal)); setPath('');
        })}>{t('siril.clear')}</button>}
      </div>
    </form>
    {busy && <p role="status">{t('siril.verifying')}</p>}
    {error && <p role="alert">{stateText(error.code)}{error.detected && ` · ${t('siril.version')} ${error.detected}`}</p>}
    </section>
  </>;
}

