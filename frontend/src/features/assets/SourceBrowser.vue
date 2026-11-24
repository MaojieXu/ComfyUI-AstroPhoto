<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError, isRecord, requestJson } from '../../api/client';
import StorageError from '../storage/StorageError.vue';
import '../storage/storage.css';

const props = defineProps<{ allowDirectory: boolean; directoryOnly?: boolean }>();
const emit = defineEmits<{ close: []; choose: [path: string] }>();
const { t } = useI18n();
const dialog = ref<HTMLDialogElement>();
const current = ref<string | null>(null);
const parent = ref<string | null>(null);
const directories = ref<{ name: string; path: string }[]>([]);
const files = ref<{ name: string; path: string }[]>([]);
const pending = ref(false);
const error = ref('');
const controller = new AbortController();
onScopeDispose(() => controller.abort());
const breadcrumbs = computed(() => {
  if (!current.value) return [];
  const windows = /^[A-Za-z]:[\\/]/.test(current.value);
  const separator = windows ? '\\' : '/';
  const parts = current.value.split(/[\\/]+/).filter(Boolean);
  let path = windows ? parts.shift() + separator : separator;
  const result = [{ name: path, path }];
  for (const part of parts) {
    path += (path.endsWith(separator) ? '' : separator) + part;
    result.push({ name: part, path });
  }
  return result;
});
async function browse(path: string | null = null) {
  if (pending.value) return;
  pending.value = true;
  error.value = '';
  try {
    const params = new URLSearchParams({ files: '1' });
    if (path !== null) params.set('path', path);
    const data = await requestJson('/astrophoto/v1/storage/directories?' + params, 'GET', undefined, controller.signal);
    const validEntries = (value: unknown) => Array.isArray(value) && value.every(item =>
      isRecord(item) && typeof item.name === 'string' && typeof item.path === 'string');
    if (!isRecord(data) || !(data.path === null || typeof data.path === 'string') ||
      !(data.parent === null || typeof data.parent === 'string') || !validEntries(data.directories) ||
      (data.files !== undefined && !validEntries(data.files))) throw new ApiError('schema');
    current.value = data.path as string | null;
    parent.value = data.parent as string | null;
    directories.value = data.directories as { name: string; path: string }[];
    files.value = (data.files ?? []) as { name: string; path: string }[];
  } catch (cause) {
    if (!controller.signal.aborted) error.value = cause instanceof ApiError ? cause.code : 'network';
  } finally { pending.value = false; }
}
onMounted(() => { dialog.value?.showModal(); void browse(); });
function choose(path: string) { emit('choose', path); emit('close'); }
</script>

<template>
  <dialog ref="dialog" class="ap-directory-dialog" :aria-label="t('assetLibrary.browseSources')" @cancel.prevent="emit('close')">
    <div class="ap-directory-dialog-body">
      <div class="ap-directory-dialog-header">
        <strong>{{ t('assetLibrary.browseSources') }}</strong>
        <button type="button" class="ap-storage-button" :aria-label="t('storage.closeDirectory')" @click="emit('close')">×</button>
      </div>
      <nav class="ap-directory-breadcrumbs" :aria-label="t('storage.currentPath')">
        <button type="button" :disabled="pending" @click="browse()">{{ t('storage.directoryRoots') }}</button>
        <template v-for="crumb in breadcrumbs" :key="crumb.path">
          <span aria-hidden="true">/</span><button type="button" :disabled="pending" @click="browse(crumb.path)">{{ crumb.name }}</button>
        </template>
      </nav>
      <StorageError v-if="error" :code="error" />
      <button v-if="current !== null" type="button" class="ap-storage-button" :disabled="pending" @click="browse(parent)">{{ t('storage.directoryUp') }}</button>
      <p v-if="pending" role="status">{{ t('states.loading') }}</p>
      <ul v-else class="ap-directory-list">
        <li v-for="directory in directories" :key="directory.path">
          <button type="button" class="ap-storage-button" @click="browse(directory.path)">📁 {{ directory.name }}</button>
        </li>
        <li v-for="file in files" :key="file.path">
          <button v-if="!directoryOnly" type="button" class="ap-storage-button" @click="choose(file.path)">📄 {{ file.name }}</button>
        </li>
      </ul>
      <p v-if="current" class="ap-storage-path">{{ current }}</p>
      <div class="ap-storage-actions">
        <button type="button" class="ap-storage-button" @click="emit('close')">{{ t('storage.cancelDirectory') }}</button>
        <button v-if="props.allowDirectory" type="button" class="ap-storage-button" data-variant="primary"
          :disabled="pending || !current" @click="current && choose(current)">{{ t('storage.chooseDirectory') }}</button>
      </div>
    </div>
  </dialog>
</template>
