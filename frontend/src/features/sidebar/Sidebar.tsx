import { defineComponent, nextTick, onScopeDispose, shallowRef } from 'vue';
import Button from '@comfyorg/design-system/button/Button';
import PopoverContent from '@comfyorg/design-system/popover/PopoverContent';
import TabList from '@comfyorg/design-system/tab/TabList';
import Tab from '@comfyorg/design-system/tab/Tab';
import { PopoverRoot, PopoverTrigger } from 'reka-ui';
import { useI18n } from 'vue-i18n';
import { NodesPage } from '../nodes/NodesPage';
import AssetsPanel from '../assets/AssetsPanel.vue';
import type { FrontendBundle } from '../../bundles/types';
import { SettingsPage } from './SettingsPage';
import { useResource } from '../../shared/useResource';
import { fetchNodes } from '../../api/nodes';
import { fetchStatus } from '../../api/status';
import { fetchStorage } from '../../api/storage';
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
        const canvasDetailsOpen = shallowRef(false);
        const equipmentGuard = shallowRef<(() => Promise<boolean>) | null>(null);
        let confirmationPending = false;
        let disposed = false;
        onScopeDispose(() => {
            disposed = true;
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
                                <PopoverRoot open={canvasDetailsOpen.value} onUpdate:open={(open: boolean) => { canvasDetailsOpen.value = open; }}>
                                    <PopoverTrigger asChild>
                                      <Button class="ap-native-button ap-canvas-details" {...{ type: 'button', title: t('canvasBridge.details') }} variant="muted-textonly" size="icon" aria-label={t('canvasBridge.details')}>
                                        <i class="icon-[lucide--info]" aria-hidden="true" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent class="ap-canvas-details-panel" align="end" sideOffset={4}>
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
                                    </PopoverContent>
                                </PopoverRoot>
                            </div>
                            <Button
                                class="ap-native-button ap-refresh-button"
                                {...{ type: 'button', title: refreshLabel, onClick: () => { canvasDetailsOpen.value = false; refreshNodes.value?.(); assetsPanel.value?.refresh(); refreshSettings.value?.(); } }}
                                variant="muted-textonly"
                                size="icon"
                                aria-label={refreshLabel}
                            >
                                <i class="icon-[lucide--refresh-cw]" aria-hidden="true" />
                            </Button>
                    </header>
                    <div class="ap-tab-scroll">
                        <TabList modelValue={active} onUpdate:modelValue={select} aria-label={t('nav.label')}>
                            {views.map((view) => (
                                <Tab key={view} value={view} class="ap-native-button"
                                    id={`ap-tab-${view}`} aria-controls={`ap-panel-${view}`}
                                    onClick={() => { if (view === active) void select(view); }}>
                                    {t('nav.' + view)}
                                </Tab>
                            ))}
                        </TabList>
                    </div>
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
