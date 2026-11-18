import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { modules, type ModuleId, capabilityFor } from './moduleRegistry';
import type { AstroStatus } from '../../api/status';
import type { Resource } from '../../shared/useResource';
import { Feedback } from '../../shared/Feedback';
import { StoragePage } from './StoragePage';
import { SoftwarePage } from './SoftwarePage';
import { EnvironmentPage } from './EnvironmentPage';
import { EquipmentPage, type EquipmentSession, type LeaveGuard } from './equipment/EquipmentPage';
import type { Storage } from '../../api/storage';
export function SettingsPage({ status, refresh, storage, refreshStorage, equipmentGuard, equipmentSession }: { status: Resource<AstroStatus>; refresh: () => void;
  storage: Resource<Storage>; refreshStorage: () => void; equipmentGuard: LeaveGuard; equipmentSession: EquipmentSession }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<ModuleId | null>(() => equipmentSession.current ? "equipment" : null);
  const availability = (id: ModuleId) => {
    if (id === 'storage' || id === 'environment') return storage.state === 'ready' ? 'available' : 'unavailable';
    if (id === 'software') return status.state === 'ready' && status.data.capabilities.software?.available ? 'available' : 'unavailable';
    if (id === 'equipment') return status.state === 'ready' && status.data.capabilities.equipment?.available ? 'available' : 'unavailable';
    if (id === 'system') return status.state === 'ready' ? 'partial' : status.state;
    return 'planned';
  };
  return <>
    <div hidden={selected !== null} className="ap-scroll">
      {modules.map(id => <button className="ap-module" key={id} onClick={() => setSelected(id)}>
        <strong>{t(`modules.${id}.title`)}</strong><small>{t(`modules.${id}.description`)}</small><small>{t(`states.${availability(id)}`)}</small>
      </button>)}
    </div>
    {selected === 'equipment' && (status.state === 'ready' && status.data.capabilities.equipment?.available ?
      <EquipmentPage guard={equipmentGuard} session={equipmentSession} trainAvailable={Boolean(status.data.capabilities.optical_trains?.available)}
        onBack={() => setSelected(null)} /> :
      <div className="ap-scroll"><button type="button" onClick={() => setSelected(null)}>{t('actions.back')}</button>
        <h2>{t('modules.equipment.title')}</h2>
        {status.state === 'error' ? <Feedback error={status.error} retry={refresh} /> :
          <p role="status">{t(status.state === 'loading' ? 'states.loading' : 'equipment.unavailable')}
            {status.state === 'ready' && status.data.capabilities.equipment?.reason && <> · <code>{status.data.capabilities.equipment.reason}</code></>}</p>}
        <button type="button" onClick={refresh}>{t('actions.refresh')}</button>
      </div>)}
    {selected && selected !== 'equipment' && <div className={selected === 'storage' ? 'ap-scroll ap-storage-detail' : 'ap-scroll'}>
      <button type="button" className="ap-settings-back" onClick={() => setSelected(null)}>{t('actions.back')}</button>
      <h2>{t(`modules.${selected}.title`)}</h2>
      {selected !== 'storage' && selected !== 'software' && selected !== 'environment' && <><p>{t(`modules.${selected}.description`)}</p><p>{t(`states.${availability(selected)}`)}</p></>}
      {selected === 'storage' && <StoragePage resource={storage} refresh={refreshStorage} />}
      {selected === 'software' && <SoftwarePage />}
      {selected === 'environment' && <EnvironmentPage onSaved={refreshStorage} />}
      {selected !== 'system' && selected !== 'storage' && selected !== 'software' && selected !== 'environment' && <p>{t(selected === 'agent' ? 'settings.agentNote' : 'settings.plannedNote')}</p>}
      {selected !== 'system' && selected !== 'software' && capabilityFor[selected] && status.state === 'ready' &&
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
