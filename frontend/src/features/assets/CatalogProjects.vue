<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError, getJson, requestJson } from '../../api/client';
import { useResource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import { fetchStorage } from '../../api/storage';
import { confirmAction } from '../library/components/useMutation';
import AssetFilterPopover from './AssetFilterPopover.vue';
import { facetGroups, matchesFacet, type FacetFilters, type FacetRecord } from './assetFacets';
import CatalogDetails from './CatalogDetails.vue';
import ProjectSubframes from './ProjectSubframes.vue';
import LibraryError from './LibraryError.vue';
import { readDocument, type Asset } from '../../api/assets';

const { t } = useI18n();
const emit = defineEmits<{ source: [value: { asset: Asset } | { collectionId: string }] }>();
const base = '/astrophoto/v1/catalog';
type RecordInfo = { id: string; name: string; revision: number; notes?: string | null };
type Node = RecordInfo & { parent_id: string | null; kind: string; resource_id: string | null; resource_name?: string; resource_kind?: string; asset_type?: string };
type ProjectData = { project: RecordInfo; items: Node[]; affected_folders: number; affected_references: number };
type RemovalImpact = { affected_folders: number; affected_references: number; requires_confirmation: boolean; impact_token: string; revision: number };
type Selection = { projectId: string; nodeId: string | null };
type TreeItem = { row: Node; path: string; depth: number };
const query = ref('');
const pickerQuery = ref('');
const pickerText = ref('');
const pickerFilters = ref<FacetFilters>({});
const pickerTarget = ref<{ projectId: string; projectName: string; parentId: string | null; parentPath: string } | null>(null);
const selected = ref<Selection | null>(null);
const expandedProjects = ref<string[]>([]);
const expandedFolders = ref<string[]>([]);
const expandedCollections = ref(new Set<string>());
const frameCounts = ref<Record<string, number>>({});
const projectData = ref<Record<string, ProjectData>>({});
const mode = ref('');
const name = ref('');
const notes = ref('');
const checked = ref<string[]>([]);
const target = shallowRef<Node>();
const detail = shallowRef<Node>();
const moveParent = ref('');
const menu = ref('');
const backgroundPosition = ref({ x: 0, y: 0 });
const busy = ref(false);
const error = shallowRef<unknown>();
const root = ref<HTMLElement | null>(null);
const edit = ref<{ type: 'create-project' | 'create-folder' | 'rename-project' | 'rename-node'; projectId?: string; nodeId?: string; parentId?: string | null } | null>(null);
const editName = ref('');
const editError = shallowRef<unknown>();
const message = ref('');
const dragging = ref<{ projectId: string; nodeId: string } | null>(null);
const dropTarget = ref<string | null>(null);
let expandTimer: ReturnType<typeof setTimeout> | undefined;

async function all<T extends { id: string; name: string } = RecordInfo>(path: string, signal: AbortSignal) {
  const rows: T[] = [];
  let after = '';
  do {
    const response = await getJson(path + '?after=' + encodeURIComponent(after), signal) as { items: T[]; next: string | null };
    rows.push(...response.items);
    after = response.next ?? '';
  } while (after);
  return rows;
}
const { resource: projects, refresh: refreshProjects } = useResource(signal => all(base + '/projects', signal));
const { resource: choices, refresh: refreshChoices } = useResource(computed(() => {
  const open = mode.value === 'assets';
  return (signal: AbortSignal) => open ? all<FacetRecord>(base + '/assets', signal) : Promise.resolve([]);
}));
const { resource: storage } = useResource(fetchStorage);
const pickerRows = computed(() => choices.value.state === 'ready' ? choices.value.data : []);
const pickerWorkspaces = computed(() => storage.value.state === 'ready' ? storage.value.data.workspaces : []);
const pickerGroups = computed(() => facetGroups(pickerRows.value, pickerQuery.value, pickerFilters.value, t, pickerWorkspaces.value));
const pickerResults = computed(() => pickerRows.value.filter(row => matchesFacet(row, pickerQuery.value, pickerFilters.value, t, pickerWorkspaces.value)).sort((a, b) => a.name.localeCompare(b.name)));
function changePickerFilter(key: string, value: string) {
  const current = pickerFilters.value[key] || [];
  pickerFilters.value = { ...pickerFilters.value, [key]: current.includes(value) ? current.filter(item => item !== value) : [...current, value] };
}
const projectId = computed(() => selected.value?.projectId || '');
const current = computed(() => projectData.value[projectId.value]);
const selectedNode = computed(() => current.value?.items.find(row => row.id === selected.value?.nodeId));
const destination = computed(() => selectedNode.value?.kind === 'folder' ? selectedNode.value.id : selectedNode.value?.parent_id ?? null);
const alreadyAdded = computed(() => new Set((projectData.value[pickerTarget.value?.projectId || '']?.items || []).filter(row => row.kind !== 'folder').map(row => row.resource_id)));
const detailAsset = computed(() => {
  const row = detail.value;
  if (!row?.resource_id) return undefined;
  const catalogKind = row.resource_kind === 'calibration_master' ? 'calibration_masters'
    : row.kind === 'video' ? 'videos' : 'image_results';
  return { id: row.resource_id, catalog_kind: catalogKind, attributes: {
    role: row.asset_type === 'master_frame' ? 'master_frame' : row.asset_type === 'image_result' ? 'processed' : null,
  } };
});
function addDetailSource() {
  const id = detailAsset.value?.id;
  if (id) void run(async () => {
    const asset = await readDocument('assets', id, new AbortController().signal);
    emit('source', { asset });
  });
}
const projectRows = computed(() => projects.value.state === 'ready' ? projects.value.data : []);
function endpoint(id: string) { return base + '/projects/' + encodeURIComponent(id); }
async function loadProject(id: string) {
  const data = await getJson(endpoint(id)) as ProjectData;
  projectData.value = { ...projectData.value, [id]: data };
}
async function run(action: () => Promise<void>) {
  if (busy.value) return;
  busy.value = true; error.value = undefined;
  try { await action(); } catch (cause) { error.value = cause; } finally { busy.value = false; }
}
function tree(id: string): TreeItem[] {
  const result: TreeItem[] = [];
  const children = new Map<string | null, Node[]>();
  for (const row of projectData.value[id]?.items || []) children.set(row.parent_id, [...(children.get(row.parent_id) || []), row]);
  function walk(parent: string | null, path: string, depth: number) {
    for (const row of children.get(parent) || []) {
      const next = path + '/' + row.name;
      result.push({ row, path: next, depth });
      if (row.kind === 'folder') walk(row.id, next, depth + 1);
    }
  }
  walk(null, '', 0);
  return result;
}
function visibleTree(id: string): TreeItem[] {
  const items = tree(id);
  const q = query.value.trim().toLocaleLowerCase();
  if (q) {
    const matches = items.filter(item => item.row.name.toLocaleLowerCase().includes(q) || (item.row.resource_name || '').toLocaleLowerCase().includes(q));
    const included = new Set(matches.map(item => item.row.id));
    for (const match of matches) {
      let parent = match.row.parent_id;
      while (parent) { included.add(parent); parent = items.find(item => item.row.id === parent)?.row.parent_id ?? null; }
    }
    return items.filter(item => included.has(item.row.id));
  }
  return items.filter(item => {
    let parent = item.row.parent_id;
    while (parent) {
      if (!expandedFolders.value.includes(parent)) return false;
      parent = items.find(candidate => candidate.row.id === parent)?.row.parent_id ?? null;
    }
    return true;
  });
}
function projectVisible(row: RecordInfo) {
  const q = query.value.trim().toLocaleLowerCase();
  return !q || row.name.toLocaleLowerCase().includes(q) || visibleTree(row.id).length > 0;
}
watch([query, projectRows], ([value, rows]) => {
  if (value.trim()) for (const row of rows) if (!projectData.value[row.id]) void loadProject(row.id).catch(cause => { error.value = cause; });
});
function select(id: string, nodeId: string | null = null) { selected.value = { projectId: id, nodeId }; menu.value = ''; }
let clickTimer: ReturnType<typeof setTimeout> | undefined;
function closeOutsideMenu(event: PointerEvent) {
  if (menu.value && event.target instanceof Element && !event.target.closest('.ap-project-menu')) menu.value = '';
}
onMounted(() => document.addEventListener('pointerdown', closeOutsideMenu, true));
onUnmounted(() => { clearTimeout(clickTimer); clearTimeout(expandTimer); document.removeEventListener('pointerdown', closeOutsideMenu, true); });
function clickRow(id: string, row?: Node) {
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    select(id, row?.id ?? null);
    if (!row) void toggleProject(id);
    else if (row.kind === 'folder') toggleFolder(row.id);
    else if (isCollection(row)) toggleCollection(row.id);
  }, 220);
}
function doubleClickProject(row: RecordInfo) { clearTimeout(clickTimer); renameProject(row); }
function doubleClickNode(id: string, row: Node) { clearTimeout(clickTimer); renameNode(id, row); }
function isCollection(row?: Node): row is Node & { resource_id: string } {
  return row?.kind === 'subframe_collection' && !!row.resource_id;
}
function toggleCollection(id: string) {
  if (expandedCollections.value.has(id)) expandedCollections.value.delete(id);
  else expandedCollections.value.add(id);
}
function rowExpanded(row: Node) {
  if (isCollection(row)) return expandedCollections.value.has(row.id);
  if (row.kind === 'folder') return expandedFolders.value.includes(row.id) || !!query.value.trim();
}
async function toggleProject(id: string) {
  if (expandedProjects.value.includes(id)) { expandedProjects.value = expandedProjects.value.filter(value => value !== id); return; }
  await run(async () => { await loadProject(id); expandedProjects.value = [...expandedProjects.value, id]; });
}
function toggleFolder(id: string) { expandedFolders.value = expandedFolders.value.includes(id) ? expandedFolders.value.filter(value => value !== id) : [...expandedFolders.value, id]; }
async function startEdit(value: NonNullable<typeof edit.value>, initial = '') {
  clearTimeout(clickTimer);
  mode.value = ''; menu.value = ''; message.value = ''; editError.value = undefined; editName.value = initial; edit.value = value;
  await nextTick();
  const input = root.value?.querySelector<HTMLInputElement>('.ap-project-inline input, .ap-project-inline-form input');
  input?.focus(); input?.select();
}
async function newItem() {
  if (busy.value) return;
  query.value = '';
  if (!selected.value) { await startEdit({ type: 'create-project' }); return; }
  const id = selected.value.projectId;
  if (!projectData.value[id]) {
    try { await loadProject(id); } catch (cause) { error.value = cause; return; }
  }
  if (!expandedProjects.value.includes(id)) expandedProjects.value.push(id);
  const parent = destination.value;
  if (parent && !expandedFolders.value.includes(parent)) expandedFolders.value.push(parent);
  await startEdit({ type: 'create-folder', projectId: id, parentId: parent });
}
function renameProject(row: RecordInfo) { select(row.id); void startEdit({ type: 'rename-project', projectId: row.id }, row.name); }
function renameNode(project: string, row: Node) { select(project, row.id); void startEdit({ type: 'rename-node', projectId: project, nodeId: row.id }, row.name); }
function cancelEdit() { if (!busy.value) { edit.value = null; editError.value = undefined; } }
function blurEdit() {
  void saveInline();
}
function guardComposition(event: KeyboardEvent) { if (event.isComposing || event.keyCode === 229) event.preventDefault(); }
function nameKey(value: string) { return value.trim().normalize('NFC').toLocaleLowerCase(); }
function nameError(value: string, editing: NonNullable<typeof edit.value>) {
  if (!value) return '';
  if ([...value].length > 120 || value === '.' || value === '..' || /[\/\\\x00-\x1f]/.test(value)) return t('assetLibrary.projectUi.invalidName');
  const key = nameKey(value);
  if (editing.type === 'create-project' || editing.type === 'rename-project') {
    return projectRows.value.some(row => row.id !== editing.projectId && nameKey(row.name) === key) ? t('assetLibrary.projectUi.nameConflict') : '';
  }
  const rows = projectData.value[editing.projectId || '']?.items || [];
  const parent = editing.type === 'rename-node' ? rows.find(row => row.id === editing.nodeId)?.parent_id : editing.parentId;
  return rows.some(row => row.id !== editing.nodeId && row.parent_id === (parent ?? null) && nameKey(row.name) === key) ? t('assetLibrary.projectUi.nameConflict') : '';
}
async function saveInline() {
  const editing = edit.value;
  const value = editName.value.trim();
  if (!editing || busy.value) return;
  if (!value) { cancelEdit(); return; }
  const previous = editing.type === 'rename-project' ? (projectData.value[editing.projectId || '']?.project || projectRows.value.find(row => row.id === editing.projectId))?.name
    : editing.type === 'rename-node' ? projectData.value[editing.projectId || '']?.items.find(row => row.id === editing.nodeId)?.name : undefined;
  if (previous === value) { cancelEdit(); return; }
  const validation = nameError(value, editing);
  if (validation) { edit.value = null; message.value = validation; return; }
  busy.value = true; editError.value = undefined;
  try {
    if (editing.type === 'create-project') {
      const created = await requestJson(base + '/projects', 'POST', { name: value }) as RecordInfo;
      refreshProjects(); selected.value = { projectId: created.id, nodeId: null };
    } else if (editing.projectId) {
      const id = editing.projectId;
      if (editing.type === 'create-folder') {
        const parent = tree(id).find(item => item.row.id === editing.parentId);
        const result = await requestJson(endpoint(id) + '/folders', 'POST', { paths: [(parent?.path || '') + '/' + value] }) as { items: Node[] };
        if (!result.items.length) throw new ApiError('REVISION_CONFLICT');
      } else if (editing.type === 'rename-project') {
        const row = projectData.value[id]?.project || projectRows.value.find(item => item.id === id);
        if (!row) throw new Error('Project unavailable');
        await requestJson(endpoint(id), 'PATCH', { name: value, revision: row.revision });
        refreshProjects();
      } else {
        const row = projectData.value[id]?.items.find(item => item.id === editing.nodeId);
        if (!row) throw new Error('Node unavailable');
        await requestJson(endpoint(id) + '/nodes/' + encodeURIComponent(row.id), 'PATCH', { name: value, revision: row.revision });
      }
      edit.value = null;
      await loadProject(id);
    }
    edit.value = null;
  } catch (cause) {
    if (!edit.value) {
      error.value = cause;
    } else if (cause instanceof ApiError && (cause.code === 'INVALID_REQUEST' || (cause.code === 'REVISION_CONFLICT' && (cause.details?.name || cause.details?.path || cause.details?.existing_path)))) {
      edit.value = null;
      message.value = t(cause.code === 'INVALID_REQUEST' ? 'assetLibrary.projectUi.invalidName' : 'assetLibrary.projectUi.nameConflict');
    } else if (cause instanceof ApiError && cause.code === 'REVISION_CONFLICT') {
      editError.value = cause;
      message.value = t('assetLibrary.projectChangedRetry');
      if (editing.projectId) await loadProject(editing.projectId).catch(() => {});
    } else {
      editError.value = cause;
      await nextTick(); root.value?.querySelector<HTMLInputElement>('.ap-project-inline input, .ap-project-inline-form input')?.focus();
    }
  }
  finally { busy.value = false; }
}
async function openAssets() {
  if (!selected.value) return;
  try { await loadProject(selected.value.projectId); } catch (cause) { error.value = cause; return; }
  const id = selected.value.projectId;
  const parent = destination.value;
  const parentPath = parent ? tree(id).find(item => item.row.id === parent)?.path : '/';
  if (!parentPath) { error.value = new ApiError('REVISION_CONFLICT'); return; }
  pickerTarget.value = { projectId: id, projectName: projectData.value[id].project.name, parentId: parent,
    parentPath };
  mode.value = 'assets'; edit.value = null; checked.value = []; pickerText.value = ''; pickerQuery.value = ''; pickerFilters.value = {}; menu.value = '';
}
function addAssets() { void run(async () => {
  const target = pickerTarget.value;
  if (!target || !checked.value.length || checked.value.length > 100) return;
  const id = target.projectId;
  const parent = target.parentId;
  const assets = checked.value.map(key => {
    const item = pickerRows.value.find(row => row.id === key);
    if (!item) throw new ApiError('REVISION_CONFLICT');
    return { kind: item.asset_type === 'master_frame' ? 'image_result' : item.asset_type, resource_id: item.id };
  });
  await requestJson(endpoint(id) + '/references', 'POST', { parent_path: target.parentPath, assets });
  checked.value = [];
  await loadProject(id);
  if (!expandedProjects.value.includes(id)) expandedProjects.value.push(id);
  if (parent && !expandedFolders.value.includes(parent)) expandedFolders.value.push(parent);
  mode.value = '';
}); }
async function openProjectEdit(row: RecordInfo) {
  try { await loadProject(row.id); } catch (cause) { error.value = cause; return; }
  select(row.id); name.value = row.name; notes.value = row.notes || ''; mode.value = 'project'; menu.value = '';
}
function saveProject() { void run(async () => {
  const row = current.value?.project;
  if (!row) return;
  await requestJson(endpoint(projectId.value), 'PATCH', { name: name.value, notes: notes.value || null, revision: row.revision });
  mode.value = ''; refreshProjects(); await loadProject(projectId.value);
}); }
function openMove(project: string, row: Node) { select(project, row.id); target.value = row; moveParent.value = row.parent_id || ''; mode.value = 'move'; menu.value = ''; }
function validMoveTarget(item: TreeItem) {
  if (item.row.kind !== 'folder' || !target.value) return false;
  let id: string | null = item.row.id;
  const rows = projectData.value[projectId.value]?.items || [];
  while (id) {
    if (id === target.value.id) return false;
    id = rows.find(row => row.id === id)?.parent_id ?? null;
  }
  return true;
}
function saveMove() { void run(async () => {
  if (!target.value) return;
  await requestJson(endpoint(projectId.value) + '/nodes/' + target.value.id, 'PATCH', { parent_id: moveParent.value || null, revision: target.value.revision });
  mode.value = ''; await loadProject(projectId.value);
}); }
function remove(id: string, row?: Node, path?: string) { void run(async () => {
  let revision = row?.revision;
  let impactToken: string | undefined;
  let confirmed = false;
  if (!row || row.kind === 'folder') {
    const query = new URLSearchParams({ path: path ?? '/', view: 'impact' });
    const counts = await getJson(endpoint(id) + '?' + query) as RemovalImpact;
    revision = counts.revision;
    impactToken = counts.impact_token;
    if (counts.requires_confirmation) {
      confirmed = (await confirmAction(t('assetLibrary.remove'), t('assetLibrary.projectImpact', { ...counts }))) === true;
      if (!confirmed) return;
    }
  } else {
    confirmed = (await confirmAction(t('assetLibrary.remove'), t('assetLibrary.projectRemoveReference'))) === true;
    if (!confirmed) return;
  }
  await requestJson(row ? endpoint(id) + '/nodes/' + row.id : endpoint(id), 'DELETE', { revision, confirmed, impact_token: impactToken });
  menu.value = ''; mode.value = ''; selected.value = null;
  if (row) await loadProject(id); else { delete projectData.value[id]; refreshProjects(); }
}); }
function openDetail(row: Node) { detail.value = row; menu.value = ''; }
function canDrop(project: string, parentId: string | null) {
  const drag = dragging.value;
  if (!drag || drag.projectId !== project) return false;
  const rows = projectData.value[project]?.items || [];
  const source = rows.find(row => row.id === drag.nodeId);
  if (!source || source.parent_id === parentId) return false;
  let current = parentId;
  while (current) {
    if (current === source.id) return false;
    const parent = rows.find(row => row.id === current);
    if (!parent || parent.kind !== 'folder') return false;
    current = parent.parent_id;
  }
  return true;
}
function startDrag(event: DragEvent, project: string, row: Node) {
  if (busy.value || edit.value) { event.preventDefault(); return; }
  dragging.value = { projectId: project, nodeId: row.id };
  if (event.dataTransfer) { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', row.name); }
}
function endDrag() { clearTimeout(expandTimer); dragging.value = null; dropTarget.value = null; }
function dragOver(event: DragEvent, project: string, parent: string | null) {
  if (!canDrop(project, parent)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  const key = project + ':' + (parent || 'root');
  if (dropTarget.value !== key) {
    clearTimeout(expandTimer); dropTarget.value = key;
    if (parent && !expandedFolders.value.includes(parent)) expandTimer = setTimeout(() => expandedFolders.value.push(parent), 700);
  }
}
function dragLeave(event: DragEvent) {
  if (event.currentTarget instanceof Element && event.relatedTarget instanceof globalThis.Node && event.currentTarget.contains(event.relatedTarget)) return;
  clearTimeout(expandTimer); dropTarget.value = null;
}
function drop(event: DragEvent, project: string, parent: string | null) {
  if (!canDrop(project, parent) || !dragging.value) { endDrag(); return; }
  event.preventDefault();
  const row = projectData.value[project]?.items.find(item => item.id === dragging.value?.nodeId);
  endDrag();
  if (!row) return;
  void run(async () => {
    await requestJson(endpoint(project) + '/nodes/' + row.id, 'PATCH', { parent_id: parent, revision: row.revision });
    await loadProject(project);
    select(project, row.id);
    if (!expandedProjects.value.includes(project)) expandedProjects.value.push(project);
    if (parent && !expandedFolders.value.includes(parent)) expandedFolders.value.push(parent);
  });
}
function showMenu(project: string, row?: Node) {
  clearTimeout(clickTimer);
  select(project, row?.id ?? null); menu.value = row?.id || project;
  void nextTick(() => root.value?.querySelector<HTMLButtonElement>('.ap-project-menu button')?.focus());
}
function contextMenu(event: MouseEvent, project: string, row?: Node) {
  event.preventDefault(); event.stopPropagation(); clearTimeout(clickTimer); showMenu(project, row);
}
function showBackgroundMenu(x: number, y: number) {
  if (busy.value || edit.value || mode.value || detail.value) return;
  clearTimeout(clickTimer);
  selected.value = null;
  backgroundPosition.value = { x: Math.max(4, Math.min(x, window.innerWidth - 170)), y: Math.max(4, Math.min(y, window.innerHeight - 50)) };
  menu.value = 'background';
  void nextTick(() => root.value?.querySelector<HTMLButtonElement>('.ap-project-background-menu button')?.focus());
}
function backgroundContextMenu(event: MouseEvent) {
  if (!(event.target instanceof Element) || event.target.closest('li, button, input, select, textarea, .ap-project-picker, .ap-project-editor, .ap-project-menu')) return;
  event.preventDefault();
  showBackgroundMenu(event.clientX, event.clientY);
}
async function focusRow(project: string, nodeId: string | null) {
  select(project, nodeId);
  await nextTick();
  const buttons = root.value?.querySelectorAll<HTMLButtonElement>('[data-project-row]');
  for (const button of buttons || []) {
    if (button.dataset.projectRow === project && (button.dataset.nodeRow || null) === nodeId) { button.focus(); break; }
  }
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && menu.value) { menu.value = ''; if (selected.value) void focusRow(selected.value.projectId, selected.value.nodeId); else root.value?.focus(); event.preventDefault(); return; }
  if (event.target === root.value && (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey))) {
    const rect = root.value?.getBoundingClientRect();
    if (rect) showBackgroundMenu(rect.left + 8, rect.top + 40);
    event.preventDefault(); return;
  }
  if (!(event.target instanceof HTMLElement)) return;
  const branch = event.target.closest<HTMLElement>('[data-project-frames]');
  if (branch && event.key === 'ArrowLeft') {
    branch.previousElementSibling?.querySelector<HTMLButtonElement>('[data-node-row]')?.focus();
    event.preventDefault();
    return;
  }
  if (!selected.value || edit.value || mode.value || !event.target.matches('[data-project-row]')) return;
  const project = projectRows.value.find(row => row.id === selected.value?.projectId);
  if (event.key === 'F2') {
    if (selectedNode.value) renameNode(selected.value.projectId, selectedNode.value);
    else if (project) renameProject(project);
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    const buttons = Array.from(root.value?.querySelectorAll<HTMLButtonElement>('[data-project-row]') || []);
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    const next = buttons[index + (event.key === 'ArrowDown' ? 1 : -1)];
    if (next) void focusRow(next.dataset.projectRow!, next.dataset.nodeRow || null);
  } else if (event.key === 'ArrowRight') {
    if (isCollection(selectedNode.value)) {
      if (!expandedCollections.value.has(selectedNode.value.id)) toggleCollection(selectedNode.value.id);
      else {
        const childBranch = event.target.closest('li')?.nextElementSibling;
        if (childBranch?.matches('[data-project-frames]')) childBranch.querySelector<HTMLButtonElement>('button')?.focus();
      }
    } else if (!selectedNode.value && !expandedProjects.value.includes(projectId.value)) void toggleProject(projectId.value);
    else if (selectedNode.value?.kind === 'folder' && !expandedFolders.value.includes(selectedNode.value.id)) toggleFolder(selectedNode.value.id);
    else {
      const child = visibleTree(projectId.value).find(item => item.row.parent_id === (selectedNode.value?.id ?? null));
      if (child && (!selectedNode.value || selectedNode.value.kind === 'folder')) void focusRow(projectId.value, child.row.id);
    }
  } else if (event.key === 'ArrowLeft') {
    if (!selectedNode.value && expandedProjects.value.includes(projectId.value)) void toggleProject(projectId.value);
    else if (selectedNode.value?.kind === 'folder' && expandedFolders.value.includes(selectedNode.value.id)) toggleFolder(selectedNode.value.id);
    else if (isCollection(selectedNode.value) && expandedCollections.value.has(selectedNode.value.id)) toggleCollection(selectedNode.value.id);
    else if (selectedNode.value) void focusRow(projectId.value, selectedNode.value.parent_id);
  } else if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
    showMenu(selected.value.projectId, selectedNode.value);
  } else if (event.key === 'Escape') { selected.value = null; menu.value = ''; }
  else return;
  event.preventDefault();
}
</script>

<template>
  <section ref="root" class="ap-projects" tabindex="0" :aria-label="t('assetLibrary.projects')" @keydown="onKey" @contextmenu="backgroundContextMenu" @click.self="selected = null">
    <template v-if="detail">
      <button class="ap-project-back" type="button" @click="detail = undefined">← {{ t('assetLibrary.projects') }}</button>
      <CatalogDetails v-if="detail.kind === 'subframe_collection'" :group-id="detail.resource_id || ''" @changed="projectId && loadProject(projectId)" @removed="detail = undefined; projectId && loadProject(projectId)" @source="emit('source', { collectionId: detail!.resource_id! })" />
      <CatalogDetails v-else :asset="detailAsset" @changed="projectId && loadProject(projectId)" @removed="detail = undefined; projectId && loadProject(projectId)" @source="addDetailSource" />
      <LibraryError v-if="error" :error="error" :notify="false" />
    </template>
    <template v-else>
      <div class="ap-project-toolbar">
        <input v-model="query" type="search" :aria-label="t('assetLibrary.projectUi.searchTree')" :placeholder="t('assetLibrary.projectUi.searchTree')">
      </div>
      <div v-if="menu === 'background'" class="ap-project-menu ap-project-background-menu" :style="{ left: backgroundPosition.x + 'px', top: backgroundPosition.y + 'px' }"><button type="button" @click="menu = ''; newItem()">{{ t('assetLibrary.projectUi.new') }}</button></div>
      <form v-if="mode === 'project' || mode === 'move'" class="ap-project-editor" @submit.prevent="mode === 'project' ? saveProject() : saveMove()">
        <template v-if="mode === 'project'"><label>{{ t('assetLibrary.fields.name') }}<input v-model="name" maxlength="120" required></label><label>{{ t('assetLibrary.fields.notes') }}<input v-model="notes" maxlength="4000"></label></template>
        <label v-else>{{ t('assetLibrary.projectUi.moveTo') }}<select v-model="moveParent"><option value="">/</option><option v-for="item in tree(projectId).filter(validMoveTarget)" :key="item.row.id" :value="item.row.id">{{ item.path }}</option></select></label>
        <div class="ap-project-actions"><button type="button" @click="mode = ''">{{ t('storage.cancel') }}</button><button type="submit" :disabled="busy || (mode === 'move' && moveParent === (target?.parent_id || ''))">{{ t('assetLibrary.save') }}</button></div>
      </form>
      <div v-if="mode === 'assets'" class="ap-project-picker">
        <div class="ap-project-picker-head"><strong>{{ t('assetLibrary.addExistingAssets') }}</strong><button type="button" @click="mode = ''">×</button></div>
        <p v-if="pickerTarget" class="ap-project-picker-target">{{ t('assetLibrary.projectPickerDestination') }}: {{ pickerTarget.projectName }}{{ pickerTarget.parentPath === '/' ? ' /' : pickerTarget.parentPath.replaceAll('/', ' / ') }}</p>
        <div class="ap-assets-search-row ap-project-picker-search">
          <SearchField :label="t('assetLibrary.searchAssets')" :clear-label="t('browse.clear')" :value="pickerText" @value-change="pickerText = $event" @search="pickerQuery = $event" />
          <AssetFilterPopover :filters="pickerFilters" :groups="pickerGroups" :pending="choices.state === 'loading'" :error="choices.state === 'error' ? choices.error : undefined" @open="value => { if (value && choices.state === 'error') refreshChoices(); }" @change="changePickerFilter" @clear="pickerFilters = {}" />
        </div>
        <LibraryError v-if="choices.state === 'error'" :error="choices.error" :retry="refreshChoices" />
        <p v-if="choices.state === 'loading'" role="status">{{ t('states.loading') }}</p>
        <p v-else-if="choices.state === 'ready' && !pickerResults.length" class="ap-project-empty">{{ t('assetLibrary.noMatches') }}</p>
        <div class="ap-project-choices"><label v-for="row in pickerResults" :key="row.id" :title="row.name"><input v-model="checked" type="checkbox" :value="row.id" :disabled="alreadyAdded.has(row.id) || (checked.length >= 100 && !checked.includes(row.id))"><span>{{ row.name }}</span><small>{{ t('assetLibrary.importTypes.' + row.asset_type) }}</small><small v-if="alreadyAdded.has(row.id)">{{ t('assetLibrary.projectUi.added') }}</small></label></div>
        <p v-if="checked.length >= 100" class="ap-project-picker-target">{{ t('assetLibrary.projectPickerLimit') }}</p>
        <div class="ap-project-actions"><button type="button" @click="mode = ''">{{ t('storage.cancel') }}</button><button type="button" :disabled="busy || choices.state !== 'ready' || !checked.length" @click="addAssets">{{ t('assetLibrary.projectUi.addSelected', { count: checked.length }) }}</button></div>
      </div>
      <LibraryError v-if="projects.state === 'error'" :error="projects.error" :retry="refreshProjects" />
      <LibraryError v-if="error" :error="error" :notify="false" />
      <p v-if="message" class="ap-project-message" role="status">{{ message }}</p>
      <p v-if="projects.state === 'ready' && !projectRows.length && !edit" class="ap-project-empty">{{ t('assetLibrary.projectEmptyContext') }}</p>
      <p v-else-if="query.trim() && projectRows.length && !projectRows.some(projectVisible)" class="ap-project-empty">{{ t('assetLibrary.projectUi.noResults') }}</p>
      <ul class="ap-project-tree" @click.self="selected = null">
        <li v-if="edit?.type === 'create-project'" class="ap-project-inline"><form @submit.prevent="saveInline"><input v-model="editName" maxlength="120" :aria-label="t('assetLibrary.fields.name')" @blur="blurEdit" @contextmenu.stop @keydown.enter="guardComposition" @keydown.esc.prevent="cancelEdit"></form></li>
        <template v-for="project in projectRows.filter(projectVisible)" :key="project.id">
          <li :class="{ selected: selected?.projectId === project.id && !selected.nodeId, 'drop-target': dropTarget === project.id + ':root' }" @contextmenu="contextMenu($event, project.id)" @dragover="dragOver($event, project.id, null)" @dragleave="dragLeave" @drop="drop($event, project.id, null)">
            <form v-if="edit?.type === 'rename-project' && edit.projectId === project.id" class="ap-project-inline-form" @submit.prevent="saveInline"><input v-model="editName" maxlength="120" :aria-label="t('assetLibrary.fields.name')" @blur="blurEdit" @contextmenu.stop @keydown.enter="guardComposition" @keydown.esc.prevent="cancelEdit"></form>
            <button v-else type="button" class="ap-project-row-name" :data-project-row="project.id" :title="project.name" :aria-expanded="expandedProjects.includes(project.id) || !!query.trim()" @focus="select(project.id)" @click="clickRow(project.id)" @dblclick="doubleClickProject(project)">{{ project.name }}</button>
            <div v-if="menu === project.id" class="ap-project-menu-wrap"><div class="ap-project-menu"><button type="button" @click="menu = ''; newItem()">{{ t('assetLibrary.newFolder') }}</button><button type="button" @click="menu = ''; openAssets()">{{ t('assetLibrary.addExistingAssets') }}</button><button type="button" @click="renameProject(project)">{{ t('assetLibrary.projectUi.rename') }}</button><button type="button" @click="openProjectEdit(project)">{{ t('assetLibrary.editProject') }}</button><button type="button" @click="remove(project.id)">{{ t('assetLibrary.deleteCatalogProject') }}</button></div></div>
          </li>
          <template v-if="expandedProjects.includes(project.id) || query.trim()">
            <li v-if="edit?.type === 'create-folder' && edit.projectId === project.id && !edit.parentId" class="ap-project-inline" :style="{ paddingInlineStart: '14px' }"><form @submit.prevent="saveInline"><input v-model="editName" maxlength="120" :aria-label="t('assetLibrary.folderName')" @blur="blurEdit" @contextmenu.stop @keydown.enter="guardComposition" @keydown.esc.prevent="cancelEdit"></form></li>
            <template v-for="item in visibleTree(project.id)" :key="item.row.id">
              <li :class="{ selected: selected?.projectId === project.id && selected.nodeId === item.row.id, 'drop-target': dropTarget === project.id + ':' + item.row.id }" :style="{ paddingInlineStart: Math.min(item.depth + 1, 7) * 14 + 'px' }" :draggable="!edit && !busy" @contextmenu="contextMenu($event, project.id, item.row)" @dragstart="startDrag($event, project.id, item.row)" @dragend="endDrag" @dragover="item.row.kind === 'folder' && dragOver($event, project.id, item.row.id)" @dragleave="dragLeave" @drop="item.row.kind === 'folder' && drop($event, project.id, item.row.id)">
                <form v-if="edit?.type === 'rename-node' && edit.nodeId === item.row.id" class="ap-project-inline-form" @submit.prevent="saveInline"><input v-model="editName" maxlength="120" :aria-label="t('assetLibrary.fields.name')" @blur="blurEdit" @contextmenu.stop @keydown.enter="guardComposition" @keydown.esc.prevent="cancelEdit"></form>
                <button v-else type="button" class="ap-project-row-name" :class="{ 'ap-project-collection': isCollection(item.row) }" :data-project-row="project.id" :data-node-row="item.row.id" :title="item.path" :aria-expanded="rowExpanded(item.row)" @focus="select(project.id, item.row.id)" @click="clickRow(project.id, item.row)" @dblclick="doubleClickNode(project.id, item.row)">
                  <DisclosureChevron v-if="isCollection(item.row)" /><span>{{ item.row.name }}</span>
                </button>
                <span v-if="item.row.kind !== 'folder'" class="ap-project-kind">{{ t('assetLibrary.importTypes.' + (item.row.asset_type || item.row.kind)) }}<template v-if="isCollection(item.row) && frameCounts[item.row.id] !== undefined"> · {{ t('assetLibrary.frameCount', { count: frameCounts[item.row.id] }) }}</template></span>
                <div v-if="menu === item.row.id" class="ap-project-menu-wrap"><div class="ap-project-menu"><button type="button" @click="menu = ''; newItem()">{{ t('assetLibrary.newFolder') }}</button><button type="button" @click="menu = ''; openAssets()">{{ t('assetLibrary.addExistingAssets') }}</button><button v-if="item.row.kind !== 'folder'" type="button" @click="select(project.id, item.row.id); openDetail(item.row)">{{ t(isCollection(item.row) ? 'assetLibrary.projectGroupDetails' : 'assetLibrary.projectUi.details') }}</button><button type="button" @click="renameNode(project.id, item.row)">{{ t('assetLibrary.projectUi.rename') }}</button><button type="button" @click="openMove(project.id, item.row)">{{ t('assetLibrary.projectUi.moveTo') }}</button><button type="button" @click="remove(project.id, item.row, item.path)">{{ t('assetLibrary.remove') }}</button></div></div>
              </li>
              <li v-if="isCollection(item.row) && expandedCollections.has(item.row.id) && edit?.nodeId !== item.row.id"
                  class="ap-project-branch" data-project-frames :style="{ paddingInlineStart: Math.min(item.depth + 2, 8) * 14 + 'px' }">
                <ProjectSubframes :collection-id="item.row.resource_id" @count="frameCounts[item.row.id] = $event" />
              </li>
              <li v-if="edit?.type === 'create-folder' && edit.projectId === project.id && edit.parentId === item.row.id" class="ap-project-inline" :style="{ paddingInlineStart: Math.min(item.depth + 2, 7) * 14 + 'px' }"><form @submit.prevent="saveInline"><input v-model="editName" maxlength="120" :aria-label="t('assetLibrary.folderName')" @blur="blurEdit" @contextmenu.stop @keydown.enter="guardComposition" @keydown.esc.prevent="cancelEdit"></form></li>
            </template>
          </template>
        </template>
      </ul>
      <LibraryError v-if="editError" :error="editError" :retry="saveInline" @mousedown.prevent />
    </template>
  </section>
</template>

<style scoped>
.ap-projects { min-width:0; min-height:100%; font-size:13px; }
.ap-project-toolbar,.ap-project-actions,.ap-project-picker-head { display:flex; align-items:center; gap:6px; }
.ap-project-toolbar { flex-wrap:wrap; }
.ap-project-toolbar input { flex:1 1 90px; min-width:80px; }
.ap-projects input:not([type=checkbox]),.ap-projects select { box-sizing:border-box; height:30px; padding:3px 8px; font-size:13px; border:1px solid var(--border-color,#41434a); border-radius:6px; background:var(--comfy-input-bg,#22242a); color:inherit; }
.ap-projects button { font-size:13px; cursor:pointer; }
.ap-project-back { border:0; background:transparent; color:inherit; padding:4px; }
.ap-project-menu-wrap { position:relative; }
.ap-project-menu { position:absolute; z-index:5; right:0; top:100%; min-width:125px; padding:4px; border:1px solid var(--border-color,#41434a); border-radius:6px; background:var(--comfy-menu-bg,#25262a); box-shadow:0 4px 14px #0008; }
.ap-project-menu.ap-project-background-menu { position:fixed; z-index:20; right:auto; }
.ap-project-menu button { display:block; width:100%; padding:6px 8px; text-align:left; white-space:nowrap; border:0; background:transparent; color:inherit; }
.ap-project-menu button:hover,.ap-project-tree li:hover { background:#ffffff0a; }
.ap-project-tree { list-style:none; margin:6px 0 0; padding:0; }
.ap-project-tree li { box-sizing:border-box; display:flex; align-items:center; min-width:0; min-height:28px; }
.ap-project-tree li.selected { background:var(--comfy-input-bg,#30333a); border-radius:4px; }
.ap-project-tree li.drop-target { outline:1px solid var(--primary, #1689dc); outline-offset:-1px; border-radius:4px; }
.ap-project-row-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left; border:0; background:transparent; color:inherit; padding:5px 2px; }
.ap-project-collection { display:flex; align-items:center; gap:3px; }
.ap-project-collection span { min-width:0; overflow:hidden; text-overflow:ellipsis; }
.ap-project-collection :deep(.ap-tree-chevron) { flex:none; width:12px; height:12px; }
.ap-project-collection[aria-expanded="false"] :deep(.ap-tree-chevron) { transform:rotate(-90deg); }
.ap-project-tree > .ap-project-branch:hover { background:transparent; }
.ap-project-kind { color:var(--descrip-text,#999); font-size:11px; white-space:nowrap; margin-left:5px; }
.ap-project-inline form,.ap-project-inline-form { flex:1; min-width:0; }
.ap-project-inline input,.ap-project-inline-form input { width:100%; }
.ap-projects .ap-project-inline input,.ap-projects .ap-project-inline-form input { height:26px; }
.ap-project-editor,.ap-project-picker { display:grid; gap:7px; max-width:310px; margin-top:8px; padding:8px; border:1px solid var(--border-color,#41434a); border-radius:6px; }
.ap-project-editor label { display:grid; grid-template-columns:70px minmax(0,1fr); align-items:center; gap:6px; }
.ap-project-editor input,.ap-project-editor select { width:100%; }
.ap-project-actions { justify-content:flex-end; margin-top:4px; }
.ap-project-actions button,.ap-project-picker-head button { padding:4px 8px; border:0; border-radius:5px; background:transparent; color:inherit; }
.ap-project-actions button:last-child { background:#3a3d44; }
.ap-project-picker-head { justify-content:space-between; }
.ap-project-picker-target { margin:0; color:var(--descrip-text,#999); font-size:12px; overflow-wrap:anywhere; }
.ap-project-picker-search { position:static; padding:0; margin:0; }
.ap-project-picker-search .ap-search-field { flex:1; min-width:0; }
.ap-project-picker > input,.ap-project-picker > select { width:100%; }
.ap-project-choices { max-height:180px; overflow:auto; }
.ap-project-choices label { display:flex; align-items:center; gap:6px; min-height:28px; }
.ap-project-choices label span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
.ap-project-choices small,.ap-project-empty { color:var(--descrip-text,#999); }
.ap-project-empty { margin:12px 4px; }
.ap-project-message { margin:6px 4px; color:var(--descrip-text,#aaa); }
</style>
