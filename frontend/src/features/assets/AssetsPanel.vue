<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { allDocuments, listCollectionAssets, listDocuments, type Asset } from '../../api/assets';
import { ApiError, getJson, requestJson } from '../../api/client';
import { fetchStorage } from '../../api/storage';
import { app } from '../../host/comfy';
import { notifyHost } from '../../host/notify';
import { createCanvasNode } from '../../host/canvas';
import { attachCanvasDrop } from '../../host/dragDrop';
import { useResource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import { SidebarTabs } from '../../shared/SidebarTabs';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import { useMutation } from '../library/components/useMutation';
import AssetEditor from './AssetEditor.vue';
import LibraryError from './LibraryError.vue';
import ImportAssets from './ImportAssets.vue';
import CatalogDetails from './CatalogDetails.vue';
import CatalogProjects from './CatalogProjects.vue';
import AssetFilterPopover from './AssetFilterPopover.vue';
import { facetGroups, matchesFacet, type FacetRecord } from './assetFacets';
import './assets.css';

const props = defineProps<{ active: boolean; openStorage: () => void }>();
const { t } = useI18n();
const tabs = ['allAssets', 'projects'] as const;
type Tab = typeof tabs[number];
type Resource = { asset: Asset } | { collectionId: string };
type Form = { kind: 'import'; resumeTaskId?: string } |
  { kind: 'asset'; asset: Asset } | { kind: 'detail'; asset: Asset };
const tab = ref<Tab>('allAssets');
const queryText = ref('');
const query = ref('');
const selectedImportGroup = ref('');
const groupFramesExpanded = ref(false);
const filters = ref<Record<string, string[]>>({});
const { resource: importStorage, refresh: refreshImportStorage } = useResource(fetchStorage);
const form = shallowRef<Form>();
const heading = ref<HTMLElement>();
const assetEditor = ref<InstanceType<typeof AssetEditor>>();
const catalogDetails = ref<InstanceType<typeof CatalogDetails>>();
const groupDetails = ref<InstanceType<typeof CatalogDetails>>();
const importEditor = ref<InstanceType<typeof ImportAssets>>();
function closeAssetMenu(event: Event) {
  const target = event.target;
  if (!(target instanceof Element) || !target.closest('.ap-asset-actions')) menu.value = '';
}
function closeMenusOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  menu.value = '';
}
onMounted(() => {
  document.addEventListener('pointerdown', closeAssetMenu, true);
  document.addEventListener('contextmenu', closeAssetMenu, true);
  document.addEventListener('keydown', closeMenusOnEscape, true);
});
onScopeDispose(() => {
  document.removeEventListener('pointerdown', closeAssetMenu, true);
  document.removeEventListener('contextmenu', closeAssetMenu, true);
  document.removeEventListener('keydown', closeMenusOnEscape, true);
});
const notice = ref('');
function showNotice(message: string) {
  if (message === t('assetLibrary.saved') || message === t('assetLibrary.canvasBound')) {
    if (notifyHost('success', message)) { notice.value = ''; return; }
  }
  notifyHost('info', message);
  notice.value = message;
}
const canvasNotified = ref(false);
function errorMessage(error: unknown) {
  const code = error instanceof ApiError ? error.code : error instanceof Error ? error.message : 'network';
  return t('assetLibrary.errors.' + code, t('storage.errors.' + code, t('errors.' + code, t('errors.unknown'))));
}
const menu = ref('');
let trigger: HTMLElement | null = null;
let drag: { resource: Resource } | undefined;
const draggedId = ref('');

const { resource: importGroups, refresh: refreshImportGroups } = useResource(
  (signal: AbortSignal) => allDocuments('import-groups', {}, signal), true);
const browseGroups = computed(() => !selectedImportGroup.value);
const groupRows = computed(() => importGroups.value.state === 'ready' ? importGroups.value.data : []);
const matchingGroups = computed(() => groupRows.value.filter(row => row.name.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase()) && matchesFilters(row.id)));
const openGroup = computed(() => groupRows.value.find(row => row.id === selectedImportGroup.value));
watch(importGroups, result => {
  if (result.state === 'ready' && selectedImportGroup.value && !openGroup.value) selectedImportGroup.value = '';
});
watch(selectedImportGroup, () => { groupFramesExpanded.value = false; });
const options = computed(() => ({
  q: query.value.trim(),
  import_group_id: selectedImportGroup.value || (browseGroups.value ? 'ungrouped' : undefined),
  sort: selectedImportGroup.value ? 'import_index' : 'name',
}));
const loadAssets = computed(() => {
  const current = options.value;
  const group = selectedImportGroup.value;
  const expanded = groupFramesExpanded.value;
  return async (signal: AbortSignal) => {
    if (!group) return { items: await allDocuments('assets', current, signal), next: null };
    if (!expanded) return { items: [], next: null };
    return current.q ? listDocuments('assets', current, signal) : listCollectionAssets(group, undefined, signal);
  };
});
const { resource: results, refresh: refreshAssets } = useResource(loadAssets);
const visibleAssets = shallowRef<Asset[]>([]);
const cursor = ref<string | null>(null);
const { run: runPage, error: pageError, pending: pagePending } = useMutation();
const { run: runRemoveFrame, error: removeFrameError, pending: removeFramePending } = useMutation();
const { run: runFilterLoad, error: filterError, pending: filterPending } = useMutation();
const facetRows = shallowRef<FacetRecord[]>([]);
const filteredAssets = computed(() => selectedImportGroup.value ? visibleAssets.value : visibleAssets.value.filter(row => matchesFilters(row.id)));
const canvasError = shallowRef<unknown>();
watch(canvasError, error => { canvasNotified.value = !!error && notifyHost('error', errorMessage(error)); });
watch(results, value => {
  if (value.state !== 'ready') return;
  visibleAssets.value = value.data.items;
  cursor.value = value.data.next;
});
function loadMore() {
  const after = cursor.value;
  const current = options.value;
  if (!after) return;
  void runPage(async signal => {
    const group = selectedImportGroup.value;
    const page = group && !current.q ? await listCollectionAssets(group, after, signal)
      : await listDocuments('assets', { ...current, after }, signal);
    if (signal.aborted || current !== options.value) return;
    if (page.next === after) throw new ApiError('schema');
    visibleAssets.value = [...visibleAssets.value, ...page.items];
    cursor.value = page.next;
  });
}

function clearFilters() {
  filters.value = {};
  selectedImportGroup.value = '';
}
function changeFilter(key: string, value: string) {
  const current = filters.value[key] || [];
  filters.value = { ...filters.value, [key]: current.includes(value) ? current.filter(item => item !== value) : [...current, value] };
}
async function selectTab(value: Tab) {
  if (groupDetails.value && !await groupDetails.value.requestClose()) return;
  tab.value = value;
}
watch(() => props.active, active => {
  if (!active) cancelDrag();
  else refreshImportStorage();
});
function reload() {
  refreshAssets();
  refreshImportGroups();
  if (Object.values(filters.value).some(values => values.length)) openFilters(true);
}
function detailChanged(name: string) {
  if (form.value?.kind === 'detail') form.value = { ...form.value, asset: { ...form.value.asset, name } };
  reload();
}
function removeFrame(asset: Asset) {
  const group = openGroup.value;
  if (!group || group.id !== asset.import_group_id) return;
  void runRemoveFrame(async signal => {
    const path = '/astrophoto/v1/catalog/subframe_collection/' + encodeURIComponent(group.id) + '/files/' + encodeURIComponent(asset.id);
    try {
      await requestJson(path, 'DELETE', { revision: group.revision }, signal);
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === 'REVISION_CONFLICT') reload();
      throw cause;
    }
    menu.value = '';
    reload();
    showNotice(t('assetLibrary.saved'));
  });
}
async function open(dialog: Form) {
  if (form.value) return;
  trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  form.value = dialog;
  menu.value = '';
  await nextTick();
  heading.value?.focus();
}
async function openImport() {
  await open({ kind: 'import' });
}
async function close() {
  const restoreFocus = heading.value?.closest('[role="region"]')?.contains(document.activeElement);
  form.value = undefined;
  await nextTick();
  if (restoreFocus && trigger?.isConnected) trigger.focus();
  trigger = null;
}
async function requestClose() {
  if (assetEditor.value) await assetEditor.value.discardDraft();
  else if (importEditor.value) await importEditor.value.discardDraft();
  else if (catalogDetails.value && !await catalogDetails.value.requestClose()) return;
  else await close();
  if (catalogDetails.value) await close();
}
async function closeGroup() { if (!groupDetails.value || await groupDetails.value.requestClose()) selectedImportGroup.value = ''; }
function finishHome() {
  if (form.value) return false;
  selectTab('allAssets');
  return true;
}
function goHome(): boolean | Promise<boolean> {
  if (form.value) return requestClose().then(finishHome);
  if (groupDetails.value) return groupDetails.value.requestClose().then(ok => ok ? finishHome() : false);
  return finishHome();
}
async function openTaskImport(id: string) {
  if (form.value?.kind === 'import' && importEditor.value?.hasTask(id)) return;
  if (form.value) await requestClose();
  if (!form.value) await open({ kind: 'import', resumeTaskId: id });
}
defineExpose({ goHome, openTaskImport, refresh: reload });
const editorTitle = computed(() => {
  const current = form.value;
  if (!current) return '';
  if (current.kind === 'asset' || current.kind === 'detail') return current.asset.name;
  return t('assetLibrary.importAssets');
});
const sourceNode = (item: Resource) => 'asset' in item ? 'AstroPhotoAssetSource' : 'AstroPhotoCollectionSource';
const canvas = attachCanvasDrop(
  id => !!drag?.resource && props.active && !form.value && sourceNode(drag.resource) === id,
  error => { canvasError.value = error; if (!error) showNotice(t('assetLibrary.canvasBound')); },
  (_id, point) => { if (drag?.resource) bindCanvas(drag.resource, point); },
);
onScopeDispose(canvas.dispose);
function bindCanvas(resource: Resource, point?: [number, number]) {
  const field = 'asset' in resource ? 'asset_id' : 'collection_id';
  if ('asset' in resource && !resource.asset.available) throw new ApiError('ASSET_OFFLINE');
  createCanvasNode(sourceNode(resource), point, app, undefined, node => {
    const input = node.widgets?.find(widget => widget.name === field);
    if (!input) throw new ApiError('CANVAS_UNSUPPORTED');
    input.value = 'asset' in resource ? resource.asset.id : resource.collectionId;
  });
}
function addSource(resource: Resource) {
  canvasError.value = undefined;
  menu.value = '';
  try {
    bindCanvas(resource);
    showNotice(t('assetLibrary.canvasBound'));
  } catch (cause) { canvasError.value = cause; }
}
function startDrag(event: DragEvent, resource: Resource) {
  if (!event.dataTransfer || form.value) { event.preventDefault(); return; }
  cancelDrag();
  drag = { resource };
  draggedId.value = 'asset' in resource ? resource.asset.id : resource.collectionId;
  canvas.start(event.dataTransfer, sourceNode(resource));
}
function cancelDrag() {
  canvas.cancel();
  drag = undefined;
  draggedId.value = '';
}
const facetWorkspaces = computed(() => importStorage.value.state === 'ready' ? importStorage.value.data.workspaces : []);
function matchesFilters(id: string) {
  if (!Object.values(filters.value).some(values => values.length)) return true;
  const row = facetRows.value.find(item => item.id === id);
  return !!row && matchesFacet(row, query.value, filters.value, t, facetWorkspaces.value);
}
const availableFilters = computed(() => facetGroups(facetRows.value, query.value, filters.value, t, facetWorkspaces.value));
function openFilters(open: boolean) {
  if (open) void runFilterLoad(async signal => {
    const rows: FacetRecord[] = []; let after = '';
    do {
      const page = await getJson('/astrophoto/v1/catalog/assets?after=' + encodeURIComponent(after), signal) as { items: FacetRecord[]; next: string | null };
      rows.push(...page.items); after = page.next || '';
    } while (after);
    facetRows.value = rows;
  });
}
function assetType(asset: Asset) {
  if (asset.import_group_id) return t('assetLibrary.subframes');
  if (asset.catalog_kind === 'videos' || asset.attributes.file_kind === 'video') return t('assetLibrary.importTypes.video');
  if (asset.attributes.role === 'master_frame' || asset.attributes.role === 'calibration_master' || asset.catalog_kind === 'calibration_masters') return t('assetLibrary.importTypes.master_frame');
  if (asset.attributes.role === 'processed') return t('assetLibrary.importTypes.image_result');
  return t('assetLibrary.values.unknown');
}
</script>

<template>
  <div class="ap-assets-panel" @keydown.esc.stop="form && requestClose()">
    <div v-if="form" class="ap-assets-editor ap-scroll" role="region" aria-labelledby="ap-assets-editor-title">
      <div class="ap-assets-toolbar">
        <button type="button" @click="requestClose">{{ t('actions.back') }}</button>
        <h2 id="ap-assets-editor-title" ref="heading" tabindex="-1" :class="{ 'ap-catalog-hidden-title': form.kind === 'detail' && !form.asset.import_group_id }">{{ editorTitle }}</h2>
      </div>
      <ImportAssets v-if="form.kind === 'import'" ref="importEditor" :active="active" :resume-task-id="form.resumeTaskId"
        @changed="reload()" @close="close" />
      <CatalogDetails v-else-if="form.kind === 'detail'" ref="catalogDetails" :asset="form.asset" @group="selectedImportGroup = $event; close()" @changed="detailChanged" @removed="reload(); close()" @source="addSource({ asset: form.asset })" />
      <AssetEditor v-else-if="form.kind === 'asset'" ref="assetEditor"
        :asset="form.asset"
        @changed="reload" @notice="showNotice($event)" @close="close" />
    </div>

    <SidebarTabs v-show="!form" :items="tabs" :active="tab" prefix="ap-asset"
      :label="t('nav.assets')" :title="value => t('assetLibrary.' + value)" :select="selectTab" />

    <p v-if="notice" class="ap-assets-notice" role="status">{{ notice }}</p>
    <LibraryError v-if="canvasError && !canvasNotified" :error="canvasError" />

    <section v-show="!form && tab === 'projects'" id="ap-asset-panel-projects" class="ap-assets-view ap-scroll"
      role="tabpanel" aria-labelledby="ap-asset-tab-projects">
      <CatalogProjects v-if="tab === 'projects'" @source="addSource" />
    </section>

    <section v-show="!form && tab === 'allAssets'" id="ap-asset-panel-allAssets" class="ap-assets-view ap-scroll"
      role="tabpanel" aria-labelledby="ap-asset-tab-allAssets">
      <div v-show="!groupDetails?.editing" class="ap-assets-search-row">
        <SearchField :label="t('assetLibrary.searchAssets')" :clear-label="t('browse.clear')" :value="queryText"
          @value-change="queryText = $event" @search="query = $event" />
        <!-- Adapted from ComfyUI Frontend v1.59.6 MediaAssetFilterBar. -->
        <AssetFilterPopover :filters="filters" :groups="availableFilters" :pending="filterPending" :error="filterError" @open="openFilters" @change="changeFilter" @clear="clearFilters" />
        <button class="ap-assets-import-button" type="button" :aria-label="t('assetLibrary.importAssets')" :disabled="importStorage.state === 'loading'" @click="openImport()">{{ t('assetLibrary.importNow') }}</button>
      </div>
      <div v-if="selectedImportGroup" class="ap-assets-toolbar">
        <button type="button" @click="closeGroup">{{ t('actions.back') }}</button>
      </div>
      <CatalogDetails v-if="openGroup" :key="openGroup.id + '-' + openGroup.count" ref="groupDetails" :group-id="openGroup.id" @changed="reload" @removed="selectedImportGroup = ''; reload()" @source="addSource({ collectionId: openGroup.id })" />
      <button v-if="openGroup && !groupDetails?.editing" type="button" class="ap-detail-toggle ap-tree-row ap-tree-folder ap-frame-list-toggle"
        :aria-expanded="groupFramesExpanded" @click="groupFramesExpanded = !groupFramesExpanded">
        <DisclosureChevron /><span>{{ t('assetLibrary.frameCount', { count: openGroup.count }) }}</span>
      </button>
      <LibraryError v-if="importGroups.state === 'error'" :error="importGroups.error" :retry="refreshImportGroups" />
      <ul v-if="browseGroups && matchingGroups.length" class="ap-assets-list" :aria-label="t('assetLibrary.importGroups')">
        <li v-for="row in matchingGroups" :key="row.id" class="ap-assets-row">
          <button class="ap-assets-truncate ap-asset-main ap-asset-typed" type="button" :title="row.name" @click="selectedImportGroup = row.id">
            <strong>{{ row.name }}</strong><span class="ap-asset-type">{{ t('assetLibrary.importTypes.subframe_collection') }}</span>
          </button>
        </li>
      </ul>
      <LibraryError v-if="removeFrameError" :error="removeFrameError" />
      <p v-if="results.state === 'loading'" role="status">{{ t('states.loading') }}</p>
      <LibraryError v-else-if="results.state === 'error'" :error="results.error" :retry="refreshAssets" />
      <template v-else-if="!groupDetails?.editing && (!selectedImportGroup || groupFramesExpanded)">
        <div v-if="!filteredAssets.length && !(browseGroups && matchingGroups.length)" class="ap-assets-empty" role="status">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 11v6M12 7h.01" /></svg>
          <p>{{ t(query || Object.values(filters).some(values => values.length) ? 'assetLibrary.noMatches' : 'assetLibrary.noAssets') }}</p>
          <button v-if="Object.values(filters).some(values => values.length)" type="button" @click="clearFilters">{{ t('assetLibrary.clearFilters') }}</button>
        </div>
        <div>
          <ul class="ap-assets-list">
            <li v-for="asset in filteredAssets" :key="asset.id" class="ap-assets-row" :data-dragging="draggedId === asset.id">
              <button type="button" class="ap-assets-truncate ap-asset-main" :class="{ 'ap-asset-typed': !selectedImportGroup }" :title="asset.name" :draggable="!!selectedImportGroup"
                @dragstart="startDrag($event, { asset })" @dragend="cancelDrag" @contextmenu="selectedImportGroup && ($event.preventDefault(), menu = asset.id)" @click="open({ kind: asset.import_group_id || asset.catalog_kind ? 'detail' : 'asset', asset })">
                <strong>{{ asset.name }}</strong><small v-if="selectedImportGroup">{{ t('assetLibrary.values.' + (asset.available ? 'online' : 'offline')) }}</small><span v-else class="ap-asset-type">{{ assetType(asset) }}</span>
              </button>
              <div v-if="selectedImportGroup" class="ap-asset-actions">
              <button type="button" :aria-label="t('assetLibrary.more')" :aria-expanded="menu === asset.id" @click="menu = menu === asset.id ? '' : asset.id">⋯</button>
              <div v-if="menu === asset.id" class="ap-assets-row-menu">
                <button v-if="asset.import_group_id" type="button" :disabled="removeFramePending" @click="removeFrame(asset)">{{ t('assetLibrary.removeFrame') }}</button>
              </div>
              </div>
            </li>
          </ul>
        </div>
        <LibraryError v-if="pageError" :error="pageError" :retry="loadMore" />
        <button v-if="cursor" type="button" :disabled="pagePending" @click="loadMore">{{ t('assetLibrary.loadMore') }}</button>
      </template>
    </section>

  </div>
</template>
