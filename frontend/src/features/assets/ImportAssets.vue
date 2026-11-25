<script setup lang="ts">
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError, getJson, requestJson } from '../../api/client';
import { fetchEquipmentList, fetchOpticalTrains, fetchTrain, type Device, type Train } from '../../api/equipment';
import { nativePicker } from '../../api/nativePicker';
import { previewImport, type ImportPreview } from '../../api/assets';
import { fetchStorage, startOperation, type Operation } from '../../api/storage';
import { useResource } from '../../shared/useResource';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import OperationProgress from '../storage/OperationProgress.vue';
import { confirmAction } from '../library/components/useMutation';
import { DetailAccordion } from '../library/components/DetailAccordion';
import { bytes } from '../storage/format';
import LibraryError from './LibraryError.vue';
import CaptureFields from './CaptureFields.vue';
import SourceBrowser from './SourceBrowser.vue';
import { previewDirectImport, type DirectPreview, type ImportTicket } from '../../api/directImport';
import DirectImportProgress from './DirectImportProgress.vue';
import { savedTicket, saveTicket } from './directTransfer';
import { observeTask, taskReceipts } from '../tasks/taskState';

const props = defineProps<{ active: boolean; resumeTaskId?: string }>();
const emit = defineEmits<{ changed: []; close: [] }>();
const { t, locale } = useI18n();
const { resource: storage, refresh } = useResource(fetchStorage);
type PendingEntry = { id: string; name: string; file?: File; source?: string };
const selected = shallowRef<PendingEntry[]>([]);
const listExpanded = ref(false);
const filePicker = ref<HTMLInputElement>();
const directoryPicker = ref<HTMLInputElement>();
const page = ref(0);
const pageSize = 30;
const browsingSources = ref(false);
const nativeUnavailable = ref(false);
const types = ['subframe_collection', 'video', 'master_frame', 'image_result'] as const;
type Selection = typeof types[number];
const selectionKind = ref<Selection | ''>('');
const grouped = computed(() => selectionKind.value === 'subframe_collection');
const calibration = computed(() => selectionKind.value === 'master_frame' && ['dark', 'bias', 'dark_flat', 'flat'].includes(masterType.value));
const capture = computed(() => grouped.value || selectionKind.value === 'master_frame');
const frameTypes = ['light', 'dark', 'flat', 'bias', 'dark_flat', 'unknown'];
const name = ref('');
const notes = ref('');
const frameType = ref('unknown');
const masterType = ref('unknown');
const sourceCollection = ref('');
const cameraId = ref('');
const state = ref('unknown');
const parameters = ref<Record<string, string | number>>({ binning: '1' });
const numeric = ['exposure_seconds', 'iso', 'gain', 'offset', 'temperature_c'];
const trainId = ref('');
const filter = ref('unknown');
const train = shallowRef<Train>();
const masterIds = ref<string[]>([]);
const matches = computed(() => frameType.value === 'light' ? ['dark', 'bias', 'flat'] :
  frameType.value === 'flat' ? ['bias', 'dark_flat'] : []);
const { resource: trains } = useResource(async signal => {
  const rows: Train[] = [];
  let after: string | null = null;
  do {
    const page = await fetchOpticalTrains({ after: after ?? undefined }, signal);
    rows.push(...page.items.filter(item => item.status !== 'archived' && item.status !== 'deleted'));
    after = page.next;
  } while (after);
  return rows;
});
const { resource: masters } = useResource(async signal => {
  const rows: { id: string; name: string; type: string; camera_id?: string | null; equipment_train_id?: string | null; filter_state?: string; filter_id?: string | null; exposure_seconds?: number | null; iso?: number | null; gain?: number | null; offset?: number | null; binning?: string | null; readout_mode?: string | null }[] = [];
  let cursor = '';
  do {
    const page = await getJson('/astrophoto/v1/catalog/calibration_master?after=' + cursor, signal) as
      { items: typeof rows; next: string | null };
    rows.push(...page.items);
    cursor = page.next ?? '';
  } while (cursor);
  return rows;
});
const candidates = computed(() => masters.value.state === 'ready'
  ? masters.value.data.filter(item => matches.value.includes(item.type)).map(item => {
    const pairs: [unknown, unknown][] = [[train.value?.camera_id, item.camera_id]];
    for (const key of ['iso', 'gain', 'offset', 'binning', 'readout_mode'] as const) {
      const other = key === 'iso' ? 'gain' : key === 'gain' ? 'iso' : '';
      if (other && (parameters.value[key] == null || parameters.value[key] === '') && item[key] == null && parameters.value[other] != null && parameters.value[other] !== '' && item[other] != null) continue;
      pairs.push([parameters.value[key], item[key]]);
    }
    if (['dark', 'dark_flat'].includes(item.type)) pairs.push([parameters.value.exposure_seconds, item.exposure_seconds]);
    if (item.type === 'flat') pairs.push([trainId.value, item.equipment_train_id], [filter.value, item.filter_state === 'selected' ? item.filter_id : item.filter_state]);
    const difference = pairs.some(([a, b]) => a != null && b != null && a !== '' && b !== '' && a !== 'unknown' && b !== 'unknown' && String(a) !== String(b));
    const unknown = item.type === 'flat' || pairs.some(([a, b]) => a == null || b == null || a === '' || b === '' || a === 'unknown' || b === 'unknown');
    return { ...item, comparisonStatus: difference ? 'difference' : unknown ? 'unknown' : 'match' };
  }) : []);
watch(candidates, rows => { masterIds.value = masterIds.value.filter(id => rows.some(row => row.id === id)); });
const { resource: calibrationSources } = useResource(async signal => {
  const rows: { id: string; name: string; frame_type: string }[] = [];
  let after = '';
  do {
    const page = await getJson('/astrophoto/v1/catalog/subframe_collection?after=' + after, signal) as
      { items: typeof rows; next: string | null };
    rows.push(...page.items);
    after = page.next ?? '';
  } while (after);
  return rows;
});
const { resource: cameras } = useResource(async signal => {
  const rows: Device[] = [];
  let after: string | null = null;
  do {
    const page = await fetchEquipmentList({ type: 'camera', after: after ?? undefined }, signal);
    rows.push(...page.items.filter(item => !item.archived_at_utc));
    after = page.next;
  } while (after);
  return rows;
});
watch(frameType, () => { masterIds.value = []; });
watch(masterType, () => { sourceCollection.value = ''; });
watch(sourceCollection, (id, _old, cleanup) => {
  if (!id) return;
  const controller = new AbortController();
  cleanup(() => controller.abort());
  void getJson('/astrophoto/v1/catalog/subframe_collection/' + encodeURIComponent(id) + '?summary=1', controller.signal)
    .then(raw => {
      const row = raw as Record<string, unknown>;
      for (const key of [...numeric, 'binning', 'readout_mode']) {
        if (row[key] != null && (parameters.value[key] == null || parameters.value[key] === '' || key === 'binning' && parameters.value[key] === '1')) parameters.value[key] = row[key] as string | number;
      }
      if (!trainId.value && row.equipment_train_id && trains.value.state === 'ready' && trains.value.data.some(item => item.id === row.equipment_train_id)) {
        trainId.value = String(row.equipment_train_id);
        filter.value = row.filter_state === 'selected' ? String(row.filter_id) : String(row.filter_state || 'unknown');
      }
    }).catch(cause => { if (!controller.signal.aborted) error.value = cause; });
});
watch(trainId, (id, _old, cleanup) => {
  filter.value = 'unknown';
  train.value = undefined;
  if (!id) return;
  const controller = new AbortController();
  cleanup(() => controller.abort());
  void fetchTrain(id, controller.signal).then(row => { train.value = row; }).catch(cause => {
    if (!controller.signal.aborted) error.value = cause;
  });
}, { flush: 'sync' });
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
const supportsParallel = computed(() => mode.value === 'copy' && grouped.value && eligible.value.length > 1);
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

function invalidate() {
  results.value = undefined;
  directResults.value = undefined;
  previewRevision.value = undefined;
  accepted.value = undefined;
  if (!submissionStarted.value) submitKey = crypto.randomUUID();
}
watch([name, notes, frameType, masterType, sourceCollection, cameraId, state, parameters, trainId, filter, masterIds, parallel, workspaceIds],
  () => { if (!busy.value) invalidate(); }, { deep: true });
watch(() => props.active, (active, previous) => {
  if (active && previous === false) refresh();
});
watch(() => policy.value?.imports.revision, revision => {
  if (!submissionStarted.value && previewRevision.value !== undefined && revision !== undefined && revision !== previewRevision.value) invalidate();
});

function appendFiles(files: FileList | File[]) {
  if (busy.value || submissionStarted.value || (mode.value && mode.value !== 'copy')) return;
  const entries = Array.from(files, file => ({ id: crypto.randomUUID(), name: file.webkitRelativePath || file.name, file }));
  if ((!grouped.value && entries.length > 1) || (grouped.value && entries.some(entry => !entry.file.webkitRelativePath))) {
    selectionError.value = true;
    invalidate();
    return;
  }
  if (!entries.length) return;
  selectionError.value = false;
  const previous = selected.value;
  selected.value = grouped.value ? [...previous, ...entries.filter(entry => !previous.some(row =>
    row.name === entry.name && row.file?.size === entry.file.size && row.file?.lastModified === entry.file.lastModified))] : entries;
  if (!previous.length || !grouped.value) name.value = grouped.value ? entries[0].name.split('/')[0] : entries[0].name;
  page.value = 0;
  invalidate();
}
function selectFileList(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) appendFiles(input.files);
  input.value = '';
}
function setSource(source: string) {
  if (submissionStarted.value || mode.value !== 'reference') return;
  selectionError.value = false;
  name.value = sourceName(source);
  selected.value = [{ id: crypto.randomUUID(), name: name.value, source }];
  page.value = 0;
  invalidate();
}
async function chooseFolder(source: string, signal: AbortSignal) {
  const response = await requestJson('/astrophoto/v1/catalog/source-folder', 'POST', { path: source }, signal) as
    { names: string[] };
  const separator = source.includes('\\') ? '\\' : '/';
  const root = source.replace(/[\\/]+$/, '');
  const previous = selected.value;
  const entries = response.names.map(file => ({ id: crypto.randomUUID(), name: sourceName(source) + '/' + file,
    source: root + separator + file.replace(/\//g, separator) }));
  selected.value = [...previous, ...entries.filter(entry => !previous.some(row => row.source?.toLowerCase() === entry.source.toLowerCase()))];
  if (!previous.length && entries.length) name.value = sourceName(source);
  selectionError.value = false;
  page.value = 0;
  invalidate();
}
function chooseSource(source: string) {
  if (grouped.value) void run(signal => chooseFolder(source, signal));
  else setSource(source);
}
function sourceName(source: string) {
  return source.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || source;
}
function pickNativeSource(kind: 'file' | 'folder') {
  void run(async signal => {
    const language = locale.value.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    const result = await nativePicker(kind, signal, kind === 'folder' ? undefined : language);
    if (result.status === 'selected') {
      if (result.path && grouped.value) await chooseFolder(result.path, signal);
      else if (result.path) setSource(result.path);
    } else if (result.status === 'unavailable') { nativeUnavailable.value = true; browsingSources.value = true; }
    else if (result.status === 'busy') throw new ApiError('STORAGE_BUSY');
  });
}
function clear() {
  selected.value = [];
  listExpanded.value = false;
  selectionError.value = false;
  page.value = 0;
  invalidate();
}
function pick() {
  if (mode.value === 'reference') pickNativeSource(grouped.value ? 'folder' : 'file');
  else if (grouped.value) directoryPicker.value?.click();
  else filePicker.value?.click();
}
function chooseKind(kind: Selection) {
  clear();
  parameters.value = { binning: '1' };
  selectionKind.value = kind;
  pick();
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

function importSelected() {
  if (busy.value || !policy.value || !canImport.value || !selected.value.length || !name.value.trim() ||
      hasMismatch.value || selectionError.value || parameters.value.binning === 'custom') return;
  if (submissionStarted.value) { submitAccepted(); return; }
  const current = policy.value;
  invalidate();
  void run(async signal => {
    const config: Record<string, unknown> = {
      kind: selectionKind.value === 'master_frame' ? 'image_result' : selectionKind.value,
      name: name.value.trim(), notes: notes.value.trim() || null,
    };
    if (selectionKind.value === 'master_frame' || selectionKind.value === 'image_result') config.result_type = selectionKind.value;
    if (selectionKind.value === 'master_frame') config.master_type = masterType.value;
    if (!sourceCollection.value || trainId.value || filter.value !== 'unknown') Object.assign(config, {
      equipment_train_id: trainId.value || null,
      filter_state: ['unknown', 'none'].includes(filter.value) ? filter.value : 'selected',
      filter_id: ['unknown', 'none'].includes(filter.value) ? null : filter.value,
    });
    if (capture.value)
      for (const key of [...numeric, 'binning', 'readout_mode']) {
        const value = parameters.value[key];
        config[key] = value == null || String(value).trim() === '' ? null : numeric.includes(key) ? Number(value) : String(value).trim();
      }
    if (grouped.value) Object.assign(config, { frame_type: frameType.value, calibration_state: state.value, master_ids: masterIds.value });
    if (selectionKind.value === 'master_frame') {
      if (sourceCollection.value) config.source_collection_id = sourceCollection.value;
      if (calibration.value && cameraId.value) config.camera_id = cameraId.value;
    }
    const payload: Record<string, unknown> = {
      settings_revision: current.imports.revision, catalog: config,
    };
    if (current.imports.default_mode === 'copy') {
      payload.files = directFiles.value.map(file => ({ name: file.name, size_bytes: file.size, last_modified_ms: file.lastModified }));
      payload.parallel = !!parallelTargets.value;
      if (parallelTargets.value) payload.workspace_ids = parallelTargets.value;
    } else {
      payload.sources = selected.value.map(entry => entry.source);
    }
    async function check() {
      if (current.imports.default_mode === 'copy') {
        directResults.value = await previewDirectImport(payload, signal);
        return directResults.value;
      }
      return previewImport(payload, signal);
    }
    const checked = await check();
    signal.throwIfAborted();
    results.value = checked;
    if (checked.file_count <= checked.failed) return;
    if (checked.failed) {
      const message = t('assetLibrary.preflightFailures', { failed: checked.failed });
      if (!await confirmAction(t('assetLibrary.reviewImport'), message)) return;
      signal.throwIfAborted();
    }
    accepted.value = { ...payload, preview_id: checked.preview_id };
    previewRevision.value = current.imports.revision;
    await submit(signal);
  });
}

function submitAccepted() {
  void run(submit);
}

async function submit(signal: AbortSignal) {
  const payload = accepted.value;
  if (!payload || !results.value || results.value.file_count <= results.value.failed) return;
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
});
</script>

<template>
  <section class="ap-assets-dialog-content">
    <input ref="filePicker" type="file" hidden @change="selectFileList">
    <input ref="directoryPicker" type="file" multiple webkitdirectory hidden @change="selectFileList">
    <LibraryError v-if="storage.state === 'error'" :error="storage.error" :retry="refresh" />
    <p v-else-if="!policy" role="status">{{ t('states.loading') }}</p>
    <template v-else>
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
      <div v-if="!selected.length && !browsingSources" class="ap-assets-form">
        <button v-for="kind in types" :key="kind" class="ap-import-kind" type="button" :disabled="busy || !canImport" @click="chooseKind(kind)">
          <span>{{ t('assetLibrary.importTypes.' + kind) }}</span>
          <span class="ap-import-kind-description">{{ t('assetLibrary.importTypeDescriptions.' + kind) }}</span>
        </button>
      </div>
      <button v-if="selected.length" type="button" :disabled="busy || submissionStarted || !canImport" @click="pick">
        {{ t(grouped ? 'assetLibrary.pickDirectory' : 'assetLibrary.pickFile') }}
      </button>
      <p v-if="nativeUnavailable && browsingSources" role="status">{{ t('assetLibrary.nativeUnavailableFallback') }}</p>
      <SourceBrowser v-if="browsingSources" :allow-directory="grouped" :directory-only="grouped"
        @choose="chooseSource" @close="browsingSources = false" />
      <p v-if="selectionError" role="alert">{{ t('assetLibrary.singleFileOnly') }}</p>
      <p v-if="hasMismatch" role="alert">{{ t('assetLibrary.selectionModeChanged') }}</p>
      <p v-if="selected.length && !grouped" class="ap-import-file">{{ selected[0].name }}</p>

      <fieldset v-if="selected.length" class="ap-assets-form ap-import-fields" :disabled="busy || submissionStarted">
        <div v-if="grouped">
          <button type="button" class="ap-detail-toggle ap-tree-row ap-tree-folder ap-frame-list-toggle" :aria-expanded="listExpanded" @click="listExpanded = !listExpanded">
            <DisclosureChevron />
            {{ t('assetLibrary.frameCount', { count: selected.length }) }}
          </button>
          <template v-if="listExpanded">
          <ul class="ap-assets-list">
            <li v-for="entry in visible" :key="entry.id" class="ap-frame-list-item">
              <button type="button" class="ap-frame-remove" :aria-label="t('assetLibrary.remove') + ' ' + entry.name" :title="t('assetLibrary.remove')" @click="selected = selected.filter(row => row.id !== entry.id); page = Math.min(page, Math.max(0, Math.ceil(selected.length / pageSize) - 1)); invalidate()">×</button>
              <span>{{ entry.name }}</span>
            </li>
          </ul>
          <div v-if="selected.length > pageSize" class="ap-assets-toolbar">
            <button type="button" :disabled="page === 0" @click="page--">{{ t('assetLibrary.previous') }}</button>
            <button type="button" :disabled="(page + 1) * pageSize >= selected.length" @click="page++">{{ t('assetLibrary.next') }}</button>
          </div>
          </template>
        </div>
        <label>{{ t('assetLibrary.fields.name') }} <input v-model="name" maxlength="120" required aria-describedby="ap-import-name-hint"></label>
        <small id="ap-import-name-hint" class="ap-catalog-meta">{{ t('assetLibrary.uniqueAssetName') }}</small>
        <label v-if="grouped">{{ t('assetLibrary.catalogFields.frame_type') }}
          <select v-model="frameType"><option v-for="value in frameTypes" :key="value" :value="value">{{ t('assetLibrary.values.' + value) }}</option></select>
        </label>
        <label v-if="selectionKind === 'master_frame'">{{ t('assetLibrary.facet.master_type') }}
          <select v-model="masterType"><option v-for="value in ['unknown', 'light', 'dark', 'bias', 'dark_flat', 'flat']" :key="value" :value="value">{{ value === 'light' ? t('assetLibrary.masterPurpose.light') : t('assetLibrary.values.' + value) }}</option></select>
        </label>
        <label v-if="selectionKind === 'master_frame' && calibrationSources.state === 'ready'">
          {{ t('assetLibrary.calibrationSource') }}
          <select v-model="sourceCollection">
            <option value="">{{ t('assetLibrary.values.unspecified') }}</option>
            <option v-for="row in calibrationSources.data.filter(item => masterType === 'unknown' || item.frame_type === masterType)" :key="row.id" :value="row.id">{{ row.name }}</option>
          </select>
        </label>
        <label v-if="calibration && cameras.state === 'ready'">
          {{ t('assetLibrary.catalogFields.camera_id') }}
          <select v-model="cameraId">
            <option value="">{{ t('assetLibrary.values.unspecified') }}</option>
            <option v-for="row in cameras.data" :key="row.id" :value="row.id">{{ row.name }}</option>
          </select>
        </label>
        <DetailAccordion :title="t('assetLibrary.equipmentAndFilter')" :initially-open="selectionKind !== 'image_result'">
          <div class="ap-assets-form ap-import-fields">
            <label>{{ t('assetLibrary.catalogFields.equipment_train_id') }}
              <select v-model="trainId">
                <option value="">{{ t('assetLibrary.values.unspecified') }}</option>
                <option v-for="item in trains.state === 'ready' ? trains.data : []" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </label>
            <LibraryError v-if="trains.state === 'error'" :error="trains.error" />
            <dl v-if="train" class="ap-import-equipment">
              <template v-if="train.summary.camera"><dt>{{ t('assetLibrary.catalogFields.camera_id') }}</dt><dd>{{ train.summary.camera }}</dd></template>
              <template v-if="train.summary.primary_optics"><dt>{{ t('assetLibrary.importCompact.primaryOptics') }}</dt><dd>{{ train.summary.primary_optics }}</dd></template>
              <template v-for="item in train.summary.accessories" :key="item"><dt>{{ t('assetLibrary.importCompact.accessory') }}</dt><dd>{{ item }}</dd></template>
            </dl>
            <DetailAccordion v-if="train?.summary.others.length" :title="t('assetLibrary.importCompact.otherEquipment')" :count="String(train.summary.others.length)">
              <ul class="ap-import-other"><li v-for="item in train.summary.others" :key="item">{{ item }}</li></ul>
            </DetailAccordion>
            <label>{{ t('assetLibrary.fields.filter') }}
              <select v-model="filter" :disabled="!trainId">
                <option value="unknown">{{ t('assetLibrary.values.unknown') }}</option>
                <option value="none">{{ t('assetLibrary.noFilter') }}</option>
                <option v-for="(id, index) in train?.filter_ids ?? []" :key="id" :value="id">
                  {{ train?.components?.find(item => item.id === id)?.name ?? train?.summary.filters[index] ?? id }}
                </option>
              </select>
            </label>
          </div>
        </DetailAccordion>
        <CaptureFields v-if="capture" v-model="parameters" />
        <label v-if="grouped">{{ t('assetLibrary.fields.calibration_state') }}
          <select v-model="state"><option v-for="value in ['unknown', 'uncalibrated', 'calibrated']" :key="value" :value="value">{{ t('assetLibrary.values.' + value) }}</option></select>
        </label>
        <DetailAccordion v-if="grouped && matches.length" :title="t('assetLibrary.calibration')" :count="t('assetLibrary.importCompact.bound', { count: masterIds.length })">
          <LibraryError v-if="masters.state === 'error'" :error="masters.error" />
          <p v-else-if="masters.state === 'ready' && !candidates.length">{{ t('assetLibrary.noMatchingMasters') }}</p>
          <label v-for="item in candidates" :key="item.id" class="ap-assets-checkbox">
            <input v-model="masterIds" type="checkbox" :value="item.id"> {{ item.name }} · {{ t('assetLibrary.comparison.' + item.comparisonStatus) }}
          </label>
        </DetailAccordion>
        <DetailAccordion :title="t('assetLibrary.fields.notes')" :count="notes ? t('assetLibrary.importCompact.hasNotes') : t('assetLibrary.importCompact.notFilled')"><label class="ap-import-notes"><span class="sr-only">{{ t('assetLibrary.fields.notes') }}</span><textarea v-model="notes" maxlength="4000" /></label></DetailAccordion>
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
      </fieldset>

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
      <div class="ap-assets-toolbar ap-import-actions">
        <button v-if="selected.length" type="button" :disabled="busy || !canImport || hasMismatch || selectionError || !name.trim() || parameters.binning === 'custom' || (parallelTargets && parallelTargets.length < 2)"
          @click="importSelected">{{ t(submissionStarted ? 'actions.retry' : 'assetLibrary.importNow') }}</button>
        <button v-if="busy" type="button" @click="action?.abort()">{{ t('storage.cancel') }}</button>
      </div>
    </template>
    <button v-if="job" type="button" @click="emit('close')">{{ t('assetLibrary.allAssets') }}</button>
  </section>
</template>

<style scoped>
.ap-import-kind {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  white-space: normal;
}
.ap-import-kind-description {
  color: var(--ap-text-muted, #999);
  font-size: 0.85em;
  line-height: 1.4;
}
.ap-import-actions { position: sticky; bottom: 0; z-index: 1; padding-block: 6px; background: var(--ap-background, var(--p-content-background, #18181b)); }
.ap-import-file { margin: 0; overflow-wrap: anywhere; color: var(--ap-text-muted, #999); font-size: 12px; }
</style>
