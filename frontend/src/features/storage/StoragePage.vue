<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref, useId, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError, isRecord, requestJson } from '../../api/client';
import { nativePicker } from '../../api/nativePicker';
import { app } from '../../host/comfy';
import { notifyHost } from '../../host/notify';
import { notifyTask } from '../tasks/taskState';
import { mutate, type Mode, type Storage, type Workspace } from '../../api/storage';
import type { Resource } from '../../shared/useResource';
import StorageError from './StorageError.vue';
import { bytes, capacityBytes } from './format';
import { useStorageAction } from './useStorageAction';
import './storage.css';

const props = defineProps<{ resource: Resource<Storage>; refresh: () => void }>();
function closeLocationMenus(event: Event) {
  const target = event.target;
  document.querySelectorAll<HTMLDetailsElement>('.ap-storage .ap-location-menu[open]').forEach(menu => {
    if (!(target instanceof Node) || !menu.contains(target)) menu.open = false;
  });
}
function closeLocationMenusOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') document.querySelectorAll<HTMLDetailsElement>('.ap-storage .ap-location-menu[open]').forEach(menu => { menu.open = false; });
}
onMounted(() => {
  document.addEventListener('pointerdown', closeLocationMenus, true);
  document.addEventListener('contextmenu', closeLocationMenus, true);
  document.addEventListener('keydown', closeLocationMenusOnEscape, true);
});
onScopeDispose(() => {
  document.removeEventListener('pointerdown', closeLocationMenus, true);
  document.removeEventListener('contextmenu', closeLocationMenus, true);
  document.removeEventListener('keydown', closeLocationMenusOnEscape, true);
});
const { t } = useI18n();
const name = ref('');
const path = ref('');
const adding = ref(false);
const browsing = ref(false);
const directoryDialog = ref<HTMLDialogElement>();
const removalDialog = ref<HTMLDialogElement>();
const removalSource = ref<Workspace>();
const targetId = ref('');
const movingFrom = ref('');
const removalNotice = ref('');
const directoryPath = ref<string | null>(null);
const directoryParent = ref<string | null>(null);
const directories = ref<{ name: string; path: string }[]>([]);
const dragging = ref<string | null>(null);
const dragTarget = ref<string | null>(null);
const addId = useId();
const { pending, error, details, run } = useStorageAction();
const storage = computed(() => props.resource.state === 'ready' ? props.resource.data : undefined);
const disabled = computed(() => pending.value || !storage.value?.capabilities.write);
const removalTargets = computed(() => {
  const source = removalSource.value;
  return storage.value?.workspaces.filter(row => {
    if (row.id === source?.id || !row.enabled) return false;
    if (source?.removal_target_id) {
      return row.id === source.removal_target_id && ['online', 'migrating'].includes(row.status);
    }
    return row.status === 'online';
  }) ?? [];
});
const configuredVolumes = computed(() => storage.value?.volumes?.filter(volume => volume.quota_bytes !== null) ?? []);
const modes = ['reference', 'copy'] as const;
const breadcrumbs = computed(() => {
  const current = directoryPath.value;
  if (!current) return [];
  const windows = /^[A-Za-z]:[\\/]/.test(current);
  const separator = windows ? '\\' : '/';
  const parts = current.split(/[\\/]+/).filter(Boolean);
  let accumulated = windows ? parts.shift() + separator : separator;
  const result = [{ name: accumulated, path: accumulated }];
  for (const part of parts) {
    accumulated = accumulated.endsWith(separator) ? accumulated + part : accumulated + separator + part;
    result.push({ name: part, path: accumulated });
  }
  return result;
});

watch([browsing, directoryDialog], ([open, dialog]) => {
  if (!dialog) return;
  if (open && !dialog.open) dialog.showModal();
  if (!open && dialog.open) dialog.close();
}, { flush: 'post' });

function setImportMode(mode: Mode) {
  const current = storage.value;
  if (disabled.value || !current || mode === current.imports.default_mode) return;
  void run(async signal => {
    await mutate('/storage/settings', {
      expected_revision: current.imports.revision,
      imports: { default_mode: mode },
    }, signal, 'PATCH');
    if (!signal.aborted) props.refresh();
  });
}

function add() {
  const input = { path: path.value.trim(), name: name.value.trim() };
  if (disabled.value || !adding.value || !input.name || !input.path) return;
  void run(async signal => {
    await mutate('/storage/locations', input, signal);
    if (signal.aborted) return;
    name.value = '';
    path.value = '';
    adding.value = false;
    props.refresh();
  });
}

function browseDirectories(target: string | null = null) {
  browsing.value = true;
  void run(async signal => {
    const query = target === null ? '' : '?path=' + encodeURIComponent(target);
    const data = await requestJson('/astrophoto/v1/storage/directories' + query, 'GET', undefined, signal);
    if (!isRecord(data) || !(data.path === null || typeof data.path === 'string') ||
      !(data.parent === null || typeof data.parent === 'string') || !Array.isArray(data.directories) ||
      !data.directories.every(item => isRecord(item) && typeof item.name === 'string' && typeof item.path === 'string')) {
      throw new ApiError('schema');
    }
    if (signal.aborted) return;
    directoryPath.value = data.path as string | null;
    directoryParent.value = data.parent as string | null;
    directories.value = data.directories as { name: string; path: string }[];
  });
}

function pickNativeDirectory() {
  void run(async signal => {
    const result = await nativePicker('folder', signal);
    if (result.status === 'selected' && result.path) path.value = result.path;
    else if (result.status === 'unavailable') browseAfterNative.value = true;
    else if (result.status === 'busy') throw new ApiError('STORAGE_BUSY');
  }).then(() => {
    if (browseAfterNative.value) { browseAfterNative.value = false; browseDirectories(); }
  });
}
const browseAfterNative = ref(false);

function chooseDirectory() {
  if (directoryPath.value === null) return;
  path.value = directoryPath.value;
  browsing.value = false;
}

async function rename(workspace: Workspace) {
  const value = await app.extensionManager.dialog.prompt({
    title: t('storage.rename'),
    message: t('storage.name'),
    defaultValue: workspace.name,
  });
  if (value == null || !value.trim() || value.trim() === workspace.name) return;
  void run(async signal => {
    await mutate('/storage/locations/' + encodeURIComponent(workspace.id),
      { expected_revision: workspace.revision, name: value.trim() }, signal, 'PATCH');
    if (!signal.aborted) props.refresh();
  });
}

async function chooseRemovalTarget(workspace: Workspace) {
  if (disabled.value || (storage.value?.workspaces.length ?? 0) < 2) return;
  removalSource.value = workspace;
  targetId.value = workspace.removal_target_id ?? '';
  removalNotice.value = '';
  await nextTick();
  removalDialog.value?.showModal();
}

function confirmRemoval() {
  const source = removalSource.value;
  const target = removalTargets.value.find(row => row.id === targetId.value);
  if (disabled.value || !source || !target) return;
  removalDialog.value?.close();
  movingFrom.value = source.id;
  void run(async signal => {
    try {
      // The response follows verified file copies, which can take minutes.
      const result = await mutate('/storage/locations/' + encodeURIComponent(source.id),
        { expected_revision: source.revision, target_workspace_id: target.id }, signal, 'DELETE', null);
      if (!signal.aborted) {
        const message = t('storage.removedLocation', { source: source.name, target: target.name });
        const delivered = typeof result.operation_id === 'string'
          ? notifyTask(result.operation_id, 'completed', 'success', message)
          : notifyHost('success', message);
        if (!delivered) removalNotice.value = message;
      }
    } finally {
      movingFrom.value = '';
      if (!signal.aborted) props.refresh();
    }
  });
}

async function updatePolicy(order: Workspace[], quotas: Record<string, number | null>) {
  const current = storage.value;
  if (!current || disabled.value) return;
  await run(async signal => {
    await mutate('/storage/location-policy', {
      expected_revision: current.imports.revision, order: order.map(row => row.id), quotas,
    }, signal, 'PUT');
    if (!signal.aborted) props.refresh();
  });
}

function currentQuotas() {
  return Object.fromEntries((storage.value?.workspaces ?? []).map(row => [row.id, row.quota_bytes ?? null]));
}

function move(index: number, direction: number) {
  const rows = [...(storage.value?.workspaces ?? [])];
  const target = index + direction;
  if (target < 0 || target >= rows.length) return;
  [rows[index], rows[target]] = [rows[target], rows[index]];
  void updatePolicy(rows, currentQuotas());
}

function startDrag(event: DragEvent, workspace: Workspace) {
  if (disabled.value || !event.dataTransfer || (storage.value?.workspaces.length ?? 0) < 2) {
    event.preventDefault();
    return;
  }
  dragging.value = workspace.id;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', workspace.id);
}

function endDrag() {
  dragging.value = null;
  dragTarget.value = null;
}

function dragOver(event: DragEvent, workspace: Workspace) {
  if (!dragging.value || dragging.value === workspace.id || disabled.value) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  dragTarget.value = workspace.id;
}

function drop(event: DragEvent, target: Workspace) {
  if (!dragging.value || disabled.value) return;
  event.preventDefault();
  const rows = [...(storage.value?.workspaces ?? [])];
  const from = rows.findIndex(row => row.id === dragging.value);
  const to = rows.findIndex(row => row.id === target.id);
  endDrag();
  if (from < 0 || to < 0 || from === to) return;
  const [item] = rows.splice(from, 1);
  rows.splice(to, 0, item);
  void updatePolicy(rows, currentQuotas());
}

async function editQuota(workspace: Workspace) {
  const value = await app.extensionManager.dialog.prompt({
    title: t('storage.locationLimit'),
    message: t('storage.locationLimitHelp'),
    defaultValue: workspace.quota_bytes == null ? '' : String(workspace.quota_bytes / 1073741824),
  });
  if (value == null) return;
  const quota = value.trim() ? Number(value) * 1073741824 : null;
  if (quota !== null && (!Number.isSafeInteger(quota) || quota < 0)) return;
  await updatePolicy(storage.value?.workspaces ?? [], { ...currentQuotas(), [workspace.id]: quota });
}
</script>

<template>
  <template v-if="resource.state === 'error'">
    <StorageError :code="resource.error instanceof ApiError ? resource.error.code : 'network'" />
    <button type="button" class="ap-storage-button" @click="refresh()">{{ t('actions.refresh') }}</button>
  </template>
  <p v-else-if="!storage" role="status">{{ t('states.loading') }}</p>
  <div v-else class="ap-storage">
    <StorageError v-if="!storage.capabilities.write" code="UNAUTHORIZED_STORAGE_OPERATION" />
    <StorageError v-if="error" :code="error" :notify="typeof details?.operation_id !== 'string'" />
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
          <div class="ap-storage-actions ap-location-form-actions">
            <button type="button" class="ap-storage-button" @click="pickNativeDirectory">{{ t('storage.browseDirectories') }}</button>
            <button type="submit" class="ap-storage-button" data-variant="primary" :disabled="!name.trim() || !path.trim()">
              {{ t('storage.save') }}
            </button>
          </div>
        </fieldset>
      </form>
      <dialog ref="directoryDialog" class="ap-directory-dialog" :aria-label="t('storage.browseDirectories')"
        @cancel.prevent="browsing = false" @close="browsing = false">
        <div class="ap-directory-dialog-body">
          <div class="ap-directory-dialog-header">
            <strong>{{ t('storage.browseDirectories') }}</strong>
            <button type="button" class="ap-storage-button" :aria-label="t('storage.closeDirectory')"
              @click="browsing = false">×</button>
          </div>
          <nav class="ap-directory-breadcrumbs" :aria-label="t('storage.currentPath')">
            <button type="button" @click="browseDirectories()">{{ t('storage.directoryRoots') }}</button>
            <template v-for="crumb in breadcrumbs" :key="crumb.path">
              <span aria-hidden="true">/</span>
              <button type="button" @click="browseDirectories(crumb.path)">{{ crumb.name }}</button>
            </template>
          </nav>
          <StorageError v-if="error" :code="error" />
          <button v-if="directoryPath !== null" type="button" class="ap-storage-button"
            :disabled="pending" @click="browseDirectories(directoryParent)">{{ t('storage.directoryUp') }}</button>
          <p v-if="pending" role="status">{{ t('states.loading') }}</p>
          <ul v-else class="ap-directory-list">
            <li v-for="directory in directories" :key="directory.path">
              <button type="button" class="ap-storage-button" @click="browseDirectories(directory.path)">{{ directory.name }}</button>
            </li>
          </ul>
          <p v-if="directoryPath" class="ap-storage-path">{{ directoryPath }}</p>
          <div class="ap-storage-actions">
            <button type="button" class="ap-storage-button" @click="browsing = false">{{ t('storage.cancelDirectory') }}</button>
            <button type="button" class="ap-storage-button" data-variant="primary" :disabled="pending || directoryPath === null"
              @click="chooseDirectory">{{ t('storage.chooseDirectory') }}</button>
          </div>
        </div>
      </dialog>
      <dialog ref="removalDialog" class="ap-directory-dialog" :aria-label="t('storage.removeLocationTitle')"
        @close="removalSource = undefined">
        <div v-if="removalSource" class="ap-directory-dialog-body ap-storage-fields">
          <strong>{{ t('storage.removeLocationTitle') }}</strong>
          <p>{{ t(removalSource.removal_target_id ? 'storage.resumeRemoveHelp' : 'storage.removeHelp', { name: removalSource.name }) }}</p>
          <label v-if="removalTargets.length">{{ t('storage.removalTarget') }}
            <select v-model="targetId" :disabled="!!removalSource.removal_target_id">
              <option disabled value="">{{ t('storage.chooseTarget') }}</option>
              <option v-for="target in removalTargets" :key="target.id" :value="target.id">
                {{ target.name }} · {{ target.root_path }}
              </option>
            </select>
          </label>
          <p v-else role="status">{{ t(removalSource.removal_target_id ? 'storage.reconnectTarget' : 'storage.noRemovalTarget') }}</p>
          <div class="ap-storage-actions">
            <button type="button" class="ap-storage-button" @click="removalDialog?.close()">{{ t('storage.cancelDirectory') }}</button>
            <button type="button" class="ap-storage-button" data-variant="primary"
              :disabled="disabled || !removalTargets.some(row => row.id === targetId)" @click="confirmRemoval">
              {{ t(removalSource.removal_target_id ? 'storage.resumeRemove' : 'storage.confirmRemove') }}
            </button>
          </div>
        </div>
      </dialog>
      <p v-if="removalNotice" role="status">{{ removalNotice }}</p>
      <ul class="ap-workspace-list">
        <li v-for="(workspace, index) in storage.workspaces" :key="workspace.id" class="ap-workspace-row"
          :class="{ 'ap-location-drop-target': dragTarget === workspace.id }"
          @dragover="dragOver($event, workspace)" @drop="drop($event, workspace)" @dragend="endDrag">
          <div class="ap-storage-meta">
            <span class="ap-location-drag" :draggable="!disabled && storage.workspaces.length > 1"
              :aria-label="t('storage.dragLocation', { name: workspace.name })"
              :title="t('storage.dragLocation', { name: workspace.name })"
              @dragstart="startDrag($event, workspace)" @dragend="endDrag">⠿</span>
            <strong>{{ workspace.name }}</strong>
            <span v-if="index === 0" class="ap-storage-badge">{{ t('storage.preferred') }}</span>
            <details class="ap-location-menu">
              <summary :aria-label="t('storage.workspaceActions', { name: workspace.name })">⋯</summary>
              <div class="ap-location-menu-items" @click="($event.target as HTMLElement).closest('button') && (($event.currentTarget as HTMLElement).closest('details')!.open = false)">
                <details class="ap-location-path">
                  <summary>{{ t('storage.showPath') }}</summary>
                  <p class="ap-storage-path">{{ workspace.root_path }}</p>
                </details>
            <button type="button" class="ap-storage-button" :disabled="disabled" @click="rename(workspace)">
              {{ t('storage.rename') }}
            </button>
            <button type="button" class="ap-storage-button" :disabled="disabled || storage.workspaces.length <= 1"
              :title="storage.workspaces.length <= 1 ? t('storage.lastLocation') : undefined" @click="chooseRemovalTarget(workspace)">
              {{ t(workspace.removal_target_id ? 'storage.resumeRemove' : 'storage.remove') }}
            </button>
            <button type="button" class="ap-storage-button" :disabled="disabled || index === 0" @click="move(index, -1)">
              {{ t('storage.moveUp') }}
            </button>
            <button type="button" class="ap-storage-button" :disabled="disabled || index === storage.workspaces.length - 1" @click="move(index, 1)">
              {{ t('storage.moveDown') }}
            </button>
            <button type="button" class="ap-storage-button" :disabled="disabled" @click="editQuota(workspace)">
              {{ t('storage.locationLimit') }}
            </button>
              </div>
            </details>
          </div>
          <p class="ap-storage-meta">
            <span class="ap-storage-badge" :data-state="workspace.status">{{ t('storage.states.' + workspace.status) }}</span>
            <small v-if="workspace.status === 'migrating' && workspace.underlying_status && workspace.underlying_status !== 'online'">
              {{ t('storage.states.' + workspace.underlying_status) }}
            </small>
            <small>{{ t('storage.free') }} {{ bytes(workspace.free_bytes) }}</small>
            <small>{{ t('storage.locationUsage', { used: bytes(workspace.used_bytes ?? 0), limit: workspace.quota_bytes == null ? t('storage.unlimited') : bytes(workspace.quota_bytes) }) }}</small>
            <small v-if="workspace.missing_count">{{ t('storage.missingFiles', { count: workspace.missing_count }) }}</small>
          </p>
          <p v-if="movingFrom === workspace.id" role="status">{{ t('storage.removalPending') }}</p>
        </li>
      </ul>
    </section>
    <section v-if="configuredVolumes.length" class="ap-storage-group">
      <h3>{{ t('storage.volumeQuota') }}</h3>
      <div v-for="volume in configuredVolumes" :key="volume.id" class="ap-storage-fields">
        <p>{{ storage.workspaces.filter(workspace => volume.workspace_ids.includes(workspace.id)).map(workspace => workspace.name).join(' · ') }}</p>
        <p>{{ t('storage.quotaBalance', {
          quota: capacityBytes(volume.quota_bytes), remaining: capacityBytes(volume.remaining_quota_bytes),
        }) }}</p>
      </div>
    </section>
  </div>
</template>
