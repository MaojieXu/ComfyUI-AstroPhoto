<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';
import {
  allDocuments, listDocuments, writeDocument, type Asset, type Assignment, type Collection, type Folder,
  type Master, type Placement, type Project, type Session,
} from '../../api/assets';
import { ApiError } from '../../api/client';
import { fetchStorage } from '../../api/storage';
import { app } from '../../host/comfy';
import { notifyHost } from '../../host/notify';
import { createCanvasNode } from '../../host/canvas';
import { attachCanvasDrop } from '../../host/dragDrop';
import { useResource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import { SidebarTabs } from '../../shared/SidebarTabs';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { useMutation } from '../library/components/useMutation';
import { bytes } from '../storage/format';
import AssetEditor from './AssetEditor.vue';
import LibraryEditor from './LibraryEditor.vue';
import LibraryError from './LibraryError.vue';
import LibraryTree from './LibraryTree.vue';
import ImportAssets from './ImportAssets.vue';
import ProjectAssetsPicker from './ProjectAssetsPicker.vue';
import { libraryTree, type Entry } from './tree';
import { numbers, values } from './attributes';
import './assets.css';

const props = defineProps<{ active: boolean; openStorage: () => void }>();
const { t } = useI18n();
const tabs = ['allAssets', 'projects'] as const;
type Tab = typeof tabs[number];
type Resource = { asset: Asset } | { collection: Collection };
type Form = { kind: 'projectAssets'; projectId: string } | { kind: 'import'; importKind: 'single' | 'batch'; resumeTaskId?: string } |
  { kind: 'asset'; asset: Asset } | { kind: 'batch'; assets: Asset[] } |
  { kind: 'projects'; row?: Project } | { kind: 'folders'; row?: Folder; projectId?: string; parentId?: string } |
  { kind: 'collections'; row?: Collection; assetIds?: string[] } | { kind: 'sessions'; row?: Session; assetIds?: string[] } |
  { kind: 'masters'; row?: Master } | { kind: 'assignments'; resource: Resource; row?: Assignment } |
  { kind: 'placements'; resource: Resource; row?: Placement };
const tab = ref<Tab>('projects');
const calibration = ref(false);
const projectId = ref('');
const selectedEntry = shallowRef<Entry>();
const calibrationSelection = shallowRef<Entry>();
const queryText = ref('');
const query = ref('');
const projectQuery = ref('');
const calibrationQuery = ref('');
const classification = ref('');
const sort = ref('name');
const descending = ref(false);
const group = ref('');
const selectedImportGroup = ref('');
const filters = ref<Record<string, string>>({});
const { resource: importStorage, refresh: refreshImportStorage } = useResource(fetchStorage);
const form = shallowRef<Form>();
const heading = ref<HTMLElement>();
const assetEditor = ref<InstanceType<typeof AssetEditor>>();
const libraryEditor = ref<InstanceType<typeof LibraryEditor>>();
const importEditor = ref<InstanceType<typeof ImportAssets>>();
const projectAssetsEditor = ref<InstanceType<typeof ProjectAssetsPicker>>();
const projectTrees = new Map<string, InstanceType<typeof LibraryTree>>();
function closeOtherFolderMenus(event: Event) {
  const target = event.target;
  document.querySelectorAll<HTMLDetailsElement>('.ap-assets-panel .ap-folder-menu[open]').forEach(menu => {
    if (!(target instanceof Node) || !menu.contains(target)) menu.open = false;
  });
  if (!(target instanceof Element) || !target.closest('.ap-asset-actions')) menu.value = '';
}
function closeMenusOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  menu.value = '';
  document.querySelectorAll<HTMLDetailsElement>('.ap-assets-panel .ap-folder-menu[open]').forEach(item => { item.open = false; });
}
onMounted(() => {
  document.addEventListener('pointerdown', closeOtherFolderMenus, true);
  document.addEventListener('contextmenu', closeOtherFolderMenus, true);
  document.addEventListener('keydown', closeMenusOnEscape, true);
});
onScopeDispose(() => {
  document.removeEventListener('pointerdown', closeOtherFolderMenus, true);
  document.removeEventListener('contextmenu', closeOtherFolderMenus, true);
  document.removeEventListener('keydown', closeMenusOnEscape, true);
});
const expandedProjects = ref(new Set<string>());
function setProjectTree(id: string, view: unknown) {
  if (view) projectTrees.set(id, view as InstanceType<typeof LibraryTree>);
  else projectTrees.delete(id);
}
function expandProject(id: string) { expandedProjects.value = new Set([...expandedProjects.value, id]); }
function toggleProject(id: string) {
  const next = new Set(expandedProjects.value);
  if (next.has(id)) next.delete(id); else next.add(id);
  expandedProjects.value = next;
  chooseProject(id);
}
async function newProjectFolder(id: string) {
  chooseProject(id);
  expandProject(id);
  await nextTick();
  projectTrees.get(id)?.startFolder(null);
}
function projectContext(event: MouseEvent, id: string) {
  event.preventDefault();
  chooseProject(id);
  const row = (event.currentTarget as HTMLElement).closest('.ap-folder-row');
  const details = row?.querySelector<HTMLDetailsElement>('details');
  if (details) details.open = true;
}
const notice = ref('');
function showNotice(message: string) {
  if (message === t('assetLibrary.saved') || message === t('assetLibrary.canvasBound')) {
    if (notifyHost('success', message)) { notice.value = ''; return; }
  }
  notifyHost('info', message);
  notice.value = message;
}
const placementNotified = ref(false);
const canvasNotified = ref(false);
function errorMessage(error: unknown) {
  const code = error instanceof ApiError ? error.code : error instanceof Error ? error.message : 'network';
  return t('assetLibrary.errors.' + code, t('storage.errors.' + code, t('errors.' + code, t('errors.unknown'))));
}
const menu = ref('');
const checked = ref(new Set<string>());
let trigger: HTMLElement | null = null;
let drag: { token: string; resource?: Resource; folder?: Folder } | undefined;
const draggedId = ref('');
const dropTarget = ref('');
const dragMime = 'application/x-astrophoto-library';
const assetMap = shallowRef(new Map<string, Asset>());

const { resource: structure, refresh: refreshStructure } = useResource(async signal => {
  const [projects, collections, folders, masters, placements, sessions, assignments] = await Promise.all([
    allDocuments('projects', {}, signal), allDocuments('collections', {}, signal), allDocuments('folders', {}, signal),
    allDocuments('masters', {}, signal), allDocuments('placements', {}, signal), allDocuments('sessions', {}, signal),
    allDocuments('assignments', {}, signal),
  ]);
  const refs = [...new Set([...masters.map(row => row.asset_id), ...placements.flatMap(row => row.asset_id ? [row.asset_id] : [])])];
  for (let offset = 0; offset < refs.length; offset += 100) {
    const assets = await listDocuments('assets', { asset_ids: refs.slice(offset, offset + 100).join(',') }, signal);
    if (signal.aborted) break;
    remember(assets.items);
  }
  return { projects, collections, folders, masters, placements, sessions, assignments };
}, true);

const { resource: importGroups, refresh: refreshImportGroups } = useResource(
  (signal: AbortSignal) => allDocuments('import-groups', {}, signal), true);
const browseGroups = computed(() => !selectedImportGroup.value && !group.value &&
  (!classification.value || classification.value === 'raw') &&
  !query.value.trim() && !Object.values(filters.value).some(Boolean));
const groupRows = computed(() => importGroups.value.state === 'ready' ? importGroups.value.data : []);
const openGroup = computed(() => groupRows.value.find(row => row.id === selectedImportGroup.value));
watch(importGroups, result => {
  if (result.state === 'ready' && selectedImportGroup.value && !openGroup.value) selectedImportGroup.value = '';
});
watch(classification, () => { selectedImportGroup.value = ''; });
const groupSort = ref('import_index');
const activeSort = computed({
  get: () => selectedImportGroup.value ? groupSort.value : sort.value,
  set(value: string) { if (selectedImportGroup.value) groupSort.value = value; else sort.value = value; },
});
const options = computed(() => ({
  ...filters.value,
  q: query.value.trim(),
  import_group_id: selectedImportGroup.value || (browseGroups.value && groupRows.value.length ? 'ungrouped' : undefined),
  ...(classification.value === 'video' ? { file_kind: 'video' }
    : classification.value ? { role: classification.value } : {}),
  sort: (descending.value ? '-' : '') + activeSort.value,
}));
const loadAssets = computed(() => {
  const current = options.value;
  return (signal: AbortSignal) => listDocuments('assets', current, signal);
});
const { resource: results, refresh: refreshAssets } = useResource(loadAssets);
const visibleAssets = shallowRef<Asset[]>([]);
const cursor = ref<string | null>(null);
const { run: runPage, error: pageError, pending: pagePending } = useMutation();
const { run: runPlacement, error: placementError, pending: placementPending } = useMutation();
const { run: runMemberLoad, error: memberError } = useMutation();
const { run: runFilterLoad, error: filterError, pending: filterPending } = useMutation();
const filterAssets = shallowRef<Asset[]>([]);
const canvasError = shallowRef<unknown>();
watch(placementError, error => {
  placementNotified.value = !!error && !error.details && error.status !== 409 && notifyHost('error', errorMessage(error));
});
watch(canvasError, error => { canvasNotified.value = !!error && notifyHost('error', errorMessage(error)); });
function remember(rows: Asset[]) {
  if (!rows.length) return;
  const map = new Map(assetMap.value);
  for (const row of rows) map.set(row.id, row);
  assetMap.value = map;
}
watch(results, value => {
  if (value.state !== 'ready') return;
  visibleAssets.value = value.data.items;
  cursor.value = value.data.next;
  remember(value.data.items);
});
function loadMore() {
  const after = cursor.value;
  const current = options.value;
  if (!after) return;
  void runPage(async signal => {
    const page = await listDocuments('assets', { ...current, after }, signal);
    if (signal.aborted || current !== options.value) return;
    if (page.next === after) throw new ApiError('schema');
    visibleAssets.value = [...visibleAssets.value, ...page.items];
    cursor.value = page.next;
    remember(page.items);
  });
}

const metadata = computed(() => structure.value.state === 'ready' ? structure.value.data : null);
const projects = computed(() => metadata.value?.projects ?? []);
const collections = computed(() => metadata.value?.collections ?? []);
const folders = computed(() => metadata.value?.folders ?? []);
const placements = computed(() => metadata.value?.placements ?? []);
const masters = computed(() => metadata.value?.masters ?? []);
const assignments = computed(() => metadata.value?.assignments ?? []);
const sessions = computed(() => metadata.value?.sessions ?? []);
const collectionsById = computed(() => new Map(collections.value.map(row => [row.id, row])));
const assetIdsInCollections = computed(() => new Set(collections.value.flatMap(row => row.asset_ids)));
watch(projects, rows => {
  if (rows.some(row => row.id === projectId.value)) return;
  projectId.value = rows[0]?.id ?? '';
  selectedEntry.value = undefined;
});
function projectTree(id: string) {
  return libraryTree(folders.value.filter(row => row.project_id === id),
    placements.value.filter(row => row.project_id === id).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [], assetMap.value, collectionsById.value);
}
function projectNameMatches(project: Project) {
  const q = projectQuery.value.trim().toLocaleLowerCase();
  return !q || [project.name, project.target ?? ''].some(field => field.toLocaleLowerCase().includes(q));
}
function entryMatches(entries: Entry[], q: string): boolean {
  return entries.some(entry => entry.label.toLocaleLowerCase().includes(q) || (entry.children && entryMatches(entry.children, q)));
}
const calibrationTree = computed(() => libraryTree(folders.value.filter(row => !row.project_id), [], masters.value,
  assetMap.value, collectionsById.value, collections.value.filter(row => row.calibration_eligible)));
const projectAssetIds = computed(() => {
  const ids = new Set<string>();
  for (const row of placements.value.filter(item => item.project_id === projectId.value)) {
    if (row.asset_id) ids.add(row.asset_id);
    if (row.collection_id) collectionsById.value.get(row.collection_id)?.asset_ids.forEach(id => ids.add(id));
  }
  return [...ids];
});
const filteredProjects = computed(() => projects.value.filter(row => projectNameMatches(row) ||
  entryMatches(projectTree(row.id), projectQuery.value.trim().toLocaleLowerCase())));
const visibleCollections = computed(() => selectedImportGroup.value ? [] : collections.value.filter(row =>
  (!classification.value || classification.value === 'raw' || classification.value === 'video') &&
  (!query.value.trim() || row.name.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase()) ||
    visibleAssets.value.some(asset => row.asset_ids.includes(asset.id))) &&
  (!classification.value || row.asset_ids.some(id => visibleAssets.value.some(asset => asset.id === id))),
));
const grouped = computed(() => {
  const rows = visibleAssets.value.filter(asset => classification.value !== 'raw' ||
    !assetIdsInCollections.value.has(asset.id) || !visibleCollections.value.some(row => row.asset_ids.includes(asset.id)));
  const groups = new Map<string, Asset[]>();
  for (const row of rows) {
    const key = group.value ? String(row.attributes[group.value] ?? '') : '';
    const items = groups.get(key) || [];
    items.push(row);
    groups.set(key, items);
  }
  return [...groups];
});
const selectedAssets = computed(() => [...checked.value].map(id => assetMap.value.get(id)).filter((row): row is Asset => !!row));
function toggleAsset(asset: Asset) {
  const next = new Set(checked.value);
  if (next.has(asset.id)) next.delete(asset.id);
  else next.add(asset.id);
  checked.value = next;
}
function clearFilters() {
  queryText.value = '';
  query.value = '';
  filters.value = {};
  selectedImportGroup.value = '';
  classification.value = '';
  group.value = '';
}
function changeFilter(key: string, value: string) {
  filters.value = { ...filters.value, [key]: value };
}
function selectTab(value: Tab) {
  calibration.value = false;
  tab.value = value;
}
watch(() => props.active, active => {
  if (!active) cancelDrag();
  else refreshImportStorage();
});
function reload() {
  refreshAssets();
  refreshImportGroups();
  refreshStructure();
}
function openCollection(event: Event, collection: Collection) {
  if (!(event.currentTarget instanceof HTMLDetailsElement) || !event.currentTarget.open ||
      collection.asset_ids.every(id => assetMap.value.has(id))) return;
  void runMemberLoad(async signal => remember(await allDocuments('assets', { collection_id: collection.id }, signal)));
}
async function open(dialog: Form) {
  if (form.value) return;
  trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  form.value = dialog;
  menu.value = '';
  await nextTick();
  heading.value?.focus();
}
async function openImport(importKind: 'single' | 'batch') {
  const storage = importStorage.value;
  const shouldChooseFile = storage.state === 'ready' && storage.data.imports.default_mode === 'copy';
  await open({ kind: 'import', importKind });
  if (shouldChooseFile) importEditor.value?.openFilePicker();
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
  else if (libraryEditor.value) await libraryEditor.value.discardDraft();
  else if (importEditor.value) await importEditor.value.discardDraft();
  else if (projectAssetsEditor.value) await projectAssetsEditor.value.discardDraft();
  else await close();
}
function finishHome() {
  if (form.value) return false;
  selectTab('projects');
  return true;
}
function goHome() {
  return form.value ? requestClose().then(finishHome) : finishHome();
}
async function openTaskImport(id: string) {
  if (form.value?.kind === 'import' && importEditor.value?.hasTask(id)) return;
  if (form.value) await requestClose();
  if (!form.value) await open({ kind: 'import', importKind: 'batch', resumeTaskId: id });
}
defineExpose({ goHome, openTaskImport });
const editorTitle = computed(() => {
  const current = form.value;
  if (!current) return '';
  if (current.kind === 'asset') return current.asset.name;
  if (current.kind === 'projectAssets') return t('assetLibrary.addExistingAssets');
  if (current.kind === 'import') return t('assetLibrary.' + (current.importKind === 'single' ? 'importSingle' : 'importBatch'));
  return t('assetLibrary.forms.' + current.kind);
});
const logicalEditor = computed(() => {
  const current = form.value;
  if (!current || current.kind === 'import' || current.kind === 'projectAssets' ||
      current.kind === 'asset' || current.kind === 'batch') return null;
  switch (current.kind) {
    case 'folders': return { kind: current.kind, row: current.row, defaults: {
      project_id: current.projectId ?? null, parent_id: current.parentId ?? null,
    } };
    case 'collections': case 'sessions': return { kind: current.kind, row: current.row, defaults: { asset_ids: current.assetIds } };
    case 'placements': case 'assignments':
      return { kind: current.kind, row: current.row, defaults: fields(current.resource), targetName: resourceName(current.resource) };
    default: return { kind: current.kind, row: current.row };
  }
});

const resourceId = (item: Resource) => 'asset' in item ? item.asset.id : item.collection.id;
const resourceName = (item: Resource) => 'asset' in item ? item.asset.name : item.collection.name;
const fields = (item: Resource) => 'asset' in item ? { asset_id: item.asset.id } : { collection_id: item.collection.id };
const sourceNode = (resource: Resource) => 'asset' in resource ? 'AstroPhotoAssetSource' : 'AstroPhotoCollectionSource';
function resourceIn(entry?: Entry): Resource | undefined {
  const placed = entry?.placement;
  const assetId = placed?.asset_id ?? entry?.master?.asset_id;
  const asset = assetId && assetMap.value.get(assetId);
  if (asset) return { asset };
  const collection = placed?.collection_id && collectionsById.value.get(placed.collection_id);
  if (collection) return { collection };
}
const canvas = attachCanvasDrop(
  id => !!drag?.resource && props.active && !form.value && sourceNode(drag.resource) === id,
  error => { canvasError.value = error; if (!error) showNotice(t('assetLibrary.canvasBound')); },
  (_id, point) => { if (drag?.resource) bindCanvas(drag.resource, point); },
);
onScopeDispose(canvas.dispose);
function bindCanvas(resource: Resource, point?: [number, number]) {
  const field = 'asset' in resource ? 'asset_id' : 'collection_id';
  if ('asset' in resource && !resource.asset.available) throw new ApiError('ASSET_OFFLINE');
  if ('collection' in resource && !resource.collection.asset_ids.length) throw new ApiError('COLLECTION_EMPTY');
  if ('collection' in resource && resource.collection.asset_ids.some(id => assetMap.value.get(id)?.available === false))
    throw new ApiError('ASSET_OFFLINE');
  createCanvasNode(sourceNode(resource), point, app, undefined, node => {
    const input = node.widgets?.find(widget => widget.name === field);
    if (!input) throw new ApiError('CANVAS_UNSUPPORTED');
    input.value = resourceId(resource);
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
function startDrag(event: DragEvent, resource?: Resource, folder?: Folder) {
  if (!event.dataTransfer || (!resource && !folder) || form.value) { event.preventDefault(); return; }
  cancelDrag();
  const token = crypto.randomUUID();
  drag = { token, resource, folder };
  draggedId.value = resource ? resourceId(resource) : folder!.id;
  if (resource) canvas.start(event.dataTransfer, sourceNode(resource));
  event.dataTransfer.effectAllowed = 'copyMove';
  event.dataTransfer.setData(dragMime, token);
}
function cancelDrag() {
  canvas.cancel();
  drag = undefined;
  draggedId.value = '';
  dropTarget.value = '';
}
function validFolderDrop(folder: Folder, parentId: string | null, targetId: string) {
  if (folder.project_id !== targetId || folder.parent_id === parentId) return false;
  let current = parentId;
  const seen = new Set<string>();
  while (current) {
    if (current === folder.id || seen.has(current)) return false;
    seen.add(current);
    current = folders.value.find(row => row.id === current)?.parent_id ?? null;
  }
  return true;
}
function over(event: DragEvent, entry?: Entry, targetId = projectId.value) {
  if (!drag || form.value || placementPending.value || !event.dataTransfer?.types.includes(dragMime)) return;
  event.preventDefault();
  event.stopPropagation();
  if (drag.folder && !validFolderDrop(drag.folder, entry?.folder?.id ?? null, targetId)) {
    event.dataTransfer.dropEffect = 'none';
    dropTarget.value = '';
    return;
  }
  event.dataTransfer.dropEffect = drag.folder ? 'move' : 'copy';
  dropTarget.value = entry?.id ?? targetId;
}
function overTab(value: Tab, event: DragEvent) {
  if (value !== 'projects' || !drag?.resource || !event.dataTransfer?.types.includes(dragMime)) return;
  event.preventDefault();
  selectTab('projects');
}
function drop(event: DragEvent, entry?: Entry, targetId = projectId.value) {
  if (!drag || !projects.value.some(row => row.id === targetId) || !event.dataTransfer || event.dataTransfer.getData(dragMime) !== drag.token) return;
  event.preventDefault();
  event.stopPropagation();
  const current = drag;
  const folderId = entry?.folder?.id ?? null;
  if (current.folder && !validFolderDrop(current.folder, folderId, targetId)) { cancelDrag(); return; }
  cancelDrag();
  void runPlacement(async signal => {
    if (current.folder) {
      if (current.folder.project_id !== targetId || current.folder.id === folderId) throw new ApiError('INVALID_REQUEST');
      await writeDocument('folders', { name: current.folder.name, parent_id: folderId, project_id: targetId }, signal, current.folder);
    } else if (current.resource) {
      const resource = current.resource;
      const prior = placements.value.find(row => row.project_id === targetId &&
        ('asset' in resource ? row.asset_id === resource.asset.id : row.collection_id === resource.collection.id));
      await writeDocument('placements', { project_id: targetId, folder_id: folderId, ...fields(resource) }, signal, prior);
    }
    if (!signal.aborted) refreshStructure();
  });
}
function chooseProject(id: string) {
  selectedEntry.value = undefined;
  projectId.value = id;
}
function handleChanged(row?: { id: string }) {
  if (form.value?.kind === 'projects' && row) { chooseProject(row.id); expandProject(row.id); }
  selectedEntry.value = undefined;
  calibrationSelection.value = undefined;
  reload();
}
function relevantAssignments(resource: Resource) {
  return assignments.value.filter(row => 'asset' in resource ? row.asset_id === resource.asset.id : row.collection_id === resource.collection.id);
}
function candidateSessions(asset: Asset) {
  return sessions.value.filter(row => row.asset_ids.includes(asset.id));
}
function attachableSessions(asset: Asset) {
  return sessions.value.filter(row => !row.asset_ids.includes(asset.id));
}
const localizedEmpty = computed(() => ({ value: '', label: t('assetLibrary.values.unspecified') }));
const filtersList = ['target', 'target_type', 'filter', 'band', 'panel', 'region', 'batch', 'channel', 'camera_id', 'optical_train_id',
  'captured_at', 'extension', 'project_id', 'folder_id', 'collection_id', 'session_id', 'workspace_id',
  ...numbers, ...Object.keys(values), 'storage_mode', 'available'];
// The list is deliberately independent of the current search and pagination, so a
// selected value does not disappear when it narrows the visible results.
const availableFilters = computed(() => {
  const choices = new Map<string, Map<string, string>>();
  function add(key: string, value: unknown, label?: string) {
    if ((typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') || value === '') return;
    const raw = String(value);
    const labels = choices.get(key) ?? new Map<string, string>();
    labels.set(raw, label ?? (key in values || key === 'available' || key === 'storage_mode'
      ? t('assetLibrary.values.' + (raw === 'true' ? 'online' : raw === 'false' ? 'offline' : raw), raw) : raw));
    choices.set(key, labels);
  }
  const ids = new Set(filterAssets.value.map(asset => asset.id));
  for (const asset of filterAssets.value) {
    for (const key of filtersList) {
      const value = key === 'storage_mode' || key === 'available' || key === 'workspace_id' ? asset[key] : asset.attributes[key];
      if (Array.isArray(value)) value.forEach(item => add(key, item));
      else add(key, value);
    }
    const dot = asset.name.lastIndexOf('.');
    if (dot > 0 && dot < asset.name.length - 1) add('extension', asset.name.slice(dot + 1).toLocaleLowerCase());
  }
  for (const collection of collections.value) {
    if (collection.asset_ids.some(id => ids.has(id))) add('collection_id', collection.id, collection.name);
  }
  for (const session of sessions.value) {
    if (session.asset_ids.some(id => ids.has(id))) add('session_id', session.id, session.name);
  }
  for (const placement of placements.value) {
    const collection = placement.collection_id ? collectionsById.value.get(placement.collection_id) : undefined;
    if (!(placement.asset_id && ids.has(placement.asset_id)) && !collection?.asset_ids.some(id => ids.has(id))) continue;
    add('project_id', placement.project_id, projects.value.find(row => row.id === placement.project_id)?.name);
    if (placement.folder_id) add('folder_id', placement.folder_id, folders.value.find(row => row.id === placement.folder_id)?.name);
  }
  return filtersList.flatMap(key => {
    const labels = choices.get(key);
    return labels?.size ? [{ key, options: [...labels].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)) }] : [];
  });
});
function openFilters(open: boolean) {
  if (open) void runFilterLoad(async signal => { filterAssets.value = await allDocuments('assets', {}, signal); });
}
const assetMeta = (asset: Asset) => [bytes(asset.size_bytes), asset.attributes.usage && t('assetLibrary.values.' + asset.attributes.usage, String(asset.attributes.usage)),
  t('assetLibrary.values.' + (asset.available ? 'online' : 'offline'))].filter(Boolean).join(' · ');
</script>

<template>
  <div class="ap-assets-panel" @keydown.esc.stop="form && requestClose()">
    <div v-if="form" class="ap-assets-editor ap-scroll" role="region" aria-labelledby="ap-assets-editor-title">
      <div class="ap-assets-toolbar">
        <button type="button" @click="requestClose">{{ t('actions.back') }}</button>
        <h2 id="ap-assets-editor-title" ref="heading" tabindex="-1">{{ editorTitle }}</h2>
      </div>
      <ImportAssets v-if="form.kind === 'import'" ref="importEditor" :active="active" :projects="projects" :open-storage="openStorage" :import-kind="form.importKind" :resume-task-id="form.resumeTaskId"
        @changed="reload" @close="close" />
      <ProjectAssetsPicker v-else-if="form.kind === 'projectAssets'" ref="projectAssetsEditor"
        :project-id="form.projectId" :existing="projectAssetIds" @close="close"
        @changed="(added, existing) => { showNotice(t('assetLibrary.addAssetsResult', { added, existing })); reload(); close(); }" />
      <AssetEditor v-else-if="form.kind === 'asset' || form.kind === 'batch'" ref="assetEditor"
        :asset="form.kind === 'asset' ? form.asset : undefined" :selected="form.kind === 'batch' ? form.assets : undefined"
        @changed="reload" @notice="showNotice($event)" @close="close" />
      <LibraryEditor v-else-if="logicalEditor" v-bind="logicalEditor" ref="libraryEditor"
        :assets="[...assetMap.values()]" :projects="projects" :folders="folders" :collections="collections" :placements="placements" :masters="masters"
        :assignments="assignments"
        @changed="handleChanged" @notice="showNotice($event)" @close="close" />
    </div>

    <SidebarTabs v-show="!form && !calibration" :items="tabs" :active="tab" prefix="ap-asset"
      :label="t('nav.assets')" :title="value => t('assetLibrary.' + value)" :select="selectTab" :dragOver="overTab" />

    <p v-if="notice" class="ap-assets-notice" role="status">{{ notice }}</p>
    <LibraryError v-if="placementError && !placementNotified" :error="placementError" />
    <LibraryError v-if="canvasError && !canvasNotified" :error="canvasError" />
    <LibraryError v-if="structure.state === 'error' && !form" :error="structure.error" :retry="refreshStructure" />

    <section v-show="!form && tab === 'projects' && !calibration" id="ap-asset-panel-projects" class="ap-assets-view ap-scroll"
      role="tabpanel" aria-labelledby="ap-asset-tab-projects">
      <div class="ap-assets-toolbar">
        <h2>{{ t('assetLibrary.projects') }}</h2>
        <button type="button" @click="open({ kind: 'projects' })">{{ t('assetLibrary.newProject') }}</button>
      </div>
      <SearchField :label="t('assetLibrary.searchProjects')" :clear-label="t('browse.clear')" @search="projectQuery = $event" />
      <p v-if="structure.state === 'loading'" role="status">{{ t('states.loading') }}</p>
      <p v-else-if="structure.state === 'ready' && !filteredProjects.length" role="status">
        {{ t(projectQuery.trim() ? 'assetLibrary.noMatches' : 'assetLibrary.noProjects') }}
      </p>
      <ul v-else class="ap-assets-list">
        <li v-for="project in filteredProjects" :key="project.id">
          <div class="ap-folder-row">
            <button type="button" class="ap-tree-row ap-assets-tree-row ap-assets-project" :class="{ 'ap-drop-active': dropTarget === project.id }"
              :aria-expanded="expandedProjects.has(project.id) || !!projectQuery.trim()" :title="project.name"
              @click="toggleProject(project.id)" @contextmenu="projectContext($event, project.id)"
              @dragover="over($event, undefined, project.id)" @drop="drop($event, undefined, project.id)" @dragleave="dropTarget = ''">
              <DisclosureChevron />
              <strong>{{ project.name }}</strong><small v-if="project.target">{{ project.target }}</small>
            </button>
            <details class="ap-folder-menu" @keydown.esc.stop="($event.currentTarget as HTMLDetailsElement).open = false">
              <summary :aria-label="t('assetLibrary.projectActions', { name: project.name })">⋯</summary>
              <div class="ap-assets-row-menu">
                <button type="button" @click="chooseProject(project.id); open({ kind: 'projectAssets', projectId: project.id }); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('assetLibrary.addExistingAssets') }}</button>
                <button type="button" @click="newProjectFolder(project.id); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('assetLibrary.newFolder') }}</button>
                <button type="button" @click="chooseProject(project.id); open({ kind: 'projects', row: project }); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('assetLibrary.editProject') }}</button>
              </div>
            </details>
          </div>
          <div v-if="expandedProjects.has(project.id) || projectQuery.trim()" class="ap-project-children">
            <LibraryTree :ref="view => setProjectTree(project.id, view)" :entries="projectTree(project.id)" can-drop
              :query="projectNameMatches(project) ? '' : projectQuery" :selected="project.id === projectId ? selectedEntry?.id : undefined"
              :project-id="project.id" :folders="folders" :placements="placements" :drop-target="dropTarget" @changed="refreshStructure"
              @select="entry => { projectId = project.id; selectedEntry = entry; }" @over="(event, entry) => over(event, entry, project.id)"
              @drop="(event, entry) => drop(event, entry, project.id)"
              @drag="(event, entry) => startDrag(event, resourceIn(entry), entry.folder)" @drag-end="cancelDrag" />
            <div v-if="project.id === projectId && selectedEntry?.placement && resourceIn(selectedEntry)" class="ap-assets-toolbar">
              <button type="button" @click="open({ kind: 'placements', resource: resourceIn(selectedEntry)!, row: selectedEntry.placement })">{{ t('assetLibrary.editReference') }}</button>
              <button type="button" @click="open({ kind: 'assignments', resource: resourceIn(selectedEntry)! })">{{ t('assetLibrary.forms.assignments') }}</button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <section v-show="!form && tab === 'allAssets' && !calibration" id="ap-asset-panel-allAssets" class="ap-assets-view ap-scroll"
      role="tabpanel" aria-labelledby="ap-asset-tab-allAssets">
      <div class="ap-assets-toolbar">
        <h2>{{ t('assetLibrary.allAssets') }}</h2>
        <button type="button" :disabled="importStorage.state === 'loading'" @click="openImport('single')">{{ t('assetLibrary.importSingle') }}</button>
        <button type="button" :disabled="importStorage.state === 'loading'" @click="openImport('batch')">{{ t('assetLibrary.importBatch') }}</button>
      </div>
      <div class="ap-assets-search-row">
        <SearchField :label="t('assetLibrary.searchAssets')" :clear-label="t('browse.clear')" :value="queryText"
          @value-change="queryText = $event" @search="query = $event" />
        <!-- Adapted from ComfyUI Frontend v1.59.6 MediaAssetFilterBar. -->
        <PopoverRoot @update:open="openFilters">
          <PopoverTrigger as-child>
            <button type="button" class="ap-search-action ap-assets-filter-trigger" :aria-label="t('assetLibrary.filters')" :title="t('assetLibrary.filters')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 5h18M6 12h12M10 19h4" /></svg>
              <span v-if="Object.values(filters).some(Boolean)" class="ap-assets-filter-indicator" aria-hidden="true"></span>
            </button>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent class="ap-assets-settings-popover ap-assets-filter-popover" side="bottom" align="end" :side-offset="5" :collision-padding="10">
              <strong>{{ t('assetLibrary.filters') }}</strong>
              <p v-if="filterPending" role="status">{{ t('states.loading') }}</p>
              <LibraryError v-else-if="filterError" :error="filterError" :retry="() => openFilters(true)" />
              <template v-else>
                <p v-if="!availableFilters.length" role="status">{{ t('assetLibrary.noFilterOptions') }}</p>
                <div v-for="item in availableFilters" :key="item.key" class="ap-assets-filter-option">
                  <label :for="'ap-filter-' + item.key">{{ t('assetLibrary.fields.' + item.key) }}</label>
                  <ComfySingleSelect :id="'ap-filter-' + item.key" :label="t('assetLibrary.fields.' + item.key)"
                    :value="filters[item.key] ?? ''" :options="[{ value: '', label: t('assetLibrary.values.all') }, ...item.options]"
                    @change="changeFilter(item.key, $event)" />
                </div>
              </template>
              <button v-if="Object.values(filters).some(Boolean)" type="button" @click="filters = {}">{{ t('assetLibrary.clearFilters') }}</button>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
        <!-- Adapted from ComfyUI Frontend v1.59.6 MediaAssetSettingsButton / Popover. -->
        <PopoverRoot>
          <PopoverTrigger as-child>
            <button type="button" class="ap-search-action" :aria-label="t('assetLibrary.viewSettings')" :title="t('assetLibrary.viewSettings')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent class="ap-assets-settings-popover" side="bottom" align="end" :side-offset="5" :collision-padding="10">
              <label for="ap-asset-order">{{ t('assetLibrary.sort') }}</label>
              <ComfySingleSelect id="ap-asset-order" :label="t('assetLibrary.sort')" :value="activeSort"
                :options="[...(selectedImportGroup ? ['import_index'] : []), 'name', 'size_bytes', 'captured_at', 'panel', 'order', 'exposure', 'mtime_ns'].map(value => ({ value, label: t('assetLibrary.fields.' + value) }))"
                @change="activeSort = $event" />
              <button type="button" :aria-pressed="descending" @click="descending = !descending">{{ t('assetLibrary.' + (descending ? 'descending' : 'ascending')) }}</button>
              <label for="ap-asset-group">{{ t('assetLibrary.group') }}</label>
              <ComfySingleSelect id="ap-asset-group" :label="t('assetLibrary.group')" :value="group"
                :options="[{ ...localizedEmpty, label: t('assetLibrary.group') }, ...['target', 'panel', 'usage', 'filter', 'band', 'stage'].map(value => ({ value, label: t('assetLibrary.fields.' + value) }))]"
                @change="group = $event" />
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
      </div>
      <div class="ap-assets-toolbar">
        <div role="group" :aria-label="t('assetLibrary.classification')" class="ap-assets-quick-filter">
          <button v-for="kind in ['', 'raw', 'master_frame', 'video']" :key="kind" type="button" :aria-pressed="classification === kind" @click="classification = kind">
            {{ t(kind === 'raw' ? 'assetLibrary.subframes' : 'assetLibrary.values.' + (kind || 'all')) }}
          </button>
        </div>
        <button type="button" class="ap-assets-calibration-link" @click="calibration = true">{{ t('assetLibrary.calibration') }}</button>
      </div>
      <div v-if="selectedImportGroup" class="ap-assets-toolbar">
        <button type="button" @click="selectedImportGroup = ''">{{ t('actions.back') }}</button>
        <strong>{{ openGroup?.name }}</strong>
      </div>
      <LibraryError v-if="importGroups.state === 'error'" :error="importGroups.error" :retry="refreshImportGroups" />
      <ul v-if="browseGroups && groupRows.length" class="ap-assets-list" :aria-label="t('assetLibrary.importGroups')">
        <li v-for="row in groupRows" :key="row.id" class="ap-assets-row">
          <button class="ap-assets-truncate ap-asset-main" type="button" @click="selectedImportGroup = row.id">
            <strong>{{ row.name }} · {{ t('assetLibrary.frameCount', { count: row.count }) }}</strong>
            <small>{{ row.workspaces.map(position => position.name + ' (' + position.count + ')').join(' · ') }}</small>
          </button>
        </li>
      </ul>
      <div v-if="selectedAssets.length" class="ap-assets-toolbar">
        <button type="button" @click="open({ kind: 'batch', assets: selectedAssets })">{{ t('assetLibrary.bulkEdit') }} ({{ selectedAssets.length }})</button>
        <button type="button" @click="open({ kind: 'collections', assetIds: [...checked] })">{{ t('assetLibrary.newCollection') }}</button>
        <button type="button" @click="checked = new Set()">{{ t('assetLibrary.clearSelection') }}</button>
      </div>
      <p v-if="results.state === 'loading'" role="status">{{ t('states.loading') }}</p>
      <LibraryError v-else-if="results.state === 'error'" :error="results.error" :retry="refreshAssets" />
      <template v-else>
        <div v-if="!visibleAssets.length && !visibleCollections.length && !(browseGroups && groupRows.length)" class="ap-assets-empty" role="status">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 11v6M12 7h.01" /></svg>
          <p>{{ t(query || classification || Object.values(filters).some(Boolean) ? 'assetLibrary.noMatches' : 'assetLibrary.noAssets') }}</p>
          <button v-if="query || classification || Object.values(filters).some(Boolean)" type="button" @click="clearFilters">{{ t('assetLibrary.clearFilters') }}</button>
        </div>
        <ul v-if="visibleCollections.length" class="ap-assets-list">
          <li v-for="collection in visibleCollections" :key="collection.id" class="ap-assets-row" :data-dragging="draggedId === collection.id">
            <details class="ap-assets-collection" @toggle="openCollection($event, collection)">
              <summary draggable="true" class="ap-assets-truncate" :title="collection.name" @dragstart="startDrag($event, { collection })" @dragend="cancelDrag">
                {{ collection.name }} <small>{{ t('assetLibrary.members', { count: collection.asset_ids.length }) }}</small>
              </summary>
              <ul class="ap-assets-list">
                <li v-for="id in collection.asset_ids" :key="id">
                  <button v-if="assetMap.has(id)" type="button" class="ap-assets-truncate" :title="assetMap.get(id)!.name"
                    draggable="true" @dragstart="startDrag($event, { asset: assetMap.get(id)! })" @dragend="cancelDrag"
                    @click="open({ kind: 'asset', asset: assetMap.get(id)! })">{{ assetMap.get(id)!.name }}</button>
                  <span v-else class="ap-assets-truncate">{{ id }}</span>
                </li>
              </ul>
              <LibraryError v-if="memberError" :error="memberError" />
            </details>
            <div class="ap-asset-actions">
            <button type="button" :aria-label="t('assetLibrary.more')" :aria-expanded="menu === collection.id"
              @click="menu = menu === collection.id ? '' : collection.id">⋯</button>
            <div v-if="menu === collection.id" class="ap-assets-row-menu">
              <button type="button" @click="open({ kind: 'collections', row: collection })">{{ t('assetLibrary.forms.collections') }}</button>
              <button type="button" @click="open({ kind: 'placements', resource: { collection } })">{{ t('assetLibrary.forms.placements') }}</button>
              <button type="button" @click="open({ kind: 'assignments', resource: { collection } })">{{ t('assetLibrary.forms.assignments') }}</button>
              <button v-for="row in relevantAssignments({ collection })" :key="row.id" type="button"
                @click="open({ kind: 'assignments', resource: { collection }, row })">{{ t('assetLibrary.editAssignment') }} · {{ assetMap.get(masters.find(master => master.id === row.master_id)?.asset_id || '')?.name ?? row.master_id }}</button>
              <button type="button" @click="addSource({ collection })">{{ t('assetLibrary.createSource') }}</button>
            </div>
            </div>
          </li>
        </ul>
        <div v-for="([label, rows]) in grouped" :key="label">
          <h3 v-if="group">{{ label || t('assetLibrary.values.unknown') }}</h3>
          <ul class="ap-assets-list">
            <li v-for="asset in rows" :key="asset.id" class="ap-assets-row" :data-dragging="draggedId === asset.id">
              <input type="checkbox" :aria-label="t('assetLibrary.selectAsset', { name: asset.name })" :checked="checked.has(asset.id)" @change="toggleAsset(asset)" />
              <button type="button" class="ap-assets-truncate ap-asset-main" :title="asset.name" draggable="true"
                @dragstart="startDrag($event, { asset })" @dragend="cancelDrag" @contextmenu.prevent="menu = asset.id" @click="open({ kind: 'asset', asset })">
                <strong>{{ asset.name }}</strong><small>{{ assetMeta(asset) }}</small>
              </button>
              <div class="ap-asset-actions">
              <button type="button" :aria-label="t('assetLibrary.more')" :aria-expanded="menu === asset.id" @click="menu = menu === asset.id ? '' : asset.id">⋯</button>
              <div v-if="menu === asset.id" class="ap-assets-row-menu">
                <button type="button" @click="open({ kind: 'placements', resource: { asset } })">{{ t('assetLibrary.forms.placements') }}</button>
                <button type="button" @click="open({ kind: 'sessions', assetIds: [asset.id] })">{{ t('assetLibrary.forms.sessions') }}</button>
                <button v-for="row in candidateSessions(asset)" :key="row.id" type="button" @click="open({ kind: 'sessions', row })">{{ row.name }}</button>
                <button v-for="row in attachableSessions(asset)" :key="'attach-' + row.id" type="button"
                  @click="open({ kind: 'sessions', row: { ...row, asset_ids: [...row.asset_ids, asset.id] } })">
                  {{ t('assetLibrary.attachToSession', { name: row.name }) }}
                </button>
                <button v-if="asset.attributes.usage === 'light' && !assetIdsInCollections.has(asset.id)" type="button"
                  @click="open({ kind: 'assignments', resource: { asset } })">
                  {{ t('assetLibrary.forms.assignments') }}
                </button>
                <button v-for="row in relevantAssignments({ asset })" :key="row.id" type="button"
                  @click="open({ kind: 'assignments', resource: { asset }, row })">{{ t('assetLibrary.editAssignment') }} · {{ assetMap.get(masters.find(master => master.id === row.master_id)?.asset_id || '')?.name ?? row.master_id }}</button>
                <button type="button" :disabled="!asset.available" @click="addSource({ asset })">{{ t('assetLibrary.createSource') }}</button>
              </div>
              </div>
            </li>
          </ul>
        </div>
        <LibraryError v-if="pageError" :error="pageError" :retry="loadMore" />
        <button v-if="cursor" type="button" :disabled="pagePending" @click="loadMore">{{ t('assetLibrary.loadMore') }}</button>
      </template>
    </section>

    <section v-show="!form && calibration" class="ap-assets-view ap-scroll" aria-labelledby="ap-calibration-title">
      <div class="ap-assets-toolbar">
        <button type="button" @click="calibration = false">{{ t('actions.back') }}</button>
        <h2 id="ap-calibration-title">{{ t('assetLibrary.calibration') }}</h2>
        <button type="button" @click="open({ kind: 'masters' })">{{ t('assetLibrary.registerMaster') }}</button>
      </div>
      <SearchField :label="t('assetLibrary.calibration')" :clear-label="t('browse.clear')" @search="calibrationQuery = $event" />
      <div class="ap-assets-toolbar">
        <button type="button" @click="open({ kind: 'folders' })">{{ t('assetLibrary.newFolder') }}</button>
      </div>
      <LibraryTree :entries="calibrationTree" :query="calibrationQuery" :selected="calibrationSelection?.id" @select="calibrationSelection = $event" />
      <p v-if="!calibrationTree.length" role="status">{{ t('assetLibrary.noCalibration') }}</p>
      <div v-if="calibrationSelection?.folder" class="ap-assets-toolbar">
        <button type="button" @click="open({ kind: 'folders', parentId: calibrationSelection.folder.id })">{{ t('assetLibrary.newFolder') }}</button>
        <button type="button" @click="open({ kind: 'folders', row: calibrationSelection.folder })">{{ t('assetLibrary.editFolder') }}</button>
      </div>
      <button v-if="calibrationSelection?.master" type="button" @click="open({ kind: 'masters', row: calibrationSelection.master })">
        {{ t('assetLibrary.forms.masters') }}
      </button>
      <button v-if="calibrationSelection?.collection" type="button" @click="open({ kind: 'collections', row: calibrationSelection.collection })">
        {{ t('assetLibrary.forms.collections') }}
      </button>
    </section>
  </div>
</template>
