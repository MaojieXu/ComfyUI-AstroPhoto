<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchApprovals, resolveApproval, type Approval } from '../../api/assets';
import { useResource } from '../../shared/useResource';
import { confirmAction, useMutation } from '../library/components/useMutation';
import LibraryError from './LibraryError.vue';

const emit = defineEmits<{ applied: [] }>();
const { t } = useI18n();
const { resource, refresh } = useResource(fetchApprovals);
const { pending, run, error } = useMutation();
const unresolved = computed(() => resource.value.state === 'ready'
  ? resource.value.data.filter(row => row.status === 'pending') : []);

function decide(row: Approval, approved: boolean) {
  void run(async signal => {
    if (approved && !await confirmAction(t('assetLibrary.approve'), t('assetLibrary.approveConfirm'), row.kind + ' · ' + row.method))
      return;
    await resolveApproval(row.id, approved, signal);
    if (signal.aborted) return;
    refresh();
    if (approved) emit('applied');
  });
}
</script>

<template>
  <div class="ap-assets-dialog-content">
    <button type="button" :disabled="pending" @click="refresh">{{ t('actions.refresh') }}</button>
    <p v-if="resource.state === 'loading'" role="status">{{ t('states.loading') }}</p>
    <LibraryError v-else-if="resource.state === 'error'" :error="resource.error" :retry="refresh" />
    <p v-else-if="!unresolved.length" role="status">{{ t('assetLibrary.noApprovals') }}</p>
    <LibraryError v-if="error" :error="error" />
    <ul class="ap-assets-list">
      <li v-for="row in unresolved" :key="row.id" class="ap-assets-approval">
        <strong>{{ row.kind }} · {{ row.method }}</strong>
        <p v-if="row.record_id">{{ row.record_id }}</p>
        <pre>{{ JSON.stringify(row.payload, null, 2) }}</pre>
        <div class="ap-assets-toolbar">
          <button type="button" :disabled="pending" @click="decide(row, true)">{{ t('assetLibrary.approve') }}</button>
          <button type="button" :disabled="pending" @click="decide(row, false)">{{ t('assetLibrary.deny') }}</button>
        </div>
      </li>
    </ul>
  </div>
</template>
