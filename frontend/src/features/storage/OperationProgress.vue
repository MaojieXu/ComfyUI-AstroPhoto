<script setup lang="ts">
import RetryCalibrationBinding from '../assets/RetryCalibrationBinding.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@comfyorg/design-system/button/Button';
import { ApiError } from '../../api/client';
import { fetchReceipt, mutate, operationPath, type Operation, type Receipt } from '../../api/storage';
import { app } from '../../host/comfy';
import StorageError from './StorageError.vue';
import { capacityBytes } from './format';
import { useStorageAction } from './useStorageAction';

const props = defineProps<{ job: Operation; onTerminal: () => void; onRetryRemaining?: (operationId: string) => void }>();
const { t } = useI18n();
const receipt = shallowRef<Receipt>();
const code = ref('');
const restart = ref(0);
const { pending, error, run } = useStorageAction();
const terminal = ['completed', 'failed', 'cancelled'];
const receiptFields = ['registered', 'copied', 'skipped', 'failed', 'verification'] as const;

watch([() => props.job.operation_id, () => props.job.kind, restart], ([operationId, kind], _, onCleanup) => {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => {
    controller.abort();
    clearTimeout(timer);
  });

  async function poll() {
    try {
      const current = await fetchReceipt({ operation_id: operationId, kind, phase: 'queued' }, controller.signal);
      if (controller.signal.aborted) return;
      receipt.value = current;
      code.value = '';
      if (terminal.includes(current.phase)) props.onTerminal();
      else if (!current.error) timer = setTimeout(() => void poll(), 800);
    } catch (cause) {
      if (!controller.signal.aborted) code.value = cause instanceof ApiError ? cause.code : 'network';
    }
  }

  void poll();
}, { immediate: true });

const phase = computed(() => receipt.value?.phase ?? 'queued');
const totals = computed(() => receipt.value?.receipt);
const binding = computed(() => {
  const issue = totals.value?.binding_error as { master_ids?: unknown } | undefined;
  const id = totals.value?.collection_id;
  return typeof id === 'string' && Array.isArray(issue?.master_ids) && issue.master_ids.every(key => typeof key === 'string')
    ? { id, keys: issue.master_ids as string[] } : undefined;
});
const partial = computed(() => phase.value === 'completed' && typeof totals.value?.failed === 'number' && totals.value.failed > 0);
const reportedError = computed(() => code.value || error.value || receipt.value?.error?.code);
const retryable = computed(() => typeof totals.value?.retryable === 'number' ? totals.value.retryable : 0);

function changeOperation(action: 'cancel' | 'retry') {
  void run(async signal => {
    await mutate(`${operationPath(props.job)}/${action}`, {}, signal);
    if (!signal.aborted) restart.value++;
  });
}

function retryRemaining() {
  void run(async signal => {
    const result = await mutate(`/library/imports/${encodeURIComponent(props.job.operation_id)}/retry-remaining`, {}, signal);
    if (typeof result.operation_id !== 'string') throw new ApiError('schema');
    if (!signal.aborted) props.onRetryRemaining?.(result.operation_id);
  });
}

function discardTarget() {
  const path = operationPath(props.job) + '/discard-target';
  void run(async signal => {
    const preview = await mutate(path, {}, signal);
    if (!Array.isArray(preview.files) || !preview.files.every(file => typeof file === 'string')) {
      throw new ApiError('schema');
    }
    const confirmed = await app.extensionManager.dialog.confirm({
      key: 'astrophoto.discard-migration-target', type: 'delete',
      title: t('storage.discardTarget'), message: t('storage.discardTargetHelp'),
      itemList: preview.files.slice(0, 50),
    });
    if (signal.aborted || confirmed !== true) return;
    await mutate(path, { confirm: true }, signal);
    if (!signal.aborted) restart.value++;
  });
}
</script>

<template>
  <section class="ap-operation" :aria-label="t('storage.operation')">
    <RetryCalibrationBinding v-if="binding" :collection-id="binding.id" :master-ids="binding.keys"
      @changed="onTerminal" />
    <div role="status">
      <strong class="ap-storage-badge" :data-state="phase">
        {{ t('storage.phases.' + (partial ? 'partial' : phase), phase) }}
      </strong>
      <p><code>{{ job.operation_id }}</code></p>
      <progress v-if="typeof totals?.processed === 'number' && typeof totals.total === 'number'"
        :aria-label="t('storage.operation')" :value="totals.processed" :max="Math.max(1, totals.total)" />
      <template v-for="field in receiptFields" :key="field">
        <p v-if="typeof totals?.[field] === 'number' || typeof totals?.[field] === 'string'">
          {{ t('storage.' + field) }} {{ totals[field] }}
        </p>
      </template>
      <p v-if="typeof totals?.completed_bytes === 'number'">{{ t('storage.movedBytes') }} {{ capacityBytes(totals.completed_bytes) }}</p>
      <p v-if="typeof totals?.target_path === 'string'" class="ap-storage-path">
        {{ t('storage.migrationTarget') }} {{ totals.target_path }}
      </p>
      <p v-if="Array.isArray(totals?.cleanup_remaining) && totals.cleanup_remaining.length">
        {{ t('storage.cleanupCount') }} {{ totals.cleanup_remaining.length }}
      </p>
    </div>
    <StorageError v-if="reportedError" :code="reportedError" :notify="!!code || !!error" />
    <template v-if="Array.isArray(totals?.errors)">
      <div v-for="item in totals.errors" :key="item.entry">#{{ item.entry }} <StorageError :code="item.code" :notify="false" /></div>
    </template>
    <Button v-if="phase !== 'committed' && !terminal.includes(phase)" type="button" class="ap-native-button" variant="secondary" size="md" :disabled="pending"
      @click="changeOperation('cancel')">{{ t('storage.cancel') }}</Button>
    <Button v-if="code" type="button" class="ap-native-button" variant="secondary" size="md" @click="restart++">{{ t('actions.refresh') }}</Button>
    <Button v-if="receipt?.error && !terminal.includes(phase)" type="button" class="ap-native-button" variant="secondary" size="md" :disabled="pending"
      @click="changeOperation('retry')">{{ t('storage.retry') }}</Button>
    <Button v-if="job.kind === 'import' && onRetryRemaining && terminal.includes(phase) && retryable > 0"
      type="button" class="ap-native-button" variant="secondary" size="md" :disabled="pending" @click="retryRemaining">
      {{ t('assetLibrary.retryRemaining', { count: retryable }) }}
    </Button>
    <Button v-if="job.kind === 'migration' && totals?.target_cleanup_available === true && !totals?.target_cleanup"
      type="button" class="ap-native-button" variant="secondary" size="md" :disabled="pending" @click="discardTarget">{{ t('storage.discardTarget') }}</Button>
  </section>
</template>
