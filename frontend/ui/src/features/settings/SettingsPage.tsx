import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { modules, type ModuleId, capabilityFor } from './moduleRegistry';
import type { AstroStatus } from '../../api/status';
import type { Resource } from '../../shared/useResource';
import { Feedback } from '../../shared/Feedback';
export function SettingsPage({ status, refresh }: { status: Resource<AstroStatus>; refresh: () => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ModuleId | null>(null);
  const availability = (id: ModuleId) => id === 'system' ? (status.state === 'ready' ? 'partial' : status.state) : 'planned';
  return <>
    <div hidden={selected !== null} className="ap-scroll">
      {modules.map(id => <button className="ap-module" key={id} onClick={() => setSelected(id)}>
        <strong>{t(`modules.${id}.title`)}</strong><small>{t(`modules.${id}.description`)}</small><small>{t(`states.${availability(id)}`)}</small>
      </button>)}
    </div>
    {selected && <div className="ap-scroll"><button onClick={() => setSelected(null)}>{t('actions.back')}</button>
      <h2>{t(`modules.${selected}.title`)}</h2><p>{t(`modules.${selected}.description`)}</p>
      <p>{t(`states.${availability(selected)}`)}</p>
      {selected !== 'system' && <p>{t(selected === 'agent' ? 'settings.agentNote' : 'settings.plannedNote')}</p>}
      {selected !== 'system' && capabilityFor[selected] && status.state === 'ready' &&
        <p>{t('settings.backendCapability')}: {capabilityFor[selected]} — {t(status.data.capabilities[capabilityFor[selected]!]?.available ? 'states.available' : 'states.unavailable')}</p>}
      {selected === 'system' && <><button onClick={refresh}>{t('actions.refresh')}</button>
        {status.state === 'error' && <Feedback error={status.error} retry={refresh} />}
        {status.state === 'loading' && <p role="status">{t('states.loading')}</p>}
        {status.state === 'ready' && <><dl>
          <div><dt>{t('settings.version')}</dt><dd>{status.data.extension.version}</dd></div>
          <div><dt>{t('settings.api')}</dt><dd>{status.data.api_version}</dd></div>
          <div><dt>{t('settings.status')}</dt><dd>{status.data.status}</dd></div>
          <div><dt>{t('settings.nodeRegistered')}</dt><dd>{t(status.data.runtime.node_registered ? 'states.available' : 'states.unavailable')}</dd></div>
        </dl><h3>{t('settings.capabilities')}</h3>
          {Object.entries(status.data.capabilities).map(([id, cap]) => <p key={id}><code>{id}</code> — {t(cap.available ? 'states.available' : 'states.unavailable')}{cap.reason && ` (${cap.reason})`}</p>)}
          <p>{t('settings.statusBoundary')}</p></>}
      </>}
    </div>}
  </>;
}
