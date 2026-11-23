<script setup lang="ts">
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { nativePicker } from '../../api/nativePicker';
import { previewImport, type ImportPreview, type Project } from '../../api/assets';
import { fetchStorage, startOperation, type Operation } from '../../api/storage';
import { useResource } from '../../shared/useResource';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import OperationProgress from '../storage/OperationProgress.vue';
import { confirmAction } from '../library/components/useMutation';
import { bytes } from '../storage/format';
import LibraryError from './LibraryError.vue';
import { notifyHost } from '../../host/notify';
import SourceBrowser from './SourceBrowser.vue';
import { previewDirectImport, type DirectPreview, type ImportTicket } from '../../api/directImport';
import DirectImportProgress from './DirectImportProgress.vue';
import { savedTicket, saveTicket } from './directTransfer';
import { observeTask, taskReceipts } from '../tasks/taskState';

const props = defineProps<{ active: boolean; projects: Project[]; openStorage: () => void; importKind: 'single' | 'batch'; resumeTaskId?: string }>();
const emit = defineEmits<{ changed: []; close: [] }>();
const { t } = useI18n();
const { resource: storage, refresh } = useResource(fetchStorage);
type PendingEntry = { id: string; name: string; file?: File; source?: string };
const selected = shallowRef<PendingEntry[]>([]);
const filePicker = ref<HTMLInputElement>();
const directoryPicker = ref<HTMLInputElement>();
const page = ref(0);
const pageSize = 30;
const pathEntry = ref('');
const browsingSources = ref(false);
const project = ref('');
const classification = ref('');
const parallel = ref(false);
const workspaceIds = ref<string[]>([]);
const directTicket = shallowRef<ImportTicket | undefined>(props.resumeTaskId
  ? { preview_id: props.resumeTaskId, idempotency_key: '' } : savedTicket());
if (props.resumeTaskId && directTicket.value) saveTicket(directTicket.value);
const directProgress = ref<InstanceType<typeof DirectImportProgress>>();
const directFiles = computed(() => selected.value.flatMap(entry => entry.file ? [entry.file] : []));
const directResults = shallowRef<DirectPreview>();
const plannedLanes = computed(() => new Set(directResults.value?.workspaces.map(row => row.lane)).size);
const recoverable = computed(() => taskReceipts.value.filter(row => row.kind === 'import' &&
  (row.phase === 'importing' || row.phase === 'paused') && row.receipt.direct_import === true));
function resumeDirect(id: string) {
  if (selected.value.length || busy.value) return;
  directTicket.value = { preview_id: id, idempotency_key: '' };
  saveTicket(directTicket.value);
}
const results = shallowRef<ImportPreview>();
const previewRevision = ref<number>();
const accepted = shallowRef<Record<string, unknown>>();
const job = shallowRef<Operation>();
const error = shallowRef<unknown>();
const busy = ref(false);
const selectionError = ref(false);
let action: AbortController | undefined;
let submitKey = crypto.randomUUID();
const submissionStarted = ref(false);
onScopeDispose(() => action?.abort());

const policy = computed(() => storage.value.state === 'ready' ? storage.value.data : undefined);
const mode = computed(() => policy.value?.imports.default_mode);
const eligible = computed(() => policy.value?.workspaces.filter(ws => ws.enabled && ws.status === 'online') || []);
const supportsParallel = computed(() => mode.value === 'copy' && props.importKind === 'batch' && eligible.value.length > 1);
function toggleParallel(event: Event) {
  parallel.value = (event.target as HTMLInputElement).checked;
  workspaceIds.value = parallel.value ? eligible.value.map(ws => ws.id) : [];
}
const parallelTargets = computed(() => parallel.value && supportsParallel.value
  ? workspaceIds.value.filter(id => eligible.value.some(ws => ws.id === id)) : undefined);
const canImport = computed(() => policy.value?.capabilities.import && (
  mode.value === 'reference' || policy.value?.workspaces.some(row => row.status === 'online')
));
const visible = computed(() => selected.value.slice(page.value * pageSize, (page.value + 1) * pageSize));
const hasMismatch = computed(() => selected.value.some(entry => mode.value === 'reference' ? !entry.source : !entry.file));
watch(selectionError, value => { if (value) notifyHost('error', t('assetLibrary.singleFileOnly')); });
watch(hasMismatch, value => { if (value) notifyHost('warning', t('assetLibrary.selectionModeChanged')); });
watch([policy, canImport], ([current, allowed]) => { if (current && !allowed) notifyHost('error', t('assetLibrary.storageUnavailable')); });

function invalidate() {
  results.value = undefined;
  directResults.value = undefined;
  previewRevision.value = undefined;
  accepted.value = undefined;
  if (!submissionStarted.value) submitKey = crypto.randomUUID();
}
watch([project, classification, parallel, workspaceIds], invalidate);
watch(() => props.active, (active, previous) => {
  if (active && previous === false) refresh();
});
watch(() => policy.value?.imports.revision, revision => {
  if (!submissionStarted.value && previewRevision.value !== undefined && revision !== undefined && revision !== previewRevision.value) invalidate();
});

function appendFiles(files: FileList | File[]) {
  if (busy.value || submissionStarted.value || (mode.value && mode.value !== 'copy')) return;
  const entries = Array.from(files, file => ({ id: crypto.randomUUID(), name: file.webkitRelativePath || file.name, file }));
  if (props.importKind === 'single' && entries.length > 1) {
    selectionError.value = true;
    invalidate();
    return;
  }
  if (!entries.length) return;
  selectionError.value = false;
  if (props.importKind === 'single') clear();
  selected.value = [...selected.value, ...entries];
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
  if (props.importKind === 'single') clear();
  selectionError.value = false;
  selected.value = [...selected.value, { id: crypto.randomUUID(), name: source, source }];
  pathEntry.value = '';
  invalidate();
}
function chooseSource(source: string) {
  pathEntry.value = source;
  appendPath();
}
function pickNativeSource(kind: 'file' | 'folder') {
  void run(async signal => {
    const result = await nativePicker(kind, signal);
    if (result.status === 'selected' && result.path) {
      const source = result.path;
      if (props.importKind === 'single') clear();
      selectionError.value = false;
      selected.value = [...selected.value, { id: crypto.randomUUID(), name: source, source }];
      invalidate();
    } else if (result.status === 'unavailable') browsingSources.value = true;
    else if (result.status === 'busy') throw new ApiError('STORAGE_BUSY');
  });
}
function remove(id: string) {
  selectionError.value = false;
  selected.value = selected.value.filter(entry => entry.id !== id);
  page.value = Math.min(page.value, Math.max(0, Math.ceil(selected.value.length / pageSize) - 1));
  invalidate();
}
function clear() {
  selected.value = [];
  selectionError.value = false;
  page.value = 0;
  invalidate();
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
  if (busy.value || !policy.value || !canImport.value || !selected.value.length || hasMismatch.value || selectionError.value) return;
  const current = policy.value;
  invalidate();
  void run(async signal => {
    const payload: Record<string, unknown> = {
      settings_revision: current.imports.revision,
    };
    if (project.value) payload.project_id = project.value;
    if (classification.value) payload.attributes = classification.value === 'video'
      ? { file_kind: 'video' } : { role: classification.value };
    let checked: ImportPreview;
    if (current.imports.default_mode === 'copy') {
      payload.files = directFiles.value.map(file => ({ name: file.name, size_bytes: file.size, last_modified_ms: file.lastModified }));
      payload.parallel = !!parallelTargets.value;
      if (parallelTargets.value) payload.workspace_ids = parallelTargets.value;
      directResults.value = await previewDirectImport(payload, signal);
      checked = directResults.value;
    } else {
      payload.allow_duplicate = true;
      payload.sources = selected.value.map(entry => entry.source);
      checked = await previewImport(payload, signal);
    }
    signal.throwIfAborted();
    results.value = checked;
    if (props.importKind === 'single' && checked.file_count > 1) {
      selectionError.value = true;
      return;
    }
    accepted.value = { ...payload, preview_id: checked.preview_id };
    previewRevision.value = current.imports.revision;
  });
}

function submit() {
  const payload = accepted.value;
  if (!payload || !results.value || results.value.file_count <= results.value.failed ||
      (props.importKind === 'single' && results.value.file_count > 1)) return;
  void run(async signal => {
    try {
      if (!submissionStarted.value) {
        const current = await fetchStorage(signal);
        if (current.imports.revision !== payload.settings_revision) throw new ApiError('SETTINGS_CHANGED');
      }
      submissionStarted.value = true;
      if (directResults.value) {
        directTicket.value = { preview_id: directResults.value.preview_id, idempotency_key: submitKey };
        saveTicket(directTicket.value);
      } else {
        job.value = await startOperation('import', { ...payload, idempotency_key: submitKey }, signal);
        observeTask(job.value.operation_id);
      }
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
  observeTask(operationId);
  job.value = { operation_id: operationId, kind: 'import', phase: 'queued' };
}

async function discardDraft() {
  if (directTicket.value) { directProgress.value?.leave(); return; }
  if (busy.value) return;
  if (job.value || !selected.value.length ||
      await confirmAction(t('assetLibrary.discard'), t('assetLibrary.discardConfirm'))) emit('close');
}
defineExpose({ discardDraft, hasTask: (id: string) => directTicket.value?.preview_id === id,
  openFilePicker: () => { if (!directTicket.value && !recoverable.value.length) filePicker.value?.click(); } });
</script>

<template>
  <section class="ap-assets-dialog-content">
    <input ref="filePicker" type="file" :multiple="importKind === 'batch'" hidden @change="selectFileList">
    <LibraryError v-if="storage.state === 'error'" :error="storage.error" :retry="refresh" />
    <p v-else-if="!policy" role="status">{{ t('states.loading') }}</p>
    <template v-else>
      <div v-if="!directTicket" class="ap-assets-toolbar">
        <button type="button" :disabled="busy" @click="openStorage">{{ t('assetLibrary.openStorage') }}</button>
      </div>
      <p v-if="!canImport" role="alert">{{ t('assetLibrary.storageUnavailable') }}</p>
    </template>

    <DirectImportProgress v-if="directTicket" ref="directProgress" :ticket="directTicket" :files="directFiles"
      :workspaces="policy?.workspaces || []" @changed="emit('changed')" @close="emit('close')" />
    <OperationProgress v-else-if="job" :key="job.operation_id" :job="job" :on-terminal="() => emit('changed')" :on-retry-remaining="followRetry" />
    <template v-else>
      <div v-if="!selected.length && recoverable.length" class="ap-assets-toolbar">
        <button v-for="item in recoverable" :key="item.operation_id" type="button" :disabled="busy" @click="resumeDirect(item.operation_id)">
          {{ t('assetLibrary.resumeDirect', { id: item.operation_id.slice(0, 8), copied: item.receipt.copied || 0, total: item.receipt.total }) }}
        </button>
      </div>
      <div v-if="mode === 'copy'" class="ap-assets-picker" @dragover="onDragOver" @drop="onDrop">
        <input v-if="importKind === 'batch'" ref="directoryPicker" type="file" multiple webkitdirectory hidden @change="selectFileList">
        <div class="ap-assets-toolbar">
          <button type="button" :disabled="busy || submissionStarted || !canImport" @click="filePicker?.click()">{{ t(importKind === 'single' ? 'assetLibrary.pickFile' : 'assetLibrary.pickFiles') }}</button>
          <button v-if="importKind === 'batch'" type="button" :disabled="busy || submissionStarted || !canImport" @click="directoryPicker?.click()">{{ t('assetLibrary.pickDirectory') }}</button>
        </div>
      </div>
      <form v-else-if="mode === 'reference'" class="ap-assets-form" @submit.prevent="appendPath">
        <p>{{ t(importKind === 'single' ? 'assetLibrary.referencePickerSingle' : 'assetLibrary.referencePicker') }}</p>
        <label>{{ t('assetLibrary.authorizedPath') }}<input v-model="pathEntry" :disabled="busy" /></label>
        <button type="button" :disabled="busy || submissionStarted || !canImport" @click="pickNativeSource('file')">{{ t('assetLibrary.nativeFile') }}</button>
        <button v-if="importKind === 'batch'" type="button" :disabled="busy || submissionStarted || !canImport" @click="pickNativeSource('folder')">{{ t('assetLibrary.nativeFolder') }}</button>
        <button type="button" :disabled="busy || submissionStarted || !canImport" @click="browsingSources = true">{{ t('assetLibrary.browseSources') }}</button>
        <button type="submit" :disabled="busy || submissionStarted || !canImport || !pathEntry.trim()">{{ t('assetLibrary.addPath') }}</button>
      </form>
      <SourceBrowser v-if="browsingSources" :allow-directory="importKind === 'batch'" @choose="chooseSource" @close="browsingSources = false" />

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
      <p v-if="selectionError" role="alert">{{ t('assetLibrary.singleFileOnly') }}</p>
      <p v-if="hasMismatch" role="alert">{{ t('assetLibrary.selectionModeChanged') }}</p>

      <div class="ap-assets-form">
        <p v-if="importKind === 'batch'">{{ t('assetLibrary.batchAttributes') }}</p>
        <label for="ap-import-class">{{ t('assetLibrary.classification') }}</label>
        <ComfySingleSelect id="ap-import-class" :label="t('assetLibrary.classification')" :value="classification" :disabled="busy || submissionStarted"
          :options="['', 'raw', 'master_frame', 'video'].map(value => ({ value, label: t(value === 'raw' ? 'assetLibrary.subframes' : 'assetLibrary.values.' + (value || 'unspecified')) }))"
          @change="classification = $event" />
        <label for="ap-import-project">{{ t('assetLibrary.project') }}</label>
        <ComfySingleSelect id="ap-import-project" :label="t('assetLibrary.project')" :value="project" :disabled="busy || submissionStarted"
          :options="[{ value: '', label: t('assetLibrary.values.unspecified') }, ...projects.map(row => ({ value: row.id, label: row.name }))]"
          @change="project = $event" />
        <label v-if="supportsParallel" class="ap-assets-checkbox">
          <input type="checkbox" :checked="parallel" :disabled="busy || submissionStarted" @change="toggleParallel">
          {{ t('assetLibrary.parallelImport') }}
        </label>
        <fieldset v-if="parallelTargets" class="ap-assets-form" :disabled="busy || submissionStarted">
          <legend>{{ t('assetLibrary.importLocations') }}</legend>
          <label v-for="ws in eligible" :key="ws.id" class="ap-assets-checkbox">
            <input v-model="workspaceIds" type="checkbox" :value="ws.id"> {{ ws.name }}
          </label>
        </fieldset>
      </div>

      <p v-if="busy" role="status">{{ t('states.loading') }}</p>
      <div v-if="results" role="status">
        <p>{{ t('assetLibrary.previewResult', { passed: results.file_count - results.failed - (results.skipped || 0), failed: results.failed,
          skipped: results.skipped || 0, size: bytes(results.size_bytes) }) }}</p>
        <p v-if="results.workspace_id">{{ t('assetLibrary.actualLocation', { name: policy?.workspaces.find(row => row.id === results?.workspace_id)?.name || results.workspace_id }) }}</p>
        <ul v-if="directResults" class="ap-assets-list">
          <li v-for="row in directResults.workspaces" :key="row.workspace_id">
            {{ policy?.workspaces.find(ws => ws.id === row.workspace_id)?.name || row.workspace_id }} ·
            {{ t('assetLibrary.plannedFiles', { count: row.file_count, size: bytes(row.size_bytes) }) }}
          </li>
        </ul>
        <p v-if="parallelTargets && directResults">{{ t('assetLibrary.plannedLanes', { count: plannedLanes }) }}</p>
        <ul v-if="results.errors?.length">
          <li v-for="row in results.errors" :key="row.entry">{{ row.entry }} · {{ t('assetLibrary.errors.' + row.code, row.code) }}</li>
        </ul>
      </div>
      <LibraryError v-if="error" :error="error" />
      <div class="ap-assets-toolbar">
        <button type="button" :disabled="busy || submissionStarted || !canImport || hasMismatch || selectionError || !selected.length || (parallelTargets && parallelTargets.length < 2)" @click="preview">{{ t('assetLibrary.previewImport') }}</button>
        <button type="button" :disabled="busy || !accepted || !results || results.file_count <= results.failed" @click="submit">{{ t('assetLibrary.confirmImport') }}</button>
        <button v-if="busy" type="button" @click="action?.abort()">{{ t('storage.cancel') }}</button>
      </div>
    </template>
    <button v-if="job" type="button" @click="emit('close')">{{ t('assetLibrary.allAssets') }}</button>
  </section>
</template>
