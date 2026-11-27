<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@comfyorg/design-system/button/Button';
import { ApiError } from '../../api/client';
import { mutate, operationPath, type Receipt } from '../../api/storage';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import { notifyTask, observeTask, startTaskTracking, taskLocalErrors, taskPollError, taskReceipts } from './taskState';
import './tasks.css';

const { t } = useI18n();
const emit = defineEmits<{ resume: [id: string] }>();
const terminal = new Set(['completed', 'failed', 'cancelled']);
const inactive = (job: Receipt) => terminal.has(job.phase) || job.phase === 'paused';
const pending = ref('');
const requestError = ref('');
const dismissed = ref(readDismissed());
const expanded = ref(readSession('astrophoto.tasks.expanded') === 'true');
const lifetime = new AbortController();

function readSession(key: string) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function writeSession(key: string, value: string) {
  try { sessionStorage.setItem(key, value); } catch { /* The panel remains usable without session storage. */ }
}
function readDismissed(): string[] {
  try {
    const value: unknown = JSON.parse(readSession('astrophoto.tasks.dismissed') || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}

const visible = computed(() => taskReceipts.value.filter(job => !inactive(job) || !dismissed.value.includes(job.operation_id)).map(job => {
  const code = taskLocalErrors.value[job.operation_id];
  return code && !terminal.has(job.phase) ? { ...job, error: { code } } : job;
}));
const active = computed(() => visible.value.filter(job => !inactive(job)).length);
const hasTasks = computed(() => visible.value.length > 0);
const summary = computed(() => {
  if (!active.value) {
    if (visible.value.some(job => job.phase === 'paused')) return t('storage.phases.paused');
    return t('taskPanel.finished', { count: visible.value.length });
  }
  if (active.value > 1) return t('taskPanel.active', { count: active.value });
  const job = visible.value.find(item => !inactive(item));
  if (job?.error || job?.receipt.direct_import === true && Array.isArray(job.receipt.errors) && job.receipt.errors.length) return t('taskPanel.attention');
  if (job && typeof job.receipt.processed === 'number' && typeof job.receipt.total === 'number' && job.receipt.total > 0) {
    return t('taskPanel.count', { processed: job.receipt.processed, total: job.receipt.total });
  }
  return t('taskPanel.active', { count: active.value });
});

function taskName(job: Receipt) {
  return t(job.kind === 'import' ? 'taskPanel.import' : 'taskPanel.migration');
}
function isPartial(job: Receipt) {
  return job.phase === 'completed' && typeof job.receipt.failed === 'number' && job.receipt.failed > 0;
}
onMounted(() => startTaskTracking((key, values) => t(key, values || {})));
onScopeDispose(() => lifetime.abort());

function toggle() {
  expanded.value = !expanded.value;
  writeSession('astrophoto.tasks.expanded', String(expanded.value));
}
function dismiss(job: Receipt) {
  if (!inactive(job)) return;
  dismissed.value = [...dismissed.value, job.operation_id];
  writeSession('astrophoto.tasks.dismissed', JSON.stringify(dismissed.value));
}
async function retry(job: Receipt) {
  if (pending.value) return;
  pending.value = job.operation_id;
  requestError.value = '';
  try {
    const retryRemaining = job.kind === 'import' && terminal.has(job.phase);
    const path = retryRemaining
      ? `/library/imports/${encodeURIComponent(job.operation_id)}/retry-remaining`
      : `${operationPath(job)}/retry`;
    const result = await mutate(path, {}, lifetime.signal);
    if (retryRemaining && typeof result.operation_id === 'string') observeTask(result.operation_id);
  } catch (cause) {
    if (!lifetime.signal.aborted) {
      requestError.value = cause instanceof ApiError ? cause.code : 'network';
      notifyTask(job.operation_id, `retry:${requestError.value}`, 'error', t('taskPanel.retryFailed'));
    }
  } finally {
    pending.value = '';
  }
}
function canRetry(job: Receipt) {
  return job.receipt.direct_import !== true && ((!!job.error && !terminal.has(job.phase)) ||
    (job.kind === 'import' && terminal.has(job.phase) && typeof job.receipt.retryable === 'number' && job.receipt.retryable > 0));
}
</script>

<template>
  <aside v-if="hasTasks" class="ap-task-panel" :aria-label="t('taskPanel.title')">
    <button class="ap-task-toggle" type="button" :aria-expanded="expanded" aria-controls="ap-task-list" @click="toggle">
      <DisclosureChevron />
      <strong>{{ t('taskPanel.title') }}</strong>
      <span class="ap-task-summary">{{ summary }}</span>
    </button>
    <div v-show="expanded" id="ap-task-list" class="ap-task-list">
      <p v-if="requestError" class="ap-task-error" role="alert">{{ t('taskPanel.retryFailed') }} · {{ requestError }}</p>
      <p v-else-if="taskPollError" class="ap-task-error" role="status">{{ t('taskPanel.updateFailed') }}</p>
      <article v-for="job in visible" :key="job.operation_id" class="ap-task-item">
        <div class="ap-task-row">
          <strong>{{ taskName(job) }}</strong>
          <Button v-if="inactive(job)" type="button" class="ap-native-button ap-task-dismiss" variant="muted-textonly" size="icon"
            :aria-label="t('taskPanel.dismiss', { name: taskName(job) })" @click="dismiss(job)">
            <i class="icon-[lucide--x] size-4" aria-hidden="true" />
          </Button>
        </div>
        <span>{{ t('storage.phases.' + (isPartial(job) ? 'partial' : job.phase), job.phase) }}</span>
        <template v-if="typeof job.receipt.processed === 'number' && typeof job.receipt.total === 'number' && job.receipt.total > 0">
          <progress :value="job.receipt.processed" :max="job.receipt.total" :aria-label="taskName(job)" />
          <span>{{ t('taskPanel.count', { processed: job.receipt.processed, total: job.receipt.total }) }}</span>
        </template>
        <p v-if="job.error" class="ap-task-error">{{ t('storage.errors.' + job.error.code, t('storage.error')) }} · {{ job.error.code }}</p>
        <p v-if="isPartial(job)" class="ap-task-error">{{ t('taskPanel.failedCount', { count: job.receipt.failed }) }}</p>
        <ul v-if="Array.isArray(job.receipt.errors) && job.receipt.errors.length" class="ap-task-error">
          <li v-for="item in job.receipt.errors" :key="item.entry">#{{ item.entry }} · {{ t('storage.errors.' + item.code, item.code) }}</li>
        </ul>
        <Button v-if="canRetry(job)" type="button" class="ap-native-button ap-task-retry" variant="secondary" size="md" :disabled="!!pending" @click="retry(job)">{{ t('storage.retry') }}</Button>
        <Button v-if="job.receipt.direct_import === true && !terminal.has(job.phase)" type="button" class="ap-native-button ap-task-retry" variant="secondary" size="md"
          @click="emit('resume', job.operation_id)">{{ t('taskPanel.openImport') }}</Button>
      </article>
    </div>
  </aside>
</template>
