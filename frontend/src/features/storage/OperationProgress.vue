<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { fetchReceipt, mutate, operationPath, type Operation, type Receipt } from '../../api/storage';
import StorageError from './StorageError.vue';
import { useStorageAction } from './useStorageAction';

const props = defineProps<{ job: Operation; onTerminal: () => void }>();
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
const partial = computed(() => phase.value === 'completed' && typeof totals.value?.failed === 'number' && totals.value.failed > 0);
const reportedError = computed(() => code.value || error.value || receipt.value?.error?.code);

function changeOperation(action: 'cancel' | 'retry') {
  void run(async signal => {
    await mutate(`${operationPath(props.job)}/${action}`, {}, signal);
    if (!signal.aborted) restart.value++;
  });
}
</script>

<template>
  <section class="ap-operation" :aria-label="t('storage.operation')">
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
    </div>
    <StorageError v-if="reportedError" :code="reportedError" />
    <template v-if="Array.isArray(totals?.errors)">
      <div v-for="item in totals.errors" :key="item.entry">#{{ item.entry }} <StorageError :code="item.code" /></div>
    </template>
    <button v-if="!terminal.includes(phase)" type="button" class="ap-storage-button" :disabled="pending"
      @click="changeOperation('cancel')">{{ t('storage.cancel') }}</button>
    <button v-if="code" type="button" class="ap-storage-button" @click="restart++">{{ t('actions.refresh') }}</button>
    <button v-if="receipt?.error && !terminal.includes(phase)" type="button" class="ap-storage-button" :disabled="pending"
      @click="changeOperation('retry')">{{ t('storage.retry') }}</button>
  </section>
</template>
