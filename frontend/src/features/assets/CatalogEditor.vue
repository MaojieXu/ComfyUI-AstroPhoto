<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getJson, requestJson } from '../../api/client';
import { fetchEquipmentList, fetchOpticalTrains, fetchTrain, type Train } from '../../api/equipment';
import { useResource } from '../../shared/useResource';
import { ComfySingleSelect } from '../../shared/ComfySingleSelect';
import { confirmAction } from '../library/components/useMutation';
import { DetailAccordion } from '../library/components/DetailAccordion';
import LibraryError from './LibraryError.vue';
import CaptureFields from './CaptureFields.vue';

const props = defineProps<{ endpoint: string; record: Record<string, any>; group: boolean }>();
const emit = defineEmits<{ saved: [name: string]; cancel: [] }>();
const { t } = useI18n();
const fields = ['exposure_seconds', 'iso', 'gain', 'offset', 'binning', 'readout_mode', 'temperature_c'];
const numeric = new Set(['exposure_seconds', 'iso', 'gain', 'offset', 'temperature_c']);
const draft = ref<Record<string, any>>({ name: props.record.name, notes: props.record.notes || '',
  frame_type: props.record.frame_type, calibration_state: props.record.calibration_state,
  master_type: props.record.master_type || props.record.type || 'unknown', camera_id: props.record.camera_id || '', source_collection_id: props.record.source_collection_id || '',
  ...Object.fromEntries(fields.map(key => [key, props.record[key] ?? ''])) });
const initial = JSON.stringify(draft.value);
const isMaster = computed(() => !props.group && (props.record.result_type === 'master_frame' || !!props.record.type));
const isCalibration = computed(() => isMaster.value && ['dark', 'bias', 'dark_flat', 'flat'].includes(draft.value.master_type));
const trainId = ref<string>(props.record.equipment_train_id || '');
const filter = ref<string>(props.record.filter_state === 'selected' ? props.record.filter_id : props.record.filter_state || 'unknown');
const train = shallowRef<Train>();
const equipmentSummary = computed(() => {
  if (trainId.value === (props.record.equipment_train_id || '') && props.record.equipment_snapshot) {
    const components = props.record.equipment_snapshot.components || [];
    return { camera: components.find((item: any) => item.equipment_type === 'camera')?.name,
      primary_optics: components.find((item: any) => item.equipment_type === 'primary_optics')?.name,
      accessories: components.filter((item: any) => item.equipment_type === 'optical_accessory').map((item: any) => item.name),
      others: components.filter((item: any) => item.equipment_type === 'other').map((item: any) => item.name) };
  }
  return train.value?.summary;
});
const busy = ref(false);
const error = shallowRef<unknown>();
const { resource: trains } = useResource(async signal => {
  const rows: Train[] = []; let after: string | null = null;
  do { const page = await fetchOpticalTrains({ after: after ?? undefined }, signal); rows.push(...page.items.filter(row => row.status !== 'archived' && row.status !== 'deleted')); after = page.next; } while (after);
  return rows;
});
const { resource: cameras } = useResource(async signal => {
  const rows = []; let after: string | undefined;
  do { const page = await fetchEquipmentList({ type: 'camera', after }, signal); rows.push(...page.items.filter(row => !row.archived_at_utc)); after = page.next || undefined; } while (after);
  return rows;
});
const { resource: sources } = useResource(async signal => {
  const rows: { id: string; name: string; frame_type: string }[] = []; let after = '';
  do { const page = await getJson('/astrophoto/v1/catalog/subframe_collection?after=' + encodeURIComponent(after), signal) as { items: typeof rows; next: string | null }; rows.push(...page.items); after = page.next || ''; } while (after);
  return rows;
});
watch(trainId, (id, old, cleanup) => {
  if (old !== undefined && id !== old) filter.value = 'unknown';
  train.value = undefined;
  if (!id) return;
  const controller = new AbortController(); cleanup(() => controller.abort());
  void fetchTrain(id, controller.signal).then(row => { train.value = row; }).catch(cause => { if (!controller.signal.aborted) error.value = cause; });
}, { immediate: true });
const dirty = computed(() => JSON.stringify(draft.value) !== initial || trainId.value !== (props.record.equipment_train_id || '') ||
  filter.value !== (props.record.filter_state === 'selected' ? props.record.filter_id : props.record.filter_state || 'unknown'));
async function discard() {
  if (!dirty.value || await confirmAction(t('assetLibrary.discard'), t('assetLibrary.discardConfirm'))) { emit('cancel'); return true; }
  return false;
}
defineExpose({ discard });
async function save() {
  if (busy.value || !draft.value.name.trim()) return;
  busy.value = true; error.value = undefined;
  try {
    const body: Record<string, unknown> = { revision: props.record.revision };
    if (draft.value.name.trim() !== props.record.name) body.name = draft.value.name.trim();
    const notes = draft.value.notes.trim() || null;
    if (notes !== (props.record.notes ?? null)) body.notes = notes;
    if (props.group) {
      for (const key of ['frame_type', 'calibration_state']) {
        if (draft.value[key] !== props.record[key]) body[key] = draft.value[key];
      }
    }
    if (props.group || isMaster.value) {
      for (const key of fields) {
        const next = draft.value[key] === '' ? null : numeric.has(key) ? Number(draft.value[key]) : draft.value[key];
        if (next !== (props.record[key] ?? null)) body[key] = next;
      }
    }
    if (isMaster.value) {
      if (draft.value.master_type !== (props.record.master_type || props.record.type || 'unknown')) body.master_type = draft.value.master_type;
      for (const key of isCalibration.value ? ['camera_id', 'source_collection_id'] : ['source_collection_id']) {
        const next = draft.value[key] || null;
        if (next !== (props.record[key] || null)) body[key] = next;
      }
    }
    if (trainId.value !== (props.record.equipment_train_id || '') || filter.value !== (props.record.filter_state === 'selected' ? props.record.filter_id : props.record.filter_state || 'unknown')) {
      body.equipment_train_id = trainId.value || null;
      body.filter_state = ['unknown', 'none'].includes(filter.value) ? filter.value : 'selected';
      body.filter_id = body.filter_state === 'selected' ? filter.value : null;
    }
    await requestJson('/astrophoto/v1/catalog/' + props.endpoint, 'PATCH', body);
    emit('saved', draft.value.name.trim());
  } catch (cause) { error.value = cause; } finally { busy.value = false; }
}
</script>

<template>
  <form class="ap-assets-form ap-catalog-editor ap-import-fields" @submit.prevent="save">
    <label class="ap-catalog-editor-wide">{{ t('assetLibrary.name') }}<input v-model="draft.name" required :disabled="busy" aria-describedby="ap-edit-name-hint" /></label>
    <small id="ap-edit-name-hint" class="ap-catalog-meta ap-catalog-editor-wide">{{ t('assetLibrary.uniqueAssetName') }}</small>
    <template v-if="isMaster">
      <label>{{ t('assetLibrary.facet.master_type') }}<select v-model="draft.master_type"><option v-for="value in ['unknown','light','dark','flat','bias','dark_flat']" :key="value" :value="value">{{ value === 'light' ? t('assetLibrary.masterPurpose.light') : t('assetLibrary.values.' + value) }}</option></select></label>
      <template v-if="isCalibration">
        <label>{{ t('assetLibrary.catalogFields.camera_id') }}<select v-model="draft.camera_id"><option value="">{{ t('assetLibrary.values.unspecified') }}</option><option v-for="item in cameras.state === 'ready' ? cameras.data : []" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
      </template>
      <label class="ap-catalog-editor-wide">{{ t('assetLibrary.calibrationSource') }}<select v-model="draft.source_collection_id"><option value="">{{ t('assetLibrary.values.unspecified') }}</option><option v-for="item in sources.state === 'ready' ? sources.data.filter(row => draft.master_type === 'unknown' || row.frame_type === draft.master_type) : []" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
    </template>
    <template v-if="group">
      <label>{{ t('assetLibrary.catalogFields.frame_type') }}<ComfySingleSelect id="ap-edit-frame-type" :label="t('assetLibrary.catalogFields.frame_type')" :value="draft.frame_type" :options="['light','dark','flat','bias','dark_flat','unknown'].map(value => ({ value, label: t('assetLibrary.values.' + value) }))" @change="draft.frame_type = $event" /></label>
      <label>{{ t('assetLibrary.fields.calibration_state') }}<ComfySingleSelect id="ap-edit-calibration-state" :label="t('assetLibrary.fields.calibration_state')" :value="draft.calibration_state" :options="['unknown','uncalibrated','calibrated'].map(value => ({ value, label: t('assetLibrary.values.' + value) }))" @change="draft.calibration_state = $event" /></label>
    </template>
    <div v-if="group || isMaster" class="ap-catalog-editor-wide"><CaptureFields v-model="draft" /></div>
    <DetailAccordion class="ap-catalog-editor-wide" :title="t('assetLibrary.equipmentAndFilter')" :initially-open="record.result_type !== 'image_result' || !!trainId">
      <div class="ap-assets-form ap-import-fields">
        <label class="ap-catalog-editor-wide">{{ t('assetLibrary.catalogFields.equipment_train_id') }}<select v-model="trainId"><option value="">{{ t('assetLibrary.values.unspecified') }}</option><option v-if="trainId && trains.state === 'ready' && !trains.data.some(item => item.id === trainId)" :value="trainId">{{ record.equipment_snapshot?.name }}</option><option v-for="item in trains.state === 'ready' ? trains.data : []" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
        <dl v-if="equipmentSummary" class="ap-import-equipment ap-catalog-editor-wide"><template v-if="equipmentSummary.camera"><dt>{{ t('assetLibrary.catalogFields.camera_id') }}</dt><dd>{{ equipmentSummary.camera }}</dd></template><template v-if="equipmentSummary.primary_optics"><dt>{{ t('assetLibrary.importCompact.primaryOptics') }}</dt><dd>{{ equipmentSummary.primary_optics }}</dd></template><template v-for="item in equipmentSummary.accessories" :key="item"><dt>{{ t('assetLibrary.importCompact.accessory') }}</dt><dd>{{ item }}</dd></template><template v-for="item in equipmentSummary.others" :key="item"><dt>{{ t('assetLibrary.importCompact.otherEquipment') }}</dt><dd>{{ item }}</dd></template></dl>
        <label class="ap-catalog-editor-wide">{{ t('assetLibrary.catalogFields.filter') }}<select v-model="filter" :disabled="!trainId"><option value="unknown">{{ t('assetLibrary.values.unknown') }}</option><option value="none">{{ t('assetLibrary.noFilter') }}</option><option v-if="filter === record.filter_id && !train?.filter_ids.includes(filter)" :value="filter">{{ record.filter_snapshot?.name || filter }}</option><option v-for="(id, index) in train?.filter_ids ?? []" :key="id" :value="id">{{ train?.components?.find(item => item.id === id)?.name ?? train?.summary.filters[index] ?? id }}</option></select></label>
      </div>
    </DetailAccordion>
    <label class="ap-catalog-editor-wide">{{ t('assetLibrary.fields.notes') }}<textarea v-model="draft.notes" /></label>
    <LibraryError v-if="error" :error="error" />
    <div class="ap-assets-toolbar ap-catalog-editor-wide ap-catalog-editor-actions"><button type="button" :disabled="busy" @click="discard">{{ t('storage.cancel') }}</button><button type="submit" :disabled="busy || !dirty || !draft.name.trim()">{{ t('assetLibrary.save') }}</button></div>
  </form>
</template>
