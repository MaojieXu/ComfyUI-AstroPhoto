<script setup lang="ts">
import RetryCalibrationBinding from './RetryCalibrationBinding.vue';
import { computed, onMounted, onScopeDispose, ref, shallowReactive, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { cancelDirectImport, readDirectImport, startDirectImport, type DirectEntry, type DirectJob, type ImportTicket } from '../../api/directImport';
import type { Workspace } from '../../api/storage';
import { notifyHost } from '../../host/notify';
import LibraryError from './LibraryError.vue';
import { matchesFile, saveTicket, transferDirectFiles } from './directTransfer';
import { clearTaskError, notifyTask, observeTask, reportTaskError } from '../tasks/taskState';

const props = defineProps<{ ticket: ImportTicket; files: File[]; workspaces: Workspace[] }>();
const emit = defineEmits<{ changed: []; close: [] }>();
const { t } = useI18n();
const job = ref<DirectJob>();
const sources = shallowReactive(new Map<number, File>(props.files.map((file, index) => [index, file])));
const recoveryPicker = ref<HTMLInputElement>();
const folderPicker = ref<HTMLInputElement>();
const recoveryIndex = ref<number>();
const error = shallowRef<unknown>();
const reportedTaskError = ref(false);
const busy = ref(false);
const cancelling = ref(false);
let controller: AbortController | undefined;
onScopeDispose(() => controller?.abort());
const remaining = computed(() => job.value?.entries.filter(entry => entry.status !== 'copied') || []);
const copied = computed(() => (job.value?.entries.length || 0) - remaining.value.length);
const missing = computed(() => remaining.value.filter(entry => !sources.has(entry.index)));
const locations = computed(() => {
  const counts = new Map<string, { id: string; name: string; copied: number; count: number }>();
  for (const entry of job.value?.entries || []) {
    let row = counts.get(entry.workspace_id);
    if (!row) {
      const id = entry.workspace_id;
      row = { id, name: props.workspaces.find(ws => ws.id === id)?.name || id, copied: 0, count: 0 };
      counts.set(id, row);
    }
    row.count++;
    if (entry.status === 'copied') row.copied++;
  }
  return [...counts.values()];
});
const terminal = computed(() => job.value?.phase === 'completed' || job.value?.phase === 'cancelled');

async function loadJob(signal: AbortSignal) {
  if (job.value) return readDirectImport(job.value.id, signal);
  if (!props.files.length) {
    try { return await readDirectImport(props.ticket.preview_id, signal); }
    catch (cause) {
      // A page reload can land between saving the ticket and starting the job.
      if (!props.ticket.idempotency_key || !(cause instanceof ApiError) || cause.status !== 404) throw cause;
    }
  }
  return startDirectImport(props.ticket, signal);
}
async function synchronize(upload: boolean) {
  if (busy.value) return;
  controller = new AbortController();
  const { signal } = controller;
  error.value = undefined;
  reportedTaskError.value = false;
  busy.value = true;
  try {
    const current = await loadJob(signal);
    signal.throwIfAborted();
    job.value = current;
    observeTask(current.id);
    if (upload && !terminal.value && sources.size) {
      clearTaskError(current.id);
      const entries = new Map(job.value.entries.map(entry => [entry.id, entry]));
      const failed = await transferDirectFiles(current, sources, signal, (entry, status, target, code) => {
        const row = entries.get(entry.id)!;
        row.status = status;
        row.workspace_id = target;
        row.error = code || null;
      });
      signal.throwIfAborted();
      job.value = await readDirectImport(current.id, signal);
      signal.throwIfAborted();
      if (failed && remaining.value.length) {
        const code = failed instanceof ApiError ? failed.code : 'network';
        reportedTaskError.value = true;
        error.value = failed;
        reportTaskError(current.id, code, t('taskPanel.failed', { name: t('taskPanel.import') }));
      }
      emit('changed');
    }
    if (terminal.value) {
      saveTicket();
      if (job.value?.phase === 'completed' && upload) notifyTask(current.id, 'completed', 'success', t('assetLibrary.directProgress', { copied: copied.value, total: current.entries.length }));
    }
  } catch (cause) {
    if (!signal.aborted) error.value = cause;
  } finally {
    if (controller?.signal === signal) busy.value = false;
  }
}

function recover(event: Event) {
  const input = event.target as HTMLInputElement;
  const picked = Array.from(input.files || []);
  input.value = '';
  if (!picked.length) return;
  const candidates = new Map<string, DirectEntry[]>();
  for (const entry of missing.value) {
    const list = candidates.get(entry.name) || [];
    list.push(entry);
    candidates.set(entry.name, list);
  }
  let matched = 0;
  for (const file of picked) {
    const matches = (candidates.get(file.name) || []).filter(entry => !sources.has(entry.index) &&
      (recoveryIndex.value === undefined || entry.index === recoveryIndex.value) && matchesFile(entry, file));
    if (matches.length === 1) { sources.set(matches[0].index, file); matched++; }
  }
  recoveryIndex.value = undefined;
  if (matched !== picked.length) notifyHost('warning', t('assetLibrary.unmatchedFiles'));
}
function pickRecovery(index?: number) {
  recoveryIndex.value = index;
  if (recoveryPicker.value) {
    recoveryPicker.value.multiple = index === undefined;
    recoveryPicker.value.click();
  }
}
async function cancel() {
  if (cancelling.value) return;
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;
  cancelling.value = busy.value = true;
  try {
    if (job.value) job.value = await cancelDirectImport(job.value.id, signal);
    else {
      try { await cancelDirectImport(props.ticket.preview_id, signal); }
      catch (cause) { if (!(cause instanceof ApiError && cause.status === 404)) throw cause; }
    }
    signal.throwIfAborted();
    saveTicket();
    emit('changed');
    emit('close');
  } catch (cause) {
    if (!signal.aborted) error.value = cause;
  } finally {
    busy.value = cancelling.value = false;
  }
}
function leave() {
  if (busy.value) return;
  if (terminal.value) saveTicket();
  emit('close');
}
defineExpose({ leave });
onMounted(() => void synchronize(!!props.files.length));
</script>

<template>
  <section class="ap-operation" :aria-label="t('storage.operation')">
    <template v-if="job">
      <p role="status">{{ t('assetLibrary.directProgress', { copied, total: job.entries.length }) }}</p>
      <progress :value="copied" :max="job.entries.length || 1" :aria-label="t('storage.operation')" />
      <ul class="ap-assets-list">
        <li v-for="row in locations" :key="row.id">{{ row.name }} · {{ row.copied }} / {{ row.count }}</li>
      </ul>
      <p v-if="job.phase === 'cancelled'">{{ t('storage.phases.cancelled') }}</p>
      <RetryCalibrationBinding v-if="job.group_id && job.binding_error" :collection-id="job.group_id"
        :master-ids="job.binding_error.master_ids" @changed="emit('changed')" />
      <template v-if="!terminal && missing.length && !busy">
        <p>{{ t('assetLibrary.reselectFiles', { count: missing.length }) }}</p>
        <input ref="recoveryPicker" type="file" multiple hidden @change="recover">
        <input ref="folderPicker" type="file" multiple webkitdirectory hidden @change="recover">
        <button type="button" @click="pickRecovery()">{{ t('assetLibrary.pickFiles') }}</button>
        <button type="button" @click="recoveryIndex = undefined; folderPicker?.click()">{{ t('assetLibrary.pickDirectory') }}</button>
        <details>
          <summary>{{ t('assetLibrary.pendingCount', { count: missing.length }) }}</summary>
          <button v-for="entry in missing" :key="entry.id" type="button" @click="pickRecovery(entry.index)">
            #{{ entry.index + 1 }} {{ entry.name }}
          </button>
        </details>
      </template>
      <details v-if="!busy && remaining.some(row => row.error)">
        <summary>{{ t('storage.failed') }}</summary>
        <ul><li v-for="entry in remaining.filter(row => row.error)" :key="entry.id">
          {{ entry.name }} · {{ t('storage.errors.' + entry.error, entry.error || '') }}
        </li></ul>
      </details>
    </template>
    <p v-else-if="busy" role="status">{{ t('states.loading') }}</p>
    <LibraryError v-if="error" :error="error" :notify="!reportedTaskError" />
    <div class="ap-assets-toolbar">
      <button v-if="!terminal && !busy" type="button" :disabled="!!job && remaining.length === missing.length && remaining.length > 0"
        @click="synchronize(true)">{{ job ? t('assetLibrary.retryRemaining', { count: remaining.length - missing.length }) : t('actions.retry') }}</button>
      <button v-if="!terminal" type="button" :disabled="cancelling" @click="cancel">{{ t('storage.cancel') }}</button>
      <button v-if="!busy" type="button" @click="leave">{{ t('assetLibrary.allAssets') }}</button>
    </div>
  </section>
</template>
