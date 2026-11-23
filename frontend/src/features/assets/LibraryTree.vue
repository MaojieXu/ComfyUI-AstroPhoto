<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import { notifyHost } from '../../host/notify';
import { removeDocument, writeDocument, type Folder, type Placement } from '../../api/assets';
import { confirmAction, useMutation } from '../library/components/useMutation';
import LibraryError from './LibraryError.vue';
import type { Entry } from './tree';

const props = defineProps<{ entries: Entry[]; selected?: string; query?: string; canDrop?: boolean;
  projectId?: string; folders?: Folder[]; placements?: Placement[]; dropTarget?: string }>();
const emit = defineEmits<{
  select: [entry: Entry]; over: [event: DragEvent, entry: Entry]; drop: [event: DragEvent, entry: Entry];
  drag: [event: DragEvent, entry: Entry]; dragEnd: []; changed: [];
}>();
const { t } = useI18n();
const expanded = ref(new Set<string>());
const focus = ref('');
const tree = ref<HTMLElement>();
function change(id: string, open: boolean) {
  const next = new Set(expanded.value);
  if (open) next.add(id);
  else next.delete(id);
  expanded.value = next;
}
const editor = ref<{ parentId: string | null; folder?: Folder }>();
const folderName = ref('');
watch(() => props.projectId, () => { editor.value = undefined; });
const { run, pending, error } = useMutation();
const notified = ref(false);
watch(error, problem => {
  if (!problem || editor.value || problem.details || problem.status === 409) { notified.value = false; return; }
  const code = problem.code;
  const message = t('assetLibrary.errors.' + code, t('storage.errors.' + code, t('errors.' + code, t('errors.unknown'))));
  notified.value = notifyHost('error', message + ' · ' + code);
});
async function editFolder(parentId: string | null, folder?: Folder) {
  if (pending.value) return;
  if (parentId) change(parentId, true);
  editor.value = { parentId, folder };
  folderName.value = folder?.name ?? '';
  await nextTick();
  tree.value?.querySelector<HTMLInputElement>('[data-folder-name]')?.focus();
}
function cancelEdit() {
  if (!pending.value) editor.value = undefined;
}
function saveFolder() {
  const current = editor.value;
  const name = folderName.value.trim();
  const projectId = props.projectId;
  if (!current || !name || !projectId) return;
  void run(async signal => {
    await writeDocument('folders', { name, project_id: projectId, parent_id: current.parentId }, signal, current.folder);
    if (signal.aborted) return;
    editor.value = undefined;
    emit('changed');
  });
}
function deleteFolder(folder: Folder) {
  void run(async signal => {
    const descendants = new Set([folder.id]);
    let pendingIds = [folder.id];
    while (pendingIds.length) {
      const children = (props.folders ?? []).filter(row => row.parent_id && pendingIds.includes(row.parent_id));
      pendingIds = children.filter(row => !descendants.has(row.id)).map(row => row.id);
      pendingIds.forEach(id => descendants.add(id));
    }
    const count = (props.placements ?? []).filter(row => row.folder_id && descendants.has(row.folder_id)).length;
    if (!await confirmAction(t('assetLibrary.remove'), t('assetLibrary.removeFolderHelp', { folders: descendants.size, count }), folder.name, 'delete')) return;
    await removeDocument('folders', folder, signal, { confirmed: true });
    if (signal.aborted) return;
    editor.value = undefined;
    emit('changed');
  });
}
defineExpose({ startFolder: (parentId: string | null) => editFolder(parentId) });
function contextFolder(event: MouseEvent, entry: Entry) {
  if (!props.projectId || !entry.folder) return;
  event.preventDefault();
  focus.value = entry.id;
  emit('select', entry);
  const row = (event.currentTarget as HTMLElement).closest('.ap-folder-row');
  const menu = row?.querySelector<HTMLDetailsElement>('.ap-folder-menu');
  tree.value?.querySelectorAll<HTMLDetailsElement>('.ap-folder-menu[open]').forEach(item => { item.open = false; });
  if (menu) menu.open = true;
}
const filtered = computed(() => {
  const q = props.query?.trim().toLocaleLowerCase();
  if (!q) return props.entries;
  function filter(entries: Entry[]): Entry[] {
    const result: Entry[] = [];
    for (const entry of entries) {
      if (entry.label.toLocaleLowerCase().includes(q!)) result.push(entry);
      else if (entry.children) {
        const children = filter(entry.children);
        if (children.length) result.push({ ...entry, children });
      }
    }
    return result;
  }
  return filter(props.entries);
});
const open = (id: string) => !!props.query?.trim() || expanded.value.has(id);
const visible = computed(() => {
  const rows: { entry: Entry; level: number; parent?: string }[] = [];
  function add(entries: Entry[], level: number, parent?: string) {
    for (const entry of entries) {
      rows.push({ entry, level, parent });
      if (entry.children && open(entry.id)) add(entry.children, level + 1, entry.id);
    }
  }
  add(filtered.value, 1);
  return rows;
});
const tabStop = computed(() => visible.value.some(row => row.entry.id === focus.value) ? focus.value : visible.value[0]?.entry.id);
async function moveFocus(id?: string) {
  if (!id) return;
  focus.value = id;
  await nextTick();
  const buttons = tree.value?.querySelectorAll<HTMLButtonElement>('[data-tree-id]');
  Array.from(buttons ?? []).find(button => button.dataset.treeId === id)?.focus();
}
function key(event: KeyboardEvent, index: number) {
  const { entry, parent } = visible.value[index];
  let target: string | undefined;
  switch (event.key) {
    case 'ArrowUp': target = visible.value[index - 1]?.entry.id; break;
    case 'ArrowDown': target = visible.value[index + 1]?.entry.id; break;
    case 'Home': target = visible.value[0]?.entry.id; break;
    case 'End': target = visible.value.at(-1)?.entry.id; break;
    case 'ArrowRight':
      if (entry.children && !open(entry.id)) change(entry.id, true);
      else target = entry.children?.[0]?.id;
      break;
    case 'ArrowLeft':
      if (entry.children && open(entry.id) && !props.query) change(entry.id, false);
      else target = parent;
      break;
    default: return;
  }
  event.preventDefault();
  void moveFocus(target);
}
function activate(entry: Entry) {
  focus.value = entry.id;
  if (entry.children) change(entry.id, !open(entry.id));
  emit('select', entry);
}
</script>

<template>
  <ul ref="tree" class="ap-assets-list" role="tree" :aria-label="t('assetLibrary.folderTree')">
    <li v-if="editor && !editor.folder && !editor.parentId" role="none">
      <form class="ap-folder-inline" @submit.prevent="saveFolder" @keydown.esc.stop.prevent="cancelEdit">
        <input v-model="folderName" data-folder-name :aria-label="t('assetLibrary.folderName')" :disabled="pending" required maxlength="120" />
        <button type="submit" :disabled="pending || !folderName.trim()">{{ t('assetLibrary.save') }}</button>
        <button type="button" :disabled="pending" @click="cancelEdit">{{ t('storage.cancel') }}</button>
      </form>
    </li>
    <li v-for="({ entry, level }, index) in visible" :key="entry.id" role="none">
      <div class="ap-folder-row">
      <button type="button" role="treeitem" class="ap-tree-row ap-assets-tree-row" :class="{ 'ap-drop-active': dropTarget === entry.id }"
        :aria-level="level" :aria-expanded="entry.children ? open(entry.id) : undefined" :aria-selected="selected === entry.id"
        :style="{ paddingInlineStart: Math.min(50, 6 + (level - 1) * 12) + 'px' }"
        :tabindex="tabStop === entry.id ? 0 : -1" :data-tree-id="entry.id" :draggable="!!entry.placement || !!entry.folder"
        @contextmenu="contextFolder($event, entry)" @focus="focus = entry.id" @keydown="key($event, index)" @click="activate(entry)"
        @dragstart="emit('drag', $event, entry)" @dragend="emit('dragEnd')"
        @dragover="canDrop && entry.folder && emit('over', $event, entry)"
        @drop="canDrop && entry.folder && emit('drop', $event, entry)">
        <DisclosureChevron v-if="entry.children" />
        <span :title="entry.label">{{ entry.label }}</span>
        <small v-if="entry.placement?.collection_id || entry.collection">{{ t('assetLibrary.collection') }}</small>
        <small v-else-if="entry.master">{{ t('assetLibrary.master') }}</small>
      </button>
      <details v-if="projectId && entry.folder" class="ap-folder-menu" @keydown.esc.stop="($event.currentTarget as HTMLDetailsElement).open = false">
        <summary :aria-label="t('assetLibrary.folderActions', { name: entry.label })">⋯</summary>
        <div class="ap-assets-row-menu">
          <button type="button" :disabled="pending" @click="editFolder(entry.folder.id); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('assetLibrary.newSubfolder') }}</button>
          <button type="button" :disabled="pending" @click="editFolder(entry.folder.parent_id, entry.folder); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('assetLibrary.renameFolder') }}</button>
          <button type="button" :disabled="pending" @click="deleteFolder(entry.folder); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('assetLibrary.deleteFolder') }}</button>
        </div>
      </details>
      </div>
      <form v-if="editor && (editor.folder?.id === entry.folder?.id && editor.folder || !editor.folder && editor.parentId === entry.folder?.id)"
        class="ap-folder-inline" :style="{ paddingInlineStart: Math.min(50, 20 + level * 12) + 'px' }"
        @submit.prevent="saveFolder" @keydown.esc.stop.prevent="cancelEdit">
        <input v-model="folderName" data-folder-name :aria-label="t('assetLibrary.folderName')" :disabled="pending" required maxlength="120" />
        <button type="submit" :disabled="pending || !folderName.trim()">{{ t('assetLibrary.save') }}</button>
        <button type="button" :disabled="pending" @click="cancelEdit">{{ t('storage.cancel') }}</button>
      </form>
    </li>
  </ul>
  <LibraryError v-if="error && !notified" :error="error" />
</template>
