<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';
import { getJson, requestJson } from '../../api/client';
import type { Asset } from '../../api/assets';
import { fetchStorage } from '../../api/storage';
import { useResource } from '../../shared/useResource';
import { DetailAccordion } from '../library/components/DetailAccordion';
import CatalogCalibration from './CatalogCalibration.vue';
import CatalogEditor from './CatalogEditor.vue';
import { confirmAction } from '../library/components/useMutation';
import LibraryError from './LibraryError.vue';

type DetailAsset = Pick<Asset, 'id' | 'catalog_kind' | 'import_group_id'> &
  Partial<Pick<Asset, 'attributes' | 'available' | 'size_bytes'>>;
const props = defineProps<{ groupId?: string; asset?: DetailAsset }>();
const emit = defineEmits<{ group: [id: string]; changed: [name: string]; removed: []; source: [] }>();
const { t } = useI18n();
const editing = ref(false);
const editedLegacyMaster = ref(false);
const actionMenu = ref(false);
const editor = ref<InstanceType<typeof CatalogEditor>>();
const error = shallowRef<unknown>();
const busy = ref(false);
type Location = { id: string; file_name?: string | null; external_path?: string | null; relative_path?: string | null; workspace_id?: string | null };
type EquipmentSnapshot = { id: string; name: string; equipment_type: string; product_name?: string | null };
type RecordData = Location & { name: string; revision?: number; equipment_train_id?: string | null; filter_id?: string | null; notes?: string | null; frame_type?: string; calibration_state?: string;
  filter_state?: string; filter_snapshot?: { name?: string; product_name?: string | null } | null;
  equipment_snapshot?: { name?: string; components?: EquipmentSnapshot[] } | null;
  count?: number; [key: string]: unknown };
const endpoint = computed(() => {
  if (props.groupId || props.asset?.import_group_id) return 'subframe_collection/' + encodeURIComponent(props.groupId || props.asset!.import_group_id!);
  const kind = props.asset?.catalog_kind === 'videos' ? 'video' : props.asset?.catalog_kind === 'calibration_masters' && !editedLegacyMaster.value ? 'calibration_master' : 'image_result';
  return kind + '/' + encodeURIComponent(props.asset!.id);
});
const { resource, refresh } = useResource(computed(() => {
  const url = '/astrophoto/v1/catalog/' + endpoint.value;
  const member = props.asset?.import_group_id ? props.asset.id : undefined;
  const group = !!(props.groupId || member);
  return async (signal: AbortSignal) => {
    const [data, storage, frame] = await Promise.all([
      getJson(url + (group ? '?summary=1&bindings=1' : ''), signal) as Promise<RecordData>,
      fetchStorage(signal),
      member ? getJson(url + '/files/' + encodeURIComponent(member), signal) as Promise<Location> : undefined,
    ]);
    return { data, storage, frame };
  };
}));
const capture = ['exposure_seconds', 'iso', 'gain', 'offset', 'binning', 'readout_mode', 'temperature_c'];
const empty = computed(() => t('assetLibrary.values.unspecified'));
function value(input: unknown) { return input == null || input === '' ? empty.value : String(input); }
function equipment(snapshot: RecordData['equipment_snapshot']) {
  const order = ['camera', 'primary_optics', 'optical_accessory', 'other'];
  return [...(snapshot?.components || [])].filter(item => item.equipment_type !== 'filter')
    .sort((a, b) => order.indexOf(a.equipment_type) - order.indexOf(b.equipment_type));
}
function fileSize(size: number) {
  if (size < 1024) return size + ' B';
  if (size < 1024 ** 2) return (size / 1024).toFixed(1) + ' KiB';
  if (size < 1024 ** 3) return (size / 1024 ** 2).toFixed(1) + ' MiB';
  return (size / 1024 ** 3).toFixed(2) + ' GiB';
}
function filePath(location: Location, workspaces: { id: string; root_path: string }[]) {
  if (location.external_path) return location.external_path;
  const root = workspaces.find(row => row.id === location.workspace_id)?.root_path;
  if (!root || !location.relative_path) return empty.value;
  const separator = root.includes('\\') ? '\\' : '/';
  return root.replace(/[\\/]+$/, '') + separator + location.relative_path.replace(/\//g, separator);
}
async function requestClose() { return !editing.value || await editor.value?.discard() === true; }
defineExpose({ requestClose, editing });
function saved(name: string) { editing.value = false; if (props.asset?.catalog_kind === 'calibration_masters') editedLegacyMaster.value = true; refresh(); emit('changed', name); }
async function remove(record: RecordData) {
  actionMenu.value = false;
  const url = '/astrophoto/v1/catalog/' + endpoint.value;
  if (busy.value || !await confirmAction(t('assetLibrary.unregister'), t('assetLibrary.unregisterPreservesFiles'), record.name, 'delete')) return;
  busy.value = true; error.value = undefined;
  try {
    await requestJson(url, 'DELETE', { revision: record.revision });
    emit('removed');
  } catch (cause) { error.value = cause; } finally { busy.value = false; }
}
</script>

<template>
  <p v-if="resource.state === 'loading'" role="status">{{ t('states.loading') }}</p>
  <LibraryError v-else-if="resource.state === 'error'" :error="resource.error" :retry="refresh" />
  <template v-else>
    <CatalogEditor v-if="editing" ref="editor" :endpoint="endpoint" :record="resource.data.data" :group="!!groupId" @saved="saved" @cancel="editing = false" />
    <template v-else>
    <div v-if="groupId || (asset && !asset.import_group_id)" class="ap-catalog-heading">
      <h2 class="ap-catalog-title" :title="resource.data.data.name">{{ resource.data.data.name }}</h2>
      <button type="button" @click="editing = true">{{ t('assetLibrary.edit') }}</button>
      <PopoverRoot v-model:open="actionMenu"><PopoverTrigger as-child><button type="button" :aria-label="t('assetLibrary.more')">⋯</button></PopoverTrigger>
        <PopoverPortal><PopoverContent class="ap-catalog-actions-popover" side="bottom" align="end" :side-offset="4">
          <button type="button" :disabled="asset?.available === false" @click="actionMenu = false; emit('source')">{{ t('assetLibrary.createSource') }}</button>
          <button type="button" class="ap-assets-danger" :disabled="busy" @click="remove(resource.data.data)">{{ t('assetLibrary.unregister') }}</button>
        </PopoverContent></PopoverPortal>
      </PopoverRoot>
    </div>
    <p v-if="groupId || (asset && !asset.import_group_id)" class="ap-catalog-meta ap-catalog-subtitle">{{ groupId ? t('assetLibrary.importTypes.subframe_collection') : asset?.catalog_kind === 'videos' ? t('assetLibrary.importTypes.video') : asset?.attributes?.role === 'master_frame' ? t('assetLibrary.importTypes.master_frame') : asset?.attributes?.role === 'processed' ? t('assetLibrary.importTypes.image_result') : t('assetLibrary.values.unknown') }}<template v-if="groupId"> · {{ t('assetLibrary.values.' + resource.data.data.frame_type, value(resource.data.data.frame_type)) }} · {{ t('assetLibrary.frameCount', { count: resource.data.data.count ?? 0 }) }} · {{ t('assetLibrary.values.' + resource.data.data.calibration_state, value(resource.data.data.calibration_state)) }}</template></p>
    <template v-if="groupId">
      <DetailAccordion :title="t('assetLibrary.equipmentAndFilter')"><dl class="ap-catalog-facts">
        <div><dt>{{ t('assetLibrary.catalogFields.equipment_train_id') }}</dt><dd>{{ value(resource.data.data.equipment_snapshot?.name) }}</dd></div>
        <div v-for="item in equipment(resource.data.data.equipment_snapshot)" :key="item.id">
          <dt>{{ t('equipment.values.' + item.equipment_type, item.equipment_type) }}</dt>
          <dd>{{ item.name }}<small v-if="item.product_name && item.product_name !== item.name" class="ap-catalog-product">{{ item.product_name }}</small></dd>
        </div>
        <div><dt>{{ t('assetLibrary.catalogFields.filter') }}</dt><dd>
          {{ resource.data.data.filter_state === 'selected' ? value(resource.data.data.filter_snapshot?.name) : t('assetLibrary.values.' + (resource.data.data.filter_state || 'unknown')) }}
          <small v-if="resource.data.data.filter_state === 'selected' && resource.data.data.filter_snapshot?.product_name && resource.data.data.filter_snapshot.product_name !== resource.data.data.filter_snapshot.name" class="ap-catalog-product">{{ resource.data.data.filter_snapshot.product_name }}</small>
        </dd></div>
      </dl></DetailAccordion>
      <DetailAccordion :title="t('assetLibrary.captureParameters')">
        <dl class="ap-catalog-facts"><div v-for="key in capture" :key="key"><dt>{{ t('assetLibrary.catalogFields.' + key) }}</dt><dd>{{ value(resource.data.data[key]) }}</dd></div></dl>
      </DetailAccordion>
      <CatalogCalibration v-if="['light', 'flat'].includes(resource.data.data.frame_type || '')" :id="groupId" />
      <p v-else-if="resource.data.data.frame_type === 'unknown'" class="ap-catalog-meta">{{ t('assetLibrary.chooseFrameFirst') }}</p>
      <dl class="ap-catalog-facts"><div><dt>{{ t('assetLibrary.fields.notes') }}</dt><dd>{{ value(resource.data.data.notes) }}</dd></div></dl>
    </template>
    <template v-else-if="asset"><h3>{{ t('assetLibrary.basicInformation') }}</h3><dl class="ap-catalog-facts">
      <div v-if="resource.data.data.master_type || resource.data.data.type"><dt>{{ t('assetLibrary.facet.master_type') }}</dt><dd>{{ (resource.data.data.master_type || resource.data.data.type) === 'light' ? t('assetLibrary.masterPurpose.light') : t('assetLibrary.values.' + (resource.data.data.master_type || resource.data.data.type)) }}</dd></div>
      <div v-if="resource.data.data.camera_snapshot"><dt>{{ t('assetLibrary.catalogFields.camera_id') }}</dt><dd>{{ value((resource.data.data.camera_snapshot as {name?: string}).name) }}</dd></div>
      <div v-if="resource.data.data.source_collection_name"><dt>{{ t('assetLibrary.calibrationSource') }}</dt><dd>{{ value(resource.data.data.source_collection_name) }}</dd></div>
      <div v-if="asset.import_group_id"><dt>{{ t('assetLibrary.importGroups') }}</dt><dd><button type="button" @click="emit('group', asset.import_group_id!)">{{ resource.data.data.name }}</button></dd></div>
      <div v-if="resource.data.data.file_name"><dt>{{ t('assetLibrary.originalFileName') }}</dt><dd>{{ resource.data.data.file_name }}</dd></div>
      <div><dt>{{ t('assetLibrary.filePath') }}</dt><dd>{{ filePath(resource.data.frame ?? resource.data.data, resource.data.storage.workspaces) }}</dd></div>
      <div v-if="asset.size_bytes !== undefined"><dt>{{ t('assetLibrary.fileSize') }}</dt><dd>{{ fileSize(asset.size_bytes) }}</dd></div>
      <div><dt>{{ t('assetLibrary.availability') }}</dt><dd>{{ t('assetLibrary.values.' + (asset.available ? 'online' : 'offline')) }}</dd></div>
    </dl>
    <template v-if="!asset.import_group_id"><DetailAccordion v-if="resource.data.data.result_type === 'master_frame' || resource.data.data.type" :title="t('assetLibrary.captureParameters')"><dl class="ap-catalog-facts"><div v-for="key in capture" :key="key"><dt>{{ t('assetLibrary.catalogFields.' + key) }}</dt><dd>{{ value(resource.data.data[key]) }}</dd></div></dl></DetailAccordion><DetailAccordion :initially-open="resource.data.data.result_type === 'image_result' && !!resource.data.data.equipment_train_id" :title="t('assetLibrary.equipmentAndFilter')"><dl class="ap-catalog-facts">
        <div><dt>{{ t('assetLibrary.catalogFields.equipment_train_id') }}</dt><dd>{{ value(resource.data.data.equipment_snapshot?.name) }}</dd></div>
        <div v-for="item in equipment(resource.data.data.equipment_snapshot)" :key="item.id"><dt>{{ t('equipment.values.' + item.equipment_type, item.equipment_type) }}</dt><dd>{{ item.name }}<small v-if="item.product_name && item.product_name !== item.name" class="ap-catalog-product">{{ item.product_name }}</small></dd></div>
        <div><dt>{{ t('assetLibrary.catalogFields.filter') }}</dt><dd>{{ resource.data.data.filter_state === 'selected' ? value(resource.data.data.filter_snapshot?.name) : t('assetLibrary.values.' + (resource.data.data.filter_state || 'unknown')) }}</dd></div>
    </dl></DetailAccordion><dl class="ap-catalog-facts"><div><dt>{{ t('assetLibrary.fields.notes') }}</dt><dd>{{ value(resource.data.data.notes) }}</dd></div></dl></template>
    </template>
    <LibraryError v-if="error" :error="error" />
    </template>
  </template>
</template>
