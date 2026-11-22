<script setup lang="ts">
import { computed, ref, shallowRef, useId, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError, isRecord } from '../../api/client';
import { app } from '../../host/comfy';
import { mutate, previewMigration, startOperation, type MigrationOption, type MigrationPreview, type Mode,
  type Operation, type Storage, type Volume } from '../../api/storage';
import type { Resource } from '../../shared/useResource';
import CacheSettings from './CacheSettings.vue';
import OperationProgress from './OperationProgress.vue';
import StorageError from './StorageError.vue';
import WorkspaceActions from './WorkspaceActions.vue';
import { bytes, capacityBytes } from './format';
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
const validationMissing = ref<string[]>([]);
const { pending, error, run } = useStorageAction();
const storage = computed(() => props.resource.state === 'ready' ? props.resource.data : undefined);
const disabled = computed(() => pending.value || !storage.value?.capabilities.write);
const job = shallowRef<Operation>();
const migration = computed(() => job.value ?? storage.value?.operations.find(operation => operation.kind === 'migration'));
const modes = ['reference', 'copy'] as const;
const migrationPreview = shallowRef<MigrationPreview>();
const rootPreview = shallowRef<{ source: string; target: string; size: number }>();
const writable = computed(() => storage.value?.workspaces.filter(workspace => ['online', 'partial'].includes(workspace.status)) ?? []);
const migrationSources = computed(() => writable.value.filter(workspace => workspace.status === 'online'));
const sourceId = ref('');
const targetId = ref('');
const amount = ref<number | ''>('');
const unit = ref<'GB' | '%'>('GB');
let key = '';
let previewRequest = 0;
watch([sourceId, targetId, amount, unit], () => {
  previewRequest++;
  migrationPreview.value = undefined;
});

function change(path: string, body: Record<string, unknown>, method?: string) {
  if (disabled.value) return;
  void run(async signal => {
    const result = await mutate(path, body, signal, method);
    if (signal.aborted) return;
    if (path.endsWith('/validate')) {
      if (typeof result.status !== 'string' || typeof result.name !== 'string') throw new ApiError('schema');
      validated.value = result.name + ' · ' + t('storage.states.' + result.status);
      validationMissing.value = Array.isArray(result.missing)
        ? result.missing.filter(isRecord).map(entry => String(entry.relative_key)) : [];
    }
    props.refresh();
  });
}

function relocate(workspaceId: string, target: string) {
  if (disabled.value) return;
  const endpoint = '/storage/locations/' + encodeURIComponent(workspaceId) + '/relocate';
  void run(async signal => {
    try {
      await mutate(endpoint, { new_path: target }, signal);
    } catch (cause) {
      if (!(cause instanceof ApiError) || cause.code !== 'WORKSPACE_REBIND_PARTIAL') throw cause;
      const missing = cause.details?.missing;
      const confirmed = await app.extensionManager.dialog.confirm({
        key: 'astrophoto.partial-workspace-rebind',
        title: t('storage.relocate'),
        message: t('storage.partialRebind', { count: cause.details?.missing_count }),
        itemList: Array.isArray(missing) ? missing.filter(isRecord).map(file => String(file.relative_key)) : [],
      });
      if (signal.aborted || confirmed !== true) return;
      await mutate(endpoint, { new_path: target, allow_partial: true }, signal);
    }
    if (!signal.aborted) props.refresh();
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

function preflight(body: Record<string, unknown>) {
  if (disabled.value) return;
  const request = ++previewRequest;
  migrationPreview.value = undefined;
  void run(async signal => {
    const preview = await previewMigration(body, signal);
    if (signal.aborted || request !== previewRequest) return;
    migrationPreview.value = preview;
    key = crypto.randomUUID();
  });
}

function migrate(workspaceId: string, targetPath: string) {
  preflight({ workspace_id: workspaceId, target_path: targetPath });
}

function shellPath(value: string) {
  return "'" + value.replaceAll("'", "''") + "'";
}

async function confirmMigration(option: MigrationOption) {
  const preview = migrationPreview.value;
  if (!preview || disabled.value) return;
  const itemList = option.id === 'complete' ? preview.cleanup_files :
    preview.groups.filter(group => option.groups.includes(group.id)).flatMap(group => group.members);
  const confirm = await app.extensionManager.dialog.confirm({
    key: 'astrophoto.confirm-migration',
    title: t('storage.migrate'),
    message: t('storage.migrationConfirm', { volume: capacityBytes(option.bytes) }),
    itemList: itemList.slice(0, 50),
    hint: t('storage.migrationFiles', { count: itemList.length }),
  });
  if (confirm !== true || migrationPreview.value !== preview || disabled.value) return;
  void run(async signal => {
    const operation = await startOperation('migration', {
      plan_id: preview.plan_id, option_id: option.id, idempotency_key: key,
    }, signal);
    if (signal.aborted) return;
    migrationPreview.value = undefined;
    job.value = operation;
    props.refresh();
  });
}

async function planRootMove() {
  if (disabled.value) return;
  const target = (await app.extensionManager.dialog.prompt({
    title: t('storage.moveRoot'), message: t('storage.path'),
  }))?.trim();
  if (!target || disabled.value) return;
  void run(async signal => {
    const result = await mutate('/storage/data-root/preflight', { target_path: target }, signal);
    if (typeof result.source !== 'string' || typeof result.target !== 'string' || typeof result.copy_bytes !== 'number') {
      throw new ApiError('schema');
    }
    if (!signal.aborted) rootPreview.value = { source: result.source, target: result.target, size: result.copy_bytes };
  });
}

async function editQuota(volume: Volume) {
  const revision = storage.value?.imports.revision;
  const workspace = storage.value?.workspaces.find(item => volume.workspace_ids.includes(item.id)
    && ['online', 'partial', 'read_only'].includes(item.status))?.id;
  if (disabled.value || revision === undefined || !workspace) return;
  const value = await app.extensionManager.dialog.prompt({
    title: t('storage.volumeQuota'),
    message: t('storage.volumeQuotaHelp'),
    defaultValue: volume.quota_bytes === null ? '' : String(volume.quota_bytes / 1e9),
  });
  if (value == null) return;
  const quota = value.trim() ? Math.round(Number(value) * 1e9) : null;
  if (quota !== null && (!Number.isSafeInteger(quota) || quota < 0)) {
    void run(async () => { throw new ApiError('INVALID_REQUEST'); });
    return;
  }
  change('/storage/locations/' + encodeURIComponent(workspace) + '/volume',
    { expected_revision: revision, quota_bytes: quota }, 'PATCH');
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
      <button type="button" class="ap-storage-button" :disabled="disabled" @click="planRootMove">
        {{ t('storage.moveRoot') }}
      </button>
      <div v-if="rootPreview" role="status">
        <p class="ap-storage-path">{{ rootPreview.source }} → {{ rootPreview.target }} · {{ capacityBytes(rootPreview.size) }}</p>
        <p>{{ t('storage.moveRootInstructions') }}</p>
        <code>uv run python -m astrophoto.storage.data_root move {{ shellPath(rootPreview.source) }} {{ shellPath(rootPreview.target) }}</code>
      </div>
      <p v-else-if="storage.data_root_receipt" role="status" class="ap-storage-path">
        {{ storage.data_root_receipt.source }} → {{ storage.data_root_receipt.target }}
      </p>
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
          :settings-revision="storage.imports.revision" @change="change" @migration="migrate" @relocate="relocate" />
      </ul>
      <p v-if="validated" role="status" class="ap-storage-result">{{ validated }}</p>
      <ul v-if="validationMissing.length" class="ap-workspace-list" :aria-label="t('storage.missingFiles', { count: validationMissing.length })">
        <li v-for="file in validationMissing" :key="file" class="ap-storage-path">{{ file }}</li>
      </ul>
      <OperationProgress v-if="migration" :key="migration.operation_id" :job="migration" :on-terminal="refreshAfterMigration" />
    </section>
    <section v-if="storage.volumes?.length" class="ap-storage-group">
      <h3>{{ t('storage.volumeQuota') }}</h3>
      <div v-for="volume in storage.volumes" :key="volume.id" class="ap-storage-fields">
        <p>{{ storage.workspaces.filter(workspace => volume.workspace_ids.includes(workspace.id)).map(workspace => workspace.name).join(' · ') }}</p>
        <p>{{ t('storage.volumeBalance', { free: capacityBytes(volume.free_bytes), used: capacityBytes(volume.used_bytes), reserved: capacityBytes(volume.reserved_bytes) }) }}</p>
        <p>{{ volume.quota_bytes === null ? t('storage.noQuota') : t('storage.quotaBalance', {
          quota: capacityBytes(volume.quota_bytes), remaining: capacityBytes(volume.remaining_quota_bytes),
        }) }}</p>
        <div><button type="button" class="ap-storage-button" :disabled="disabled" @click="editQuota(volume)">
          {{ t('storage.editQuota') }}
        </button></div>
      </div>
    </section>
    <section v-if="writable.length > 1 || migrationPreview" class="ap-storage-group">
      <form v-if="writable.length > 1 && migrationSources.length" @submit.prevent="preflight({
        workspace_id: sourceId, target_workspace_id: targetId, amount, unit,
      })">
        <fieldset class="ap-storage-fields" :disabled="disabled">
          <legend>{{ t('storage.partialMigration') }}</legend>
          <label>{{ t('storage.migrationSource') }}
            <select v-model="sourceId" required>
              <option disabled value="">{{ t('storage.selectWorkspace') }}</option>
              <option v-for="workspace in migrationSources" :key="workspace.id" :value="workspace.id">{{ workspace.name }}</option>
            </select>
          </label>
          <label>{{ t('storage.migrationTarget') }}
            <select v-model="targetId" required>
              <option disabled value="">{{ t('storage.selectWorkspace') }}</option>
              <option v-for="workspace in writable.filter(item => item.id !== sourceId)"
                :key="workspace.id" :value="workspace.id">{{ workspace.name }}</option>
            </select>
          </label>
          <label>{{ t('storage.migrationAmount') }}
            <input v-model.number="amount" type="number" min="0.000000001" step="any" :max="unit === '%' ? 100 : undefined" required />
          </label>
          <select v-model="unit" :aria-label="t('storage.migrationUnit')"><option>GB</option><option>%</option></select>
          <div><button class="ap-storage-button" type="submit" :disabled="sourceId === targetId">
            {{ t('storage.migrationPreview') }}
          </button></div>
        </fieldset>
      </form>
      <div v-if="migrationPreview" role="status">
        <p class="ap-storage-path">{{ migrationPreview.source }} → {{ migrationPreview.target }}</p>
        <p>{{ t('storage.migrationBasis', { base: capacityBytes(migrationPreview.base_bytes), volume: capacityBytes(migrationPreview.requested_bytes) }) }}</p>
        <p v-if="migrationPreview.same_volume">{{ t('storage.sameVolume') }}</p>
        <StorageError v-if="migrationPreview.reason" :code="migrationPreview.reason" />
        <div v-for="option in migrationPreview.options" :key="option.id">
          <button class="ap-storage-button" type="button" :disabled="disabled" @click="confirmMigration(option)">
            {{ t('storage.migrationOptions.' + option.id, {
              volume: capacityBytes(option.bytes), difference: capacityBytes(Math.abs(option.difference_bytes)),
            }) }}
          </button>
        </div>
      </div>
    </section>
    <CacheSettings :storage="storage" :disabled="disabled" @change="change" @clear="clearCache" />
    <p>{{ t('storage.exitClearsCache') }}</p>
    <p v-if="cleared" role="status" class="ap-storage-result">{{ cleared }}</p>
  </div>
</template>
