<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '@comfyorg/design-system/input/Input';
import Button from '@comfyorg/design-system/button/Button';
import { buttonVariants } from '@comfyorg/design-system/button.variants';
import Dialog from '@comfyorg/design-system/dialog/Dialog';
import DialogContent from '@comfyorg/design-system/dialog/DialogContent';
import DialogDescription from '@comfyorg/design-system/dialog/DialogDescription';
import DialogHeader from '@comfyorg/design-system/dialog/DialogHeader';
import DialogOverlay from '@comfyorg/design-system/dialog/DialogOverlay';
import DialogPortal from '@comfyorg/design-system/dialog/DialogPortal';
import DialogTitle from '@comfyorg/design-system/dialog/DialogTitle';
import RadioGroup from '@comfyorg/design-system/radio-group/RadioGroup';
import RadioGroupItem from '@comfyorg/design-system/radio-group/RadioGroupItem';
import { TooltipProvider } from 'reka-ui';
import { ApiError, isRecord, requestJson } from '../../api/client';
import { nativePicker } from '../../api/nativePicker';
import { notifyHost } from '../../host/notify';
import { notifyTask } from '../tasks/taskState';
import { mutate, type Mode, type Storage, type Workspace } from '../../api/storage';
import type { Resource } from '../../shared/useResource';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import StorageError from './StorageError.vue';
import { bytes, capacityBytes } from './format';
import { useStorageAction } from './useStorageAction';
import './storage.css';

const props = defineProps<{ resource: Resource<Storage>; refresh: () => void }>();
function closeLocationMenus(event: Event) {
  if (pending.value) return;
  const target = event.target;
  document.querySelectorAll<HTMLDetailsElement>('.ap-storage .ap-location-menu[open]').forEach(menu => {
    if (!(target instanceof Node) || !menu.contains(target)) menu.open = false;
  });
}
function closeLocationMenusOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && !pending.value) document.querySelectorAll<HTMLDetailsElement>('.ap-storage .ap-location-menu[open]').forEach(menu => { menu.open = false; });
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
const removalOpen = ref(false);
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
const modeId = useId();
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

const editing = ref<Workspace>();
const editName = ref('');
const editLimit = ref('');
const panelError = ref('');
const partialSaved = ref(false);
const limitReference = computed(() => {
  const row = editing.value;
  if (!row || row.status === 'offline' || row.underlying_status === 'offline' || row.free_bytes == null || row.used_bytes == null || row.reserved_bytes == null) return null;
  const volume = storage.value?.volumes?.find(item => item.workspace_ids.includes(row.id));
  if (!volume || !Number.isFinite(volume.available_bytes)) return null;
  const available = volume.remaining_quota_bytes == null ? volume.available_bytes : Math.min(volume.available_bytes, volume.remaining_quota_bytes);
  const total = row.used_bytes + row.reserved_bytes + Math.max(0, available);
  return Math.floor(total / 1073741824 * 100) / 100;
});
const panelChanged = computed(() => {
  const row = editing.value;
  if (!row) return false;
  const quota = editLimit.value.trim() ? Number(editLimit.value) * 1073741824 : null;
  return editName.value.trim() !== row.name || quota !== (row.quota_bytes ?? null);
});

function openLocationPanel(event: Event, workspace: Workspace) {
  const menu = (event.currentTarget as HTMLElement).parentElement as HTMLDetailsElement;
  if (pending.value) { event.preventDefault(); return; }
  if (menu.open) return;
  document.querySelectorAll<HTMLDetailsElement>('.ap-storage .ap-location-menu[open]').forEach(other => { other.open = false; });
  editing.value = { ...workspace };
  editName.value = workspace.name;
  editLimit.value = workspace.quota_bytes == null ? '' : String(workspace.quota_bytes / 1073741824);
  panelError.value = '';
  error.value = '';
  partialSaved.value = false;
}

function panelToggle(event: Event) {
  const menu = event.currentTarget as HTMLDetailsElement;
  if (!menu.open && partialSaved.value) { partialSaved.value = false; props.refresh(); }
}

async function saveLocation(menu: HTMLDetailsElement) {
  const row = editing.value;
  const current = storage.value;
  if (!row || !current || disabled.value || !panelChanged.value) return;
  const nextName = editName.value.trim();
  const quota = editLimit.value.trim() ? Number(editLimit.value) * 1073741824 : null;
  if (!nextName) { panelError.value = t('storage.nameRequired'); return; }
  if (quota !== null && (!Number.isSafeInteger(quota) || quota < 0)) { panelError.value = t('storage.invalidLimit'); return; }
  panelError.value = '';
  await run(async signal => {
    if (quota !== (row.quota_bytes ?? null)) {
      await mutate('/storage/location-policy', { expected_revision: current.imports.revision,
        order: current.workspaces.map(item => item.id), quotas: { ...currentQuotas(), [row.id]: quota } }, signal, 'PUT');
      row.quota_bytes = quota;
      partialSaved.value = true;
    }
    if (nextName !== row.name) {
      await mutate('/storage/locations/' + encodeURIComponent(row.id),
        { expected_revision: row.revision, name: nextName }, signal, 'PATCH');
      row.name = nextName;
      partialSaved.value = true;
    }
    if (!signal.aborted) {
      menu.open = false;
      partialSaved.value = false;
      const message = t('storage.locationSaved');
      if (!notifyHost('success', message)) removalNotice.value = message;
      props.refresh();
    }
  });
}

function chooseRemovalTarget(workspace: Workspace) {
  if (disabled.value || (storage.value?.workspaces.length ?? 0) < 2) return;
  removalSource.value = workspace;
  targetId.value = workspace.removal_target_id ?? '';
  removalNotice.value = '';
  removalOpen.value = true;
}

function confirmRemoval() {
  const source = removalSource.value;
  const target = removalTargets.value.find(row => row.id === targetId.value);
  if (disabled.value || !source || !target) return;
  removalOpen.value = false;
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

</script>

<template>
  <template v-if="resource.state === 'error'">
    <StorageError :code="resource.error instanceof ApiError ? resource.error.code : 'network'" />
    <Button type="button" class="ap-native-button" variant="secondary" size="md" @click="refresh()">{{ t('actions.refresh') }}</Button>
  </template>
  <p v-else-if="!storage" role="status">{{ t('states.loading') }}</p>
  <div v-else class="ap-storage">
    <StorageError v-if="!storage.capabilities.write" code="UNAUTHORIZED_STORAGE_OPERATION" />
    <StorageError v-if="error" :code="error" :notify="typeof details?.operation_id !== 'string'" />
    <Button v-if="error === 'REVISION_CONFLICT'" type="button" class="ap-native-button" variant="secondary" size="md" @click="refresh()">
      {{ t('actions.refresh') }}
    </Button>
    <section class="ap-storage-group">
      <fieldset class="ap-storage-radio-group" :disabled="disabled">
        <legend>{{ t('storage.importMode') }}</legend>
        <RadioGroup class="flex-col" :model-value="storage.imports.default_mode" :disabled="disabled" :aria-label="t('storage.importMode')">
          <label v-for="mode in modes" :key="mode" :for="modeId + '-' + mode">
            <RadioGroupItem :id="modeId + '-' + mode" class="ap-native-button p-0" :value="mode" :disabled="disabled" @select.prevent="setImportMode(mode)" />
            <span>{{ t('storage.' + mode) }}<small>{{ t('storage.' + mode + 'Help') }}</small></span>
          </label>
        </RadioGroup>
      </fieldset>
    </section>
    <section class="ap-storage-group">
      <div class="ap-storage-group-heading">
        <h3>{{ t('storage.workspaces') }}</h3>
        <Button type="button" class="ap-native-button ap-workspace-add" variant="secondary" size="md" :aria-expanded="adding" :aria-controls="addId"
          :disabled="disabled" @click="adding = !adding">
          <i :class="adding ? 'icon-[lucide--minus]' : 'icon-[lucide--plus]'" class="size-4" aria-hidden="true" /> {{ t('storage.add') }}
        </Button>
      </div>
      <form :id="addId" :hidden="!adding" @submit.prevent="add">
        <fieldset class="ap-storage-fields" :disabled="disabled">
          <label>{{ t('storage.name') }}<Input v-model="name" class="ap-native-input" required /></label>
          <label>{{ t('storage.path') }}<Input v-model="path" class="ap-native-input" required /></label>
          <div class="ap-storage-actions ap-location-form-actions">
            <Button type="button" class="ap-native-button" variant="textonly" size="md" @click="pickNativeDirectory">{{ t('storage.browseDirectories') }}</Button>
            <Button type="submit" class="ap-native-button" variant="primary" size="md" :disabled="!name.trim() || !path.trim()">
              {{ t('storage.save') }}
            </Button>
          </div>
        </fieldset>
      </form>
      <Dialog v-model:open="browsing">
        <DialogPortal><DialogOverlay />
          <DialogContent size="sm" :aria-describedby="undefined">
            <div class="astrophoto-ui ap-dialog-scope">
            <DialogHeader>
              <DialogTitle>{{ t('storage.browseDirectories') }}</DialogTitle>
              <Button type="button" class="ap-native-button" variant="muted-textonly" size="icon" icon="icon-[lucide--x]" :aria-label="t('storage.closeDirectory')" @click="browsing = false" />
            </DialogHeader>
            <div class="ap-directory-dialog-body">
          <nav class="ap-directory-breadcrumbs" :aria-label="t('storage.currentPath')">
            <button type="button" @click="browseDirectories()">{{ t('storage.directoryRoots') }}</button>
            <template v-for="crumb in breadcrumbs" :key="crumb.path">
              <span aria-hidden="true">/</span>
              <button type="button" @click="browseDirectories(crumb.path)">{{ crumb.name }}</button>
            </template>
          </nav>
          <StorageError v-if="error" :code="error" />
          <Button v-if="directoryPath !== null" type="button" class="ap-native-button" variant="textonly" size="md"
            :disabled="pending" @click="browseDirectories(directoryParent)">{{ t('storage.directoryUp') }}</Button>
          <p v-if="pending" role="status">{{ t('states.loading') }}</p>
          <ul v-else class="ap-directory-list">
            <li v-for="directory in directories" :key="directory.path">
              <Button type="button" class="ap-native-button ap-directory-entry" variant="textonly" size="md" @click="browseDirectories(directory.path)"><i class="icon-[lucide--folder] size-4" aria-hidden="true" />{{ directory.name }}</Button>
            </li>
          </ul>
          <p v-if="directoryPath" class="ap-storage-path">{{ directoryPath }}</p>
          <div class="ap-storage-actions">
            <Button type="button" class="ap-native-button" variant="textonly" size="md" @click="browsing = false">{{ t('storage.cancelDirectory') }}</Button>
            <Button type="button" class="ap-native-button" variant="primary" size="md" :disabled="pending || directoryPath === null"
              @click="chooseDirectory">{{ t('storage.chooseDirectory') }}</Button>
          </div>
            </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Dialog v-model:open="removalOpen">
        <DialogPortal>
          <DialogOverlay />
          <DialogContent v-if="removalSource" size="sm">
            <div class="astrophoto-ui ap-dialog-scope">
            <DialogHeader><DialogTitle>{{ t('storage.removeLocationTitle') }}</DialogTitle></DialogHeader>
            <div class="ap-directory-dialog-body ap-storage-fields">
          <DialogDescription>{{ t(removalSource.removal_target_id ? 'storage.resumeRemoveHelp' : 'storage.removeHelp', { name: removalSource.name }) }}</DialogDescription>
          <label v-if="removalTargets.length" :for="addId + '-target'">{{ t('storage.removalTarget') }}
            <ComfySingleSelect :id="addId + '-target'" :label="t('storage.removalTarget')" :value="targetId"
              :disabled="!!removalSource.removal_target_id" :options="[{ value: '', label: t('storage.chooseTarget'), disabled: true }, ...removalTargets.map(target => ({ value: target.id, label: target.name + ' · ' + target.root_path }))]"
              @change="targetId = $event" />
          </label>
          <p v-else role="status">{{ t(removalSource.removal_target_id ? 'storage.reconnectTarget' : 'storage.noRemovalTarget') }}</p>
          <div class="ap-storage-actions">
            <Button type="button" class="ap-native-button" variant="textonly" size="md" @click="removalOpen = false">{{ t('storage.cancelDirectory') }}</Button>
            <Button type="button" class="ap-native-button" variant="primary" size="md"
              :disabled="disabled || !removalTargets.some(row => row.id === targetId)" @click="confirmRemoval">
              {{ t(removalSource.removal_target_id ? 'storage.resumeRemove' : 'storage.confirmRemove') }}
            </Button>
          </div>
            </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <p v-if="removalNotice" role="status">{{ removalNotice }}</p>
      <ul class="ap-workspace-list">
        <li v-for="(workspace, index) in storage.workspaces" :key="workspace.id" class="ap-workspace-row"
          :class="{ 'ap-location-drop-target': dragTarget === workspace.id }"
          @dragover="dragOver($event, workspace)" @drop="drop($event, workspace)" @dragend="endDrag">
          <div class="ap-storage-meta">
            <button type="button" class="ap-location-drag" :draggable="!disabled && storage.workspaces.length > 1"
              :aria-label="t('storage.dragLocation', { name: workspace.name })"
              :title="t('storage.dragLocation', { name: workspace.name })"
              @dragstart="startDrag($event, workspace)" @dragend="endDrag" @keydown.up.prevent="move(index, -1)" @keydown.down.prevent="move(index, 1)">⠿</button>
            <strong>{{ workspace.name }}</strong>
            <span v-if="index === 0" class="ap-storage-badge">{{ t('storage.preferred') }}</span>
            <details class="ap-location-menu" @toggle="panelToggle">
              <summary class="ap-native-button" :class="buttonVariants({ variant: 'muted-textonly', size: 'icon' })" :aria-label="t('storage.workspaceActions', { name: workspace.name })" @click="openLocationPanel($event, workspace)"><i class="icon-[lucide--ellipsis] size-4" aria-hidden="true" /></summary>
              <form v-if="editing?.id === workspace.id" class="ap-location-menu-items ap-location-editor" @submit.prevent="saveLocation(($event.currentTarget as HTMLElement).closest('details') as HTMLDetailsElement)">
                <label>{{ t('storage.name') }}<Input v-model="editName" class="ap-native-input" :disabled="disabled" required /></label>
                <div class="ap-location-info"><strong>{{ t('storage.path') }}</strong><p class="ap-storage-path" :title="workspace.root_path">{{ workspace.root_path }}</p></div>
                <div class="ap-location-limit-heading">
                  <label :for="'location-limit-' + workspace.id">{{ t('storage.locationLimit') }} (GiB)</label>
                  <TooltipProvider :delay-duration="0" :disable-hoverable-content="true">
                    <Button type="button" class="ap-native-button" variant="muted-textonly" size="icon-sm"
                      icon="icon-[lucide--info]" :aria-label="t('storage.locationLimitHelpTitle')"
                      :tooltip="t('storage.locationLimitHelp')" />
                  </TooltipProvider>
                </div>
                <Input :id="'location-limit-' + workspace.id" v-model="editLimit" class="ap-native-input" inputmode="decimal" :disabled="disabled" />
                <small>{{ limitReference == null ? t('storage.limitReferenceUnavailable') : t('storage.limitReference', { amount: limitReference.toFixed(2) }) }}</small>
                <p v-if="panelError" role="alert">{{ panelError }}</p>
                <p v-if="error && partialSaved" role="status">{{ t('storage.partialSaved') }}</p>
                <StorageError v-if="error" :code="error" />
                <div class="ap-storage-actions ap-location-editor-actions">
                  <Button type="button" class="ap-native-button" variant="textonly" size="sm" :disabled="disabled || storage.workspaces.length <= 1" :title="storage.workspaces.length <= 1 ? t('storage.lastLocation') : undefined" @click="chooseRemovalTarget(workspace); ($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t(workspace.removal_target_id ? 'storage.resumeRemove' : 'storage.remove') }}</Button>
                  <Button type="button" class="ap-native-button" variant="textonly" size="sm" :disabled="pending" @click="($event.currentTarget as HTMLElement).closest('details')!.open = false">{{ t('storage.cancelDirectory') }}</Button>
                  <Button type="submit" class="ap-native-button" variant="secondary" size="sm" :disabled="disabled || !panelChanged">{{ t('storage.save') }}</Button>
                </div>
              </form>
            </details>
          </div>
          <p class="ap-storage-meta">
            <span class="ap-storage-badge" :data-state="workspace.status">{{ t('storage.states.' + workspace.status) }}</span>
            <small v-if="workspace.status === 'migrating' && workspace.underlying_status && workspace.underlying_status !== 'online'">
              {{ t('storage.states.' + workspace.underlying_status) }}
            </small>
            <small :class="{ 'ap-capacity-warning': workspace.status !== 'offline' && workspace.underlying_status !== 'offline' && workspace.free_bytes != null && workspace.free_bytes <= 1073741824 }">{{ workspace.status === 'offline' || workspace.underlying_status === 'offline' || workspace.free_bytes == null ? t('storage.spaceUnavailable') : t('storage.free') + ' ' + bytes(workspace.free_bytes) }}</small>
            <small v-if="workspace.quota_bytes != null" :class="{ 'ap-capacity-warning': workspace.used_bytes != null && workspace.used_bytes >= workspace.quota_bytes * 0.9 }">{{ t('storage.locationUsage', { used: workspace.used_bytes == null ? t('storage.spaceUnavailable') : bytes(workspace.used_bytes), limit: bytes(workspace.quota_bytes) }) }}</small>
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
