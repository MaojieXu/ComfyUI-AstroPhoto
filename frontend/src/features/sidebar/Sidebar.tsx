import { defineComponent, nextTick, onScopeDispose, shallowRef } from 'vue';
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
const views = ['nodes', 'assets', 'settings'] as const;
type View = (typeof views)[number];
type Props = { equipmentSession: EquipmentSession; bundles: readonly FrontendBundle[] };

export const Sidebar = defineComponent(
    (props: Props) => {
        const { t } = useI18n();
        const selected = shallowRef<View>(props.equipmentSession.current ? 'settings' : 'assets');
        const equipmentGuard = shallowRef<(() => Promise<boolean>) | null>(null);
        let confirmationPending = false;
        let disposed = false;
        onScopeDispose(() => { disposed = true; });
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
        const SettingsView = defineComponent(() => {
            const { resource: status, refresh: refreshStatus } = useResource(fetchStatus);
            const { resource: storage, refresh: refreshStorage } = useResource(fetchStorage, true);
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
            const refreshLabel = t('nodes.refresh');
            return (
                <>
                    <header>
                        <strong>{t('nav.title')}</strong>
                        {active === 'nodes' && (
                            <button
                                class="ap-refresh-button"
                                type="button"
                                onClick={() => refreshNodes.value?.()}
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
                        )}
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
