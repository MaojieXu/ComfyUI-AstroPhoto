<script setup lang="ts">
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { discardStagedAsset, previewImport, uploadAsset, type ImportPreview, type Project } from '../../api/assets';
import { fetchStorage, startOperation, type Operation } from '../../api/storage';
import { useResource } from '../../shared/useResource';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import OperationProgress from '../storage/OperationProgress.vue';
import { confirmAction } from '../library/components/useMutation';
import { bytes } from '../storage/format';
import LibraryError from './LibraryError.vue';

const props = defineProps<{ active: boolean; projects: Project[]; openStorage: () => void }>();
const emit = defineEmits<{ changed: []; close: [] }>();
const { t } = useI18n();
const { resource: storage, refresh } = useResource(fetchStorage);
type PendingEntry = { id: string; name: string; file?: File; source?: string; uploadId?: string };
const selected = shallowRef<PendingEntry[]>([]);
const filePicker = ref<HTMLInputElement>();
const directoryPicker = ref<HTMLInputElement>();
const page = ref(0);
const pageSize = 30;
const pathEntry = ref('');
const project = ref('');
const classification = ref('');
const results = shallowRef<ImportPreview>();
const previewRevision = ref<number>();
const accepted = shallowRef<Record<string, unknown>>();
const job = shallowRef<Operation>();
const error = shallowRef<unknown>();
const busy = ref(false);
const progressed = ref(0);
let action: AbortController | undefined;
let submitKey = crypto.randomUUID();
const submissionStarted = ref(false);
onScopeDispose(() => {
  action?.abort();
  for (const entry of selected.value) discardUpload(entry);
});

const policy = computed(() => storage.value.state === 'ready' ? storage.value.data : undefined);
const mode = computed(() => policy.value?.imports.default_mode);
const workspace = computed(() => policy.value?.workspaces.find(row => row.is_default));
const canImport = computed(() => policy.value?.capabilities.import && (
  mode.value === 'reference' || workspace.value?.status === 'online' || workspace.value?.status === 'partial'
));
const visible = computed(() => selected.value.slice(page.value * pageSize, (page.value + 1) * pageSize));
const hasMismatch = computed(() => selected.value.some(entry => mode.value === 'reference' ? !entry.source : !entry.file));

function invalidate() {
  results.value = undefined;
  previewRevision.value = undefined;
  accepted.value = undefined;
  if (!submissionStarted.value) submitKey = crypto.randomUUID();
}
watch([project, classification], invalidate);
watch(() => props.active, (active, previous) => {
  if (active && previous === false) refresh();
});
watch(() => policy.value?.imports.revision, revision => {
  if (!submissionStarted.value && previewRevision.value !== undefined && revision !== undefined && revision !== previewRevision.value) invalidate();
});

function appendFiles(files: FileList | File[]) {
  if (busy.value || submissionStarted.value || mode.value !== 'copy') return;
  selected.value = [...selected.value, ...Array.from(files, file => ({
    id: crypto.randomUUID(), name: file.webkitRelativePath || file.name, file,
  }))];
  invalidate();
}
function selectFileList(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) appendFiles(input.files);
  input.value = '';
}
function appendPath() {
  const source = pathEntry.value.trim();
  if (!source || busy.value || submissionStarted.value || mode.value !== 'reference') return;
  selected.value = [...selected.value, { id: crypto.randomUUID(), name: source, source }];
  pathEntry.value = '';
  invalidate();
}
function remove(id: string) {
  const entry = selected.value.find(item => item.id === id);
  if (entry) discardUpload(entry);
  selected.value = selected.value.filter(entry => entry.id !== id);
  page.value = Math.min(page.value, Math.max(0, Math.ceil(selected.value.length / pageSize) - 1));
  invalidate();
}
function clear() {
  for (const entry of selected.value) discardUpload(entry);
  selected.value = [];
  page.value = 0;
  invalidate();
}
function discardUpload(entry: PendingEntry) {
  if (!submissionStarted.value && entry.uploadId) void discardStagedAsset(entry.uploadId).catch(() => {});
}
function onDragOver(event: DragEvent) {
  if (mode.value === 'copy' && !job.value && !busy.value && event.dataTransfer?.types.includes('Files'))
    event.preventDefault();
}
function onDrop(event: DragEvent) {
  if (mode.value !== 'copy' || job.value || busy.value || !event.dataTransfer?.files.length) return;
  event.preventDefault();
  appendFiles(event.dataTransfer.files);
}

async function run(work: (signal: AbortSignal) => Promise<void>) {
  if (busy.value) return;
  action = new AbortController();
  const { signal } = action;
  busy.value = true;
  error.value = undefined;
  try {
    await work(signal);
  } catch (cause) {
    if (!signal.aborted) error.value = cause;
  } finally {
    action = undefined;
    busy.value = false;
  }
}

function preview() {
  if (!policy.value || !canImport.value || !selected.value.length || hasMismatch.value) return;
  const current = policy.value;
  invalidate();
  progressed.value = 0;
  void run(async signal => {
    const payload: Record<string, unknown> = {
      settings_revision: current.imports.revision,
      allow_duplicate: true,
    };
    if (project.value) payload.project_id = project.value;
    if (classification.value) payload.attributes = classification.value === 'video'
      ? { file_kind: 'video' } : { role: classification.value };
    if (current.imports.default_mode === 'copy') {
      const uploads: string[] = [];
      for (const entry of selected.value) {
        signal.throwIfAborted();
        if (!entry.uploadId) {
          const uploadId = crypto.randomUUID();
          try {
            entry.uploadId = await uploadAsset(uploadId, entry.file!, signal);
          } catch (cause) {
            void discardStagedAsset(uploadId).catch(() => {});
            throw cause;
          }
        }
        uploads.push(entry.uploadId);
        progressed.value++;
      }
      payload.uploads = uploads;
    } else {
      payload.sources = selected.value.map(entry => entry.source);
    }
    const checked = await previewImport(payload, signal);
    signal.throwIfAborted();
    results.value = checked;
    accepted.value = { ...payload, preview_id: checked.preview_id };
    previewRevision.value = current.imports.revision;
  });
}

function submit() {
  const payload = accepted.value;
  if (!payload || !results.value || results.value.file_count <= results.value.failed) return;
  void run(async signal => {
    try {
      if (!submissionStarted.value) {
        const current = await fetchStorage(signal);
        if (current.imports.revision !== payload.settings_revision) throw new ApiError('SETTINGS_CHANGED');
      }
      submissionStarted.value = true;
      job.value = await startOperation('import', { ...payload, idempotency_key: submitKey }, signal);
    } catch (cause) {
      if (cause instanceof ApiError && ['SETTINGS_CHANGED', 'REVISION_CONFLICT'].includes(cause.code)) {
        submissionStarted.value = false;
        invalidate();
        refresh();
      } else if (cause instanceof ApiError && cause.status && cause.status < 500) {
        submissionStarted.value = false;
      }
      throw cause;
    }
  });
}

function followRetry(operationId: string) {
  job.value = { operation_id: operationId, kind: 'import', phase: 'queued' };
}

async function discardDraft() {
  if (busy.value) return;
  if (job.value || !selected.value.length ||
      await confirmAction(t('assetLibrary.discard'), t('assetLibrary.discardConfirm'))) emit('close');
}
defineExpose({ discardDraft });
</script>

<template>
  <section class="ap-assets-dialog-content">
    <LibraryError v-if="storage.state === 'error'" :error="storage.error" :retry="refresh" />
    <p v-else-if="!policy" role="status">{{ t('states.loading') }}</p>
    <template v-else>
      <div class="ap-assets-toolbar">
        <div>
          <strong>{{ t('assetLibrary.currentPolicy', { mode: t('assetLibrary.' + mode) }) }}</strong>
          <small v-if="mode === 'copy'">{{ t('assetLibrary.workspace', { name: workspace?.name || '—' }) }}</small>
        </div>
        <button type="button" :disabled="busy" @click="openStorage">{{ t('assetLibrary.openStorage') }}</button>
      </div>
      <p v-if="!canImport" role="alert">{{ t('assetLibrary.storageUnavailable') }}</p>
    </template>

    <OperationProgress v-if="job" :key="job.operation_id" :job="job" :on-terminal="() => emit('changed')" :on-retry-remaining="followRetry" />
    <template v-else>
      <div v-if="mode === 'copy'" class="ap-assets-picker" @dragover="onDragOver" @drop="onDrop">
        <input ref="filePicker" type="file" multiple hidden @change="selectFileList">
        <input ref="directoryPicker" type="file" multiple webkitdirectory hidden @change="selectFileList">
        <div class="ap-assets-toolbar">
          <button type="button" :disabled="busy || submissionStarted || !canImport" @click="filePicker?.click()">{{ t('assetLibrary.pickFiles') }}</button>
          <button type="button" :disabled="busy || submissionStarted || !canImport" @click="directoryPicker?.click()">{{ t('assetLibrary.pickDirectory') }}</button>
        </div>
      </div>
      <form v-else-if="mode === 'reference'" class="ap-assets-form" @submit.prevent="appendPath">
        <p>{{ t('assetLibrary.referencePicker') }}</p>
        <label>{{ t('assetLibrary.authorizedPath') }}<input v-model="pathEntry" :disabled="busy" /></label>
        <button type="submit" :disabled="busy || submissionStarted || !canImport || !pathEntry.trim()">{{ t('assetLibrary.addPath') }}</button>
      </form>

      <div class="ap-assets-toolbar">
        <strong>{{ t('assetLibrary.pendingCount', { count: selected.length }) }}</strong>
        <button type="button" :disabled="busy || submissionStarted || !selected.length" @click="clear">{{ t('assetLibrary.clearSelection') }}</button>
      </div>
      <ul v-if="visible.length" class="ap-assets-list">
        <li v-for="entry in visible" :key="entry.id" class="ap-assets-row">
          <span class="ap-assets-truncate" :title="entry.name">{{ entry.name }}<small v-if="entry.file">{{ bytes(entry.file.size) }}</small></span>
          <button type="button" :disabled="busy || submissionStarted" :aria-label="t('assetLibrary.removeEntry', { name: entry.name })" @click="remove(entry.id)">
            {{ t('assetLibrary.remove') }}
          </button>
        </li>
      </ul>
      <div v-if="selected.length > pageSize" class="ap-assets-toolbar">
        <button type="button" :disabled="page === 0" @click="page--">{{ t('assetLibrary.previous') }}</button>
        <span>{{ page + 1 }} / {{ Math.ceil(selected.length / pageSize) }}</span>
        <button type="button" :disabled="(page + 1) * pageSize >= selected.length" @click="page++">{{ t('assetLibrary.next') }}</button>
      </div>
      <p v-if="hasMismatch" role="alert">{{ t('assetLibrary.selectionModeChanged') }}</p>

      <div class="ap-assets-form">
        <label for="ap-import-class">{{ t('assetLibrary.classification') }}</label>
        <ComfySingleSelect id="ap-import-class" :label="t('assetLibrary.classification')" :value="classification" :disabled="busy || submissionStarted"
          :options="['', 'raw', 'master_frame', 'video'].map(value => ({ value, label: t(value === 'raw' ? 'assetLibrary.subframes' : 'assetLibrary.values.' + (value || 'unspecified')) }))"
          @change="classification = $event" />
        <label for="ap-import-project">{{ t('assetLibrary.project') }}</label>
        <ComfySingleSelect id="ap-import-project" :label="t('assetLibrary.project')" :value="project" :disabled="busy || submissionStarted"
          :options="[{ value: '', label: t('assetLibrary.values.unspecified') }, ...projects.map(row => ({ value: row.id, label: row.name }))]"
          @change="project = $event" />
      </div>

      <p v-if="busy" role="status">{{ t('assetLibrary.working', { count: progressed, total: selected.length }) }}</p>
      <div v-if="results" role="status">
        <p>{{ t('assetLibrary.previewResult', { passed: results.file_count - results.failed - (results.skipped || 0), failed: results.failed,
          skipped: results.skipped || 0, size: bytes(results.size_bytes) }) }}</p>
        <ul v-if="results.errors?.length">
          <li v-for="row in results.errors" :key="row.entry">{{ row.entry }} · {{ t('assetLibrary.errors.' + row.code, row.code) }}</li>
        </ul>
      </div>
      <LibraryError v-if="error" :error="error" />
      <div class="ap-assets-toolbar">
        <button type="button" :disabled="busy || submissionStarted || !canImport || hasMismatch || !selected.length" @click="preview">{{ t('assetLibrary.previewImport') }}</button>
        <button type="button" :disabled="busy || !results || results.file_count <= results.failed" @click="submit">{{ t('assetLibrary.confirmImport') }}</button>
        <button v-if="busy" type="button" @click="action?.abort()">{{ t('storage.cancel') }}</button>
      </div>
    </template>
    <button v-if="job" type="button" @click="emit('close')">{{ t('assetLibrary.allAssets') }}</button>
  </section>
</template>
