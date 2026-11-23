<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { addProjectAssets, listDocuments, type Asset } from '../../api/assets';
import { ApiError } from '../../api/client';
import { useResource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import { confirmAction, useMutation } from '../library/components/useMutation';
import LibraryError from './LibraryError.vue';

const props = defineProps<{ projectId: string; existing: string[] }>();
const emit = defineEmits<{ changed: [added: number, existing: number]; close: [] }>();
const { t } = useI18n();
const search = ref('');
const selected = shallowRef(new Map<string, Asset>());
const rows = shallowRef<Asset[]>([]);
const cursor = ref<string | null>(null);
const load = computed(() => {
  const q = search.value;
  return (signal: AbortSignal) => listDocuments('assets', { q, limit: '30' }, signal);
});
const { resource, refresh } = useResource(load);
const { run, pending, error } = useMutation();
const { run: runPage, pending: pagePending, error: pageError } = useMutation();
watch(resource, value => {
  if (value.state !== 'ready') return;
  rows.value = value.data.items;
  cursor.value = value.data.next;
}, { immediate: true });
function toggle(asset: Asset) {
  const next = new Map(selected.value);
  if (next.has(asset.id)) next.delete(asset.id);
  else next.set(asset.id, asset);
  selected.value = next;
}
function loadMore() {
  const after = cursor.value;
  if (!after) return;
  const q = search.value;
  void runPage(async signal => {
    const result = await listDocuments('assets', { q, after, limit: '30' }, signal);
    if (signal.aborted || search.value !== q || cursor.value !== after || resource.value.state !== 'ready') return;
    if (result.next === after) throw new ApiError('schema');
    rows.value = [...rows.value, ...result.items];
    cursor.value = result.next;
  });
}
function save() {
  if (!selected.value.size || pending.value) return;
  void run(async signal => {
    const result = await addProjectAssets(props.projectId, [...selected.value.keys()], signal);
    if (!signal.aborted) emit('changed', result.added, result.already_present);
  });
}
async function discardDraft() {
  if (pending.value) return;
  if (!selected.value.size || await confirmAction(t('assetLibrary.discard'), t('assetLibrary.discardConfirm'))) emit('close');
}
defineExpose({ discardDraft });
</script>

<template>
  <section class="ap-assets-dialog-content ap-assets-form">
    <SearchField :label="t('assetLibrary.searchAssets')" :clear-label="t('browse.clear')" @search="search = $event" />
    <p v-if="resource.state === 'loading'" role="status">{{ t('states.loading') }}</p>
    <LibraryError v-else-if="resource.state === 'error'" :error="resource.error" :retry="refresh" />
    <p v-else-if="!rows.length" role="status">{{ t('assetLibrary.noMatches') }}</p>
    <ul v-else class="ap-assets-list">
      <li v-for="asset in rows" :key="asset.id" class="ap-assets-row">
        <label class="ap-assets-checkbox ap-assets-truncate">
          <input type="checkbox" :checked="selected.has(asset.id) || existing.includes(asset.id)"
            :disabled="pending || existing.includes(asset.id) || (!selected.has(asset.id) && selected.size >= 1000)"
            @change="toggle(asset)" />
          <span :title="asset.name">{{ asset.name }}</span>
        </label>
        <small v-if="existing.includes(asset.id)">{{ t('assetLibrary.alreadyInProject') }}</small>
      </li>
    </ul>
    <LibraryError v-if="pageError" :error="pageError" :retry="loadMore" />
    <button v-if="cursor" type="button" :disabled="pagePending || pending" @click="loadMore">{{ t('assetLibrary.loadMore') }}</button>
    <p>{{ t('assetLibrary.selectedCount', { count: selected.size }) }}</p>
    <LibraryError v-if="error" :error="error" />
    <div class="ap-assets-toolbar">
      <button type="button" :disabled="pending || !selected.size" @click="save">{{ t('assetLibrary.addSelectedAssets') }}</button>
      <button type="button" :disabled="pending" @click="discardDraft">{{ t('storage.cancel') }}</button>
    </div>
  </section>
</template>
