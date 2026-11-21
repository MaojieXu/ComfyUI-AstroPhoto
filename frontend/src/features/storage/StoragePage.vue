<script setup lang="ts">
import { computed, ref, shallowRef, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import { mutate, startOperation, type Mode, type Operation, type Storage } from '../../api/storage';
import type { Resource } from '../../shared/useResource';
import CacheSettings from './CacheSettings.vue';
import OperationProgress from './OperationProgress.vue';
import StorageError from './StorageError.vue';
import WorkspaceActions from './WorkspaceActions.vue';
import { bytes } from './format';
import { useStorageAction } from './useStorageAction';
import './storage.css';

const props = defineProps<{ resource: Resource<Storage>; refresh: () => void }>();
const { t } = useI18n();
const name = ref('');
const path = ref('');
const adding = ref(false);
const addId = useId();
const cleared = ref('');
const validated = ref('');
const { pending, error, run } = useStorageAction();
const storage = computed(() => props.resource.state === 'ready' ? props.resource.data : undefined);
const disabled = computed(() => pending.value || !storage.value?.capabilities.write);
const job = shallowRef<Operation>();
const migration = computed(() => job.value ?? storage.value?.operations.find(operation => operation.kind === 'migration'));
const modes = ['reference', 'copy'] as const;

function change(path: string, body: Record<string, unknown>, method?: string) {
  if (disabled.value) return;
  void run(async signal => {
    const result = await mutate(path, body, signal, method);
    if (signal.aborted) return;
    if (path.endsWith('/validate')) {
      if (typeof result.status !== 'string' || typeof result.name !== 'string') throw new ApiError('schema');
      validated.value = result.name + ' · ' + t('storage.states.' + result.status);
    }
    props.refresh();
  });
}

function setImportMode(mode: Mode) {
  const current = storage.value;
  if (!current || mode === current.imports.default_mode) return;
  change('/storage/settings', {
    expected_revision: current.imports.revision,
    imports: { default_mode: mode },
  }, 'PATCH');
}

function add() {
  if (disabled.value || !adding.value) return;
  void run(async signal => {
    await mutate('/storage/locations', { path: path.value.trim(), name: name.value.trim() }, signal);
    if (signal.aborted) return;
    name.value = '';
    path.value = '';
    adding.value = false;
    props.refresh();
  });
}

function migrate(workspaceId: string, targetPath: string, key: string) {
  if (disabled.value) return;
  void run(async signal => {
    const operation = await startOperation('migration', {
      workspace_id: workspaceId, target_path: targetPath, idempotency_key: key,
    }, signal);
    if (signal.aborted) return;
    job.value = operation;
    props.refresh();
  });
}

function refreshAfterMigration() {
  const phase = migration.value?.phase;
  if (phase && !['completed', 'failed', 'cancelled'].includes(phase)) props.refresh();
}

function clearCache() {
  if (disabled.value) return;
  void run(async signal => {
    const result = await mutate('/storage/cache/clear', { scope: 'all' }, signal);
    if (signal.aborted) return;
    if (typeof result.removed_bytes !== 'number' || typeof result.removed !== 'number' ||
        typeof result.skipped !== 'number' || typeof result.failed !== 'number') throw new ApiError('schema');
    cleared.value = t('storage.clearResult', {
      size: bytes(result.removed_bytes), count: result.removed, skipped: result.skipped, failed: result.failed,
    });
    props.refresh();
  });
}
</script>

<template>
  <template v-if="resource.state === 'error'">
    <StorageError :code="resource.error instanceof ApiError ? resource.error.code : 'network'" />
    <button type="button" class="ap-storage-button" @click="refresh()">{{ t('actions.refresh') }}</button>
  </template>
  <p v-else-if="!storage" role="status">{{ t('states.loading') }}</p>
  <div v-else class="ap-storage">
    <section class="ap-storage-group">
      <h3>{{ t('storage.dataRoot') }}</h3>
      <p class="ap-storage-path">{{ storage.data_root.path }}</p>
      <small>{{ t('storage.source.' + storage.data_root.source) }} · {{ t('storage.db') }} {{ storage.database.assets }}</small>
    </section>
    <StorageError v-if="!storage.capabilities.write" code="UNAUTHORIZED_STORAGE_OPERATION" />
    <StorageError v-if="error" :code="error" />
    <button v-if="error === 'REVISION_CONFLICT'" type="button" class="ap-storage-button" @click="refresh()">
      {{ t('actions.refresh') }}
    </button>
    <section class="ap-storage-group">
      <fieldset class="ap-storage-radio-group" :disabled="disabled">
        <legend>{{ t('storage.importMode') }}</legend>
        <label v-for="mode in modes" :key="mode">
          <input type="radio" name="astrophoto-import-mode" :checked="storage.imports.default_mode === mode"
            @click.prevent="setImportMode(mode)" />
          <span>{{ t('storage.' + mode) }}<small>{{ t('storage.' + mode + 'Help') }}</small></span>
        </label>
      </fieldset>
    </section>
    <section class="ap-storage-group">
      <div class="ap-storage-group-heading">
        <h3>{{ t('storage.workspaces') }}</h3>
        <button type="button" class="ap-storage-button ap-workspace-add" :aria-expanded="adding" :aria-controls="addId"
          :disabled="disabled" @click="adding = !adding">
          <span aria-hidden="true">{{ adding ? '−' : '+' }}</span> {{ t('storage.add') }}
        </button>
      </div>
      <form :id="addId" :hidden="!adding" @submit.prevent="add">
        <fieldset class="ap-storage-fields" :disabled="disabled">
          <label>{{ t('storage.name') }}<input v-model="name" required /></label>
          <label>{{ t('storage.path') }}<input v-model="path" required /></label>
          <div class="ap-storage-actions">
            <button type="submit" class="ap-storage-button" data-variant="primary">{{ t('storage.save') }}</button>
          </div>
        </fieldset>
      </form>
      <ul class="ap-workspace-list">
        <WorkspaceActions v-for="workspace in storage.workspaces" :key="workspace.id" :workspace="workspace" :busy="disabled"
          :settings-revision="storage.imports.revision" @change="change" @migration="migrate" />
      </ul>
      <p v-if="validated" role="status" class="ap-storage-result">{{ validated }}</p>
      <OperationProgress v-if="migration" :key="migration.operation_id" :job="migration" :on-terminal="refreshAfterMigration" />
    </section>
    <CacheSettings :storage="storage" :disabled="disabled" @change="change" @clear="clearCache" />
    <p v-if="cleared" role="status" class="ap-storage-result">{{ cleared }}</p>
  </div>
</template>
