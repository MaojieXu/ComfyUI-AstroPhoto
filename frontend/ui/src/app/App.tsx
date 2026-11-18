import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NodesPage } from '../features/nodes/NodesPage';
import { AssetsPage } from '../features/assets/AssetsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { useResource } from '../shared/useResource';
import { fetchNodes } from '../api/nodes';
import { fetchStatus } from '../api/status';
import { fetchStorage } from '../api/storage';
import { SidebarTabs } from '../shared/SidebarTabs';
import type { EquipmentSession } from '../features/settings/equipment/EquipmentPage';
const views = ['nodes', 'assets', 'settings'] as const;
type View = typeof views[number];
const defaultSession: EquipmentSession = {};
export function App({ equipmentSession = defaultSession }: { equipmentSession?: EquipmentSession } = {}) {
  const { t } = useTranslation();
  const [active, setActive] = useState<View>(() => equipmentSession.current ? 'settings' : 'assets');
  const equipmentGuard = useRef<(() => Promise<boolean>) | null>(null);
  const { resource: nodes, refresh: refreshNodes } = useResource(fetchNodes);
  const { resource: status, refresh: refreshStatus } = useResource(fetchStatus);
  const { resource: storage, refresh: refreshStorage } = useResource(fetchStorage, true);
  const refreshLabel = t(active === 'nodes' ? 'nodes.refresh' : 'assets.refreshStatus');
  return <>
    <header>
      <strong>{t('nav.title')}</strong>
      {active !== 'settings' && <button className="ap-refresh-button" type="button"
        onClick={active === 'nodes' ? refreshNodes : () => { refreshStatus(); refreshStorage(); }} aria-label={refreshLabel} title={refreshLabel}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      </button>}
    </header>
    <SidebarTabs items={views} active={active} prefix="ap" label={t('nav.label')} title={view => t('nav.' + view)}
      select={view => { void (async () => {
        if (view === active || (active === 'settings' && equipmentGuard.current && !await equipmentGuard.current())) return;
        setActive(view);
      })(); }} />
    {views.map(view => <section key={view} id={`ap-panel-${view}`} role="tabpanel" aria-labelledby={`ap-tab-${view}`} hidden={active !== view}>
      {view === 'nodes' ? <NodesPage active={active === 'nodes'} resource={nodes} refresh={refreshNodes} /> : view === 'assets' ? <AssetsPage status={status} refresh={refreshStatus} storage={storage} refreshStorage={refreshStorage} /> : <SettingsPage equipmentGuard={equipmentGuard} equipmentSession={equipmentSession} status={status} refresh={refreshStatus} storage={storage} refreshStorage={refreshStorage} />}
    </section>)}
  </>;
}
