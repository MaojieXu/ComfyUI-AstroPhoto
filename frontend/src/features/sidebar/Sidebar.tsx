import { defineComponent, nextTick, onMounted, onScopeDispose, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { NodesPage } from '../nodes/NodesPage';
import AssetsPanel from '../assets/AssetsPanel.vue';
import type { FrontendBundle } from '../../bundles/types';
import { SettingsPage } from './SettingsPage';
import { useResource } from '../../shared/useResource';
import { fetchNodes } from '../../api/nodes';
import { fetchStatus } from '../../api/status';
import { fetchStorage } from '../../api/storage';
import { SidebarTabs } from '../../shared/SidebarTabs';
import type { EquipmentSession } from '../library/pages/EquipmentPage';
import type { ModuleId } from './moduleRegistry';
import TaskPanel from '../tasks/TaskPanel.vue';
import { canvasBridgeStatus } from '../../host/canvasBridge';
const views = ['nodes', 'assets', 'settings'] as const;
type View = (typeof views)[number];
type Props = { equipmentSession: EquipmentSession; bundles: readonly FrontendBundle[] };

export const Sidebar = defineComponent(
    (props: Props) => {
        const { t } = useI18n();
        const selected = shallowRef<View>(props.equipmentSession.current ? 'settings' : 'assets');
        const equipmentGuard = shallowRef<(() => Promise<boolean>) | null>(null);
        const canvasDetails = shallowRef<HTMLDetailsElement | null>(null);
        const closeCanvasDetailsOnOutside = (event: PointerEvent) => {
            const details = canvasDetails.value;
            if (details?.open && event.target instanceof Node && !details.contains(event.target)) details.open = false;
        };
        const closeCanvasDetailsOnEscape = (event: KeyboardEvent) => {
            const details = canvasDetails.value;
            if (event.key !== 'Escape' || !details?.open) return;
            event.preventDefault();
            event.stopPropagation();
            details.open = false;
            details.querySelector<HTMLElement>('summary')?.focus();
        };
        onMounted(() => {
            document.addEventListener('pointerdown', closeCanvasDetailsOnOutside, true);
            document.addEventListener('keydown', closeCanvasDetailsOnEscape, true);
        });
        let confirmationPending = false;
        let disposed = false;
        onScopeDispose(() => {
            disposed = true;
            document.removeEventListener('pointerdown', closeCanvasDetailsOnOutside, true);
            document.removeEventListener('keydown', closeCanvasDetailsOnEscape, true);
        });
        // Defer all domain requests until the corresponding view has been visited.
        const nodesVisited = shallowRef(false);
        const assetsVisited = shallowRef(selected.value === 'assets');
        const settingsVisited = shallowRef(selected.value === 'settings');
        const settingsModule = shallowRef<ModuleId | null>(props.equipmentSession.current ? 'equipment' : null);
        const nodesHome = shallowRef(0);
        const assetsPanel = shallowRef<InstanceType<typeof AssetsPanel> | null>(null);
        const NodesView = defineComponent(() => {
            const { resource, refresh } = useResource(fetchNodes);
            refreshNodes.value = refresh;
            return () => (
                <NodesPage active={selected.value === 'nodes'} resource={resource.value} refresh={refresh}
                    homeActivation={nodesHome.value} />
            );
        });
        const refreshNodes = shallowRef<() => void>();
        const refreshSettings = shallowRef<() => void>();
        const SettingsView = defineComponent(() => {
            const { resource: status, refresh: refreshStatus } = useResource(fetchStatus, true);
            const { resource: storage, refresh: refreshStorage } = useResource(fetchStorage, true);
            refreshSettings.value = () => { refreshStatus(); refreshStorage(); };
            return () => (
                <SettingsPage
                    equipmentGuard={equipmentGuard}
                    equipmentSession={props.equipmentSession}
                    bundles={props.bundles}
                    status={status.value}
                    refresh={refreshStatus}
                    storage={storage.value}
                    refreshStorage={refreshStorage}
                    selectedModule={settingsModule.value}
                    selectModule={(id) => { settingsModule.value = id; }}
                />
            );
        });
        async function select(view: View, module: ModuleId | null = null, preserveAssets = false) {
            const previous = selected.value;
            if (confirmationPending) return;
            const guard = previous === 'settings' ? equipmentGuard.value : null;
            confirmationPending = true;
            try {
                if (guard && !await guard()) return;
                if (disposed) return;
                if (view === 'assets' && assetsPanel.value && !preserveAssets) {
                    const home = assetsPanel.value.goHome();
                    if (home !== true && !await home) return;
                }
                if (disposed) return;
                if (view === 'nodes') {
                    nodesVisited.value = true;
                    nodesHome.value += 1;
                }
                if (view === 'assets') assetsVisited.value = true;
                if (view === 'settings') {
                    settingsVisited.value = true;
                    settingsModule.value = module;
                }
                selected.value = view;
            } finally {
                confirmationPending = false;
            }
        }
        return () => {
            const active = selected.value;
            const refreshLabel = t('actions.refresh');
            return (
                <>
                    <header class="ap-sidebar-header">
                        <div class="ap-sidebar-heading">
                            <strong>{t('nav.title')}</strong>
                        </div>
                            <div class="ap-agent-canvas-status">
                                <span class="ap-canvas-summary" role="status">{!canvasBridgeStatus.value.connected
                                    ? t('canvasBridge.disconnected')
                                    : !canvasBridgeStatus.value.scope ? t('canvasBridge.unavailable') : ''}</span>
                                <details ref={canvasDetails} class="ap-canvas-details">
                                    <summary aria-label={t('canvasBridge.details')} title={t('canvasBridge.details')}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                            <circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" />
                                        </svg>
                                    </summary>
                                    <div class="ap-canvas-details-panel">
                                        <div>{t(!canvasBridgeStatus.value.connected ? 'canvasBridge.disconnected'
                                            : canvasBridgeStatus.value.scope ? 'canvasBridge.connected' : 'canvasBridge.unavailable')}</div>
                                        {canvasBridgeStatus.value.connected && canvasBridgeStatus.value.scope && <div>{t('canvasBridge.target', {
                                            name: canvasBridgeStatus.value.workflow || t('canvasBridge.untitled'),
                                            scope: t('canvasBridge.' + canvasBridgeStatus.value.scope),
                                        })}</div>}
                                        {canvasBridgeStatus.value.connected && canvasBridgeStatus.value.scope &&
                                            (canvasBridgeStatus.value.modified || canvasBridgeStatus.value.editable === false) &&
                                            <div>{[
                                                canvasBridgeStatus.value.modified && t('canvasBridge.unsaved'),
                                                canvasBridgeStatus.value.editable === false && t('canvasBridge.readOnly'),
                                            ].filter(Boolean).join(' · ')}</div>}
                                    </div>
                                </details>
                            </div>
                            <button
                                class="ap-refresh-button"
                                type="button"
                                onClick={() => { refreshNodes.value?.(); assetsPanel.value?.refresh(); refreshSettings.value?.(); }}
                                aria-label={refreshLabel}
                                title={refreshLabel}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                    <path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                    <path d="M8 16H3v5" />
                                </svg>
                            </button>
                    </header>
                    <SidebarTabs
                        items={views}
                        active={active}
                        prefix="ap"
                        label={t('nav.label')}
                        title={(view) => t('nav.' + view)}
                        select={select}
                    />
                    {views.map((view) => (
                        <section
                            key={view}
                            id={`ap-panel-${view}`}
                            role="tabpanel"
                            aria-labelledby={`ap-tab-${view}`}
                            hidden={active !== view}
                        >
                            {view === 'nodes' ? (
                                nodesVisited.value && <NodesView />
                            ) : view === 'assets' ? (
                                assetsVisited.value && <AssetsPanel ref={assetsPanel} active={active === 'assets'}
                                    openStorage={() => { void select('settings', 'storage'); }} />
                            ) : (
                                settingsVisited.value && <SettingsView />
                            )}
                        </section>
                    ))}
                    <TaskPanel onResume={async (id: string) => {
                        await select('assets', null, true);
                        await nextTick();
                        if (!disposed && selected.value === 'assets') await assetsPanel.value?.openTaskImport(id);
                    }} />
                </>
            );
        };
    },
    { props: ['equipmentSession', 'bundles'] },
);
