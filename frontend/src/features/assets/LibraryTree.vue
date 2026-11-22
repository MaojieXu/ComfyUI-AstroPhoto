<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import type { Entry } from './tree';

const props = defineProps<{ entries: Entry[]; selected?: string; query?: string; canDrop?: boolean }>();
const emit = defineEmits<{
  select: [entry: Entry]; over: [event: DragEvent, entry: Entry]; drop: [event: DragEvent, entry: Entry];
  drag: [event: DragEvent, entry: Entry]; dragEnd: [];
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
    <li v-for="({ entry, level }, index) in visible" :key="entry.id" role="none">
      <button type="button" role="treeitem" class="ap-tree-row ap-assets-tree-row"
        :aria-level="level" :aria-expanded="entry.children ? open(entry.id) : undefined" :aria-selected="selected === entry.id"
        :style="{ paddingInlineStart: Math.min(50, 6 + (level - 1) * 12) + 'px' }"
        :tabindex="tabStop === entry.id ? 0 : -1" :data-tree-id="entry.id" :draggable="!!entry.placement || !!entry.folder"
        @focus="focus = entry.id" @keydown="key($event, index)" @click="activate(entry)"
        @dragstart="emit('drag', $event, entry)" @dragend="emit('dragEnd')"
        @dragover="canDrop && entry.folder && emit('over', $event, entry)"
        @drop="canDrop && entry.folder && emit('drop', $event, entry)">
        <DisclosureChevron v-if="entry.children" />
        <span :title="entry.label">{{ entry.label }}</span>
        <small v-if="entry.placement?.collection_id || entry.collection">{{ t('assetLibrary.collection') }}</small>
        <small v-else-if="entry.master">{{ t('assetLibrary.master') }}</small>
      </button>
    </li>
  </ul>
</template>
