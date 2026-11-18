import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../api/client';
import { getPreviewSettings, savePreviewSettings } from '../../api/previewSettings';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { Feedback } from '../../shared/Feedback';
import { useResource } from '../../shared/useResource';
import './environment.css';

export function EnvironmentPage({ onSaved }: { onSaved: () => void }) {
  const { t } = useTranslation();
  const id = useId();
  const { resource, refresh } = useResource(getPreviewSettings);
  const [saved, setSaved] = useState<Awaited<ReturnType<typeof getPreviewSettings>>>();
  const [draft, setDraft] = useState<number>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>();

  if (resource.state === 'loading') return <p role="status">{t('states.loading')}</p>;
  if (resource.state === 'error') return <Feedback error={resource.error} retry={refresh} />;

  const current = saved ?? resource.data;
  const edge = draft ?? current.longest_edge;
  const changed = edge !== current.longest_edge;
  const label = t('environment.previewResolution');
  const conflict = error instanceof ApiError && error.status === 409;

  async function save() {
    setError(undefined);
    setSaving(true);
    try {
      setSaved(await savePreviewSettings(edge, current.canvas, current.revision));
      setDraft(undefined);
      onSaved();
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  }

  return <form className="ap-environment" onSubmit={event => {
    event.preventDefault();
    if (changed && !saving && !conflict) void save();
  }}>
    <label htmlFor={id}>{label}</label>
    <ComfySingleSelect id={id} label={label} value={String(edge)} disabled={saving}
      options={current.options.map(value => ({ value: String(value), label: value === 0 ? t('environment.fullResolution') : t('environment.pixels', { value }) }))}
      onChange={value => { setDraft(Number(value)); if (!conflict) setError(undefined); }} />
    <small>{t('environment.previewResolutionHelp')}</small>
    <div className="ap-siril-actions">
      <button className="ap-storage-button" type="submit" disabled={saving || conflict || !changed}>
        {t(saving ? 'environment.saving' : 'storage.save')}
      </button>
    </div>
    {error !== undefined && (conflict
      ? <div role="alert">
        <p>{t('environment.conflict')}</p>
        <button className="ap-storage-button" type="button" onClick={() => {
          setSaved(undefined);
          setError(undefined);
          refresh();
        }}>{t('actions.refresh')}</button>
      </div>
      : <Feedback error={error} />)}
    {saved && !changed && !saving && error === undefined && <p role="status">{t('environment.saved')}</p>}
  </form>;
}
