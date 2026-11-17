import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NodesPage } from '../features/nodes/NodesPage';
import { AssetsPage } from '../features/assets/AssetsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { useResource } from '../shared/useResource';
import { fetchNodes } from '../api/nodes';
import { fetchStatus } from '../api/status';
const views = ['nodes', 'assets', 'settings'] as const;
type View = typeof views[number];
export function App() {
  const { t } = useTranslation();
  const [active, setActive] = useState<View>('assets');
  const { resource: nodes, refresh: refreshNodes } = useResource(fetchNodes);
  const { resource: status, refresh: refreshStatus } = useResource(fetchStatus);
  const refreshLabel = t(active === 'nodes' ? 'nodes.refresh' : 'assets.refreshStatus');
  return <>
    <header>
      <strong>{t('nav.title')}</strong>
      {active !== 'settings' && <button className="ap-refresh-button" type="button"
        onClick={active === 'nodes' ? refreshNodes : refreshStatus} aria-label={refreshLabel} title={refreshLabel}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      </button>}
    </header>
    {/* Media assets tab layout and keyboard behavior from ComfyUI Frontend v1.59.1. */}
    <div className="ap-tab-scroll">
      <div className="ap-tabs" role="tablist" aria-label={t('nav.label')}>
        {views.map((view, index) => {
          const selected = view === active;
          return <button key={view} id={`ap-tab-${view}`} type="button" role="tab"
            aria-selected={selected} aria-controls={`ap-panel-${view}`}
            data-state={selected ? 'active' : 'inactive'} tabIndex={selected ? 0 : -1}
            onClick={() => setActive(view)} onKeyDown={event => {
              let next: number;
              switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                  next = (index + 1) % views.length;
                  break;
                case 'ArrowLeft':
                case 'ArrowUp':
                  next = (index - 1 + views.length) % views.length;
                  break;
                case 'Home':
                  next = 0;
                  break;
                case 'End':
                  next = views.length - 1;
                  break;
                default:
                  return;
              }
              event.preventDefault();
              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
            }}>{t(`nav.${view}`)}</button>;
        })}
      </div>
    </div>
    {views.map(view => <section key={view} id={`ap-panel-${view}`} role="tabpanel" aria-labelledby={`ap-tab-${view}`} hidden={active !== view}>
      {view === 'nodes' ? <NodesPage active={active === 'nodes'} resource={nodes} refresh={refreshNodes} /> : view === 'assets' ? <AssetsPage status={status} refresh={refreshStatus} /> : <SettingsPage status={status} refresh={refreshStatus} />}
    </section>)}
  </>;
}
