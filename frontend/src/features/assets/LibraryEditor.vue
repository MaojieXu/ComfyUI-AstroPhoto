<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../../api/client';
import {
  assignCalibrationMasters, readDocument, removeDocument, writeDocument, type Asset, type Assignment,
  type Collection, type Document, type Folder, type Master, type Placement, type Project,
} from '../../api/assets';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { confirmAction, useMutation } from '../library/components/useMutation';
import AssetPicker from './AssetPicker.vue';
import LibraryError from './LibraryError.vue';
import { calibrationUsage, processingFields } from './attributes';

type Data = Document & { name?: string; target?: string | null; notes?: string | null; asset_ids?: string[];
  project_id?: string | null; parent_id?: string | null; folder_id?: string | null; asset_id?: string | null;
  collection_id?: string | null; master_id?: string | null; method?: string | null; source_asset_id?: string | null;
  position?: number | null; calibration_folder_id?: string | null };
const props = defineProps<{
  kind: 'projects' | 'folders' | 'collections' | 'sessions' | 'masters' | 'assignments' | 'placements';
  row?: Data;
  defaults?: Partial<Data>;
  targetName?: string;
  assets: Asset[];
  projects: Project[];
  folders: Folder[];
  collections: Collection[];
  placements: Placement[];
  masters: Master[];
  assignments: Assignment[];
}>();
const emit = defineEmits<{ changed: [row?: Data]; close: []; notice: [message: string] }>();
const { t } = useI18n();
const record = shallowRef(props.row);
const latest = shallowRef<Data>();
const data = { ...props.defaults, ...props.row };
const name = ref(data.name ?? '');
const projectTarget = ref(data.target ?? '');
const notes = ref(data.notes ?? '');
const template = ref(false);
const projectId = ref(data.project_id ?? '');
const folderId = ref(data.folder_id ?? '');
const calibrationFolder = ref(data.calibration_folder_id ?? '');
const parentId = ref(data.parent_id ?? '');
const assetId = ref(data.asset_id ?? '');
const collectionId = ref(data.collection_id ?? '');
const masterId = ref(data.master_id ?? '');
const masterUsage = props.masters.find(row => row.id === masterId.value)?.usage;
const selectedByUsage = ref<Record<string, string>>({});
const usages = [...calibrationUsage, 'other'];
const method = ref(data.method ?? '');
const sourceId = ref(data.source_asset_id ?? '');
const position = ref(data.position ?? 0);
const memberIds = ref([...(data.asset_ids ?? [])]);
const rawAssurance = ref(false);
const assetsById = shallowRef(new Map(props.assets.map(row => [row.id, row])));
const { pending, run, error } = useMutation();
const warnedPayload = ref('');
const canConfirm = computed(() => error.value?.code === 'CONFIRMATION_REQUIRED' && warnedPayload.value === JSON.stringify(payload(false)));

const emptyOption = computed(() => ({ value: '', label: t('assetLibrary.values.unspecified') }));
const rootOption = computed(() => ({ value: '', label: t('assetLibrary.rootFolder') }));
const projectOptions = computed(() => [emptyOption.value, ...props.projects.map(row => ({ value: row.id, label: row.name }))]);
function folderLabel(folder: Folder) {
  const labels = [folder.name];
  const seen = new Set([folder.id]);
  let parent = props.folders.find(row => row.id === folder.parent_id);
  while (parent && !seen.has(parent.id)) {
    labels.unshift(parent.name);
    seen.add(parent.id);
    parent = props.folders.find(row => row.id === parent?.parent_id);
  }
  return labels.join(' / ');
}
function descendants(id: string) {
  const ids = new Set([id]);
  let pending = [id];
  while (pending.length) {
    pending = props.folders.filter(folder => folder.parent_id && pending.includes(folder.parent_id) && !ids.has(folder.id))
      .map(folder => folder.id);
    for (const child of pending) ids.add(child);
  }
  return ids;
}
const folderOptions = computed(() => {
  const excluded = props.kind === 'folders' && record.value ? descendants(record.value.id) : new Set<string>();
  return [rootOption.value, ...props.folders
    .filter(row => (row.project_id ?? '') === projectId.value && !excluded.has(row.id))
    .map(row => ({ value: row.id, label: folderLabel(row) }))];
});
const calibrationFolders = computed(() => [rootOption.value, ...props.folders.filter(row => !row.project_id)
  .map(row => ({ value: row.id, label: folderLabel(row) }))]);
const gallery = computed(() => props.collections.filter(row => row.id !== record.value?.id).flatMap(row => row.asset_ids));
const selectedAsset = computed(() => assetsById.value.get(assetId.value));
const assignedUsages = computed(() => new Set(props.assignments.filter(row => assetId.value
  ? row.asset_id === assetId.value : row.collection_id === collectionId.value)
  .map(row => row.usage ?? props.masters.find(master => master.id === row.master_id)?.usage)));
const availableUsages = computed(() => usages.filter(usage => !assignedUsages.value.has(usage)));
const masterIds = computed(() => availableUsages.value.map(usage => selectedByUsage.value[usage]).filter(Boolean));
const selectedMasters = computed(() => (record.value ? [masterId.value] : masterIds.value)
  .map(id => props.masters.find(row => row.id === id))
  .filter((row): row is Master => row !== undefined)
  .map(row => ({ master: row, asset: assetsById.value.get(row.asset_id) })));

function masterOptions(usage?: string) {
  return [emptyOption.value, ...props.masters.filter(row => !usage || row.usage === usage).map(row => ({
    value: row.id, label: assetsById.value.get(row.asset_id)?.name ?? row.asset_id,
  }))];
}

function remember(asset: Asset) {
  assetsById.value = new Map(assetsById.value).set(asset.id, asset);
}
function nameOf(id: string) { return assetsById.value.get(id)?.name ?? id; }
function pick(asset: Asset, type: 'asset' | 'source' | 'member') {
  remember(asset);
  if (type === 'asset') assetId.value = asset.id;
  if (type === 'source') sourceId.value = asset.id;
  if (type === 'member' && !memberIds.value.includes(asset.id)) memberIds.value.push(asset.id);
}
function moveMember(index: number, offset: number) {
  const current = memberIds.value[index];
  memberIds.value.splice(index, 1);
  memberIds.value.splice(index + offset, 0, current);
}

onMounted(() => {
  const relevant = new Set([assetId.value, sourceId.value, ...memberIds.value,
    ...(props.kind === 'assignments' ? props.masters.map(row => row.asset_id) : [])]);
  const missing = [...relevant].filter(id => id && !assetsById.value.has(id));
  if (!missing.length) return;
  void run(async signal => {
    for (const id of missing) {
      try { remember(await readDocument('assets', id, signal)); }
      catch (cause) { if (signal.aborted || !(cause instanceof ApiError) || cause.status !== 404) throw cause; }
    }
  });
});

function payload(confirmed: boolean): Record<string, unknown> {
  switch (props.kind) {
    case 'projects': return {
      name: name.value.trim(), target: projectTarget.value.trim() || null, notes: notes.value.trim() || null,
      ...(!record.value && template.value ? { template: true } : {}),
    };
    case 'folders': return { name: name.value.trim(), project_id: projectId.value || null, parent_id: parentId.value || null };
    case 'collections': return {
      name: name.value.trim(), asset_ids: memberIds.value, calibration_folder_id: calibrationFolder.value || null,
      ...(confirmed ? { confirmed: true } : {}),
    };
    case 'sessions': return { name: name.value.trim(), asset_ids: memberIds.value, notes: notes.value.trim() || null };
    case 'masters': return { asset_id: assetId.value, folder_id: folderId.value || null,
      method: method.value || null, source_asset_id: sourceId.value || null };
    case 'assignments': return {
      ...(assetId.value ? { asset_id: assetId.value } : { collection_id: collectionId.value }),
      ...(record.value ? { master_id: masterId.value } : { master_ids: masterIds.value }),
      ...(confirmed ? { confirmed: true } : {}),
    };
    case 'placements': return {
      project_id: projectId.value, folder_id: folderId.value || null,
      ...(assetId.value ? { asset_id: assetId.value } : { collection_id: collectionId.value }), position: position.value,
    };
  }
}

const needsName = computed(() => ['projects', 'folders', 'collections', 'sessions'].includes(props.kind));
const canSave = computed(() => {
  if (needsName.value) return !!name.value.trim();
  if (props.kind === 'masters') return !!assetId.value && (selectedAsset.value?.attributes.usage !== 'flat' ||
    (rawAssurance.value && !!method.value && !!sourceId.value));
  if (props.kind === 'assignments') return record.value ? !!masterId.value : masterIds.value.length > 0;
  return !!projectId.value && !!(assetId.value || collectionId.value);
});

function save() {
  if (!canSave.value) return;
  const confirm = canConfirm.value;
  const warningKey = JSON.stringify(payload(false));
  void run(async signal => {
    if (confirm && !await confirmAction(t('assetLibrary.confirm'), t('assetLibrary.confirmMismatch'))) return;
    const fields = payload(confirm);
    const prior = props.kind === 'placements' && props.placements.find(row =>
      row.project_id === projectId.value && (assetId.value ? row.asset_id === assetId.value : row.collection_id === collectionId.value));
    let result;
    try {
      if (props.kind === 'assignments' && !record.value) await assignCalibrationMasters(fields, signal);
      else result = await writeDocument(props.kind, fields, signal, record.value || prior || undefined);
    } catch (reason) {
      warnedPayload.value = reason instanceof ApiError && reason.code === 'CONFIRMATION_REQUIRED' ? warningKey : '';
      throw reason;
    }
    if (signal.aborted) return;
    emit('changed', result);
    emit('notice', t('assetLibrary.saved'));
    emit('close');
  });
}
function fetchLatest() {
  void run(async signal => {
    if (!record.value) return;
    latest.value = await readDocument(props.kind, record.value.id, signal);
  });
}
function resumeLatest() {
  if (!latest.value) return;
  record.value = latest.value;
  latest.value = undefined;
}
function remove() {
  void run(async signal => {
    const current = record.value;
    if (!current) return;
    const ids = props.kind === 'folders' ? descendants(current.id) : new Set<string>();
    const impacted = props.placements.filter(row => row.project_id === current.id || row.folder_id && ids.has(row.folder_id)).length;
    if (!await confirmAction(t('assetLibrary.remove'), t('assetLibrary.removeRelations', { count: impacted }),
      data.name, 'delete')) return;
    await removeDocument(props.kind, current, signal, { confirmed: true });
    if (signal.aborted) return;
    emit('changed');
    emit('notice', t('assetLibrary.saved'));
    emit('close');
  });
}
async function discardDraft() {
  if (pending.value) return;
  if (JSON.stringify(payload(false)) === initial ||
      await confirmAction(t('assetLibrary.discard'), t('assetLibrary.discardConfirm'))) emit('close');
}
const initial = JSON.stringify(payload(false));
defineExpose({ discardDraft });
</script>

<template>
  <form class="ap-assets-form ap-assets-dialog-content" @submit.prevent="save">
    <fieldset :disabled="pending" class="ap-assets-form">
      <label v-if="needsName">{{ t('assetLibrary.name') }}<input v-model="name" maxlength="120" required /></label>
      <label v-if="kind === 'projects'">{{ t('assetLibrary.fields.target') }}<input v-model="projectTarget" /></label>
      <label v-if="kind === 'projects' || kind === 'sessions'">{{ t('assetLibrary.fields.notes') }}<textarea v-model="notes" /></label>
      <label v-if="kind === 'projects' && !row" class="ap-assets-checkbox"><input v-model="template" type="checkbox" />
        {{ t('assetLibrary.projectTemplate') }}
      </label>
      <template v-if="kind === 'folders'">
        <label for="ap-folder-parent">{{ t('assetLibrary.parentFolder') }}</label>
        <ComfySingleSelect id="ap-folder-parent" :value="parentId" :options="folderOptions" :label="t('assetLibrary.parentFolder')"
          :disabled="pending" @change="parentId = $event" />
      </template>

      <template v-if="kind === 'collections' || kind === 'sessions'">
        <div v-if="kind === 'collections'" class="ap-assets-facts">
          <strong>{{ t('assetLibrary.processingConditions') }}</strong>
          <div v-for="key in processingFields" :key="key">
            <small>{{ t('assetLibrary.fields.' + key) }} · {{ [...new Set(memberIds.map(id => assetsById.get(id)?.attributes[key] ??
              t('assetLibrary.values.unknown')))].join(' / ') }}</small>
          </div>
        </div>
        <template v-if="kind === 'collections'">
          <label for="ap-collection-calibration-folder">{{ t('assetLibrary.calibrationFolder') }}</label>
          <ComfySingleSelect id="ap-collection-calibration-folder" :value="calibrationFolder"
            :label="t('assetLibrary.calibrationFolder')" :options="calibrationFolders" :disabled="pending" @change="calibrationFolder = $event" />
        </template>
        <h3>{{ t('assetLibrary.members', { count: memberIds.length }) }}</h3>
        <ol v-if="memberIds.length" class="ap-assets-list">
          <li v-for="(id, index) in memberIds" :key="id" class="ap-assets-row">
            <span class="ap-assets-truncate" :title="nameOf(id)">{{ nameOf(id) }}</span>
            <button type="button" :disabled="index === 0" :aria-label="t('assetLibrary.moveUp')" @click="moveMember(index, -1)">↑</button>
            <button type="button" :disabled="index === memberIds.length - 1" :aria-label="t('assetLibrary.moveDown')" @click="moveMember(index, 1)">↓</button>
            <button type="button" :aria-label="t('assetLibrary.removeEntry', { name: nameOf(id) })" @click="memberIds.splice(index, 1)">
              {{ t('assetLibrary.remove') }}
            </button>
          </li>
        </ol>
        <h3>{{ t('assetLibrary.addMembers') }}</h3>
        <AssetPicker :selected="memberIds" :excluded="kind === 'collections' ? gallery : undefined" @pick="pick($event, 'member')" />
      </template>

      <template v-if="kind === 'masters'">
        <p v-if="assetId">{{ t('assetLibrary.asset') }} · {{ nameOf(assetId) }}</p>
        <AssetPicker v-if="!row" :selected="assetId ? [assetId] : []" @pick="pick($event, 'asset')" />
        <template v-if="selectedAsset?.attributes.usage === 'flat'">
          <p>{{ t('assetLibrary.flatRequirements') }}</p>
          <label for="ap-master-method">{{ t('assetLibrary.calibrationMethod') }}</label>
          <ComfySingleSelect id="ap-master-method" :value="method" :disabled="pending" :label="t('assetLibrary.calibrationMethod')"
            :options="[emptyOption, ...['bias', 'dark_flat'].map(value => ({ value, label: t('assetLibrary.values.' + value) }))]"
            @change="method = $event; sourceId = ''" />
          <p v-if="sourceId">{{ nameOf(sourceId) }}</p>
          <AssetPicker v-if="method" :key="method" :usage="method" :excluded="[assetId]" :selected="sourceId ? [sourceId] : []"
            @pick="pick($event, 'source')" />
          <label class="ap-assets-checkbox"><input v-model="rawAssurance" type="checkbox" />{{ t('assetLibrary.flatConfirmed') }}</label>
        </template>
      </template>

      <template v-if="kind === 'assignments'">
        <p><strong>{{ props.targetName }}</strong></p>
        <div v-if="selectedAsset" class="ap-assets-facts">
          <small v-for="key in processingFields" :key="key">{{ t('assetLibrary.fields.' + key) }} ·
            {{ selectedAsset.attributes[key] ?? t('assetLibrary.values.unknown') }}</small>
        </div>
        <template v-if="record">
          <label for="ap-calibration-master">{{ t('assetLibrary.master') }}</label>
          <ComfySingleSelect id="ap-calibration-master" :value="masterId" :options="masterOptions(masterUsage)" :label="t('assetLibrary.master')"
            :disabled="pending" @change="masterId = $event" />
        </template>
        <template v-else>
          <p v-if="assignedUsages.size">{{ t('assetLibrary.assignedUsages') }}</p>
          <template v-for="usage in availableUsages" :key="usage">
            <label :for="'ap-calibration-' + usage">{{ t('assetLibrary.calibrationUse.' + usage) }}</label>
            <ComfySingleSelect :id="'ap-calibration-' + usage" :value="selectedByUsage[usage] || ''" :options="masterOptions(usage)"
              :label="t('assetLibrary.calibrationUse.' + usage)" :disabled="pending || masterOptions(usage).length === 1"
              @change="selectedByUsage[usage] = $event" />
          </template>
        </template>
        <template v-for="{ master, asset } in selectedMasters" :key="master.id">
          <div v-if="asset" class="ap-assets-facts">
            <strong>{{ asset.name }}</strong>
            <small v-for="key in processingFields" :key="key">{{ t('assetLibrary.fields.' + key) }} ·
              {{ asset.attributes[key] ?? t('assetLibrary.values.unknown') }}</small>
          </div>
        </template>
      </template>

      <template v-if="kind === 'placements'">
        <p v-if="props.targetName"><strong>{{ props.targetName }}</strong></p>
        <label for="ap-placement-project">{{ t('assetLibrary.project') }}</label>
        <ComfySingleSelect id="ap-placement-project" :value="projectId" :options="projectOptions" :label="t('assetLibrary.project')"
          :disabled="pending || !!row" @change="projectId = $event; folderId = ''" />
        <label>{{ t('assetLibrary.position') }}<input v-model.number="position" type="number" min="0" step="1" /></label>
      </template>
      <template v-if="kind === 'masters' || kind === 'placements'">
        <label for="ap-placement-folder">{{ t('assetLibrary.folder') }}</label>
        <ComfySingleSelect id="ap-placement-folder" :value="folderId" :options="folderOptions" :label="t('assetLibrary.folder')"
          :disabled="pending" @change="folderId = $event" />
      </template>
    </fieldset>
    <LibraryError v-if="error" :error="error" :retry="error.code === 'REVISION_CONFLICT' ? fetchLatest : undefined" />
    <div v-if="latest" class="ap-assets-approval" role="status">
      <strong>{{ t('assetLibrary.latestVersion') }}</strong>
      <pre>{{ JSON.stringify(latest, null, 2) }}</pre>
      <button type="button" @click="resumeLatest">{{ t('assetLibrary.keepDraft') }}</button>
    </div>
    <div class="ap-assets-toolbar">
      <button type="submit" :disabled="pending || !canSave || !!latest">{{ t('assetLibrary.' + (canConfirm ? 'confirm' : 'save')) }}</button>
      <button type="button" :disabled="pending" @click="discardDraft">{{ t('storage.cancel') }}</button>
      <button v-if="record" type="button" class="ap-assets-danger" :disabled="pending" @click="remove">{{ t('assetLibrary.remove') }}</button>
    </div>
  </form>
</template>
