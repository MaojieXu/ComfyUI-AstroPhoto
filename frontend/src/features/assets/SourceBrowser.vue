<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@comfyorg/design-system/button/Button';
import Dialog from '@comfyorg/design-system/dialog/Dialog';
import DialogContent from '@comfyorg/design-system/dialog/DialogContent';
import DialogHeader from '@comfyorg/design-system/dialog/DialogHeader';
import DialogOverlay from '@comfyorg/design-system/dialog/DialogOverlay';
import DialogPortal from '@comfyorg/design-system/dialog/DialogPortal';
import DialogTitle from '@comfyorg/design-system/dialog/DialogTitle';
import { ApiError, isRecord, requestJson } from '../../api/client';
import StorageError from '../storage/StorageError.vue';
import '../storage/storage.css';

const props = defineProps<{ allowDirectory: boolean; directoryOnly?: boolean }>();
const emit = defineEmits<{ close: []; choose: [path: string] }>();
const { t } = useI18n();
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
onMounted(() => { void browse(); });
function choose(path: string) { emit('choose', path); emit('close'); }
</script>

<template>
  <Dialog :open="true" @update:open="value => { if (!value) emit('close'); }">
    <DialogPortal><DialogOverlay />
      <DialogContent size="sm" :aria-describedby="undefined">
        <div class="astrophoto-ui ap-dialog-scope">
      <DialogHeader>
        <DialogTitle>{{ t('assetLibrary.browseSources') }}</DialogTitle>
        <Button type="button" class="ap-native-button" variant="muted-textonly" size="icon" icon="icon-[lucide--x]" :aria-label="t('storage.closeDirectory')" @click="emit('close')" />
      </DialogHeader>
    <div class="ap-directory-dialog-body">
      <nav class="ap-directory-breadcrumbs" :aria-label="t('storage.currentPath')">
        <button type="button" :disabled="pending" @click="browse()">{{ t('storage.directoryRoots') }}</button>
        <template v-for="crumb in breadcrumbs" :key="crumb.path">
          <span aria-hidden="true">/</span><button type="button" :disabled="pending" @click="browse(crumb.path)">{{ crumb.name }}</button>
        </template>
      </nav>
      <StorageError v-if="error" :code="error" />
      <Button v-if="current !== null" type="button" class="ap-native-button" variant="textonly" size="md" :disabled="pending" @click="browse(parent)">{{ t('storage.directoryUp') }}</Button>
      <p v-if="pending" role="status">{{ t('states.loading') }}</p>
      <ul v-else class="ap-directory-list">
        <li v-for="directory in directories" :key="directory.path">
          <Button type="button" class="ap-native-button ap-directory-entry" variant="textonly" size="md" @click="browse(directory.path)"><i class="icon-[lucide--folder] size-4" aria-hidden="true" />{{ directory.name }}</Button>
        </li>
        <li v-for="file in files" :key="file.path">
          <Button v-if="!directoryOnly" type="button" class="ap-native-button ap-directory-entry" variant="textonly" size="md" @click="choose(file.path)"><i class="icon-[lucide--file] size-4" aria-hidden="true" />{{ file.name }}</Button>
        </li>
      </ul>
      <p v-if="current" class="ap-storage-path">{{ current }}</p>
      <div class="ap-storage-actions">
        <Button type="button" class="ap-native-button" variant="textonly" size="md" @click="emit('close')">{{ t('storage.cancelDirectory') }}</Button>
        <Button v-if="props.allowDirectory" type="button" class="ap-native-button" variant="primary" size="md"
          :disabled="pending || !current" @click="current && choose(current)">{{ t('storage.chooseDirectory') }}</Button>
      </div>
    </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
